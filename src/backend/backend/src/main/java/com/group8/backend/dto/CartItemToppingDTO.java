package com.group8.backend.dto;

import lombok.*;

@Getter @Setter
@NoArgsConstructor @AllArgsConstructor
public class CartItemToppingDTO {
    private String toppingId;
    private String nameOption;
    private Long surcharge;
}
