package com.mealdbexplorer.domain.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Category {

    private String id;
    private String name;
    private String thumbnailUrl;
    private String description;
}
