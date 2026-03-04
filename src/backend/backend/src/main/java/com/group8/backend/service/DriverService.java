package com.group8.backend.service;

import com.group8.backend.dto.DriverLocationDTO;

public interface DriverService {
    void acceptOrder(String driverId, String orderId);
    void updateOrderStatus(String driverId, String orderId, byte status);
    void updateLocation(DriverLocationDTO dto);
}
