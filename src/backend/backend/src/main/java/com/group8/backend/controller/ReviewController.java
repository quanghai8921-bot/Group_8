package com.group8.backend.controller;

import com.group8.backend.dto.ReviewDTO;
import com.group8.backend.service.ReviewService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/reviews")
@CrossOrigin(origins = "*")
public class ReviewController {

    @Autowired
    private ReviewService reviewService;

    @PostMapping
    public ResponseEntity<Map<String,Object>> submitReview(@Valid @RequestBody ReviewDTO dto) {
        reviewService.submitReview(dto);
        Map<String,Object> resp = new HashMap<>();
        resp.put("success", true);
        resp.put("message", "Review submitted");
        return ResponseEntity.ok(resp);
    }
}
