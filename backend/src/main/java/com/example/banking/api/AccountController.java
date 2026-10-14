package com.example.banking.api;

import java.util.List;

import com.example.banking.api.BankingRequests.CreateAccount;
import com.example.banking.api.BankingViews.Account;
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
@RequestMapping("/api/accounts")
public class AccountController {

    @Autowired
    private BankingService bankingService;

    @GetMapping
    public ResponseEntity<List<Account>> listAccounts(@AuthenticationPrincipal Jwt jwt) {
        List<Account> accounts = bankingService.listAccounts(jwt.getSubject());
        return ResponseEntity.ok(accounts);
    }

    @GetMapping("/{accountId}")
    public ResponseEntity<Account> getAccount(@AuthenticationPrincipal Jwt jwt, @PathVariable String accountId) {
        Account account = bankingService.getAccount(jwt.getSubject(), accountId);
        return ResponseEntity.ok(account);
    }

    @PostMapping
    public ResponseEntity<Account> createAccount(@AuthenticationPrincipal Jwt jwt, @Valid @RequestBody CreateAccount request) {
        Account created = bankingService.createAccount(jwt.getSubject(), request);
        return ResponseEntity.status(HttpStatus.CREATED).body(created);
    }
}