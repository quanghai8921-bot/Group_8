package com.group8.backend.repository;

import com.group8.backend.model.Review;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ReviewRepository extends JpaRepository<Review, String> {
    List<Review> findByOrder_OrderId(String orderId);
    List<Review> findByOrder_Merchant_MerchantId(String merchantId);
}
