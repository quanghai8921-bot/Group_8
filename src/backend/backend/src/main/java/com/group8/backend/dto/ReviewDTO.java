package com.group8.backend.dto;

import lombok.*;
import jakarta.validation.constraints.*;

@Getter @Setter
@NoArgsConstructor @AllArgsConstructor
public class ReviewDTO {
    @NotBlank
    private String orderId;

    @Min(1) @Max(5)
    private int rating;

    private String comment;
    private String reviewType;
    private String mediaUrl;
}
