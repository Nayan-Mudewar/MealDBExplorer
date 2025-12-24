package com.mealdbexplorer.mapper;

import com.mealdbexplorer.controller.dto.*;
import com.mealdbexplorer.domain.model.Category;
import com.mealdbexplorer.domain.model.Ingredient;
import com.mealdbexplorer.domain.model.MatchResult;
import com.mealdbexplorer.domain.model.Meal;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.stream.Collectors;

@Component
public class ResponseMapper {

    public MealResponse toMealResponse(Meal meal) {
        if (meal == null) {
            return null;
        }

        return MealResponse.builder()
                .id(meal.getId())
                .name(meal.getName())
                .category(meal.getCategory())
                .area(meal.getArea())
                .instructions(meal.getInstructions())
                .thumbnailUrl(meal.getThumbnailUrl())
                .youtubeUrl(meal.getYoutubeUrl())
                .ingredients(toIngredientDtos(meal.getIngredients()))
                .tags(meal.getTags())
                .build();
    }

    public List<MealResponse> toMealResponseList(List<Meal> meals) {
        if (meals == null) {
            return List.of();
        }

        return meals.stream()
                .map(this::toMealResponse)
                .collect(Collectors.toList());
    }

    public CategoryResponse toCategoryResponse(Category category) {
        if (category == null) {
            return null;
        }

        return CategoryResponse.builder()
                .id(category.getId())
                .name(category.getName())
                .thumbnailUrl(category.getThumbnailUrl())
                .description(category.getDescription())
                .build();
    }

    public List<CategoryResponse> toCategoryResponseList(List<Category> categories) {
        if (categories == null) {
            return List.of();
        }

        return categories.stream()
                .map(this::toCategoryResponse)
                .collect(Collectors.toList());
    }

    public MatchResponse toMatchResponse(MatchResult matchResult) {
        if (matchResult == null) {
            return null;
        }

        return MatchResponse.builder()
                .meal(toMealResponse(matchResult.getMeal()))
                .matchPercentage(matchResult.getMatchPercentage())
                .matchedIngredientsCount(matchResult.getMatchedIngredientsCount())
                .totalIngredientsCount(matchResult.getTotalIngredientsCount())
                .matchedIngredients(matchResult.getMatchedIngredients())
                .missingIngredients(matchResult.getMissingIngredients())
                .build();
    }

    public List<MatchResponse> toMatchResponseList(List<MatchResult> matchResults) {
        if (matchResults == null) {
            return List.of();
        }

        return matchResults.stream()
                .map(this::toMatchResponse)
                .collect(Collectors.toList());
    }

    private List<IngredientDto> toIngredientDtos(List<Ingredient> ingredients) {
        if (ingredients == null) {
            return List.of();
        }

        return ingredients.stream()
                .map(ing -> IngredientDto.builder()
                        .name(ing.getName())
                        .measure(ing.getMeasure())
                        .build())
                .collect(Collectors.toList());
    }
}
