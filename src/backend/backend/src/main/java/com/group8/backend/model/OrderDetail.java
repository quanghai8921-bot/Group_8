package com.group8.backend.model;

import jakarta.persistence.*;
import lombok.*;
import java.math.BigDecimal;
import java.util.Set;

@Entity
@Table(name = "Order_Detail")
@Getter @Setter
@NoArgsConstructor @AllArgsConstructor
public class OrderDetail {
    @Id
    @Column(name = "Order_Detail_ID", length = 10)
    private String orderDetailId;

    @ManyToOne
    @JoinColumn(name = "Order_ID", nullable = false)
    private Order order;

    @ManyToOne
    @JoinColumn(name = "Food_ID", nullable = false)
    private FoodItem foodItem;

    @Column(name = "Food_Name", length = 100, nullable = false)
    private String foodName;

    @Column(name = "Quantity", nullable = false)
    private Integer quantity;

    @Column(name = "Unit_Price", nullable = false)
    private BigDecimal unitPrice;

    // Relationships
    @OneToMany(mappedBy = "orderDetail", cascade = CascadeType.ALL)
    private Set<OrderDetailTopping> orderDetailToppings;
}
