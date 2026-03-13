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
    @Column(name = "OdToppingId", length = 10)
    private String odToppingId;

    @ManyToOne
    @JoinColumn(name = "OptionToppingId", nullable = false)
    private OptionTopping optionTopping;

    @ManyToOne
    @JoinColumn(name = "OrderDetailId", nullable = false)
    private OrderDetail orderDetail;

    @Column(name = "ToppingName", length = 100, nullable = false)
    private String toppingName;

    @Column(name = "ToppingPrice", nullable = false)
    private Long toppingPrice;

    @PrePersist
    public void generateId() {
        if (this.odToppingId == null) {
            this.odToppingId = com.group8.backend.config.IDGenerator.generateID();
        }
    }
}
