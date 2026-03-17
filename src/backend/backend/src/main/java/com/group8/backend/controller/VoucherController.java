package com.group8.backend.controller;

import com.group8.backend.model.Voucher;
import com.group8.backend.service.VoucherService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/vouchers")
@CrossOrigin(origins = "*")
public class VoucherController {

    @Autowired
    private VoucherService voucherService;

    @GetMapping
    public ResponseEntity<Map<String, Object>> getAllVouchers() {
        try {
            List<Voucher> vouchers = voucherService.getAllVouchers();
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("data", vouchers);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, Object> response = new HashMap<>();
            response.put("success", false);
            response.put("message", e.getMessage());
            return ResponseEntity.status(500).body(response);
        }
    }

    @GetMapping("/merchant/{merchantId}")
    public ResponseEntity<Map<String, Object>> getVouchersByMerchant(@PathVariable String merchantId) {
        try {
            List<Voucher> vouchers = voucherService.getVouchersByMerchant(merchantId);
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("data", vouchers);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, Object> response = new HashMap<>();
            response.put("success", false);
            response.put("message", e.getMessage());
            return ResponseEntity.status(500).body(response);
        }
    }

    @GetMapping("/merchant/{merchantId}/active")
    public ResponseEntity<Map<String, Object>> getActiveVouchersByMerchant(@PathVariable String merchantId) {
        try {
            List<Voucher> vouchers = voucherService.getActiveVouchersByMerchant(merchantId);
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("data", vouchers);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, Object> response = new HashMap<>();
            response.put("success", false);
            response.put("message", e.getMessage());
            return ResponseEntity.status(500).body(response);
        }
    }

    @PostMapping
    public ResponseEntity<Map<String, Object>> createVoucher(@RequestBody Voucher voucher) {
        try {
            Voucher created = voucherService.createVoucher(voucher);
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("data", created);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, Object> response = new HashMap<>();
            response.put("success", false);
            response.put("message", e.getMessage());
            return ResponseEntity.status(400).body(response);
        }
    }

    @PutMapping("/{voucherId}")
    public ResponseEntity<Map<String, Object>> updateVoucher(@PathVariable String voucherId, @RequestBody Voucher voucher) {
        try {
            Voucher updated = voucherService.updateVoucher(voucherId, voucher);
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("data", updated);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, Object> response = new HashMap<>();
            response.put("success", false);
            response.put("message", e.getMessage());
            return ResponseEntity.status(400).body(response);
        }
    }

    @DeleteMapping("/{voucherId}")
    public ResponseEntity<Map<String, Object>> deleteVoucher(@PathVariable String voucherId) {
        try {
            voucherService.deleteVoucher(voucherId);
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, Object> response = new HashMap<>();
            response.put("success", false);
            response.put("message", e.getMessage());
            return ResponseEntity.status(400).body(response);
        }
    }
}
