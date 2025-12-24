package com.mealdbexplorer.adaptor.themealdb.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Data;

import java.util.List;

@Data
public class MealDbResponse {

    @JsonProperty("meals")
    private List<com.mealdbexplorer.adapter.themealdb.dto.MealDbDto> meals;
}
