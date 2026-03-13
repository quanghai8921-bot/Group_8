package com.group8.backend.model;

import jakarta.persistence.*;
import lombok.*;
// import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.Set;

@Entity
@Table(name = "Carts")
@Getter @Setter
@NoArgsConstructor @AllArgsConstructor
public class Cart {
    @Id
    @Column(name = "CartId", length = 10)
    private String cartId;

    @ManyToOne
    @JoinColumn(name = "UserId", nullable = false)
    private User user;

    @ManyToOne
    @JoinColumn(name = "MerchantId", nullable = false)
    private Merchant merchant;

    @Column(name = "CreatedAt")
    private LocalDateTime createdAt;

    @Column(name = "SubtotalPrice")
    private Long subtotalPrice = 0L;

    // Relationships
    @OneToMany(mappedBy = "cart", cascade = CascadeType.ALL)
    private Set<CartItem> cartItems;

    @PrePersist
    public void generateId() {
        if (this.cartId == null) {
            this.cartId = com.group8.backend.config.IDGenerator.generateID();
        }
    }
}
