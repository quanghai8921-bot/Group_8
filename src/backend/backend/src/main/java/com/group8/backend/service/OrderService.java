package com.group8.backend.service;

import com.group8.backend.dto.OrderRequestDTO;
import com.group8.backend.dto.OrderResponseDTO;
import com.group8.backend.dto.CheckoutRequestDTO;
import com.group8.backend.dto.CheckoutResponseDTO;

import java.util.List;

public interface OrderService {
    OrderResponseDTO createOrder(OrderRequestDTO dto);

    // Place order by transferring Cart -> Order (transactional)
    OrderResponseDTO createOrderFromCart(com.group8.backend.dto.PlaceOrderDTO dto);

    CheckoutResponseDTO checkout(CheckoutRequestDTO dto);

    OrderResponseDTO getOrderById(String orderId);
    List<OrderResponseDTO> getOrdersByUser(String userId);
    List<OrderResponseDTO> getOrdersByMerchant(String merchantId);

    List<OrderResponseDTO> getAllOrders();

    OrderResponseDTO updateOrderStatus(String orderId, Integer status);
}
