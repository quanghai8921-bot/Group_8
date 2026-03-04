package com.group8.backend.model;

import jakarta.persistence.*;
import lombok.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "Driver_Location")
@Getter @Setter
@NoArgsConstructor @AllArgsConstructor
public class DriverLocation {
    @Id
    @Column(name = "Driver_ID", length = 10)
    private String driverId;

    @OneToOne
    @JoinColumn(name = "Driver_ID", nullable = false)
    @MapsId
    private Driver driver;

    @Column(name = "Latitude")
    private BigDecimal latitude;

    @Column(name = "Longitude")
    private BigDecimal longitude;

    @Column(name = "Updated_At")
    private LocalDateTime updatedAt;

    @Column(name = "Is_Active")
    private boolean active = false;
}
