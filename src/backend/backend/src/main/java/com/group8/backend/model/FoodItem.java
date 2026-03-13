package com.group8.backend.model;

import jakarta.persistence.*;
import lombok.*;
import java.util.Set;

@Entity
@Table(name = "FoodItems")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class FoodItem {
    @Id
    @Column(name = "FoodID", length = 10)
    private String foodId;

    @ManyToOne
    @JoinColumn(name = "CategoryID", nullable = false)
    private MenuCategory menuCategory;

    @ManyToOne
    @JoinColumn(name = "MerchantID", nullable = false)
    private Merchant merchant;

    @Column(name = "FoodName", length = 50, nullable = false)
    private String foodName;

    @Column(name = "OriginalPrice")
    private Long originalPrice;

    @Column(name = "SalePrice")
    private Long salePrice;

    @Column(name = "FoodImage", length = 255)
    private String foodImage;

    @Column(name = "Descriptions", length = 255)
    private String descriptions;

    @Column(name = "FoodStatus", nullable = false)
    private Boolean foodStatus = true;

    // Relationships
    @ManyToMany
    @JoinTable(
        name = "Food_Topping_Mapping",
        joinColumns = @JoinColumn(name = "Food_ID"),
        inverseJoinColumns = @JoinColumn(name = "Topping_ID")
    )
    private Set<OptionTopping> optionToppings;

    @OneToMany(mappedBy = "foodItem", cascade = CascadeType.ALL)
    private Set<CartItem> cartItems;

    @OneToMany(mappedBy = "foodItem", cascade = CascadeType.ALL)
    private Set<OrderDetail> orderDetails;
}
