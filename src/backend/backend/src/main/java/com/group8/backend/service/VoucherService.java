package com.group8.backend.service;

import java.math.BigDecimal;
import com.group8.backend.model.Voucher;

public interface VoucherService {
    Voucher validateVoucherByCode(String code, BigDecimal orderAmount);
}
