package com.group8.backend.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;
import java.util.Set;

@Entity
@Table(name = "Orders")
@Getter @Setter
@NoArgsConstructor @AllArgsConstructor
public class Order {
    @Id
    @Column(name = "OrderId", length = 10)
    private String orderId;

    @ManyToOne
    @JoinColumn(name = "UserId", nullable = false)
    private User user;

    @ManyToOne
    @JoinColumn(name = "MerchantId", nullable = false)
    private Merchant merchant;

    @ManyToOne
    @JoinColumn(name = "DriverId") // Khớp với UserId của bảng Drivers
    private Driver driver;

    @ManyToOne
    @JoinColumn(name = "VoucherId")
    private Voucher voucher;

    @Column(name = "OrderTime")
    private LocalDateTime orderTime;

    @Column(name = "PickupTime")
    private LocalDateTime pickupTime;

    @Column(name = "DeliveryTime")
    private LocalDateTime deliveryTime;

    @Column(name = "FoodAmount", nullable = false)
    private Long foodAmount;

    @Column(name = "ShippingFee", nullable = false)
    private Long shippingFee;

    // Trong SQL của bạn là FoodDiscount và ShipDiscount, 
    // nhưng ở đây bạn dùng DiscountAmount cũng được, miễn là map đúng tên cột SQL
    @Column(name = "FoodDiscount") 
    private Long foodDiscount = 0L;

    @Column(name = "ShipDiscount") 
    private Long shipDiscount = 0L;

    @Column(name = "FinalAmount", insertable = false, updatable = false)
    private Long finalAmount;

    // In the user request SQL it's INT NOT NULL DEFAULT 1
    @Column(name = "OrderStatus", nullable = false)
    private Integer orderStatus = 1;

    @Column(name = "DeliveryAddress", length = 255, nullable = false)
    private String deliveryAddress;

    @Column(name = "ContactPhone", length = 20)
    private String contactPhone;

    @Column(name = "CustomerNote", length = 255)
    private String customerNote;

    // Relationships
    @JsonIgnore
    @OneToMany(mappedBy = "order", cascade = CascadeType.ALL)
    private Set<OrderDetail> orderDetails;

    @JsonIgnore
    @OneToOne(mappedBy = "order", cascade = CascadeType.ALL)
    private Payment payment;

    @JsonIgnore
    @OneToMany(mappedBy = "order", cascade = CascadeType.ALL)
    private Set<Review> reviews;

    @PrePersist
    public void generateId() {
        if (this.orderId == null) {
            this.orderId = com.group8.backend.config.IDGenerator.generateID();
        }
        if (this.orderTime == null) {
            this.orderTime = LocalDateTime.now();
        }
    }
}