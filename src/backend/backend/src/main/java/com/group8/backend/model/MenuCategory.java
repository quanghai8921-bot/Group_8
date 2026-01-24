package com.group8.backend.model;

import jakarta.persistence.*;
import lombok.*;
import java.util.Set;

@Entity
@Table(name = "Menu_Category")
@Getter @Setter
@NoArgsConstructor @AllArgsConstructor
public class MenuCategory {
    @Id
    @Column(name = "Category_ID", length = 10)
    private String categoryId;

    @ManyToOne
    @JoinColumn(name = "Merchant_ID", nullable = false)
    private Merchant merchant;

    @Column(name = "Name_Category", length = 50, nullable = false)
    private String nameCategory;

    // Relationships
    @OneToMany(mappedBy = "menuCategory", cascade = CascadeType.ALL)
    private Set<FoodItem> foodItems;
}
