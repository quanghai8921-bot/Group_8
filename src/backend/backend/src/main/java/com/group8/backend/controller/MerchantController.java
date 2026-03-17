package com.group8.backend.controller;

import com.group8.backend.model.Merchant;
import com.group8.backend.service.MerchantService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/merchants")
@CrossOrigin(origins = "*")
public class MerchantController {

    @Autowired
    private MerchantService merchantService;

    @GetMapping
    public ResponseEntity<Map<String, Object>> getAllMerchants() {
        List<Merchant> merchants = merchantService.getAllMerchants();
        Map<String, Object> response = new HashMap<>();
        response.put("success", true);
        response.put("data", merchants);
        return ResponseEntity.ok(response);
    }
    @GetMapping("/{id}")
    public ResponseEntity<Map<String, Object>> getById(@PathVariable String id) {
        Merchant merchant = merchantService.getMerchantById(id);
        Map<String, Object> response = new HashMap<>();
        if (merchant != null) {
            response.put("success", true);
            response.put("data", merchant);
            return ResponseEntity.ok(response);
        } else {
            response.put("success", false);
            response.put("message", "Merchant not found");
            return ResponseEntity.status(404).body(response);
        }
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<Map<String, Object>> getByUserId(@PathVariable String userId) {
        Merchant merchant = merchantService.getMerchantByUserId(userId);
        Map<String, Object> response = new HashMap<>();
        if (merchant != null) {
            response.put("success", true);
            response.put("data", merchant);
            return ResponseEntity.ok(response);
        } else {
            response.put("success", false);
            response.put("message", "Merchant not found for this user");
            return ResponseEntity.status(404).body(response);
        }
    }

    @PatchMapping("/{id}/status")
    public ResponseEntity<Map<String, Object>> updateStatus(@PathVariable String id, @RequestBody Map<String, Boolean> body) {
        boolean activeStatus = body.get("activeStatus");
        Merchant updated = merchantService.updateMerchantStatus(id, activeStatus);
        Map<String, Object> response = new HashMap<>();
        if (updated != null) {
            response.put("success", true);
            response.put("data", updated);
            return ResponseEntity.ok(response);
        } else {
            response.put("success", false);
            response.put("message", "Merchant not found");
            return ResponseEntity.status(404).body(response);
        }
    }
}
