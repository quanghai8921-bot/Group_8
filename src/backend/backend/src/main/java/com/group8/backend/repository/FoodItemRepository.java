package com.group8.backend.repository;

import com.group8.backend.model.FoodItem;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface FoodItemRepository extends JpaRepository<FoodItem, String> {
    List<FoodItem> findByMenuCategory_Merchant_MerchantId(String merchantId);
    List<FoodItem> findByMenuCategory_CategoryId(String categoryId);
}
