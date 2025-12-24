package com.mealdbexplorer;

import com.mealdbexplorer.adaptor.themealdb.dto.MealDbSearchResponse;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.util.UriComponentsBuilder;

@Component
public class TheMealDbClient {

    private static final String BASE_URL =
            "https://www.themealdb.com/api/json/v1/1";

    private final RestTemplate restTemplate = new RestTemplate();

    public MealDbSearchResponse searchMealByName(String name) {

        String url = UriComponentsBuilder
                .fromHttpUrl(BASE_URL + "/search.php")
                .queryParam("s", name)
                .toUriString();

        return restTemplate.getForObject(url, MealDbSearchResponse.class);
    }
}
