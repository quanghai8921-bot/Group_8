package com.group8.backend.model;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "MerchantApplications")
@Getter @Setter
@NoArgsConstructor @AllArgsConstructor
public class MerchantApplication {
    @Id
    @Column(name = "ApplicationId", length = 10)
    private String applicationId;

    @ManyToOne
    @JoinColumn(name = "UserId", nullable = false)
    private User user;

    @Column(name = "StoreName", length = 100, nullable = false)
    private String storeName;

    @Column(name = "StoreAddress", length = 100, nullable = false)
    private String storeAddress;

    @Column(name = "ShopType", length = 50, nullable = false)
    private String shopType;

    @Column(name = "ApplicationStatus", length = 20)
    private String applicationStatus = "Pending";

    @Column(name = "CreatedAt")
    private LocalDateTime createdAt;

    @PrePersist
    public void prePersist() {
        if (this.applicationId == null) {
            this.applicationId = com.group8.backend.config.IDGenerator.generateID();
        }
        if (this.createdAt == null) {
            this.createdAt = LocalDateTime.now();
        }
    }
}
