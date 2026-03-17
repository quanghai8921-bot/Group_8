package com.group8.backend.dto;

import lombok.*;
import java.time.LocalDateTime;

@Getter @Setter
@NoArgsConstructor @AllArgsConstructor
public class OrderResponseDTO {
    private String orderId;
    private String userId;
    private String merchantId;
    private LocalDateTime orderTime;
    private Long foodAmount;
    private Long shippingFee;
    private Long discountAmount;
    private Long finalAmount;
    private Integer orderStatus;
    private String deliveryAddress;
    private String customerName;
    private String customerEmail;
    private String storeName;
    private String orderItemsSummary;
    private String contactPhone;
    private String customerNote;
    private String driverName;
    private String driverPhone;
    private String licensePlate;
    private String vehicleType;
    private String paymentMethod;
}
