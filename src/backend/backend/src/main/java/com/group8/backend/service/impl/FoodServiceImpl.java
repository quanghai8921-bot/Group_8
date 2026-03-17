package com.group8.backend.service.impl;

import com.group8.backend.dto.FoodItemDTO;
import com.group8.backend.model.*;
import com.group8.backend.repository.FoodItemRepository;
import com.group8.backend.service.FoodService;
import com.group8.backend.repository.MenuCategoryRepository;
import com.group8.backend.repository.MerchantRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class FoodServiceImpl implements FoodService {

    @Autowired
    private FoodItemRepository foodItemRepository;

    @Autowired
    private MenuCategoryRepository categoryRepository;

    @Autowired
    private MerchantRepository merchantRepository;

    @Override
    public List<FoodItemDTO> getFoodByMerchant(String merchantId, boolean includeHidden) {
        return foodItemRepository.findByMerchant_MerchantId(merchantId)
                .stream()
                .filter(food -> includeHidden || (food.getFoodStatus() != null && food.getFoodStatus() != -1))
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    @Override
    public List<FoodItemDTO> getFoodByCategory(String categoryId) {
        return foodItemRepository.findByMenuCategory_CategoryId(categoryId)
                .stream()
                .filter(food -> food.getFoodStatus() != null && food.getFoodStatus() != -1)
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
                .filter(food -> food.getFoodStatus() != null && food.getFoodStatus() != -1)
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional
    public FoodItemDTO createFood(FoodItemDTO dto) {
        FoodItem food = new FoodItem();
        food.setFoodId(com.group8.backend.config.IDGenerator.generateID());
        return saveOrUpdate(food, dto);
    }

    @Override
    @Transactional
    public FoodItemDTO updateFood(String foodId, FoodItemDTO dto) {
        FoodItem food = foodItemRepository.findById(foodId)
                .orElseThrow(() -> new RuntimeException("Food not found"));
        return saveOrUpdate(food, dto);
    }

    @Override
    @Transactional
    public void deleteFood(String foodId) {
        foodItemRepository.deleteById(foodId);
    }

    private FoodItemDTO saveOrUpdate(FoodItem food, FoodItemDTO dto) {
        if (dto.getFoodName() != null) food.setFoodName(dto.getFoodName());
        if (dto.getOriginalPrice() != null) food.setOriginalPrice(dto.getOriginalPrice());
        if (dto.getSalePrice() != null) food.setSalePrice(dto.getSalePrice());
        if (dto.getFoodImage() != null) food.setFoodImage(dto.getFoodImage());
        if (dto.getDescriptions() != null) food.setDescriptions(dto.getDescriptions());
        if (dto.getFoodStatus() != null) food.setFoodStatus(dto.getFoodStatus());

        if (dto.getMerchantId() != null) {
            Merchant m = merchantRepository.findById(dto.getMerchantId())
                    .orElseThrow(() -> new RuntimeException("Merchant not found"));
            food.setMerchant(m);
        }

        if (dto.getCategoryId() != null) {
            MenuCategory c = categoryRepository.findById(dto.getCategoryId())
                    .orElseThrow(() -> new RuntimeException("Category not found"));
            food.setMenuCategory(c);
        }

        FoodItem saved = foodItemRepository.save(food);
        return convertToDTO(saved);
    }

    private FoodItemDTO convertToDTO(FoodItem food) {
        FoodItemDTO dto = new FoodItemDTO();
        dto.setFoodId(food.getFoodId());
        dto.setFoodName(food.getFoodName());
        dto.setOriginalPrice(food.getOriginalPrice());
        dto.setSalePrice(food.getSalePrice());
        dto.setFoodImage(food.getFoodImage());
        dto.setDescriptions(food.getDescriptions());
        dto.setFoodStatus(food.getFoodStatus());
        
        if (food.getMerchant() != null) {
            dto.setMerchantId(food.getMerchant().getMerchantId());
        } else {
            dto.setMerchantId("N/A");
        }
        dto.setCategoryId(
                (food.getMenuCategory() != null)
                        ? food.getMenuCategory().getCategoryId()
                        : "N/A"
        );
        dto.setCategoryName(
                (food.getMenuCategory() != null)
                        ? food.getMenuCategory().getCategoryName()
                        : "N/A"
        );
        return dto;
    }
}
