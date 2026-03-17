package com.group8.backend.repository;

import com.group8.backend.model.Voucher;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface VoucherRepository extends JpaRepository<Voucher, String> {
    Optional<Voucher> findByVoucherCode(String code);
    java.util.List<Voucher> findByMerchant_MerchantId(String merchantId);
    java.util.List<Voucher> findByMerchant_MerchantIdAndIsActiveTrue(String merchantId);
}
