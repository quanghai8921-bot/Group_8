package com.group8.backend.repository;

import com.group8.backend.model.DriverLocation;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface DriverLocationRepository extends JpaRepository<DriverLocation, String> {
    Optional<DriverLocation> findByDriver_DriverId(String driverId);
}
