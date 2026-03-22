package com.group8.backend.service.impl;

import com.group8.backend.dto.ReviewDTO;
import com.group8.backend.model.Review;
import com.group8.backend.model.Order;
import com.group8.backend.repository.OrderRepository;
import com.group8.backend.repository.ReviewRepository;
import com.group8.backend.service.ReviewService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class ReviewServiceImpl implements ReviewService {

    @Autowired
    private OrderRepository orderRepository;

    @Autowired
    private ReviewRepository reviewRepository;

    @Override
    public List<Review> getReviewsByMerchant(String merchantId) {
        return reviewRepository.findByOrder_Merchant_MerchantId(merchantId);
    }

    @Override
    @Transactional
    public Review createReview(ReviewDTO reviewDTO) {
        Order order = orderRepository.findById(reviewDTO.getOrderId())
                .orElseThrow(() -> new RuntimeException("Order not found with id: " + reviewDTO.getOrderId()));

        Review review = new Review();
        review.setOrder(order);
        review.setRating((byte) reviewDTO.getRating());
        review.setComment(reviewDTO.getComment());
        review.setReviewType(reviewDTO.getReviewType());
        review.setMediaUrl(reviewDTO.getMediaUrl());

        return reviewRepository.save(review);
    }
}
