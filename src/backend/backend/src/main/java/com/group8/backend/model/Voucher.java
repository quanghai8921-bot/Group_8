package com.group8.backend.model;

import jakarta.persistence.*;
import lombok.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.Set;

@Entity
@Table(name = "Voucher")
@Getter @Setter
@NoArgsConstructor @AllArgsConstructor
public class Voucher {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "Voucher_ID")
    private Integer voucherId;

    @Column(name = "Voucher_Code", length = 20, unique = true, nullable = false)
    private String voucherCode;

    @Column(name = "Voucher_Type", length = 50)
    private String voucherType;

    @Column(name = "Discount_Value", nullable = false)
    private BigDecimal discountValue;

    @Column(name = "Min_Order_Value")
    private BigDecimal minOrderValue = BigDecimal.ZERO;

    @Column(name = "Max_Usage")
    private Integer maxUsage = 1;

    @Column(name = "Start_Date")
    private LocalDateTime startDate;

    @Column(name = "End_Date")
    private LocalDateTime endDate;

    // Relationships
    @OneToMany(mappedBy = "voucher")
    private Set<Order> orders;
}
