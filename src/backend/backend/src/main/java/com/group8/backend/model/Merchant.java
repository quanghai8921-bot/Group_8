package com.group8.backend.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.*;
import java.util.Set;

@Entity
@Table(name = "Merchants")
@Getter @Setter
@NoArgsConstructor @AllArgsConstructor
public class Merchant {
    @Id
    @Column(name = "MerchantId", length = 10)
    private String merchantId;

    @OneToOne
    @JoinColumn(name = "UserID", unique = true, nullable = false)
    private User user;

    @Column(name = "StoreName", length = 100, nullable = false)
    private String storeName;

    @Column(name = "StoreAddress", length = 100, nullable = false)
    private String storeAddress;

    @Column(name = "OpenTime", nullable = false)
    private java.time.LocalTime openTime;

    @Column(name = "CloseTime", nullable = false)
    private java.time.LocalTime closeTime;

    @Column(name = "ActiveStatus", nullable = false)
    private Boolean activeStatus = true;

    @Column(name = "ShopType", length = 50, nullable = false)
    private String shopType;

    @PrePersist
    public void generateId() {
        if (this.merchantId == null) {
            this.merchantId = com.group8.backend.config.IDGenerator.generateID();
        }
    }


    @Column(name = "Rating")
    private byte rating = 5;

    // Relationships

    @JsonIgnore
    @OneToMany(mappedBy = "merchant", cascade = CascadeType.ALL)
    private Set<OptionTopping> optionToppings;

    @JsonIgnore
    @OneToMany(mappedBy = "merchant", cascade = CascadeType.ALL)
    private Set<Cart> carts;

    @JsonIgnore
    @OneToMany(mappedBy = "merchant", cascade = CascadeType.ALL)
    private Set<Order> orders;
}
