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
public class Meal {

    private String id;
    private String name;
    private String category;
    private String area;
    private String instructions;
    private String thumbnailUrl;
    private String youtubeUrl;
    private List<Ingredient> ingredients;
    private List<String> tags;

    public int getIngredientCount() {
        return ingredients != null ? ingredients.size() : 0;
    }

    public boolean hasIngredient(String ingredientName) {
        if (ingredients == null || ingredientName == null) {
            return false;
        }

        String normalized = ingredientName.trim().toLowerCase();
        return ingredients.stream()
                .anyMatch(ing -> ing.getName().toLowerCase().contains(normalized) ||
                        normalized.contains(ing.getName().toLowerCase()));
    }
}