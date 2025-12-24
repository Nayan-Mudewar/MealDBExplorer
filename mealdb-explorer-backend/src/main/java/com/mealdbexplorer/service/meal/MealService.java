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

        MealDbResponse response = mealDbClient.getAllMeals();

        if (response == null || response.getMeals() == null) {
            return List.of();
        }

        return mealMapper.toDomainList(response.getMeals());
    }
}