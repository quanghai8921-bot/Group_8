package com.group8.backend.repository;

import com.group8.backend.model.OrderDetailTopping;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface OrderDetailToppingRepository extends JpaRepository<OrderDetailTopping, String> {
}
