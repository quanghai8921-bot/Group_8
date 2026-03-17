package com.group8.backend.service;

import com.group8.backend.model.MerchantApplication;
import java.util.List;

public interface MerchantApplicationService {
    MerchantApplication apply(MerchantApplication application);
    MerchantApplication approve(String applicationId);
    MerchantApplication reject(String applicationId);
    List<MerchantApplication> getAllPending();
    List<MerchantApplication> getByUserId(String userId);
}
