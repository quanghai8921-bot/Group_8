package com.group8.backend.service;

import com.group8.backend.model.Voucher;
import java.util.List;

public interface VoucherService {
    List<Voucher> getAllVouchers();
    List<Voucher> getVouchersByMerchant(String merchantId);
    List<Voucher> getActiveVouchersByMerchant(String merchantId);
    Voucher getVoucherById(String voucherId);
    Voucher createVoucher(Voucher voucher);
    Voucher updateVoucher(String voucherId, Voucher voucher);
    void deleteVoucher(String voucherId);
}
