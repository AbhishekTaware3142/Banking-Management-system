package com.example.banking.loan;

import java.util.List;

import org.springframework.data.mongodb.repository.MongoRepository;

public interface LoanRepository extends MongoRepository<LoanDocument, String> {
    List<LoanDocument> findByAccountIdOrderByOpenedAtDesc(String accountId);
}