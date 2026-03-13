package com.group8.backend.dto;

import lombok.*;
import jakarta.validation.constraints.*;
// import java.math.BigDecimal;

@Getter @Setter
@NoArgsConstructor @AllArgsConstructor
public class OrderRequestDTO {
    @NotBlank(message = "User ID cannot be blank")
    private String userId;

    @NotBlank(message = "Merchant ID cannot be blank")
    private String merchantId;

    private String driverId;
    private String voucherId;

    @NotNull(message = "Food amount cannot be null")
    @Min(value = 1, message = "Food amount must be greater than 0")
    private Long foodAmount;

    @NotNull(message = "Shipping fee cannot be null")
    @Min(value = 0, message = "Shipping fee cannot be negative")
    private Long shippingFee;

    @Min(value = 0, message = "Discount amount cannot be negative")
    private Long discountAmount;

    @NotBlank(message = "Delivery address cannot be blank")
    @Size(min = 5, max = 255, message = "Delivery address must be between 5 and 255 characters")
    private String deliveryAddress;
}
