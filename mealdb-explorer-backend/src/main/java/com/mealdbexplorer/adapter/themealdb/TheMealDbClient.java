package com.mealdbexplorer.adapter.themealdb;

import com.mealdbexplorer.adapter.themealdb.dto.CategoryDbResponse;
import com.mealdbexplorer.adapter.themealdb.dto.MealDbResponse;
import com.mealdbexplorer.exception.ExternalApiException;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestClient;

@Slf4j
@Component
public class TheMealDbClient {

    private final RestClient restClient;

    public TheMealDbClient(@Value("${themealdb.api.base-url}") String baseUrl) {
        this.restClient = RestClient.builder()
                .baseUrl(baseUrl)
                .build();
    }

    public MealDbResponse searchMealsByName(String name) {
        try {
            log.debug("Searching meals by name: {}", name);
            return restClient.get()
                    .uri("/search.php?s={name}", name)
                    .retrieve()
                    .body(MealDbResponse.class);
        } catch (Exception e) {
            log.error("Error searching meals by name: {}", name, e);
            throw new ExternalApiException("Failed to search meals", e);
        }
    }

    public MealDbResponse getMealById(String id) {
        try {
            log.debug("Fetching meal by id: {}", id);
            return restClient.get()
                    .uri("/lookup.php?i={id}", id)
                    .retrieve()
                    .body(MealDbResponse.class);
        } catch (Exception e) {
            log.error("Error fetching meal by id: {}", id, e);
            throw new ExternalApiException("Failed to fetch meal details", e);
        }
    }

    public MealDbResponse getRandomMeal() {
        try {
            log.debug("Fetching random meal");
            return restClient.get()
                    .uri("/random.php")
                    .retrieve()
                    .body(MealDbResponse.class);
        } catch (Exception e) {
            log.error("Error fetching random meal", e);
            throw new ExternalApiException("Failed to fetch random meal", e);
        }
    }

    public CategoryDbResponse getAllCategories() {
        try {
            log.debug("Fetching all categories");
            return restClient.get()
                    .uri("/categories.php")
                    .retrieve()
                    .body(CategoryDbResponse.class);
        } catch (Exception e) {
            log.error("Error fetching categories", e);
            throw new ExternalApiException("Failed to fetch categories", e);
        }
    }

    public MealDbResponse getMealsByCategory(String category) {
        try {
            log.debug("Fetching meals by category: {}", category);
            return restClient.get()
                    .uri("/filter.php?c={category}", category)
                    .retrieve()
                    .body(MealDbResponse.class);
        } catch (Exception e) {
            log.error("Error fetching meals by category: {}", category, e);
            throw new ExternalApiException("Failed to fetch meals by category", e);
        }
    }

    public MealDbResponse getAllMeals() {
        try {
            log.debug("Fetching all meals (searching with empty string)");
            return restClient.get()
                    .uri("/search.php?s=")
                    .retrieve()
                    .body(MealDbResponse.class);
        } catch (Exception e) {
            log.error("Error fetching all meals", e);
            throw new ExternalApiException("Failed to fetch all meals", e);
        }
    }
}