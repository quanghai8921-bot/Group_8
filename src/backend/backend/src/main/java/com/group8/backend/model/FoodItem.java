package com.group8.backend.model;

import jakarta.persistence.*;
import lombok.*;
import java.math.BigDecimal;
import java.util.Set;

@Entity
@Table(name = "Food_Item")
@Getter @Setter
@NoArgsConstructor @AllArgsConstructor
public class FoodItem {
    @Id
    @Column(name = "Food_ID", length = 10)
    private String foodId;

    @ManyToOne
    @JoinColumn(name = "Category_ID", nullable = false)
    private MenuCategory menuCategory;

    @Column(name = "Food_Name", length = 50, nullable = false)
    private String foodName;

    @Column(name = "Original_Price")
    private BigDecimal originalPrice;

    @Column(name = "Sale_Price")
    private BigDecimal salePrice;

    @Column(name = "Food_Image", length = 255)
    private String foodImage;

    @Column(name = "Descriptions", length = 255)
    private String descriptions;

    @Column(name = "Status_Food", length = 20, nullable = false)
    private String statusFood;

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
