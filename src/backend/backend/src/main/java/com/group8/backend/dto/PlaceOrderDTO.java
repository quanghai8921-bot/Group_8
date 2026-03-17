package com.group8.backend.dto;

import lombok.*;
import jakarta.validation.constraints.*;
import java.math.BigDecimal;

@Getter @Setter
@NoArgsConstructor @AllArgsConstructor
public class PlaceOrderDTO {
    @NotBlank
    private String userId;

    @NotBlank
    private String merchantId;

    private String driverId;

    private String voucherCode;

    @NotNull
    @DecimalMin(value = "0", message = "Shipping fee cannot be negative")
    private BigDecimal shippingFee;

    @NotBlank
    private String deliveryAddress;

    private String contactPhone;
    private String customerNote;
    private Boolean shopeeXuUsed;
    private String paymentMethod;
}
