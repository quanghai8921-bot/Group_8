package com.group8.backend.controller;

import com.group8.backend.model.Voucher;
import com.group8.backend.service.VoucherService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/vouchers")
@CrossOrigin(origins = "*")
public class VoucherController {

    @Autowired
    private VoucherService voucherService;

    @GetMapping("/validate")
    public ResponseEntity<Map<String,Object>> validate(@RequestParam String code, @RequestParam BigDecimal amount) {
        Voucher v = voucherService.validateVoucherByCode(code, amount);
        Map<String,Object> resp = new HashMap<>();
        resp.put("success", true);
        resp.put("data", v.getVoucherCode());
        resp.put("discount", v.getDiscountValue());
        return ResponseEntity.ok(resp);
    }
}
