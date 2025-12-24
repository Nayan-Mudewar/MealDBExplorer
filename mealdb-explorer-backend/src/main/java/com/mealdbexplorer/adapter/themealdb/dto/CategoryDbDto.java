package com.mealdbexplorer.adapter.themealdb.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Data;

@Data
public class CategoryDbDto {

    @JsonProperty("idCategory")
    private String idCategory;

    @JsonProperty("strCategory")
    private String strCategory;

    @JsonProperty("strCategoryThumb")
    private String strCategoryThumb;

    @JsonProperty("strCategoryDescription")
    private String strCategoryDescription;
}
