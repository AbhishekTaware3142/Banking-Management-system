package com.example.banking.transaction;

import java.util.List;

import org.springframework.data.mongodb.repository.MongoRepository;

public interface TransactionRepository extends MongoRepository<TransactionDocument, String> {
    List<TransactionDocument> findByAccountIdOrderByCreatedAtDesc(String accountId);
}