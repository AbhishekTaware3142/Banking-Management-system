package com.example.banking.api;

import java.math.BigDecimal;
import java.time.Instant;

/**
 * Standard Java 17 Response DTOs with standard POJO getters and setters.
 */
public final class BankingViews {

    private BankingViews() {
    }

    public static class Account {
        private String id;
        private String accountNumber;
        private String holderName;
        private String accountType;
        private BigDecimal balance;
        private Instant openedAt;

        public Account() {
        }

        public Account(String id, String accountNumber, String holderName, String accountType, BigDecimal balance, Instant openedAt) {
            this.id = id;
            this.accountNumber = accountNumber;
            this.holderName = holderName;
            this.accountType = accountType;
            this.balance = balance;
            this.openedAt = openedAt;
        }

        public String getId() { return id; }
        public void setId(String id) { this.id = id; }

        public String getAccountNumber() { return accountNumber; }
        public void setAccountNumber(String accountNumber) { this.accountNumber = accountNumber; }

        public String getHolderName() { return holderName; }
        public void setHolderName(String holderName) { this.holderName = holderName; }

        public String getAccountType() { return accountType; }
        public void setAccountType(String accountType) { this.accountType = accountType; }

        public BigDecimal getBalance() { return balance; }
        public void setBalance(BigDecimal balance) { this.balance = balance; }

        public Instant getOpenedAt() { return openedAt; }
        public void setOpenedAt(Instant openedAt) { this.openedAt = openedAt; }

        // Convenience accessors
        public String id() { return id; }
        public String accountNumber() { return accountNumber; }
        public String holderName() { return holderName; }
        public String accountType() { return accountType; }
        public BigDecimal balance() { return balance; }
        public Instant openedAt() { return openedAt; }
    }

    public static class Loan {
        private String id;
        private String accountId;
        private BigDecimal principal;
        private BigDecimal annualRatePercent;
        private int termMonths;
        private BigDecimal emi;
        private BigDecimal outstandingPrincipal;
        private int paidInstallments;
        private String status;
        private Instant openedAt;

        public Loan() {
        }

        public Loan(String id, String accountId, BigDecimal principal, BigDecimal annualRatePercent,
                    int termMonths, BigDecimal emi, BigDecimal outstandingPrincipal,
                    int paidInstallments, String status, Instant openedAt) {
            this.id = id;
            this.accountId = accountId;
            this.principal = principal;
            this.annualRatePercent = annualRatePercent;
            this.termMonths = termMonths;
            this.emi = emi;
            this.outstandingPrincipal = outstandingPrincipal;
            this.paidInstallments = paidInstallments;
            this.status = status;
            this.openedAt = openedAt;
        }

        public String getId() { return id; }
        public void setId(String id) { this.id = id; }

        public String getAccountId() { return accountId; }
        public void setAccountId(String accountId) { this.accountId = accountId; }

        public BigDecimal getPrincipal() { return principal; }
        public void setPrincipal(BigDecimal principal) { this.principal = principal; }

        public BigDecimal getAnnualRatePercent() { return annualRatePercent; }
        public void setAnnualRatePercent(BigDecimal annualRatePercent) { this.annualRatePercent = annualRatePercent; }

        public int getTermMonths() { return termMonths; }
        public void setTermMonths(int termMonths) { this.termMonths = termMonths; }

        public BigDecimal getEmi() { return emi; }
        public void setEmi(BigDecimal emi) { this.emi = emi; }

        public BigDecimal getOutstandingPrincipal() { return outstandingPrincipal; }
        public void setOutstandingPrincipal(BigDecimal outstandingPrincipal) { this.outstandingPrincipal = outstandingPrincipal; }

        public int getPaidInstallments() { return paidInstallments; }
        public void setPaidInstallments(int paidInstallments) { this.paidInstallments = paidInstallments; }

        public String getStatus() { return status; }
        public void setStatus(String status) { this.status = status; }

