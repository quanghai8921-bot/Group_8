package com.group8.backend.service;

import com.group8.backend.dto.FoodItemDTO;

import java.util.List;

public interface FoodService {
    List<FoodItemDTO> getFoodByMerchant(String merchantId, boolean includeHidden);

    List<FoodItemDTO> getFoodByCategory(String categoryId);

    FoodItemDTO getFoodById(String foodId);

    List<FoodItemDTO> getAllAvailableFood();
    FoodItemDTO createFood(FoodItemDTO dto);
    
    FoodItemDTO updateFood(String foodId, FoodItemDTO dto);
    
    void deleteFood(String foodId);
}
