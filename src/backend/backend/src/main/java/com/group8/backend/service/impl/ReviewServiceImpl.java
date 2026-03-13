package com.group8.backend.service.impl;

import com.group8.backend.dto.ReviewDTO;
import com.group8.backend.model.*;
import com.group8.backend.repository.*;
import com.group8.backend.service.ReviewService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.UUID;

@Service
public class ReviewServiceImpl implements ReviewService {

    @Autowired
    private OrderRepository orderRepository;

    @Autowired
    private ReviewRepository reviewRepository;

    @Override
    @Transactional
    public void submitReview(ReviewDTO dto) {
        Order order = orderRepository.findById(dto.getOrderId()).orElseThrow(() -> new RuntimeException("Order not found"));
        if (!order.getOrderStatus()) {
            throw new RuntimeException("Order is not completed; cannot submit review");
        }
        Review r = new Review();
        r.setReviewId(generateId());
        r.setOrder(order);
        r.setRating((byte) dto.getRating());
        r.setComment(dto.getComment());
        r.setReviewType("ORDER");
        r.setCreatedAt(LocalDateTime.now());
        reviewRepository.save(r);
    }

    private String generateId() {
        return "REV" + UUID.randomUUID().toString().substring(0,8).toUpperCase();
    }
}
