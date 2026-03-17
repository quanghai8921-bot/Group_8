package com.group8.backend.controller;

import com.group8.backend.dto.FoodItemDTO;
import com.group8.backend.service.FoodService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/foods")
@CrossOrigin(origins = "*")
public class FoodController {

    @Autowired
    private FoodService foodService;

    @GetMapping
    public ResponseEntity<Map<String, Object>> getAllAvailableFood() {
        try {
            List<FoodItemDTO> foods = foodService.getAllAvailableFood();
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("data", foods);
            response.put("count", foods.size());
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, Object> response = new HashMap<>();
            response.put("success", false);
            response.put("message", e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }

    @GetMapping("/{foodId}")
    public ResponseEntity<Map<String, Object>> getFoodById(@PathVariable String foodId) {
        try {
            FoodItemDTO food = foodService.getFoodById(foodId);
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("data", food);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, Object> response = new HashMap<>();
            response.put("success", false);
            response.put("message", e.getMessage());
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(response);
        }
    }

    @GetMapping("/merchant/{merchantId}")
    public ResponseEntity<Map<String, Object>> getFoodByMerchant(
            @PathVariable String merchantId,
            @RequestParam(required = false, defaultValue = "false") boolean all) {
        try {
            List<FoodItemDTO> foods = foodService.getFoodByMerchant(merchantId, all);
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("data", foods);
            response.put("count", foods.size());
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, Object> response = new HashMap<>();
            response.put("success", false);
            response.put("message", e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }

    @GetMapping("/category/{categoryId}")
    public ResponseEntity<Map<String, Object>> getFoodByCategory(@PathVariable String categoryId) {
        try {
            List<FoodItemDTO> foods = foodService.getFoodByCategory(categoryId);
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("data", foods);
            response.put("count", foods.size());
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, Object> response = new HashMap<>();
            response.put("success", false);
            response.put("message", e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }

    @PostMapping
    public ResponseEntity<Map<String, Object>> createFood(@RequestBody FoodItemDTO dto) {
        try {
            FoodItemDTO created = foodService.createFood(dto);
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("data", created);
            return ResponseEntity.status(HttpStatus.CREATED).body(response);
        } catch (Exception e) {
            Map<String, Object> response = new HashMap<>();
            response.put("success", false);
            response.put("message", e.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(response);
        }
    }

    @PutMapping("/{foodId}")
    public ResponseEntity<Map<String, Object>> updateFood(@PathVariable String foodId, @RequestBody FoodItemDTO dto) {
        try {
            FoodItemDTO updated = foodService.updateFood(foodId, dto);
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("data", updated);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, Object> response = new HashMap<>();
            response.put("success", false);
            response.put("message", e.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(response);
        }
    }

    @DeleteMapping("/{foodId}")
    public ResponseEntity<Map<String, Object>> deleteFood(@PathVariable String foodId) {
        try {
            foodService.deleteFood(foodId);
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("message", "Food deleted successfully");
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, Object> response = new HashMap<>();
            response.put("success", false);
            response.put("message", e.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(response);
        }
    }
}
