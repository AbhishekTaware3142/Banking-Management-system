package com.example.banking.user;

import java.util.Optional;

import org.springframework.data.mongodb.repository.MongoRepository;

public interface UserRepository extends MongoRepository<UserDocument, String> {
    Optional<UserDocument> findByUsernameIgnoreCase(String username);
    boolean existsByUsernameIgnoreCase(String username);
}