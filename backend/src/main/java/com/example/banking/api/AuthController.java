package com.example.banking.api;

import java.time.Duration;

import com.example.banking.api.BankingRequests.Login;
import com.example.banking.api.BankingRequests.Register;
import com.example.banking.api.BankingViews.AuthUser;
import com.example.banking.config.SecurityConfig;
import com.example.banking.service.AuthService;
import com.example.banking.service.AuthService.Session;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseCookie;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/auth")
public class AuthController {
    private static final Duration TOKEN_LIFETIME = Duration.ofHours(8);

    @Autowired
    private AuthService authService;

    @Value("${app.jwt.cookie-secure:false}")
    private boolean secureCookie;

    @PostMapping("/register")
    public ResponseEntity<AuthUser> register(@Valid @RequestBody Register request) {
        Session session = authService.register(request);
        return ResponseEntity.ok()
                .header(HttpHeaders.SET_COOKIE, tokenCookie(session.getToken(), TOKEN_LIFETIME).toString())
                .body(session.getUser());
    }

    @PostMapping("/login")
    public ResponseEntity<AuthUser> login(@Valid @RequestBody Login request) {
        Session session = authService.login(request);
        return ResponseEntity.ok()
                .header(HttpHeaders.SET_COOKIE, tokenCookie(session.getToken(), TOKEN_LIFETIME).toString())
                .body(session.getUser());
    }

    @PostMapping("/logout")
    public ResponseEntity<Void> logout() {
        return ResponseEntity.noContent()
                .header(HttpHeaders.SET_COOKIE, tokenCookie("", Duration.ZERO).toString())
                .build();
    }

    @GetMapping("/me")
    public ResponseEntity<AuthUser> currentUser(@AuthenticationPrincipal Jwt jwt) {
        String role = jwt.getClaimAsString("role");
        if (role == null || role.isBlank()) {
            role = "CUSTOMER";
        }
        AuthUser user = new AuthUser(jwt.getSubject(), jwt.getClaimAsString("username"), jwt.getClaimAsString("fullName"), role);
        return ResponseEntity.ok(user);
    }

    private ResponseCookie tokenCookie(String token, Duration maxAge) {
        return ResponseCookie.from(SecurityConfig.TOKEN_COOKIE, token)
                .httpOnly(true)
                .secure(secureCookie)
                .sameSite("Strict")
                .path("/api")
                .maxAge(maxAge)
                .build();
    }
}