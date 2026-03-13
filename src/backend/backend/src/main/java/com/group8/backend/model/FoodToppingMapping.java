package com.group8.backend.model;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "FoodToppings")
@Getter @Setter
@NoArgsConstructor @AllArgsConstructor
public class FoodToppingMapping {
    @Id
    @Column(name = "MappingId", length = 10)
    private String mappingId;

    @ManyToOne
    @JoinColumn(name = "FoodId", nullable = false)
    private FoodItem foodItem;

    @ManyToOne
    @JoinColumn(name = "ToppingId", nullable = false)
    private OptionTopping optionTopping;
}
