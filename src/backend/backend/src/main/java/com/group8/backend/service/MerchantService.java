package com.group8.backend.service;

import com.group8.backend.model.Merchant;
import java.util.List;

public interface MerchantService {
    List<Merchant> getAllMerchants();
    Merchant getMerchantById(String merchantId);
    Merchant getMerchantByUserId(String userId);
    Merchant updateMerchantStatus(String merchantId, boolean activeStatus);
}
