package com.group8.backend.service.impl;

import com.group8.backend.dto.FoodItemDTO;
import com.group8.backend.model.FoodItem;
import com.group8.backend.repository.FoodItemRepository;
import com.group8.backend.service.FoodService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class FoodServiceImpl implements FoodService {

    @Autowired
    private FoodItemRepository foodItemRepository;

    @Override
    public List<FoodItemDTO> getFoodByMerchant(String merchantId) {
        return foodItemRepository.findByMenuCategory_Merchant_MerchantId(merchantId)
                .stream()
                .filter(food -> food.getFoodStatus() != null && food.getFoodStatus())
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    @Override
    public List<FoodItemDTO> getFoodByCategory(String categoryId) {
        return foodItemRepository.findByMenuCategory_CategoryId(categoryId)
                .stream()
                .filter(food -> food.getFoodStatus() != null && food.getFoodStatus())
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    @Override
    public FoodItemDTO getFoodById(String foodId) {
        Optional<FoodItem> food = foodItemRepository.findById(foodId);
        if (food.isEmpty()) {
            throw new RuntimeException("Food not found");
        }
        return convertToDTO(food.get());
    }

    @Override
    public List<FoodItemDTO> getAllAvailableFood() {
        return foodItemRepository.findAll()
                .stream()
                .filter(food -> food.getFoodStatus() != null && food.getFoodStatus())
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    private FoodItemDTO convertToDTO(FoodItem food) {
        FoodItemDTO dto = new FoodItemDTO();
        dto.setFoodId(food.getFoodId());
        dto.setFoodName(food.getFoodName());
        dto.setOriginalPrice(new java.math.BigDecimal(food.getOriginalPrice()));
        dto.setSalePrice(new java.math.BigDecimal(food.getSalePrice()));
        dto.setFoodImage(food.getFoodImage());
        dto.setDescriptions(food.getDescriptions());
        dto.setCategoryId(food.getMenuCategory().getCategoryId());
        dto.setCategoryName(food.getMenuCategory().getNameCategory());
        return dto;
    }
}
