package com.group8.backend.dto;

import lombok.*;
import jakarta.validation.constraints.*;

@Getter @Setter
@NoArgsConstructor @AllArgsConstructor
public class CheckoutRequestDTO {
    @NotBlank(message = "User ID is required")
    private String userId;

    @NotBlank(message = "Cart ID is required")
    private String cartId;

    private String voucherId;

    @NotNull(message = "Shopee Coins Used flag is required")
    private Boolean shopeeCoinsUsed;

    @NotBlank(message = "Delivery Address is required")
    private String deliveryAddress;

    @NotBlank(message = "Payment Method is required")
    private String paymentMethod;
}