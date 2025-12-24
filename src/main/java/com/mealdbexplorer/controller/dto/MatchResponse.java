package com.mealdbexplorer.controller.dto;

import com.mealdbexplorer.controller.dto.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;

import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class MatchResponse {
    @Autowired
    private MealResponse meal;
    private double matchPercentage;
    private int matchedIngredientsCount;
    private int totalIngredientsCount;
    private List<String> matchedIngredients;
    private List<String> missingIngredients;
}