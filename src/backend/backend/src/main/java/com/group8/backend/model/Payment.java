package com.group8.backend.model;

import jakarta.persistence.*;
import lombok.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "Payment")
@Getter @Setter
@NoArgsConstructor @AllArgsConstructor
public class Payment {
    @Id
    @Column(name = "Payment_ID", length = 10)
    private String paymentId;

    @OneToOne
    @JoinColumn(name = "Order_ID", unique = true, nullable = false)
    private Order order;

    @Column(name = "Amount", nullable = false)
    private BigDecimal amount;

    @Column(name = "Payment_Method", length = 50)
    private String paymentMethod;

    @Column(name = "Payment_Date")
    private LocalDateTime paymentDate;

    @Column(name = "Status", length = 20)
    private String status;
}
