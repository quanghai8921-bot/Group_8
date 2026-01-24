package com.group8.backend.model;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "Food_Topping_Mapping")
@Getter @Setter
@NoArgsConstructor @AllArgsConstructor
public class FoodToppingMapping {
    @Id
    @Column(name = "Mapping_ID", length = 10)
    private String mappingId;

    @ManyToOne
    @JoinColumn(name = "Food_ID", nullable = false)
    private FoodItem foodItem;

    @ManyToOne
    @JoinColumn(name = "Topping_ID", nullable = false)
    private OptionTopping optionTopping;
}
