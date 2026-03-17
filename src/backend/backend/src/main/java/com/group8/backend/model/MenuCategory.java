package com.group8.backend.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.*;
import java.util.Set;

@Entity
@Table(name = "Categories")
@Getter @Setter
@NoArgsConstructor @AllArgsConstructor
public class MenuCategory {
    @Id
    @Column(name = "CategoryId", length = 10)
    private String categoryId;

    @Column(name = "CategoryName", length = 50, nullable = false)
    private String categoryName;

    // Relationships
    @JsonIgnore
    @OneToMany(mappedBy = "menuCategory", cascade = CascadeType.ALL)
    private Set<FoodItem> foodItems;
}
