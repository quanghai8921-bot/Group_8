package com.group8.backend.model;

import jakarta.persistence.*;
import lombok.*;
import java.util.Set;

@Entity
@Table(name = "Cart_Item")
@Getter @Setter
@NoArgsConstructor @AllArgsConstructor
public class CartItem {
    @Id
    @Column(name = "Cart_Item_ID", length = 10)
    private String cartItemId;

    @ManyToOne
    @JoinColumn(name = "Cart_ID", nullable = false)
    private Cart cart;

    @ManyToOne
    @JoinColumn(name = "Food_ID", nullable = false)
    private FoodItem foodItem;

    @Column(name = "Quantity", nullable = false)
    private Integer quantity;

    @Column(name = "Note", length = 255)
    private String note;

    // Relationships
    @OneToMany(mappedBy = "cartItem", cascade = CascadeType.ALL)
    private Set<CartItemTopping> cartItemToppings;
}
