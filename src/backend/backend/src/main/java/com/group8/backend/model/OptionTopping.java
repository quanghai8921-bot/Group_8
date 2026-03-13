package com.group8.backend.model;

import jakarta.persistence.*;
import lombok.*;
// import java.math.BigDecimal;
import java.util.Set;

@Entity
@Table(name = "ToppingOptions")
@Getter @Setter
@NoArgsConstructor @AllArgsConstructor
public class OptionTopping {
    @Id
    @Column(name = "ToppingId", length = 10)
    private String toppingId;

    @ManyToOne
    @JoinColumn(name = "MerchantId", nullable = false)
    private Merchant merchant;

    @Column(name = "NameOption", length = 50)
    private String nameOption;

    @Column(name = "Surcharge")
    private Long surcharge;

    // Relationships
    @ManyToMany(mappedBy = "optionToppings")
    private Set<FoodItem> foodItems;

    @OneToMany(mappedBy = "optionTopping", cascade = CascadeType.ALL)
    private Set<CartItemTopping> cartItemToppings;

    @OneToMany(mappedBy = "optionTopping", cascade = CascadeType.ALL)
    private Set<OrderDetailTopping> orderDetailToppings;
}
