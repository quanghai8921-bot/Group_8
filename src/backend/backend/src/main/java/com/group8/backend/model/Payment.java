package com.group8.backend.model;

import jakarta.persistence.*;
import lombok.*;
// import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "Payments")
@Getter @Setter
@NoArgsConstructor @AllArgsConstructor
public class Payment {
    @Id
    @Column(name = "PaymentId", length = 10)
    private String paymentId;

    @OneToOne
    @JoinColumn(name = "OrderID", unique = true, nullable = false)
    private Order order;

    @Column(name = "Amount", nullable = false)
    private Long amount;

    @Column(name = "PaymentMethod", length = 50)
    private String paymentMethod;

    @Column(name = "PaymentDate")
    private LocalDateTime paymentDate;

    @Column(name = "Status", length = 20)
    private String status;

    @PrePersist
    public void generateId() {
        if (this.paymentId == null) {
            this.paymentId = com.group8.backend.config.IDGenerator.generateID();
        }
    }
}
