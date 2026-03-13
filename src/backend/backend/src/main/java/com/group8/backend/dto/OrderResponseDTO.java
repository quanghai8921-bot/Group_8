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
    private Boolean orderStatus;
    private String deliveryAddress;
}
