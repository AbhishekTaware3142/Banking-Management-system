package com.example.banking.api;

import java.util.List;

import com.example.banking.api.BankingRequests.LoanApplication;
import com.example.banking.api.BankingRequests.Money;
import com.example.banking.api.BankingViews.Account;
import com.example.banking.api.BankingViews.Loan;
import com.example.banking.api.BankingViews.Transaction;
import com.example.banking.service.BankingService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/accounts/{accountId}")
public class BankingController {

    @Autowired
    private BankingService bankingService;

    @PostMapping("/deposits")
    public ResponseEntity<Account> deposit(
            @AuthenticationPrincipal Jwt jwt,
            @PathVariable String accountId,
            @Valid @RequestBody Money request) {
        Account account = bankingService.deposit(jwt.getSubject(), accountId, request.getAmount());
        return ResponseEntity.ok(account);
    }

    @PostMapping("/withdrawals")
    public ResponseEntity<Account> withdraw(
            @AuthenticationPrincipal Jwt jwt,
            @PathVariable String accountId,
            @Valid @RequestBody Money request) {
        Account account = bankingService.withdraw(jwt.getSubject(), accountId, request.getAmount());
        return ResponseEntity.ok(account);
    }

    @GetMapping("/loans")
    public ResponseEntity<List<Loan>> loans(
            @AuthenticationPrincipal Jwt jwt,
            @PathVariable String accountId) {
        List<Loan> loans = bankingService.listLoans(jwt.getSubject(), accountId);
        return ResponseEntity.ok(loans);
    }

    @PostMapping("/loans")
    public ResponseEntity<Loan> applyForLoan(
            @AuthenticationPrincipal Jwt jwt,
            @PathVariable String accountId,
            @Valid @RequestBody LoanApplication request) {
        Loan loan = bankingService.applyForLoan(jwt.getSubject(), accountId, request);
        return ResponseEntity.status(HttpStatus.CREATED).body(loan);
    }

    @PostMapping("/loans/{loanId}/payments")
    public ResponseEntity<Loan> payEmi(
            @AuthenticationPrincipal Jwt jwt,
            @PathVariable String accountId,
            @PathVariable String loanId) {
        Loan loan = bankingService.payEmi(jwt.getSubject(), accountId, loanId);
        return ResponseEntity.ok(loan);
    }

    @GetMapping("/statement")
    public ResponseEntity<List<Transaction>> statement(
            @AuthenticationPrincipal Jwt jwt,
            @PathVariable String accountId) {
        List<Transaction> transactions = bankingService.statement(jwt.getSubject(), accountId);
        return ResponseEntity.ok(transactions);
    }
}