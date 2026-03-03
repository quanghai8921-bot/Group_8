package com.group8.backend.service;

import com.group8.backend.dto.AddCartItemDTO;
import com.group8.backend.dto.CartResponseDTO;

public interface CartService {
    CartResponseDTO addToCart(AddCartItemDTO dto);
    CartResponseDTO getCart(String userId, String merchantId);
    void removeCartItem(String cartItemId);
    void clearCart(String cartId);
}
