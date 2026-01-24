package com.group8.backend.model;

import jakarta.persistence.*;
import lombok.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.Set;

@Entity
@Table(name = "Cart")
@Getter @Setter
@NoArgsConstructor @AllArgsConstructor
public class Cart {
    @Id
    @Column(name = "Cart_ID", length = 10)
    private String cartId;

    @ManyToOne
    @JoinColumn(name = "User_ID", nullable = false)
    private User user;

    @ManyToOne
    @JoinColumn(name = "Merchant_ID", nullable = false)
    private Merchant merchant;

    @Column(name = "Create_At")
    private LocalDateTime createAt;

    @Column(name = "Subtotal_Price")
    private BigDecimal subtotalPrice = BigDecimal.ZERO;

    // Relationships
    @OneToMany(mappedBy = "cart", cascade = CascadeType.ALL)
    private Set<CartItem> cartItems;
}