        public Instant getOpenedAt() { return openedAt; }
        public void setOpenedAt(Instant openedAt) { this.openedAt = openedAt; }

        // Convenience accessors
        public String id() { return id; }
        public String accountId() { return accountId; }
        public BigDecimal principal() { return principal; }
        public BigDecimal annualRatePercent() { return annualRatePercent; }
        public int termMonths() { return termMonths; }
        public BigDecimal emi() { return emi; }
        public BigDecimal outstandingPrincipal() { return outstandingPrincipal; }
        public int paidInstallments() { return paidInstallments; }
        public String status() { return status; }
        public Instant openedAt() { return openedAt; }
    }

    public static class Transaction {
        private String id;
        private String accountId;
        private String type;
        private BigDecimal amount;
        private BigDecimal balanceAfter;
        private String description;
        private String loanId;
        private Instant createdAt;

        public Transaction() {
        }

        public Transaction(String id, String accountId, String type, BigDecimal amount,
                           BigDecimal balanceAfter, String description, String loanId, Instant createdAt) {
            this.id = id;
            this.accountId = accountId;
            this.type = type;
            this.amount = amount;
            this.balanceAfter = balanceAfter;
            this.description = description;
            this.loanId = loanId;
            this.createdAt = createdAt;
        }

        public String getId() { return id; }
        public void setId(String id) { this.id = id; }

        public String getAccountId() { return accountId; }
        public void setAccountId(String accountId) { this.accountId = accountId; }

        public String getType() { return type; }
        public void setType(String type) { this.type = type; }

        public BigDecimal getAmount() { return amount; }
        public void setAmount(BigDecimal amount) { this.amount = amount; }

        public BigDecimal getBalanceAfter() { return balanceAfter; }
        public void setBalanceAfter(BigDecimal balanceAfter) { this.balanceAfter = balanceAfter; }

        public String getDescription() { return description; }
        public void setDescription(String description) { this.description = description; }

        public String getLoanId() { return loanId; }
        public void setLoanId(String loanId) { this.loanId = loanId; }

        public Instant getCreatedAt() { return createdAt; }
        public void setCreatedAt(Instant createdAt) { this.createdAt = createdAt; }

        // Convenience accessors
        public String id() { return id; }
        public String accountId() { return accountId; }
        public String type() { return type; }
        public BigDecimal amount() { return amount; }
        public BigDecimal balanceAfter() { return balanceAfter; }
        public String description() { return description; }
        public String loanId() { return loanId; }
        public Instant createdAt() { return createdAt; }
    }

    public static class ApiError {
        private String message;

        public ApiError() {
        }

        public ApiError(String message) {
            this.message = message;
        }

        public String getMessage() { return message; }
        public void setMessage(String message) { this.message = message; }
        public String message() { return message; }
    }

    public static class AuthUser {
        private String id;
        private String username;
        private String fullName;
        private String role;

        public AuthUser() {
        }

        public AuthUser(String id, String username, String fullName) {
            this(id, username, fullName, "CUSTOMER");
        }

        public AuthUser(String id, String username, String fullName, String role) {
            this.id = id;
            this.username = username;
            this.fullName = fullName;
            this.role = (role == null || role.isBlank()) ? "CUSTOMER" : role;
        }

        public String getId() { return id; }
        public void setId(String id) { this.id = id; }

        public String getUsername() { return username; }
        public void setUsername(String username) { this.username = username; }

        public String getFullName() { return fullName; }
        public void setFullName(String fullName) { this.fullName = fullName; }

        public String getRole() { return role; }
        public void setRole(String role) { this.role = role; }

        // Convenience accessors
        public String id() { return id; }
        public String username() { return username; }
        public String fullName() { return fullName; }
        public String role() { return role; }
    }

    public static class BankStats {
        private BigDecimal totalVaultBalance;
        private BigDecimal totalDeposits;
        private BigDecimal totalWithdrawals;
        private BigDecimal totalLoanPrincipal;
        private BigDecimal totalOutstandingLoans;
        private long totalAccounts;
        private long totalCustomers;
        private long totalTransactions;

