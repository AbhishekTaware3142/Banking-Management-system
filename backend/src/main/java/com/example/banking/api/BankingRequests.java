package com.example.banking.api;

import java.math.BigDecimal;

import jakarta.validation.constraints.DecimalMax;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.Digits;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Positive;
import jakarta.validation.constraints.Size;

/**
 * Standard Java 17 Request DTOs with POJO getters/setters and validation annotations.
 */
public final class BankingRequests {

    private BankingRequests() {
    }

    public static class CreateAccount {
        @NotBlank(message = "Holder name is required")
        private String holderName;

        @NotBlank(message = "Account type is required")
        private String accountType;

        public CreateAccount() {
        }

        public CreateAccount(String holderName, String accountType) {
            this.holderName = holderName;
            this.accountType = accountType;
        }

        public String getHolderName() {
            return holderName;
        }

        public void setHolderName(String holderName) {
            this.holderName = holderName;
        }

        public String getAccountType() {
            return accountType;
        }

        public void setAccountType(String accountType) {
            this.accountType = accountType;
        }

        // Convenience accessors
        public String holderName() {
            return holderName;
        }

        public String accountType() {
            return accountType;
        }
    }

    public static class Money {
        @NotNull(message = "Amount is required")
        @Positive(message = "Amount must be positive")
        @Digits(integer = 14, fraction = 2, message = "Amount can have up to 2 decimal places")
        private BigDecimal amount;

        public Money() {
        }

        public Money(BigDecimal amount) {
            this.amount = amount;
        }

        public BigDecimal getAmount() {
            return amount;
        }

        public void setAmount(BigDecimal amount) {
            this.amount = amount;
        }

        // Convenience accessor
        public BigDecimal amount() {
            return amount;
        }
    }

    public static class LoanApplication {
        @NotNull(message = "Principal is required")
        @Positive(message = "Principal must be positive")
        @Digits(integer = 14, fraction = 2, message = "Principal can have up to 2 decimal places")
        private BigDecimal principal;

        @NotNull(message = "Annual rate is required")
        @DecimalMin(value = "0.0", message = "Rate must be non-negative")
        @DecimalMax(value = "100.0", message = "Rate must not exceed 100%")
        @Digits(integer = 3, fraction = 4)
        private BigDecimal annualRatePercent;

        @Min(value = 1, message = "Term must be at least 1 month")
        @Max(value = 480, message = "Term cannot exceed 480 months")
        private int termMonths;

        public LoanApplication() {
        }

        public LoanApplication(BigDecimal principal, BigDecimal annualRatePercent, int termMonths) {
            this.principal = principal;
            this.annualRatePercent = annualRatePercent;
            this.termMonths = termMonths;
        }

        public BigDecimal getPrincipal() {
            return principal;
        }

        public void setPrincipal(BigDecimal principal) {
            this.principal = principal;
        }

        public BigDecimal getAnnualRatePercent() {
            return annualRatePercent;
        }

        public void setAnnualRatePercent(BigDecimal annualRatePercent) {
            this.annualRatePercent = annualRatePercent;
        }

        public int getTermMonths() {
            return termMonths;
        }

        public void setTermMonths(int termMonths) {
            this.termMonths = termMonths;
        }

        // Convenience accessors
        public BigDecimal principal() {
            return principal;
        }

        public BigDecimal annualRatePercent() {
            return annualRatePercent;
        }

        public int termMonths() {
            return termMonths;
        }
    }

    public static class Register {
        @NotBlank(message = "Username is required")
        @Size(min = 3, max = 40, message = "Username must be between 3 and 40 characters")
        @Pattern(regexp = "[A-Za-z0-9._-]+", message = "Username can only contain alphanumeric characters, dots, underscores, or dashes")
        private String username;

        @NotBlank(message = "Password is required")
        @Size(min = 8, max = 72, message = "Password must be between 8 and 72 characters")
        private String password;

        @NotBlank(message = "Full name is required")
        @Size(max = 100, message = "Full name cannot exceed 100 characters")
        private String fullName;

        public Register() {
        }

        public Register(String username, String password, String fullName) {
            this.username = username;
            this.password = password;
            this.fullName = fullName;
        }

        public String getUsername() {
            return username;
        }

        public void setUsername(String username) {
            this.username = username;
        }

        public String getPassword() {
            return password;
        }

        public void setPassword(String password) {
            this.password = password;
        }

        public String getFullName() {
            return fullName;
        }

        public void setFullName(String fullName) {
            this.fullName = fullName;
        }

        // Convenience accessors
        public String username() {
            return username;
        }

        public String password() {
            return password;
        }

        public String fullName() {
            return fullName;
        }
    }

    public static class Login {
        @NotBlank(message = "Username is required")
        @Size(min = 3, max = 40)
        private String username;

        @NotBlank(message = "Password is required")
        @Size(max = 72)
        private String password;

        public Login() {
        }

        public Login(String username, String password) {
            this.username = username;
            this.password = password;
        }

        public String getUsername() {
            return username;
        }

        public void setUsername(String username) {
            this.username = username;
        }

        public String getPassword() {
            return password;
        }

        public void setPassword(String password) {
            this.password = password;
        }

        // Convenience accessors
        public String username() {
            return username;
        }

        public String password() {
            return password;
        }
    }
}