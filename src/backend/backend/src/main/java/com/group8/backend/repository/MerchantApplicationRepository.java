package com.group8.backend.repository;

import com.group8.backend.model.MerchantApplication;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface MerchantApplicationRepository extends JpaRepository<MerchantApplication, String> {
    List<MerchantApplication> findByApplicationStatus(String status);
    List<MerchantApplication> findByUser_UserId(String userId);
}
