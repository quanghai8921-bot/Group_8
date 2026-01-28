package com.group8.backend.model;

import jakarta.persistence.*;
import lombok.*;
import java.math.BigDecimal;

@Entity
@Table(name = "Order_Detail_Topping")
@Getter @Setter
@NoArgsConstructor @AllArgsConstructor
public class OrderDetailTopping {
    @Id
    @Column(name = "OD_Topping_ID", length = 10)
    private String odToppingId;

    @ManyToOne
@JoinColumn(name = "option_topping_id")
private OptionTopping optionTopping;

    
    @ManyToOne
    @JoinColumn(name = "Order_Detail_ID", nullable = false)
    private OrderDetail orderDetail;

    @Column(name = "Topping_Name", length = 100, nullable = false)
    private String toppingName;

    @Column(name = "Topping_Price", nullable = false)
    private BigDecimal toppingPrice;
}
