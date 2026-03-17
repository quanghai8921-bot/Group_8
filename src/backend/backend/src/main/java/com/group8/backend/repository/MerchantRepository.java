package com.group8.backend.repository;

import com.group8.backend.model.Merchant;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface MerchantRepository extends JpaRepository<Merchant, String> {
    Optional<Merchant> findByUser_UserId(String userId);
    Optional<Merchant> findByUser(com.group8.backend.model.User user);
}
