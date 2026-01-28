package com.group8.backend.service.impl;

import com.group8.backend.dto.OrderRequestDTO;
import com.group8.backend.dto.OrderResponseDTO;
import com.group8.backend.model.*;
import com.group8.backend.repository.*;
import com.group8.backend.service.OrderService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
public class OrderServiceImpl implements OrderService {

    @Autowired
    private OrderRepository orderRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private MerchantRepository merchantRepository;

    @Autowired
    private DriverRepository driverRepository;

    @Autowired
    private VoucherRepository voucherRepository;

    @Override
    public OrderResponseDTO createOrder(OrderRequestDTO dto) {
        // Validate User
        Optional<User> user = userRepository.findById(dto.getUserId());
        if (user.isEmpty()) {
            throw new RuntimeException("User not found");
        }

        // Validate Merchant
        Optional<Merchant> merchant = merchantRepository.findById(dto.getMerchantId());
        if (merchant.isEmpty()) {
            throw new RuntimeException("Merchant not found");
        }

        // Create Order
        Order order = new Order();
        order.setOrderId(generateId());
        order.setUser(user.get());
        order.setMerchant(merchant.get());
        order.setOrderTime(LocalDateTime.now());
        order.setFoodAmount(dto.getFoodAmount());
        order.setShippingFee(dto.getShippingFee());
        order.setDiscountAmount(dto.getDiscountAmount() != null ? dto.getDiscountAmount() : BigDecimal.ZERO);
        order.setStatus((byte) 1); // Status: 1 = Pending
        order.setDeliveryAddress(dto.getDeliveryAddress());

        // Set Driver if provided
        if (dto.getDriverId() != null) {
            Optional<Driver> driver = driverRepository.findById(dto.getDriverId());
            driver.ifPresent(order::setDriver);
        }

        // Set Voucher if provided
        if (dto.getVoucherId() != null) {
            Optional<Voucher> voucher = voucherRepository.findById(dto.getVoucherId());
            voucher.ifPresent(order::setVoucher);
        }

        Order savedOrder = orderRepository.save(order);
        return convertToResponseDTO(savedOrder);
    }

    @Override
    public OrderResponseDTO getOrderById(String orderId) {
        Optional<Order> order = orderRepository.findById(orderId);
        if (order.isEmpty()) {
            throw new RuntimeException("Order not found");
        }
        return convertToResponseDTO(order.get());
    }

    @Override
    public List<OrderResponseDTO> getOrdersByUser(String userId) {
        return orderRepository.findByUser_UserId(userId)
                .stream()
                .map(this::convertToResponseDTO)
                .collect(Collectors.toList());
    }

    @Override
    public List<OrderResponseDTO> getOrdersByMerchant(String merchantId) {
        return orderRepository.findByMerchant_MerchantId(merchantId)
                .stream()
                .map(this::convertToResponseDTO)
                .collect(Collectors.toList());
    }

    private OrderResponseDTO convertToResponseDTO(Order order) {
        OrderResponseDTO dto = new OrderResponseDTO();
        dto.setOrderId(order.getOrderId());
        dto.setUserId(order.getUser().getUserId());
        dto.setMerchantId(order.getMerchant().getMerchantId());
        dto.setOrderTime(order.getOrderTime());
        dto.setFoodAmount(order.getFoodAmount());
        dto.setShippingFee(order.getShippingFee());
        dto.setDiscountAmount(order.getDiscountAmount());
        // Final_Amount = Food_Amount + Shipping_Fee - Discount_Amount
        BigDecimal finalAmount = order.getFoodAmount()
                .add(order.getShippingFee())
                .subtract(order.getDiscountAmount());
        dto.setFinalAmount(finalAmount);
        dto.setStatus(order.getStatus());
        dto.setDeliveryAddress(order.getDeliveryAddress());
        return dto;
    }

    private String generateId() {
        return "ORD" + UUID.randomUUID().toString().substring(0, 8).toUpperCase();
    }
}
