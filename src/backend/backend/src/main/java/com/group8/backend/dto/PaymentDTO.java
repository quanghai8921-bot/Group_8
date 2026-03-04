package com.group8.backend.dto;

import lombok.*;
import jakarta.validation.constraints.*;
import java.math.BigDecimal;

@Getter @Setter
@NoArgsConstructor @AllArgsConstructor
public class PaymentDTO {
    @NotBlank
    private String orderId;

    @NotNull
    @DecimalMin(value = "0.01")
    private BigDecimal amount;

    @NotBlank
    private String paymentMethod;

    @NotBlank
    private String status;
}
