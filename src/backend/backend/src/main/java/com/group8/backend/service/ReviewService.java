package com.group8.backend.service;

import com.group8.backend.model.Review;
import java.util.List;

public interface ReviewService {
    List<Review> getReviewsByMerchant(String merchantId);
    Review createReview(com.group8.backend.dto.ReviewDTO reviewDTO);
}
