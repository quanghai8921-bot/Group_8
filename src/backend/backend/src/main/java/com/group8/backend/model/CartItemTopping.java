package com.group8.backend.model;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "CartItemToppings")
@Getter @Setter
@NoArgsConstructor @AllArgsConstructor
public class CartItemTopping {
    @Id
    @Column(name = "CartToppingId", length = 10)
    private String cartToppingId;

    @ManyToOne
    @JoinColumn(name = "CartItemId", nullable = false)
    private CartItem cartItem;

    @ManyToOne
    @JoinColumn(name = "ToppingId", nullable = false)
    private OptionTopping optionTopping;

    @PrePersist
    public void generateId() {
        if (this.cartToppingId == null) {
            this.cartToppingId = com.group8.backend.config.IDGenerator.generateID();
        }
    }
}
