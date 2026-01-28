package com.group8.backend.service;

import com.group8.backend.dto.OrderRequestDTO;
import com.group8.backend.dto.OrderResponseDTO;

import java.util.List;

public interface OrderService {
    OrderResponseDTO createOrder(OrderRequestDTO dto);
    OrderResponseDTO getOrderById(String orderId);
    List<OrderResponseDTO> getOrdersByUser(String userId);
    List<OrderResponseDTO> getOrdersByMerchant(String merchantId);
}
