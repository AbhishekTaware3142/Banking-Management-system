package com.example.banking.api;

import java.util.List;

import com.example.banking.api.BankingRequests.Money;
import com.example.banking.api.BankingViews.Account;
import com.example.banking.api.BankingViews.BankStats;
import com.example.banking.api.BankingViews.Loan;
import com.example.banking.api.BankingViews.Transaction;
import com.example.banking.service.BankingService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

/**
 * REST Controller for Bank Employees (Tellers) and Bank Executives (Admins).
 * Provides banking-wide visibility, total liquidity & vault metrics,
 * customer account directories, and teller counter deposit/withdrawal operations.
 */
@RestController
@RequestMapping("/api/staff")
public class StaffController {

    @Autowired
    private BankingService bankingService;

    @GetMapping("/overview")
    public ResponseEntity<BankStats> getBankStats() {
        return ResponseEntity.ok(bankingService.getBankStats());
    }

    @GetMapping("/accounts")
    public ResponseEntity<List<Account>> listAllAccounts() {
        return ResponseEntity.ok(bankingService.listAllAccounts());
    }

    @PostMapping("/accounts/{accountId}/deposits")
    public ResponseEntity<Account> tellerDeposit(@PathVariable String accountId,
                                                @Valid @RequestBody Money request,
                                                @AuthenticationPrincipal Jwt jwt) {
        String staffUsername = jwt != null ? jwt.getClaimAsString("username") : "teller";
        return ResponseEntity.ok(bankingService.staffDeposit(accountId, request.getAmount(), staffUsername));
    }

    @PostMapping("/accounts/{accountId}/withdrawals")
    public ResponseEntity<Account> tellerWithdraw(@PathVariable String accountId,
                                                 @Valid @RequestBody Money request,
                                                 @AuthenticationPrincipal Jwt jwt) {
        String staffUsername = jwt != null ? jwt.getClaimAsString("username") : "teller";
        return ResponseEntity.ok(bankingService.staffWithdraw(accountId, request.getAmount(), staffUsername));
    }

    @GetMapping("/transactions")
    public ResponseEntity<List<Transaction>> listAllTransactions() {
        return ResponseEntity.ok(bankingService.listAllTransactions());
    }

    @GetMapping("/loans")
    public ResponseEntity<List<Loan>> listAllLoans() {
        return ResponseEntity.ok(bankingService.listAllLoans());
    }

    @GetMapping("/graph")
    public ResponseEntity<List<BankingViews.TellerGraphPoint>> getTellerGraph() {
        return ResponseEntity.ok(bankingService.getTellerGraphData());
    }
}
