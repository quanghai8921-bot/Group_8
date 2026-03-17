package com.group8.backend.controller;

import com.group8.backend.repository.MerchantRepository;
import com.group8.backend.repository.OrderRepository;
import com.group8.backend.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/admin")
@CrossOrigin(origins = "*")
public class AdminController {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private MerchantRepository merchantRepository;

    @Autowired
    private OrderRepository orderRepository;

    @GetMapping("/stats")
    public ResponseEntity<Map<String, Object>> getStats() {
        long totalUsers = userRepository.count();
        long totalMerchants = merchantRepository.count();
        long totalOrders = orderRepository.count();
        
        // Sum of finalAmount from all orders
        Long totalRevenue = orderRepository.findAll().stream()
                .mapToLong(order -> order.getFinalAmount() != null ? order.getFinalAmount() : 0L)
                .sum();

        Map<String, Object> stats = new HashMap<>();
        stats.put("totalUsers", totalUsers);
        stats.put("totalMerchants", totalMerchants);
        stats.put("totalOrders", totalOrders);
        stats.put("totalRevenue", totalRevenue);

        Map<String, Object> response = new HashMap<>();
        response.put("success", true);
        response.put("data", stats);
        
        return ResponseEntity.ok(response);
    }
}
