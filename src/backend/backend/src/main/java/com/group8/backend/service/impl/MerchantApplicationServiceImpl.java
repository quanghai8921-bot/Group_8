package com.group8.backend.service.impl;

import com.group8.backend.model.*;
import com.group8.backend.repository.*;
import com.group8.backend.service.MerchantApplicationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class MerchantApplicationServiceImpl implements MerchantApplicationService {

    @Autowired
    private MerchantApplicationRepository applicationRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private MerchantRepository merchantRepository;

    @Autowired
    private RoleRepository roleRepository;

    @Override
    @Transactional
    public MerchantApplication apply(MerchantApplication application) {
        if (application.getUser() == null || application.getUser().getUserId() == null) {
            throw new RuntimeException("User info is missing in application");
        }
        String userId = application.getUser().getUserId();
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found: " + userId));
        application.setUser(user);

        // Explicitly set ID and Timestamp to ensure they are not NULL during persist
        if (application.getApplicationId() == null) {
            application.setApplicationId(com.group8.backend.config.IDGenerator.generateID());
        }
        if (application.getCreatedAt() == null) {
            application.setCreatedAt(java.time.LocalDateTime.now());
        }

        return applicationRepository.save(application);
    }

    @Override
    @Transactional
    public MerchantApplication approve(String applicationId) {
        MerchantApplication app = applicationRepository.findById(applicationId)
                .orElseThrow(() -> new RuntimeException("Application not found"));

        if (!"Pending".equalsIgnoreCase(app.getApplicationStatus())) {
            throw new RuntimeException("Application is already processed");
        }

        app.setApplicationStatus("Approved");
        applicationRepository.save(app);

        // Update User Role to Merchant (RO00003)
        User user = userRepository.findById(app.getUser().getUserId())
                .orElseThrow(() -> new RuntimeException("User not found"));
        Role merchantRole = roleRepository.findById("RO00003")
                .orElseThrow(() -> new RuntimeException("Merchant Role (RO00003) not found in DB"));

        if (user.getRoles() == null) {
            user.setRoles(new java.util.HashSet<>());
        }
        user.getRoles().add(merchantRole);
        userRepository.save(user);

        // Create Merchant Record only if not exists to prevent "More than one row"
        // error
        if (merchantRepository.findByUser(user).isEmpty()) {
            Merchant merchant = new Merchant();
            merchant.setMerchantId(com.group8.backend.config.IDGenerator.generateID());
            merchant.setUser(user);
            merchant.setStoreName(app.getStoreName());
            merchant.setStoreAddress(app.getStoreAddress());
            merchant.setShopType(app.getShopType());
            // Default times
            merchant.setOpenTime(java.time.LocalTime.of(8, 0));
            merchant.setCloseTime(java.time.LocalTime.of(22, 0));
            merchant.setActiveStatus(true);
            merchantRepository.save(merchant);
        }

        return app;
    }

    @Override
    @Transactional
    public MerchantApplication reject(String applicationId) {
        MerchantApplication app = applicationRepository.findById(applicationId)
                .orElseThrow(() -> new RuntimeException("Application not found"));
        app.setApplicationStatus("Rejected");
        return applicationRepository.save(app);
    }

    @Override
    public List<MerchantApplication> getAllPending() {
        return applicationRepository.findByApplicationStatus("Pending");
    }

    @Override
    public List<MerchantApplication> getByUserId(String userId) {
        return applicationRepository.findByUser_UserId(userId);
    }
}
