package com.group8.backend.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
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

    @JsonIgnore
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

    @Column(name = "CreatedAt", updatable = false)
    private LocalDateTime createdAt;

    @PrePersist
    public void prePersist() {
        if (this.reviewId == null) {
            this.reviewId = com.group8.backend.config.IDGenerator.generateID();
        }
        if (this.createdAt == null) {
            this.createdAt = LocalDateTime.now();
        }
    }
}
