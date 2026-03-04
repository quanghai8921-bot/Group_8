package com.group8.backend.dto;

import lombok.*;
import jakarta.validation.constraints.*;
import java.util.List;

@Getter @Setter
@NoArgsConstructor @AllArgsConstructor
public class AddCartItemDTO {
    @NotBlank
    private String userId;

    @NotBlank
    private String merchantId;

    @NotBlank
    private String foodId;

    @Min(1)
    private Integer quantity = 1;

    private String note;

    // List of topping IDs (can be empty)
    private List<String> toppingIds;
}
