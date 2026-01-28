package com.group8.backend.repository;

import com.group8.backend.model.FoodToppingMapping;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface FoodToppingMappingRepository extends JpaRepository<FoodToppingMapping, String> {
    List<FoodToppingMapping> findByFoodItem_FoodId(String foodId);
}
