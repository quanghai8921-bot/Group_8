package com.group8.backend.controller;

import com.group8.backend.dto.PaymentDTO;
import com.group8.backend.service.PaymentService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/payments")
@CrossOrigin(origins = "*")
public class PaymentController {

    @Autowired
    private PaymentService paymentService;

    @PostMapping
    public ResponseEntity<Map<String,Object>> savePayment(@Valid @RequestBody PaymentDTO dto) {
        paymentService.savePayment(dto);
        Map<String,Object> resp = new HashMap<>();
        resp.put("success", true);
        resp.put("message", "Payment saved");
        return ResponseEntity.ok(resp);
    }
}
