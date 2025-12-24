package com.mealdbexplorer.domain.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Ingredient {

    private String name;
    private String measure;

    public String getNormalizedName() {
        return name != null ? name.trim().toLowerCase() : "";
    }
}