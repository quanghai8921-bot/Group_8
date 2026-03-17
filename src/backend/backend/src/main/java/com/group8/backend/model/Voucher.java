package com.group8.backend.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.*;
// import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.Set;

@Entity
@Table(name = "Vouchers")
@Getter @Setter
@NoArgsConstructor @AllArgsConstructor
public class Voucher {
    @Id
    @Column(name = "VoucherId", length = 10)
    private String voucherId;

    @Column(name = "VoucherCode", length = 20, unique = true, nullable = false)
    private String voucherCode;

    @Column(name = "VoucherType", length = 50)
    private String voucherType;

    @Column(name = "DiscountValue", nullable = false)
    private Long discountValue;

    @Column(name = "MinOrderValue")
    private Long minOrderValue;

    @Column(name = "MaxUsage")
    private Integer maxUsage;

    @Column(name = "StartDate")
    private LocalDateTime startDate;

    @Column(name = "EndDate")
    private LocalDateTime endDate;

    // Relationships
    @JsonIgnore
    @OneToMany(mappedBy = "voucher")
    private Set<Order> orders;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "MerchantId", nullable = false)
    private Merchant merchant;

    @Column(name = "IsActive", nullable = false)
    private Boolean isActive;

    @PrePersist
    public void generateId() {
        if (this.voucherId == null) {
            this.voucherId = com.group8.backend.config.IDGenerator.generateID();
        }
    }
}
