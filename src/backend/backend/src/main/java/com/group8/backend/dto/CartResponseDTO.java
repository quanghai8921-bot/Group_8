package com.group8.backend.dto;

import lombok.*;
import java.util.List;

@Getter @Setter
@NoArgsConstructor @AllArgsConstructor
public class CartResponseDTO {
    private String cartId;
    private String userId;
    private String merchantId;
    private Long subtotalPrice;
    private List<CartItemDTO> items;
}
