package com.group8.backend.service;

import com.group8.backend.dto.FoodItemDTO;

import java.util.List;

public interface FoodService {
    List<FoodItemDTO> getFoodByMerchant(String merchantId);

    List<FoodItemDTO> getFoodByCategory(String categoryId);

    FoodItemDTO getFoodById(String foodId);

    List<FoodItemDTO> getAllAvailableFood();
}
