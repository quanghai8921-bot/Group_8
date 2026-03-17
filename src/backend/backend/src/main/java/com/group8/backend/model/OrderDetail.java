package com.group8.backend.model;

import jakarta.persistence.*;
import lombok.*;
// import java.math.BigDecimal;
import java.util.Set;

@Entity
@Table(name = "OrderItems")
@Getter @Setter
@NoArgsConstructor @AllArgsConstructor
public class OrderDetail {
    @Id
    @Column(name = "OrderItemId", length = 10)
    private String orderItemId;

    @ManyToOne
    @JoinColumn(name = "OrderId", nullable = false)
    private Order order;

    @ManyToOne
    @JoinColumn(name = "FoodId", nullable = false)
    private FoodItem foodItem;

    @Column(name = "Quantity", nullable = false)
    private Integer quantity;

    @Column(name = "UnitPrice", nullable = false)
    private Long unitPrice;

    // Relationships
    @OneToMany(mappedBy = "orderDetail", cascade = CascadeType.ALL)
    private Set<OrderDetailTopping> orderDetailToppings;

    @PrePersist
    public void generateId() {
        if (this.orderItemId == null) {
            this.orderItemId = com.group8.backend.config.IDGenerator.generateID();
        }
    }
}
