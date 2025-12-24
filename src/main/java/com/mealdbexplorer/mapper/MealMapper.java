package com.mealdbexplorer.mapper;

import com.mealdbexplorer.adapter.themealdb.dto.MealDbDto;
import com.mealdbexplorer.domain.model.Ingredient;
import com.mealdbexplorer.domain.model.Meal;
import org.springframework.stereotype.Component;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.stream.Collectors;

@Component
public class MealMapper {

    public Meal toDomain(MealDbDto dto) {
        if (dto == null) {
            return null;
        }

        return Meal.builder()
                .id(dto.getIdMeal())
                .name(dto.getStrMeal())
                .category(dto.getStrCategory())
                .area(dto.getStrArea())
                .instructions(dto.getStrInstructions())
                .thumbnailUrl(dto.getStrMealThumb())
                .youtubeUrl(dto.getStrYoutube())
                .ingredients(extractIngredients(dto))
                .tags(extractTags(dto.getStrTags()))
                .build();
    }

    public List<Meal> toDomainList(List<MealDbDto> dtos) {
        if (dtos == null) {
            return List.of();
        }

        return dtos.stream()
                .map(this::toDomain)
                .collect(Collectors.toList());
    }

    private List<Ingredient> extractIngredients(MealDbDto dto) {
        List<Ingredient> ingredients = new ArrayList<>();

        addIngredientIfPresent(ingredients, dto.getStrIngredient1(), dto.getStrMeasure1());
        addIngredientIfPresent(ingredients, dto.getStrIngredient2(), dto.getStrMeasure2());
        addIngredientIfPresent(ingredients, dto.getStrIngredient3(), dto.getStrMeasure3());
        addIngredientIfPresent(ingredients, dto.getStrIngredient4(), dto.getStrMeasure4());
        addIngredientIfPresent(ingredients, dto.getStrIngredient5(), dto.getStrMeasure5());
        addIngredientIfPresent(ingredients, dto.getStrIngredient6(), dto.getStrMeasure6());
        addIngredientIfPresent(ingredients, dto.getStrIngredient7(), dto.getStrMeasure7());
        addIngredientIfPresent(ingredients, dto.getStrIngredient8(), dto.getStrMeasure8());
        addIngredientIfPresent(ingredients, dto.getStrIngredient9(), dto.getStrMeasure9());
        addIngredientIfPresent(ingredients, dto.getStrIngredient10(), dto.getStrMeasure10());
        addIngredientIfPresent(ingredients, dto.getStrIngredient11(), dto.getStrMeasure11());
        addIngredientIfPresent(ingredients, dto.getStrIngredient12(), dto.getStrMeasure12());
        addIngredientIfPresent(ingredients, dto.getStrIngredient13(), dto.getStrMeasure13());
        addIngredientIfPresent(ingredients, dto.getStrIngredient14(), dto.getStrMeasure14());
        addIngredientIfPresent(ingredients, dto.getStrIngredient15(), dto.getStrMeasure15());
        addIngredientIfPresent(ingredients, dto.getStrIngredient16(), dto.getStrMeasure16());
        addIngredientIfPresent(ingredients, dto.getStrIngredient17(), dto.getStrMeasure17());
        addIngredientIfPresent(ingredients, dto.getStrIngredient18(), dto.getStrMeasure18());
        addIngredientIfPresent(ingredients, dto.getStrIngredient19(), dto.getStrMeasure19());
        addIngredientIfPresent(ingredients, dto.getStrIngredient20(), dto.getStrMeasure20());

        return ingredients;
    }

    private void addIngredientIfPresent(List<Ingredient> ingredients, String name, String measure) {
        if (name != null && !name.trim().isEmpty()) {
            ingredients.add(Ingredient.builder()
                    .name(name.trim())
                    .measure(measure != null ? measure.trim() : "")
                    .build());
        }
    }

    private List<String> extractTags(String tagsString) {
        if (tagsString == null || tagsString.trim().isEmpty()) {
            return List.of();
        }

        return Arrays.stream(tagsString.split(","))
                .map(String::trim)
                .filter(tag -> !tag.isEmpty())
                .collect(Collectors.toList());
    }
}
