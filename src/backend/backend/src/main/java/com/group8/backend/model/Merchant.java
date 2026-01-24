package com.group8.backend.model;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;
import java.util.Set;

@Entity
@Table(name = "Merchant")
@Getter @Setter
@NoArgsConstructor @AllArgsConstructor
public class Merchant {
    @Id
    @Column(name = "Merchant_ID", length = 10)
    private String merchantId;

    @OneToOne
    @JoinColumn(name = "User_ID", unique = true, nullable = false)
    private User user;

    @Column(name = "Store_Name", length = 100, nullable = false)
    private String storeName;

    @Column(name = "Store_Address", length = 100, nullable = false)
    private String storeAddress;

    @Column(name = "Open_Time", nullable = false)
    private java.time.LocalTime openTime;

    @Column(name = "Close_Time", nullable = false)
    private java.time.LocalTime closeTime;

    @Column(name = "Active_Status", nullable = false)
    private byte activeStatus;

    @Column(name = "Shop_Type", length = 50, nullable = false)
    private String shopType;

    @Column(name = "Rating")
    private byte rating = 5;

    // Relationships
    @OneToMany(mappedBy = "merchant", cascade = CascadeType.ALL)
    private Set<MenuCategory> menuCategories;

    @OneToMany(mappedBy = "merchant", cascade = CascadeType.ALL)
    private Set<OptionTopping> optionToppings;

    @OneToMany(mappedBy = "merchant", cascade = CascadeType.ALL)
    private Set<Cart> carts;

    @OneToMany(mappedBy = "merchant", cascade = CascadeType.ALL)
    private Set<Order> orders;
}
