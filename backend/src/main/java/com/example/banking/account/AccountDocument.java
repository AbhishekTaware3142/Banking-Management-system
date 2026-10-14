package com.example.banking.account;

import java.math.BigDecimal;
import java.time.Instant;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.mapping.Field;
import org.springframework.data.mongodb.core.mapping.FieldType;

@Document(collection = "accounts")
public class AccountDocument {
    @Id
    private String id;
    private String userId;
    private String accountNumber;
    private String holderName;
    private String accountType;
    @Field(targetType = FieldType.DECIMAL128)
    private BigDecimal balance;
    private Instant openedAt;

    public AccountDocument() {
    }

    public AccountDocument(String userId, String accountNumber, String holderName, String accountType) {
        this.userId = userId;
        this.accountNumber = accountNumber;
        this.holderName = holderName;
        this.accountType = accountType;
        this.balance = BigDecimal.ZERO.setScale(2);
        this.openedAt = Instant.now();
    }

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }
    public String getUserId() { return userId; }
    public String getAccountNumber() { return accountNumber; }
    public String getHolderName() { return holderName; }
    public String getAccountType() { return accountType; }
    public BigDecimal getBalance() { return balance; }
    public void setBalance(BigDecimal balance) { this.balance = balance; }
    public Instant getOpenedAt() { return openedAt; }
}