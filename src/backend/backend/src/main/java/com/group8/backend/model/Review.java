package com.group8.backend.model;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "Reviews")
@Getter @Setter
@NoArgsConstructor @AllArgsConstructor
public class Review {
    @Id
    @Column(name = "ReviewId", length = 10)
    private String reviewId;

    @ManyToOne
    @JoinColumn(name = "OrderID", nullable = false)
    private Order order;

    @Column(name = "Rating")
    private byte rating;

    @Column(name = "Comment")
    private String comment;

    @Column(name = "ReviewType", length = 50)
    private String reviewType;

    @Column(name = "MediaUrl", length = 255)
    private String mediaUrl;

    @Column(name = "CreatedAt")
    private LocalDateTime createdAt;
}
