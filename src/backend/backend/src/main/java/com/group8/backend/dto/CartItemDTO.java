package com.group8.backend.dto;

import lombok.*;
import java.util.List;

@Getter @Setter
@NoArgsConstructor @AllArgsConstructor
public class CartItemDTO {
    private String cartItemId;
    private String foodId;
    private String foodName;
    private Integer quantity;
    private String note;
    private String foodImage;
    private Long unitPrice;
    private Long totalPrice;
    private List<CartItemToppingDTO> toppings;
}
