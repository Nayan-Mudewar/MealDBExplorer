package com.mealdbexplorer.controller.dto;

import jakarta.validation.constraints.NotEmpty;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class MatchRequest {

    @NotEmpty(message = "Ingredients list cannot be empty")
    private List<String> ingredients;

    private Double minMatchPercentage;
}