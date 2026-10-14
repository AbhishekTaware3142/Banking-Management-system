package com.example.banking.loan;

import java.math.BigDecimal;
import java.time.Instant;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.mapping.Field;
import org.springframework.data.mongodb.core.mapping.FieldType;

@Document(collection = "loans")
public class LoanDocument {
    @Id
    private String id;
    private String accountId;
    @Field(targetType = FieldType.DECIMAL128)
    private BigDecimal principal;
    @Field(targetType = FieldType.DECIMAL128)
    private BigDecimal annualRatePercent;
    private int termMonths;
    @Field(targetType = FieldType.DECIMAL128)
    private BigDecimal emi;
    @Field(targetType = FieldType.DECIMAL128)
    private BigDecimal outstandingPrincipal;
    private int paidInstallments;
    private String status;
    private Instant openedAt;

    public LoanDocument() {
    }

    public LoanDocument(String accountId, BigDecimal principal, BigDecimal annualRatePercent,
            int termMonths, BigDecimal emi) {
        this.accountId = accountId;
        this.principal = principal;
        this.annualRatePercent = annualRatePercent;
        this.termMonths = termMonths;
        this.emi = emi;
        this.outstandingPrincipal = principal;
        this.status = "ACTIVE";
        this.openedAt = Instant.now();
    }

    public String getId() { return id; }
    public String getAccountId() { return accountId; }
    public BigDecimal getPrincipal() { return principal; }
    public BigDecimal getAnnualRatePercent() { return annualRatePercent; }
    public int getTermMonths() { return termMonths; }
    public BigDecimal getEmi() { return emi; }
    public BigDecimal getOutstandingPrincipal() { return outstandingPrincipal; }
    public void setOutstandingPrincipal(BigDecimal outstandingPrincipal) { this.outstandingPrincipal = outstandingPrincipal; }
    public int getPaidInstallments() { return paidInstallments; }
    public void setPaidInstallments(int paidInstallments) { this.paidInstallments = paidInstallments; }
    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }
    public Instant getOpenedAt() { return openedAt; }
}