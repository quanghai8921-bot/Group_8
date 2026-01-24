package com.group8.backend.model;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "Review")
@Getter @Setter
@NoArgsConstructor @AllArgsConstructor
public class Review {
    @Id
    @Column(name = "Review_ID", length = 10)
    private String reviewId;

    @ManyToOne
    @JoinColumn(name = "Order_ID", nullable = false)
    private Order order;

    @Column(name = "Rating")
    private byte rating;

    @Column(name = "Comment")
    private String comment;

    @Column(name = "Review_Type", length = 50)
    private String reviewType;

    @Column(name = "Media_URL", length = 255)
    private String mediaUrl;

    @Column(name = "CreatedAt")
    private LocalDateTime createdAt;
}
