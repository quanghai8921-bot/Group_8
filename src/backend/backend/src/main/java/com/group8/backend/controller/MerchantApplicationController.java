package com.group8.backend.controller;

import com.group8.backend.model.MerchantApplication;
import com.group8.backend.service.MerchantApplicationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/merchants/apply")
@CrossOrigin(origins = "*")
public class MerchantApplicationController {

    private static final org.slf4j.Logger log = org.slf4j.LoggerFactory.getLogger(MerchantApplicationController.class);

    @Autowired
    private MerchantApplicationService applicationService;

    @PostMapping
    public ResponseEntity<Map<String, Object>> submitApplication(@RequestBody MerchantApplication application) {
        log.info("Received merchant application for user: {}", 
            application.getUser() != null ? application.getUser().getUserId() : "NULL");
        try {
            MerchantApplication created = applicationService.apply(application);
            log.info("Saved application with ID: {}", created.getApplicationId());
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("data", created);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            log.error("Error submitting application", e);
            Map<String, Object> response = new HashMap<>();
            response.put("success", false);
            response.put("message", e.getMessage());
            return ResponseEntity.badRequest().body(response);
        }
    }

    @GetMapping("/pending")
    public ResponseEntity<Map<String, Object>> getPending() {
        log.info("Fetching all pending merchant applications");
        List<MerchantApplication> list = applicationService.getAllPending();
        log.info("Found {} pending applications", list.size());
        Map<String, Object> response = new HashMap<>();
        response.put("success", true);
        response.put("data", list);
        return ResponseEntity.ok(response);
    }

    @PostMapping("/{id}/approve")
    public ResponseEntity<Map<String, Object>> approve(@PathVariable String id) {
        log.info("Approving application: {}", id);
        try {
            MerchantApplication app = applicationService.approve(id);
            log.info("Application approved successfully: {}", id);
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("message", "Application approved. User is now a Merchant.");
            response.put("data", app);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            log.error("Error approving application: " + id, e);
            Map<String, Object> response = new HashMap<>();
            response.put("success", false);
            response.put("message", e.getMessage());
            return ResponseEntity.badRequest().body(response);
        }
    }

    @PostMapping("/{id}/reject")
    public ResponseEntity<Map<String, Object>> reject(@PathVariable String id) {
        MerchantApplication app = applicationService.reject(id);
        Map<String, Object> response = new HashMap<>();
        response.put("success", true);
        response.put("message", "Application rejected.");
        response.put("data", app);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<Map<String, Object>> getByUser(@PathVariable String userId) {
        List<MerchantApplication> list = applicationService.getByUserId(userId);
        Map<String, Object> response = new HashMap<>();
        response.put("success", true);
        response.put("data", list);
        return ResponseEntity.ok(response);
    }
}
