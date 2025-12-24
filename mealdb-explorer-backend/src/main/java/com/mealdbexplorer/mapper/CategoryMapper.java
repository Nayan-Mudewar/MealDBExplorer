package com.mealdbexplorer.mapper;

import com.mealdbexplorer.adapter.themealdb.dto.CategoryDbDto;
import com.mealdbexplorer.domain.model.Category;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.stream.Collectors;

@Component
public class CategoryMapper {

    public Category toDomain(CategoryDbDto dto) {
        if (dto == null) {
            return null;
        }

        return Category.builder()
                .id(dto.getIdCategory())
                .name(dto.getStrCategory())
                .thumbnailUrl(dto.getStrCategoryThumb())
                .description(dto.getStrCategoryDescription())
                .build();
    }

    public List<Category> toDomainList(List<CategoryDbDto> dtos) {
        if (dtos == null) {
            return List.of();
        }

        return dtos.stream()
                .map(this::toDomain)
                .collect(Collectors.toList());
    }
}
