package com.group8.backend.model;

import jakarta.persistence.*;
import lombok.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.Set;

@Entity
@Table(name = "[order]")
@Getter @Setter
@NoArgsConstructor @AllArgsConstructor
public class Order {
    @Id
    @Column(name = "Order_ID", length = 10)
    private String orderId;

    @ManyToOne
    @JoinColumn(name = "User_ID", nullable = false)
    private User user;

    @ManyToOne
    @JoinColumn(name = "Merchant_ID", nullable = false)
    private Merchant merchant;

    @ManyToOne
    @JoinColumn(name = "Driver_ID")
    private Driver driver;

    @ManyToOne
    @JoinColumn(name = "Voucher_ID")
    private Voucher voucher;

    @Column(name = "Order_Time")
    private LocalDateTime orderTime;

    @Column(name = "Pickup_Time")
    private LocalDateTime pickupTime;

    @Column(name = "Delivery_Time")
    private LocalDateTime deliveryTime;

    @Column(name = "Food_Amount", nullable = false)
    private BigDecimal foodAmount;

    @Column(name = "Shipping_Fee", nullable = false)
    private BigDecimal shippingFee;

    @Column(name = "Discount_Amount")
    private BigDecimal discountAmount = BigDecimal.ZERO;

    @Column(name = "Status")
    private byte status = 1;

    @Column(name = "Delivery_Address", length = 255, nullable = false)
    private String deliveryAddress;

    // Relationships
    @OneToMany(mappedBy = "order", cascade = CascadeType.ALL)
    private Set<OrderDetail> orderDetails;

    @OneToOne(mappedBy = "order", cascade = CascadeType.ALL)
    private Payment payment;

    @OneToMany(mappedBy = "order", cascade = CascadeType.ALL)
    private Set<Review> reviews;
}
