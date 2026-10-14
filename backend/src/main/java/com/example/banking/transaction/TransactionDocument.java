package com.example.banking.transaction;

import java.math.BigDecimal;
import java.time.Instant;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.mapping.Field;
import org.springframework.data.mongodb.core.mapping.FieldType;

@Document(collection = "transactions")
public class TransactionDocument {
    @Id
    private String id;
    private String accountId;
    private String type;
    @Field(targetType = FieldType.DECIMAL128)
    private BigDecimal amount;
    @Field(targetType = FieldType.DECIMAL128)
    private BigDecimal balanceAfter;
    private String description;
    private String loanId;
    private Instant createdAt;

    public TransactionDocument() {
    }

    public TransactionDocument(String accountId, String type, BigDecimal amount, BigDecimal balanceAfter,
            String description, String loanId) {
        this(accountId, type, amount, balanceAfter, description, loanId, Instant.now());
    }

    public TransactionDocument(String accountId, String type, BigDecimal amount, BigDecimal balanceAfter,
            String description, String loanId, Instant createdAt) {
        this.accountId = accountId;
        this.type = type;
        this.amount = amount;
        this.balanceAfter = balanceAfter;
        this.description = description;
        this.loanId = loanId;
        this.createdAt = createdAt != null ? createdAt : Instant.now();
    }

    public String getId() { return id; }
    public String getAccountId() { return accountId; }
    public String getType() { return type; }
    public BigDecimal getAmount() { return amount; }
    public BigDecimal getBalanceAfter() { return balanceAfter; }
    public String getDescription() { return description; }
    public String getLoanId() { return loanId; }
    public Instant getCreatedAt() { return createdAt; }
    public void setCreatedAt(Instant createdAt) { this.createdAt = createdAt; }
}