package com.group8.backend.repository;

import com.group8.backend.model.OptionTopping;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface OptionToppingRepository extends JpaRepository<OptionTopping, String> {
    List<OptionTopping> findByMerchant_MerchantId(String merchantId);
}
