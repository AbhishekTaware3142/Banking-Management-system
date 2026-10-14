package com.example.banking.api;

import java.util.List;

import com.example.banking.api.BankingRequests.Register;
import com.example.banking.api.BankingViews.AuthUser;
import com.example.banking.service.AuthService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

/**
 * Controller strictly restricted to Bank Administrators (Role: ADMIN).
 * Provides institutional administration features such as provisioning new bank employee / teller accounts.
 */
@RestController
@RequestMapping("/api/admin")
public class AdminController {

    @Autowired
    private AuthService authService;

    @GetMapping("/employees")
    public ResponseEntity<List<AuthUser>> listEmployees() {
        return ResponseEntity.ok(authService.listEmployees());
    }

    @PostMapping("/employees")
    public ResponseEntity<AuthUser> createEmployee(@Valid @RequestBody Register request) {
        AuthUser created = authService.createEmployee(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(created);
    }
}
