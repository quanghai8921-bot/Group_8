package com.group8.backend.service.impl;

import com.group8.backend.model.Voucher;
import com.group8.backend.repository.VoucherRepository;
import com.group8.backend.service.VoucherService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class VoucherServiceImpl implements VoucherService {

    @Autowired
    private VoucherRepository voucherRepository;

    @Override
    public List<Voucher> getAllVouchers() {
        return voucherRepository.findAll();
    }

    @Override
    public List<Voucher> getVouchersByMerchant(String merchantId) {
        return voucherRepository.findByMerchant_MerchantId(merchantId);
    }

    @Override
    public List<Voucher> getActiveVouchersByMerchant(String merchantId) {
        return voucherRepository.findByMerchant_MerchantIdAndIsActiveTrue(merchantId);
    }

    @Override
    public Voucher getVoucherById(String voucherId) {
        return voucherRepository.findById(voucherId).orElseThrow(() -> new RuntimeException("Voucher not found"));
    }

    @Override
    public Voucher createVoucher(Voucher voucher) {
        if (voucher.getMinOrderValue() == null) voucher.setMinOrderValue(0L);
        if (voucher.getMaxUsage() == null) voucher.setMaxUsage(1);
        if (voucher.getIsActive() == null) voucher.setIsActive(true);
        return voucherRepository.save(voucher);
    }

    @Override
    public Voucher updateVoucher(String voucherId, Voucher voucher) {
        Voucher existing = getVoucherById(voucherId);
        
        if (voucher.getVoucherCode() != null) existing.setVoucherCode(voucher.getVoucherCode());
        if (voucher.getVoucherType() != null) existing.setVoucherType(voucher.getVoucherType());
        if (voucher.getDiscountValue() != null) existing.setDiscountValue(voucher.getDiscountValue());
        if (voucher.getMinOrderValue() != null) existing.setMinOrderValue(voucher.getMinOrderValue());
        if (voucher.getMaxUsage() != null) existing.setMaxUsage(voucher.getMaxUsage());
        if (voucher.getStartDate() != null) existing.setStartDate(voucher.getStartDate());
        if (voucher.getEndDate() != null) existing.setEndDate(voucher.getEndDate());
        if (voucher.getIsActive() != null) existing.setIsActive(voucher.getIsActive());
        
        return voucherRepository.save(existing);
    }

    @Override
    public void deleteVoucher(String voucherId) {
        voucherRepository.deleteById(voucherId);
    }
}
