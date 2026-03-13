package com.group8.backend.model;

import jakarta.persistence.*;
import lombok.*;
import java.util.Set;

@Entity
@Table(name = "CartItems")
@Getter @Setter
@NoArgsConstructor @AllArgsConstructor
public class CartItem {
    @Id
    @Column(name = "CartItemId", length = 10)
    private String cartItemId;

    @ManyToOne
    @JoinColumn(name = "CartId", nullable = false)
    private Cart cart;

    @ManyToOne
    @JoinColumn(name = "FoodId", nullable = false)
    private FoodItem foodItem;

    @Column(name = "Quantity", nullable = false)
    private Integer quantity;

    @Column(name = "Note", length = 255)
    private String note;

    // Relationships
    @OneToMany(mappedBy = "cartItem", cascade = CascadeType.ALL)
    private Set<CartItemTopping> cartItemToppings;

    @PrePersist
    public void generateId() {
        if (this.cartItemId == null) {
            this.cartItemId = com.group8.backend.config.IDGenerator.generateID();
        }
    }
}
