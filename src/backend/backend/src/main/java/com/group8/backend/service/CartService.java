package com.group8.backend.service;

import com.group8.backend.dto.AddCartItemDTO;
import com.group8.backend.dto.CartResponseDTO;

public interface CartService {
    CartResponseDTO addToCart(AddCartItemDTO dto);
    CartResponseDTO getCart(String userId, String merchantId);
    java.util.List<CartResponseDTO> getCartsByUser(String userId);
    void removeCartItem(String cartItemId);
    void clearCart(String cartId);
}
