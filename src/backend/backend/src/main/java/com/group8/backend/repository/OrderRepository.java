package com.group8.backend.repository;

import com.group8.backend.model.Order;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface OrderRepository extends JpaRepository<Order, String> {
    List<Order> findByUser_UserId(String userId);
    List<Order> findByMerchant_MerchantId(String merchantId);
    boolean existsByUser_UserIdAndVoucher_VoucherId(String userId, String voucherId);
}
