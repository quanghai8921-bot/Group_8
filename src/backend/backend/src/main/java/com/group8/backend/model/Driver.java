package com.group8.backend.model;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDate;
import java.util.Set;

@Entity
@Table(name = "Driver")
@Getter @Setter
@NoArgsConstructor @AllArgsConstructor
public class Driver {
    @Id
    @Column(name = "Driver_ID", length = 10)
    private String driverId;

    @OneToOne
    @JoinColumn(name = "User_ID", unique = true, nullable = false)
    private User user;

    @Column(name = "Full_Name", length = 50, nullable = false)
    private String fullName;

    @Column(name = "Birth_Date", nullable = false)
    private LocalDate birthDate;

    @Column(name = "Phone_Number", length = 10, unique = true, nullable = false)
    private String phoneNumber;

    @Column(name = "LicensePlate", length = 15, nullable = false)
    private String licensePlate;

    @Column(name = "Vehicle_Type", length = 50)
    private String vehicleType;

    @Column(name = "Is_Verified")
    private boolean isVerified = false;

    // Relationships
    @OneToOne(mappedBy = "driver", cascade = CascadeType.ALL)
    private DriverLocation driverLocation;

    @OneToMany(mappedBy = "driver", cascade = CascadeType.ALL)
    private Set<Order> orders;
}
