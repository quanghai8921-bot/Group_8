package com.group8.backend.model;

import jakarta.persistence.*;
import lombok.*;
import java.math.BigDecimal;
import java.util.Set;

@Entity
@Table(name = "Option_Topping")
@Getter @Setter
@NoArgsConstructor @AllArgsConstructor
public class OptionTopping {
    @Id
    @Column(name = "Topping_ID", length = 10)
    private String toppingId;

    @ManyToOne
    @JoinColumn(name = "Merchant_ID", nullable = false)
    private Merchant merchant;

    @Column(name = "Name_Option", length = 50)
    private String nameOption;

    @Column(name = "Surcharge")
    private BigDecimal surcharge;

    // Relationships
    @ManyToMany(mappedBy = "optionToppings")
    private Set<FoodItem> foodItems;

    @OneToMany(mappedBy = "optionTopping", cascade = CascadeType.ALL)
    private Set<CartItemTopping> cartItemToppings;

    @OneToMany(mappedBy = "optionTopping", cascade = CascadeType.ALL)
    private Set<OrderDetailTopping> orderDetailToppings;
}
