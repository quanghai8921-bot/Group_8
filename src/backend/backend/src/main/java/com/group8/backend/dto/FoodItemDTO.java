package com.group8.backend.dto;

import lombok.*;
import java.math.BigDecimal;

@Getter @Setter
@NoArgsConstructor @AllArgsConstructor
public class FoodItemDTO {
    private String foodId;
    private String foodName;
    private BigDecimal originalPrice;
    private BigDecimal salePrice;
    private String foodImage;
    private String descriptions;
    private String categoryId;
    private String categoryName;
}
