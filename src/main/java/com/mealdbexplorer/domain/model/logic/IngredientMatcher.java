package com.mealdbexplorer.domain.logic;

import com.mealdbexplorer.domain.model.Ingredient;
import com.mealdbexplorer.domain.model.MatchResult;
import com.mealdbexplorer.domain.model.Meal;
import org.springframework.stereotype.Component;

import java.util.ArrayList;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@Component
public class IngredientMatcher {

    public MatchResult calculateMatch(Meal meal, List<String> userIngredients) {
        if (meal == null || userIngredients == null || userIngredients.isEmpty()) {
            return createEmptyMatch(meal);
        }

        Set<String> normalizedUserIngredients = userIngredients.stream()
                .map(String::toLowerCase)
                .map(String::trim)
                .collect(Collectors.toSet());

        List<Ingredient> mealIngredients = meal.getIngredients();
        if (mealIngredients == null || mealIngredients.isEmpty()) {
            return createEmptyMatch(meal);
        }

        List<String> matchedIngredients = new ArrayList<>();
        List<String> missingIngredients = new ArrayList<>();

        for (Ingredient mealIngredient : mealIngredients) {
            String mealIngName = mealIngredient.getName().toLowerCase().trim();

            if (isIngredientMatched(mealIngName, normalizedUserIngredients)) {
                matchedIngredients.add(mealIngredient.getName());
            } else {
                missingIngredients.add(mealIngredient.getName());
            }
        }

        int matchedCount = matchedIngredients.size();
        int totalCount = mealIngredients.size();
        double matchPercentage = totalCount > 0
                ? (double) matchedCount / totalCount * 100.0
                : 0.0;

        return MatchResult.builder()
                .meal(meal)
                .matchPercentage(Math.round(matchPercentage * 100.0) / 100.0) // Round to 2 decimals
                .matchedIngredientsCount(matchedCount)
                .totalIngredientsCount(totalCount)
                .matchedIngredients(matchedIngredients)
                .missingIngredients(missingIngredients)
                .build();
    }

    private boolean isIngredientMatched(String mealIngredient, Set<String> userIngredients) {
        // Exact match
        if (userIngredients.contains(mealIngredient)) {
            return true;
        }

        // Partial match - check if user ingredient contains meal ingredient or vice versa
        for (String userIng : userIngredients) {
            if (userIng.contains(mealIngredient) || mealIngredient.contains(userIng)) {
                return true;
            }
        }

        return false;
    }

    private MatchResult createEmptyMatch(Meal meal) {
        return MatchResult.builder()
                .meal(meal)
                .matchPercentage(0.0)
                .matchedIngredientsCount(0)
                .totalIngredientsCount(meal != null ? meal.getIngredientCount() : 0)
                .matchedIngredients(List.of())
                .missingIngredients(meal != null && meal.getIngredients() != null
                        ? meal.getIngredients().stream()
                        .map(Ingredient::getName)
                        .collect(Collectors.toList())
                        : List.of())
                .build();
    }

    public List<MatchResult> sortByMatchPercentage(List<MatchResult> results) {
        if (results == null) {
            return List.of();
        }

        return results.stream()
                .sorted((r1, r2) -> {
                    // First sort by match percentage (descending)
                    int percentageCompare = Double.compare(r2.getMatchPercentage(), r1.getMatchPercentage());
                    if (percentageCompare != 0) {
                        return percentageCompare;
                    }

                    // If percentages are equal, sort by matched count (descending)
                    return Integer.compare(r2.getMatchedIngredientsCount(), r1.getMatchedIngredientsCount());
                })
                .collect(Collectors.toList());
    }
}
