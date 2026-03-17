package com.group8.backend.service.impl;

import com.group8.backend.model.Merchant;
import com.group8.backend.repository.MerchantRepository;
import com.group8.backend.service.MerchantService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class MerchantServiceImpl implements MerchantService {

    @Autowired
    private MerchantRepository merchantRepository;

    @Override
    public List<Merchant> getAllMerchants() {
        return merchantRepository.findAll();
    }

    @Override
    public Merchant getMerchantById(String merchantId) {
        return merchantRepository.findById(merchantId).orElse(null);
    }

    @Override
    public Merchant getMerchantByUserId(String userId) {
        return merchantRepository.findByUser_UserId(userId).orElse(null);
    }

    @Override
    public Merchant updateMerchantStatus(String merchantId, boolean activeStatus) {
        Merchant merchant = merchantRepository.findById(merchantId).orElse(null);
        if (merchant != null) {
            merchant.setActiveStatus(activeStatus);
            return merchantRepository.save(merchant);
        }
        return null;
    }
}
