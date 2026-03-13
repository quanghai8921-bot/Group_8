package com.group8.backend.dto;

import lombok.*;

@Getter @Setter
@NoArgsConstructor @AllArgsConstructor
public class CheckoutResponseDTO {
    private String orderId;
    private Long totalAmount;
    private Long discountAmount;
    private Long finalAmount;
    private String paymentId;
    private String status;
}