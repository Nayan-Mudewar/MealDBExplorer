package com.mealdbexplorer.service.meal;

import com.mealdbexplorer.adapter.themealdb.TheMealDbClient;
import com.mealdbexplorer.adapter.themealdb.dto.CategoryDbResponse;
import com.mealdbexplorer.adapter.themealdb.dto.MealDbDto;
import com.mealdbexplorer.adapter.themealdb.dto.MealDbResponse;
import com.mealdbexplorer.domain.model.Category;
import com.mealdbexplorer.domain.model.Meal;
import com.mealdbexplorer.exception.ResourceNotFoundException;
import com.mealdbexplorer.mapper.CategoryMapper;
import com.mealdbexplorer.mapper.MealMapper;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;

@Slf4j
@Service
@RequiredArgsConstructor
public class MealService {

    private final TheMealDbClient mealDbClient;
    private final MealMapper mealMapper;
    private final CategoryMapper categoryMapper;

    @Cacheable(value = "meals", key = "#name")
    public List<Meal> searchMealsByName(String name) {
        log.info("Searching meals by name: {}", name);

        MealDbResponse response = mealDbClient.searchMealsByName(name);

        if (response == null || response.getMeals() == null) {
            return List.of();
        }

        return mealMapper.toDomainList(response.getMeals());
    }

    @Cacheable(value = "meal", key = "#id")
    public Meal getMealById(String id) {
        log.info("Fetching meal by id: {}", id);

        MealDbResponse response = mealDbClient.getMealById(id);

        if (response == null || response.getMeals() == null || response.getMeals().isEmpty()) {
            throw new ResourceNotFoundException("Meal not found with id: " + id);
        }

        return mealMapper.toDomain(response.getMeals().get(0));
    }

    public Meal getRandomMeal() {
        log.info("Fetching random meal");

        MealDbResponse response = mealDbClient.getRandomMeal();

        if (response == null || response.getMeals() == null || response.getMeals().isEmpty()) {
            throw new ResourceNotFoundException("No random meal found");
        }

        return mealMapper.toDomain(response.getMeals().get(0));
    }

    @Cacheable(value = "categories")
    public List<Category> getAllCategories() {
        log.info("Fetching all categories");

        CategoryDbResponse response = mealDbClient.getAllCategories();

        if (response == null || response.getCategories() == null) {
            return List.of();
        }

        return categoryMapper.toDomainList(response.getCategories());
    }

    @Cacheable(value = "mealsByCategory", key = "#category")
    public List<Meal> getMealsByCategory(String category) {
        log.info("Fetching meals by category: {}", category);

        MealDbResponse response = mealDbClient.getMealsByCategory(category);

        if (response == null || response.getMeals() == null) {
            return List.of();
        }

        // Filter response gives us basic info, we need to fetch full details
        List<MealDbDto> basicMeals = response.getMeals();
        List<Meal> detailedMeals = basicMeals.stream()
                .map(meal -> {
                    try {
                        return getMealById(meal.getIdMeal());
                    } catch (Exception e) {
                        log.error("Failed to fetch details for meal: {}", meal.getIdMeal(), e);
                        return null;
                    }
                })
                .filter(meal -> meal != null)
                .toList();

        return detailedMeals;
    }

    @Cacheable(value = "allMeals")
    public List<Meal> getAllMeals() {
        log.info("Fetching all meals");

        try {
            // Try to get all meals using empty search
            MealDbResponse response = mealDbClient.getAllMeals();
            if (response != null && response.getMeals() != null) {
                return mealMapper.toDomainList(response.getMeals());
            }
        } catch (Exception e) {
            log.warn("Failed to fetch all meals using empty search, falling back to category-based approach", e);
        }

        // Fallback: Get meals from all categories
        log.info("Using fallback: fetching meals from all categories");
        List<Meal> allMeals = new ArrayList<>();
        try {
            List<Category> categories = getAllCategories();
            for (Category category : categories) {
                try {
                    List<Meal> categoryMeals = getMealsByCategory(category.getName());
                    allMeals.addAll(categoryMeals);
                } catch (Exception e) {
                    log.warn("Failed to fetch meals from category: {}", category.getName(), e);
                }
            }
        } catch (Exception e) {
            log.error("Failed to fetch meals from categories", e);
        }

        return allMeals;
    }

    @Cacheable(value = "popularMeals")
    public List<Meal> getPopularMeals() {
        log.info("Fetching popular meals from popular categories");

        // Popular categories to fetch meals from
        List<String> popularCategories = List.of("Beef", "Chicken", "Dessert", "Vegetarian", "Pasta", "Seafood");
        
        List<Meal> allMeals = new ArrayList<>();
        
        for (String category : popularCategories) {
            try {
                MealDbResponse response = mealDbClient.getMealsByCategory(category);
                if (response != null && response.getMeals() != null) {
                    // Get basic meal info from filter endpoint (faster than full details)
                    List<MealDbDto> basicMeals = response.getMeals().stream().limit(4).toList();
                    // Fetch full details only for the limited set
                    for (MealDbDto basicMeal : basicMeals) {
                        try {
                            Meal fullMeal = getMealById(basicMeal.getIdMeal());
                            allMeals.add(fullMeal);
                        } catch (Exception e) {
                            log.warn("Failed to fetch full details for meal: {}", basicMeal.getIdMeal(), e);
                        }
                    }
                }
            } catch (Exception e) {
                log.warn("Failed to fetch meals from category: {}", category, e);
                // Continue with other categories even if one fails
            }
        }
        
        // Shuffle and limit to 20 meals for variety
        Collections.shuffle(allMeals);
        return allMeals.stream().limit(20).toList();
    }
}