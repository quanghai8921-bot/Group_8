package com.group8.backend.service.impl;

import com.group8.backend.dto.DriverLocationDTO;
import com.group8.backend.model.*;
import com.group8.backend.repository.*;
import com.group8.backend.service.DriverService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;

@Service
public class DriverServiceImpl implements DriverService {

    @Autowired
    private DriverRepository driverRepository;

    @Autowired
    private OrderRepository orderRepository;

    @Autowired
    private DriverLocationRepository driverLocationRepository;

    @Override
    @Transactional
    public void acceptOrder(String driverId, String orderId) {
        Driver driver = driverRepository.findById(driverId).orElseThrow(() -> new RuntimeException("Driver not found"));
        Order order = orderRepository.findById(orderId).orElseThrow(() -> new RuntimeException("Order not found"));
        if (order.getStatus() != 1) {
            throw new RuntimeException("Order is not in pending state or already accepted");
        }
        order.setDriver(driver);
        order.setStatus((byte)2); // 2 = Accepted
        orderRepository.save(order);
    }

    @Override
    @Transactional
    public void updateOrderStatus(String driverId, String orderId, byte status) {
        Order order = orderRepository.findById(orderId).orElseThrow(() -> new RuntimeException("Order not found"));
        if (order.getDriver() == null || !order.getDriver().getDriverId().equals(driverId)) {
            throw new RuntimeException("Driver is not assigned to this order");
        }
        order.setStatus(status);
        orderRepository.save(order);
    }

    @Override
    @Transactional
    public void updateLocation(DriverLocationDTO dto) {
        Driver driver = driverRepository.findById(dto.getDriverId()).orElseThrow(() -> new RuntimeException("Driver not found"));
        DriverLocation loc = driverLocationRepository.findByDriver_DriverId(driver.getDriverId()).orElseGet(() -> {
            DriverLocation d = new DriverLocation();
            d.setDriver(driver);
            d.setDriverId(driver.getDriverId());
            return d;
        });
        loc.setLatitude(dto.getLatitude());
        loc.setLongitude(dto.getLongitude());
        loc.setUpdatedAt(LocalDateTime.now());
        loc.setActive(true);
        driverLocationRepository.save(loc);
    }
}
