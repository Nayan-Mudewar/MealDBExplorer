package com.mealdbexplorer.service.matcher;

import com.mealdbexplorer.domain.model.logic.IngredientMatcher;
import com.mealdbexplorer.domain.model.MatchResult;
import com.mealdbexplorer.domain.model.Meal;
import com.mealdbexplorer.service.meal.MealService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Slf4j
@Service
@RequiredArgsConstructor
public class MatcherService {

    private final MealService mealService;
    private final IngredientMatcher ingredientMatcher;

    private static final double MIN_MATCH_THRESHOLD = 30.0;

    public List<MatchResult> findMatchingMeals(List<String> userIngredients) {
        log.info("Finding matching meals for {} ingredients", userIngredients.size());

        if (userIngredients == null || userIngredients.isEmpty()) {
            return List.of();
        }

        // Get all meals from cache or API
        List<Meal> allMeals = mealService.getAllMeals();
        log.debug("Retrieved {} meals for matching", allMeals.size());

        // Calculate matches
        List<MatchResult> allMatches = allMeals.stream()
                .map(meal -> ingredientMatcher.calculateMatch(meal, userIngredients))
                .filter(match -> match.getMatchPercentage() >= MIN_MATCH_THRESHOLD)
                .collect(Collectors.toList());

        log.info("Found {} meals matching threshold of {}%", allMatches.size(), MIN_MATCH_THRESHOLD);

        // Sort by match percentage
        return ingredientMatcher.sortByMatchPercentage(allMatches);
    }

    public List<MatchResult> findMatchingMealsWithCustomThreshold(
            List<String> userIngredients,
            double minMatchPercentage) {

        log.info("Finding matching meals with custom threshold: {}%", minMatchPercentage);

        if (userIngredients == null || userIngredients.isEmpty()) {
            return List.of();
        }

        List<Meal> allMeals = mealService.getAllMeals();

        List<MatchResult> allMatches = allMeals.stream()
                .map(meal -> ingredientMatcher.calculateMatch(meal, userIngredients))
                .filter(match -> match.getMatchPercentage() >= minMatchPercentage)
                .collect(Collectors.toList());

        return ingredientMatcher.sortByMatchPercentage(allMatches);
    }
}
