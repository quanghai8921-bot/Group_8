package com.group8.backend.model;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "Cart_Item_Topping")
@Getter @Setter
@NoArgsConstructor @AllArgsConstructor
public class CartItemTopping {
    @Id
    @Column(name = "Cart_Topping_ID", length = 10)
    private String cartToppingId;

    @ManyToOne
    @JoinColumn(name = "Cart_Item_ID", nullable = false)
    private CartItem cartItem;

    @ManyToOne
    @JoinColumn(name = "Topping_ID", nullable = false)
    private OptionTopping optionTopping;
}
