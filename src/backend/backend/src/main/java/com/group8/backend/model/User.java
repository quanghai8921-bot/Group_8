package com.group8.backend.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.*;
import java.util.Date;
import java.util.Set;

@Entity
@Table(name = "Users")
@Getter @Setter
@NoArgsConstructor @AllArgsConstructor
public class User {
    @Id
    @Column(name = "UserId", length = 10)
    private String userId;

    @Column(name = "FullName", length = 50, nullable = false)
    private String fullName;

    @Column(name = "BirthDate", nullable = false)
    private Date birthDate;

    @Column(name = "PhoneNumber", length = 10, unique = true, nullable = false)
    private String phoneNumber;

    @Column(name = "Email", length = 50, unique = true, nullable = false)
    private String email;

    @Column(name = "AddressDelivery", length = 100, nullable = false)
    private String addressDelivery;

    @Column(name = "Passwords", length = 255, nullable = false)
    private String password;

    @Column(name = "ShopeeCoins")
    private Long shopeeCoins = 0L;

    @Column(name = "IsActive")
    private Boolean isActive = true;

    @PrePersist
    public void generateId() {
        if (this.userId == null) {
            this.userId = com.group8.backend.config.IDGenerator.generateID();
        }
    }

    // Relationships
    @JsonIgnore
    @ManyToMany(fetch = FetchType.LAZY)
    @JoinTable(
        name = "UserRoles",
        joinColumns = @JoinColumn(name = "UserId"),
        inverseJoinColumns = @JoinColumn(name = "RoleId")
    )
    private Set<Role> roles;

    @JsonIgnore
    @OneToOne(mappedBy = "user", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private Merchant merchant;

    @JsonIgnore
    @OneToOne(mappedBy = "user", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private Driver driver;

    @JsonIgnore
    @OneToMany(mappedBy = "user", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private Set<Cart> carts;

    @JsonIgnore
    @OneToMany(mappedBy = "user", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private Set<Order> orders;
}
