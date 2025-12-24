package com.mealdbexplorer;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cache.annotation.EnableCaching;

@SpringBootApplication
@EnableCaching
public class MealDbExplorerApplication {

	public static void main(String[] args) {
		SpringApplication.run(MealDbExplorerApplication.class, args);
	}

}
