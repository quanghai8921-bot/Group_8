package com.group8.backend.service.impl;

import com.group8.backend.model.Review;
import com.group8.backend.repository.ReviewRepository;
import com.group8.backend.service.ReviewService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class ReviewServiceImpl implements ReviewService {

    @Autowired
    private ReviewRepository reviewRepository;

    @Override
    public List<Review> getReviewsByMerchant(String merchantId) {
        // Find all reviews by merchant ID via orders
        return reviewRepository.findAll().stream()
                .filter(r -> r.getOrder().getMerchant().getMerchantId().equals(merchantId))
                .collect(Collectors.toList());
    }

    @Override
    public Review createReview(Review review) {
        review.setCreatedAt(LocalDateTime.now());
        return reviewRepository.save(review);
    }
}
