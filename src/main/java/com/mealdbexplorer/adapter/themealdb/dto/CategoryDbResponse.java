package com.mealdbexplorer.adapter.themealdb.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Data;

import java.util.List;

@Data
public class CategoryDbResponse {

    @JsonProperty("categories")
    private List<CategoryDbDto> categories;
}