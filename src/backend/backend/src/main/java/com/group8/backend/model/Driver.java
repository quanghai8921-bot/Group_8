package com.group8.backend.model;

import jakarta.persistence.*;
import lombok.*;
import java.util.Set;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "Drivers")
@Getter @Setter
@NoArgsConstructor @AllArgsConstructor
public class Driver {
    @Id
    @Column(name = "UserId", length = 10)
    private String userId;

    // Quan hệ 1-1 với bảng Users (Shared Primary Key)
    @OneToOne
    @MapsId
    @JoinColumn(name = "UserId")
    private User user;

    @Column(name = "LicensePlate", length = 15, nullable = false)
    private String licensePlate;

    @Column(name = "VehicleType", length = 50, nullable = false)
    private String vehicleType;

    @Column(name = "IsOnline", nullable = false)
    private Boolean isOnline = true;

    // Tọa độ được lưu trực tiếp tại đây theo Schema của bạn
    @Column(name = "Latitude", precision = 9, scale = 6)
    private BigDecimal latitude;

    @Column(name = "Longitude", precision = 9, scale = 6)
    private BigDecimal longitude;

    @Column(name = "UpdatedAt")
    private LocalDateTime updatedAt;

    // IsActive/IsVerified tùy theo thiết kế logic của bạn
    @Transient
    @Column(name = "IsVerified")
    private Boolean isVerified = false;

    @OneToMany(mappedBy = "driver", cascade = CascadeType.ALL)
    private Set<Order> orders;
}