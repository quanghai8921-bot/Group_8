package com.group8.backend.repository;

import com.group8.backend.model.Cart;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface CartRepository extends JpaRepository<Cart, String> {
    Optional<Cart> findByUser_UserIdAndMerchant_MerchantId(String userId, String merchantId);
    java.util.List<Cart> findByUser_UserId(String userId);
}
