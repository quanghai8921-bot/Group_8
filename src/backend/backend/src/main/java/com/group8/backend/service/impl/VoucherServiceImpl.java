package com.group8.backend.service.impl;

import com.group8.backend.model.Voucher;
import com.group8.backend.repository.VoucherRepository;
import com.group8.backend.service.VoucherService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Service
public class VoucherServiceImpl implements VoucherService {

    @Autowired
    private VoucherRepository voucherRepository;

    @Override
    public Voucher validateVoucherByCode(String code, BigDecimal orderAmount) {
        Voucher v = voucherRepository.findByVoucherCode(code)
                .orElseThrow(() -> new RuntimeException("Voucher not found"));
        if (v.getEndDate() != null && v.getEndDate().isBefore(LocalDateTime.now())) {
            throw new RuntimeException("Voucher has expired");
        }
        if (v.getMinOrderValue() != null && orderAmount.compareTo(BigDecimal.valueOf(v.getMinOrderValue())) < 0) {
            throw new RuntimeException("Order amount does not meet voucher minimum requirement");
        }
        return v;
    }
}
