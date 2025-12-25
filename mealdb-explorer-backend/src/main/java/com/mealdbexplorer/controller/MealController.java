package com.mealdbexplorer.controller;

import com.mealdbexplorer.controller.dto.*;
import com.mealdbexplorer.domain.model.Category;
import com.mealdbexplorer.domain.model.MatchResult;
import com.mealdbexplorer.domain.model.Meal;
import com.mealdbexplorer.mapper.ResponseMapper;
import com.mealdbexplorer.service.matcher.MatcherService;
import com.mealdbexplorer.service.meal.MealService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@Slf4j
@RestController
@RequestMapping("/api/meals")
@RequiredArgsConstructor
public class MealController {

    private final MealService mealService;
    private final MatcherService matcherService;
    private final ResponseMapper responseMapper;

    @GetMapping("/search")
    public ResponseEntity<List<MealResponse>> searchMeals(@RequestParam String name) {
        log.info("GET /api/meals/search - name: {}", name);

        List<Meal> meals = mealService.searchMealsByName(name);
        List<MealResponse> response = responseMapper.toMealResponseList(meals);

        return ResponseEntity.ok(response);
    }

    @GetMapping("/{id}")
    public ResponseEntity<MealResponse> getMealById(@PathVariable String id) {
        log.info("GET /api/meals/{}", id);

        Meal meal = mealService.getMealById(id);
        MealResponse response = responseMapper.toMealResponse(meal);

        return ResponseEntity.ok(response);
    }

    @GetMapping("/random")
    public ResponseEntity<MealResponse> getRandomMeal() {
        log.info("GET /api/meals/random");

        Meal meal = mealService.getRandomMeal();
        MealResponse response = responseMapper.toMealResponse(meal);

        return ResponseEntity.ok(response);
    }

    @GetMapping("/categories")
    public ResponseEntity<List<CategoryResponse>> getAllCategories() {
        log.info("GET /api/meals/categories");

        List<Category> categories = mealService.getAllCategories();
        List<CategoryResponse> response = responseMapper.toCategoryResponseList(categories);

        return ResponseEntity.ok(response);
    }

    @GetMapping("/category/{name}")
    public ResponseEntity<List<MealResponse>> getMealsByCategory(@PathVariable String name) {
        log.info("GET /api/meals/category/{}", name);

        List<Meal> meals = mealService.getMealsByCategory(name);
        List<MealResponse> response = responseMapper.toMealResponseList(meals);

        return ResponseEntity.ok(response);
    }

    @GetMapping("/popular")
    public ResponseEntity<List<MealResponse>> getPopularMeals() {
        log.info("GET /api/meals/popular");

        List<Meal> meals = mealService.getPopularMeals();
        List<MealResponse> response = responseMapper.toMealResponseList(meals);

        return ResponseEntity.ok(response);
    }

    @PostMapping("/what-can-i-cook")
    public ResponseEntity<List<MatchResponse>> whatCanICook(@Valid @RequestBody MatchRequest request) {
        log.info("POST /api/meals/what-can-i-cook - {} ingredients", request.getIngredients().size());

        List<MatchResult> matchResults;

        if (request.getMinMatchPercentage() != null) {
            matchResults = matcherService.findMatchingMealsWithCustomThreshold(
                    request.getIngredients(),
                    request.getMinMatchPercentage()
            );
        } else {
            matchResults = matcherService.findMatchingMeals(request.getIngredients());
        }

        List<MatchResponse> response = responseMapper.toMatchResponseList(matchResults);

        return ResponseEntity.ok(response);
    }
}