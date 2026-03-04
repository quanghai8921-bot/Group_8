package com.group8.backend.service.impl;

import com.group8.backend.dto.PaymentDTO;
import com.group8.backend.model.*;
import com.group8.backend.repository.*;
import com.group8.backend.service.PaymentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.UUID;

@Service
public class PaymentServiceImpl implements PaymentService {

    @Autowired
    private PaymentRepository paymentRepository;

    @Autowired
    private OrderRepository orderRepository;

    @Override
    @Transactional
    public void savePayment(PaymentDTO dto) {
        Order order = orderRepository.findById(dto.getOrderId()).orElseThrow(() -> new RuntimeException("Order not found"));
        Payment p = new Payment();
        p.setPaymentId(generateId());
        p.setOrder(order);
        p.setAmount(dto.getAmount());
        p.setPaymentMethod(dto.getPaymentMethod());
        p.setPaymentDate(LocalDateTime.now());
        p.setStatus(dto.getStatus());
        paymentRepository.save(p);

        // Optionally update order status to Paid/Completed (business rule)
        order.setStatus((byte)4); // 4 = Completed
        orderRepository.save(order);
    }

    private String generateId() {
        return "PAY" + UUID.randomUUID().toString().substring(0,8).toUpperCase();
    }
}
