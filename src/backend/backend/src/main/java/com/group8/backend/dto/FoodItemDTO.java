package com.group8.backend.dto;

import lombok.*;

@Getter @Setter
@NoArgsConstructor @AllArgsConstructor
public class FoodItemDTO {
    private String foodId;
    private String foodName;
    private Long originalPrice;
    private Long salePrice;
    private String foodImage;
    private String descriptions;
    private Integer foodStatus;
    private String merchantId;
    private String categoryId;
    private String categoryName;
}
