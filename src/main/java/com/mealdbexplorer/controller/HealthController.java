package com.mealdbexplorer.controller;

import com.mealdbexplorer.adapter.themealdb.TheMealDbClient;
import com.mealdbexplorer.adaptor.*;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api")
public class HealthController {

    private TheMealDbClient theMealDbClient;

    @GetMapping("/health")
    public String health() {
        return "MealDB Explorer backend is running";
    }

    @GetMapping("/test-mealdb")
    public Object testMealDb() {
        return theMealDbClient.searchMealByName("chicken");
    }

}
