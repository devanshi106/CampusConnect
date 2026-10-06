package com.CampusConnect.backend.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "app_users")
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    private String email;

    @Column(nullable = false)
    private String password;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Role role;

    @Column(name = "organization")
    private String organization;

    protected User() {
    }

    public User(String email, String password, Role role) {
        this(email, password, role, null);
    }

    public User(String email, String password, Role role, String organization) {
        this.email = email;
        this.password = password;
        this.role = role;
        this.organization = organization;
    }

    public Long getId() { return id; }
    public String getEmail() { return email; }
    public String getPassword() { return password; }
    public Role getRole() { return role; }
    public String getOrganization() { return organization; }
    public void setOrganization(String organization) { this.organization = organization; }
}
