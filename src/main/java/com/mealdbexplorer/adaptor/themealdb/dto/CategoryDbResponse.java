package com.mealdbexplorer.adaptor.themealdb.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import com.mealdbexplorer.adapter.themealdb.dto.CategoryDbDto;
import lombok.Data;

import java.util.List;

@Data
public class CategoryDbResponse {

    @JsonProperty("categories")
    private List<CategoryDbDto> categories;
}