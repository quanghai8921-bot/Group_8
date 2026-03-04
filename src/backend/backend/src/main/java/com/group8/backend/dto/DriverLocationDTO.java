package com.group8.backend.dto;

import lombok.*;
import jakarta.validation.constraints.*;
import java.math.BigDecimal;

@Getter @Setter
@NoArgsConstructor @AllArgsConstructor
public class DriverLocationDTO {
    @NotBlank
    private String driverId;

    @NotNull
    private BigDecimal latitude;

    @NotNull
    private BigDecimal longitude;
}
