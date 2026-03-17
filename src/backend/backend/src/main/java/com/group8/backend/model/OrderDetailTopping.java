package com.group8.backend.model;

import jakarta.persistence.*;
import lombok.*;
// import java.math.BigDecimal;

@Entity
@Table(name = "OrderItemToppings")
@Getter @Setter
@NoArgsConstructor @AllArgsConstructor
public class OrderDetailTopping {
    @Id
    @Column(name = "OrderToppingId", length = 10)
    private String orderToppingId;

    @ManyToOne
    @JoinColumn(name = "ToppingId", nullable = false)
    private OptionTopping optionTopping;

    @ManyToOne
    @JoinColumn(name = "OrderItemId", nullable = false)
    private OrderDetail orderDetail;

    @Column(name = "Price", nullable = false)
    private Long price;

    @PrePersist
    public void generateId() {
        if (this.orderToppingId == null) {
            this.orderToppingId = com.group8.backend.config.IDGenerator.generateID();
        }
    }
}