        public BankStats() {
        }

        public BankStats(BigDecimal totalVaultBalance, BigDecimal totalDeposits, BigDecimal totalWithdrawals,
                         BigDecimal totalLoanPrincipal, BigDecimal totalOutstandingLoans,
                         long totalAccounts, long totalCustomers, long totalTransactions) {
            this.totalVaultBalance = totalVaultBalance;
            this.totalDeposits = totalDeposits;
            this.totalWithdrawals = totalWithdrawals;
            this.totalLoanPrincipal = totalLoanPrincipal;
            this.totalOutstandingLoans = totalOutstandingLoans;
            this.totalAccounts = totalAccounts;
            this.totalCustomers = totalCustomers;
            this.totalTransactions = totalTransactions;
        }

        public BigDecimal getTotalVaultBalance() { return totalVaultBalance; }
        public void setTotalVaultBalance(BigDecimal totalVaultBalance) { this.totalVaultBalance = totalVaultBalance; }

        public BigDecimal getTotalDeposits() { return totalDeposits; }
        public void setTotalDeposits(BigDecimal totalDeposits) { this.totalDeposits = totalDeposits; }

        public BigDecimal getTotalWithdrawals() { return totalWithdrawals; }
        public void setTotalWithdrawals(BigDecimal totalWithdrawals) { this.totalWithdrawals = totalWithdrawals; }

        public BigDecimal getTotalLoanPrincipal() { return totalLoanPrincipal; }
        public void setTotalLoanPrincipal(BigDecimal totalLoanPrincipal) { this.totalLoanPrincipal = totalLoanPrincipal; }

        public BigDecimal getTotalOutstandingLoans() { return totalOutstandingLoans; }
        public void setTotalOutstandingLoans(BigDecimal totalOutstandingLoans) { this.totalOutstandingLoans = totalOutstandingLoans; }

        public long getTotalAccounts() { return totalAccounts; }
        public void setTotalAccounts(long totalAccounts) { this.totalAccounts = totalAccounts; }

        public long getTotalCustomers() { return totalCustomers; }
        public void setTotalCustomers(long totalCustomers) { this.totalCustomers = totalCustomers; }

        public long getTotalTransactions() { return totalTransactions; }
        public void setTotalTransactions(long totalTransactions) { this.totalTransactions = totalTransactions; }

        // Convenience accessors
        public BigDecimal totalVaultBalance() { return totalVaultBalance; }
        public BigDecimal totalDeposits() { return totalDeposits; }
        public BigDecimal totalWithdrawals() { return totalWithdrawals; }
        public BigDecimal totalLoanPrincipal() { return totalLoanPrincipal; }
        public BigDecimal totalOutstandingLoans() { return totalOutstandingLoans; }
        public long totalAccounts() { return totalAccounts; }
        public long totalCustomers() { return totalCustomers; }
        public long totalTransactions() { return totalTransactions; }
    }

    public static class TellerGraphPoint {
        private String day;
        private BigDecimal deposits;
        private BigDecimal withdrawals;

        public TellerGraphPoint() {
        }

        public TellerGraphPoint(String day, BigDecimal deposits, BigDecimal withdrawals) {
            this.day = day;
            this.deposits = deposits;
            this.withdrawals = withdrawals;
        }

        public String getDay() { return day; }
        public void setDay(String day) { this.day = day; }

        public BigDecimal getDeposits() { return deposits; }
        public void setDeposits(BigDecimal deposits) { this.deposits = deposits; }

        public BigDecimal getWithdrawals() { return withdrawals; }
        public void setWithdrawals(BigDecimal withdrawals) { this.withdrawals = withdrawals; }

        public String day() { return day; }
        public BigDecimal deposits() { return deposits; }
        public BigDecimal withdrawals() { return withdrawals; }
    }
}