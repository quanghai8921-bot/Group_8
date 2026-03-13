package com.group8.backend.model;

import jakarta.persistence.*;
import lombok.*;
import java.util.Set;

@Entity
@Table(name = "MenuCategories")
@Getter @Setter
@NoArgsConstructor @AllArgsConstructor
public class MenuCategory {
    @Id
    @Column(name = "CategoryId", length = 10)
    private String categoryId;

    @ManyToOne
    @JoinColumn(name = "MerchantId", nullable = false)
    private Merchant merchant;

    @Column(name = "NameCategory", length = 50, nullable = false)
    private String nameCategory;

    // Relationships
    @OneToMany(mappedBy = "menuCategory", cascade = CascadeType.ALL)
    private Set<FoodItem> foodItems;
}
