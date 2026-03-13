package com.group8.backend.service.impl;

import com.group8.backend.dto.DriverLocationDTO;
import com.group8.backend.model.*;
import com.group8.backend.repository.*;
import com.group8.backend.service.DriverService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.time.LocalDateTime;
import java.math.BigDecimal;

@Service
public class DriverServiceImpl implements DriverService {

    @Autowired
    private DriverRepository driverRepository;

    @Autowired
    private OrderRepository orderRepository;

    @Override
    @Transactional
    public void acceptOrder(String driverId, String orderId) {
        Driver driver = driverRepository.findById(driverId)
            .orElseThrow(() -> new RuntimeException("Driver not found"));
        Order order = orderRepository.findById(orderId)
            .orElseThrow(() -> new RuntimeException("Order not found"));
        
        // Sửa lỗi: Kiểm tra tên trường trong Order.java, thường là status (bit/boolean)
        // Dựa trên SQL: OrderStatus BIT DEFAULT 1
        if (order.getOrderStatus() == false) { 
            throw new RuntimeException("Order is not available");
        }
        
        order.setDriver(driver);
        // Nếu SQL là BIT, Java mapping sẽ là Boolean
        order.setOrderStatus(false); // Đánh dấu đã có người nhận
        orderRepository.save(order);
    }

    @Override
    @Transactional
    public void updateOrderStatus(String driverId, String orderId, byte status) {
        Order order = orderRepository.findById(orderId)
            .orElseThrow(() -> new RuntimeException("Order not found"));
            
        if (order.getDriver() == null || !order.getDriver().getUserId().equals(driverId)) {
            throw new RuntimeException("Driver is not assigned to this order");
        }
        
        // Sửa lỗi: Chuyển byte status sang boolean cho cột BIT
        order.setOrderStatus(status == 1); 
        orderRepository.save(order);
    }

    @Override
    @Transactional
    public void updateLocation(DriverLocationDTO dto) {
        Driver driver = driverRepository.findById(dto.getDriverId())
            .orElseThrow(() -> new RuntimeException("Driver not found"));
        
        // Sửa lỗi ép kiểu BigDecimal
        // Nếu dto.getLatitude() đã là BigDecimal, gán trực tiếp.
        // Nếu là Double, dùng BigDecimal.valueOf(double)
        driver.setLatitude(BigDecimal.valueOf(dto.getLatitude().doubleValue()));
        driver.setLongitude(BigDecimal.valueOf(dto.getLongitude().doubleValue()));
        
        driver.setUpdatedAt(LocalDateTime.now());
        driver.setIsOnline(true);
        
        driverRepository.save(driver);
    }
}