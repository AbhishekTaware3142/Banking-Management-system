package com.example.banking.user;

import java.time.Instant;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;

@Document(collection = "users")
public class UserDocument {
    @Id
    private String id;
    @Indexed(name = "ux_users_username", unique = true)
    private String username;
    private String fullName;
    private String role;
    private String passwordHash;
    private String password;
    private Instant createdAt;

    public UserDocument() {
    }

    public UserDocument(String username, String fullName, String passwordHash) {
        this(username, fullName, passwordHash, "CUSTOMER");
    }

    public UserDocument(String username, String fullName, String passwordHash, String role) {
        this.username = username;
        this.fullName = fullName;
        this.role = (role == null || role.isBlank()) ? "CUSTOMER" : role.toUpperCase();
        this.passwordHash = passwordHash;
        this.createdAt = Instant.now();
    }

    public String getId() { return id; }
    public String getUsername() { return username; }
    public String getFullName() { return fullName; }
    public String getRole() { return role; }
    public void setRole(String role) { this.role = role; }
    public String getPasswordHash() { return passwordHash; }
    public String getPassword() { return password; }
    public Instant getCreatedAt() { return createdAt; }
}