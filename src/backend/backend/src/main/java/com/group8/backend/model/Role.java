package com.group8.backend.model;

import jakarta.persistence.*;
import lombok.*;
import java.util.Set;

@Entity
@Table(name = "Roles")
@Getter @Setter
@NoArgsConstructor @AllArgsConstructor
public class Role {
    @Id
    @Column(name = "Role_ID", length = 10)
    private String roleId;

    @Column(name = "Role_Name", length = 50, nullable = false)
    private String roleName;

    @PrePersist
    public void generateId() {
        if (this.roleId == null) {
            this.roleId = com.group8.backend.config.IDGenerator.generateID();
        }
    }

    // Relationship N-N with User
    @ManyToMany(mappedBy = "roles")
    private Set<User> users;
}
