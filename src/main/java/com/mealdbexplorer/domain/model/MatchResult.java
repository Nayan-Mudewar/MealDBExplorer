package com.mealdbexplorer.domain.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class MatchResult {

    private Meal meal;
    private double matchPercentage;
    private int matchedIngredientsCount;
    private int totalIngredientsCount;
    private List<String> matchedIngredients;
    private List<String> missingIngredients;

    public boolean isExactMatch() {
        return matchPercentage == 100.0;
    }

    public boolean isHighMatch() {
        return matchPercentage >= 70.0;
    }
}