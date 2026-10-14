package com.example.banking.service;

import static org.junit.jupiter.api.Assertions.assertEquals;

import java.math.BigDecimal;

import org.junit.jupiter.api.Test;

class BankingServiceTest {
    @Test
    void calculatesEmiWithoutInterest() {
        BigDecimal emi = BankingService.calculateEmi(
                new BigDecimal("1000.00"), BigDecimal.ZERO, 3);

        assertEquals(new BigDecimal("333.33"), emi);
    }

    @Test
    void calculatesReducingBalanceEmi() {
        BigDecimal emi = BankingService.calculateEmi(
                new BigDecimal("100000.00"), new BigDecimal("12.00"), 12);

        assertEquals(new BigDecimal("8884.88"), emi);
    }

    @Test
    void finalInstallmentPaysRoundedResidual() {
        BigDecimal payment = BankingService.calculateNextPayment(
                new BigDecimal("10.00"), new BigDecimal("0.01"),
                new BigDecimal("0.50"), 12, 11);

        assertEquals(new BigDecimal("10.10"), payment);
    }
}
