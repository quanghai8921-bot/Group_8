package com.group8.backend.dto;

import lombok.*;
import java.math.BigDecimal;

@Getter @Setter
@NoArgsConstructor @AllArgsConstructor
public class CartItemToppingDTO {
    private String toppingId;
    private String nameOption;
    private BigDecimal surcharge;
}
