package com.group8.backend.dto;

import lombok.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Getter @Setter
@NoArgsConstructor @AllArgsConstructor
public class OrderResponseDTO {
    private String orderId;
    private String userId;
    private String merchantId;
    private LocalDateTime orderTime;
    private BigDecimal foodAmount;
    private BigDecimal shippingFee;
    private BigDecimal discountAmount;
    private BigDecimal finalAmount;
    private byte status;
    private String deliveryAddress;
}
