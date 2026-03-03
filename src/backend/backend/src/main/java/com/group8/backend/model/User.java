package com.group8.backend.model;

import jakarta.persistence.*;
import lombok.*;
import java.util.Date;
import java.util.Set;

@Entity
@Table(name = "[User]")
@Getter @Setter
@NoArgsConstructor @AllArgsConstructor
public class User {
    @Id
    @Column(name = "User_ID", length = 10)
    private String userId;

    @Column(name = "Full_Name", length = 50, nullable = false)
    private String fullName;

    @Column(name = "Birth_Date", nullable = false)
    private Date birthDate;

    @Column(name = "Phone_Number", length = 10, unique = true, nullable = false)
    private String phoneNumber;

    @Column(name = "Email", length = 50, unique = true, nullable = false)
    private String email;

    @Column(name = "Passwords", length = 30, nullable = false)
    private String password;

    @Column(name = "Address_Delivery", length = 100, nullable = false)
    private String addressDelivery;

    @Column(name = "Shopee_Coins")
    private Integer shopeeCoins = 0;

    // Relationships
    @ManyToMany
    @JoinTable(
        name = "User_Role_Mapping",
        joinColumns = @JoinColumn(name = "User_ID"),
        inverseJoinColumns = @JoinColumn(name = "Role_ID")
    )
    private Set<Role> roles;

    @OneToOne(mappedBy = "user", cascade = CascadeType.ALL)
    private Merchant merchant;

    @OneToOne(mappedBy = "user", cascade = CascadeType.ALL)
    private Driver driver;

    @OneToMany(mappedBy = "user", cascade = CascadeType.ALL)
    private Set<Cart> carts;

    @OneToMany(mappedBy = "user", cascade = CascadeType.ALL)
    private Set<Order> orders;
}
