package com.group8.backend.repository;

import com.group8.backend.model.CartItemTopping;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CartItemToppingRepository extends JpaRepository<CartItemTopping, String> {
    List<CartItemTopping> findByCartItem_CartItemId(String cartItemId);
    void deleteByCartItem_CartItemId(String cartItemId);
}
