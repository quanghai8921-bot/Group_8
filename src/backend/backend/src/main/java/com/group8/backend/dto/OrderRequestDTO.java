package com.group8.backend.dto;

import lombok.*;
import jakarta.validation.constraints.*;
import java.math.BigDecimal;

@Getter @Setter
@NoArgsConstructor @AllArgsConstructor
public class OrderRequestDTO {
    @NotBlank(message = "User ID cannot be blank")
    private String userId;

    @NotBlank(message = "Merchant ID cannot be blank")
    private String merchantId;

    private String driverId;
    private Integer voucherId;

    @NotNull(message = "Food amount cannot be null")
    @DecimalMin(value = "0.01", message = "Food amount must be greater than 0")
    private BigDecimal foodAmount;

    @NotNull(message = "Shipping fee cannot be null")
    @DecimalMin(value = "0", message = "Shipping fee cannot be negative")
    private BigDecimal shippingFee;

    @DecimalMin(value = "0", message = "Discount amount cannot be negative")
    private BigDecimal discountAmount;

    @NotBlank(message = "Delivery address cannot be blank")
    @Size(min = 5, max = 255, message = "Delivery address must be between 5 and 255 characters")
    private String deliveryAddress;
}
