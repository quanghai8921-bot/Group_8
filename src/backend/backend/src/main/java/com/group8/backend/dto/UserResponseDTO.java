package com.group8.backend.dto;

import lombok.*;

@Getter @Setter
@NoArgsConstructor @AllArgsConstructor
public class UserResponseDTO {
    private String userId;
    private String fullName;
    private String email;
    private String phoneNumber;
    private String addressDelivery;
    private Integer shopeeCoins;
}
