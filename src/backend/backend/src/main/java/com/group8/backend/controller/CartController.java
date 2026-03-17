package com.group8.backend.controller;

import com.group8.backend.dto.*;
import com.group8.backend.service.CartService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping({"/api/carts"})
@CrossOrigin(origins = "*")
public class CartController {

    @Autowired
    private CartService cartService;

    @PostMapping("/add")
    public ResponseEntity<Map<String,Object>> addToCart(@Valid @RequestBody AddCartItemDTO dto) {
        CartResponseDTO cart = cartService.addToCart(dto);
        Map<String,Object> resp = new HashMap<>();
        resp.put("success", true);
        resp.put("data", cart);
        return ResponseEntity.status(HttpStatus.OK).body(resp);
    }

    @GetMapping("/{userId}/{merchantId}")
    public ResponseEntity<Map<String,Object>> getCart(@PathVariable String userId, @PathVariable String merchantId) {
        CartResponseDTO cart = cartService.getCart(userId, merchantId);
        Map<String,Object> resp = new HashMap<>();
        resp.put("success", true);
        resp.put("data", cart);
        return ResponseEntity.ok(resp);
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<Map<String,Object>> getCartsByUser(@PathVariable String userId) {
        java.util.List<CartResponseDTO> carts = cartService.getCartsByUser(userId);
        Map<String,Object> resp = new HashMap<>();
        resp.put("success", true);
        resp.put("data", carts);
        return ResponseEntity.ok(resp);
    }

    @DeleteMapping("/item/{cartItemId}")
    public ResponseEntity<Map<String,Object>> removeCartItem(@PathVariable String cartItemId) {
        cartService.removeCartItem(cartItemId);
        Map<String,Object> resp = new HashMap<>();
        resp.put("success", true);
        resp.put("message", "Cart item removed");
        return ResponseEntity.ok(resp);
    }

    @DeleteMapping("/{cartId}")
    public ResponseEntity<Map<String,Object>> clearCart(@PathVariable String cartId) {
        cartService.clearCart(cartId);
        Map<String,Object> resp = new HashMap<>();
        resp.put("success", true);
        resp.put("message", "Cart cleared");
        return ResponseEntity.ok(resp);
    }
}
