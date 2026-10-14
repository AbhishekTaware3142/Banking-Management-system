package com.example.banking.service;

import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.Locale;

import com.example.banking.api.BankingRequests;
import com.example.banking.api.BankingRequests.CreateAccount;
import com.example.banking.api.BankingViews.AuthUser;
import com.example.banking.user.UserDocument;
import com.example.banking.user.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.dao.DuplicateKeyException;
import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.oauth2.jose.jws.MacAlgorithm;
import org.springframework.security.oauth2.jwt.JwsHeader;
import org.springframework.security.oauth2.jwt.JwtClaimsSet;
import org.springframework.security.oauth2.jwt.JwtEncoder;
import org.springframework.security.oauth2.jwt.JwtEncoderParameters;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

@Service
public class AuthService {
    private static final long TOKEN_LIFETIME_HOURS = 8;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private JwtEncoder jwtEncoder;

    @Autowired
    private BankingService bankingService;

    @Value("${app.auth.allow-plaintext-demo-passwords:false}")
    private boolean allowPlaintextDemoPasswords;

    public AuthService() {
    }

    public AuthService(UserRepository userRepository, PasswordEncoder passwordEncoder,
                       JwtEncoder jwtEncoder, BankingService bankingService) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtEncoder = jwtEncoder;
        this.bankingService = bankingService;
    }

    @Transactional
    public Session register(BankingRequests.Register request) {
        String username = normalize(request.getUsername());
        if (userRepository.existsByUsername(username)) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "That username is already registered.");
        }

        UserDocument user;
        try {
            user = userRepository.save(new UserDocument(username, request.getFullName().trim(), passwordEncoder.encode(request.getPassword())));
        } catch (DuplicateKeyException exception) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "That username is already registered.");
        }
        bankingService.createAccount(user.getId(), new CreateAccount(user.getFullName(), "SAVINGS"));
        return new Session(view(user), issueToken(user));
    }

    @Transactional
    public AuthUser createEmployee(BankingRequests.Register request) {
        String username = normalize(request.getUsername());
        if (userRepository.existsByUsername(username)) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "An employee with that username already exists.");
        }

        UserDocument employee = new UserDocument(username, request.getFullName().trim(),
                passwordEncoder.encode(request.getPassword()), "EMPLOYEE");
        try {
            employee = userRepository.save(employee);
        } catch (DuplicateKeyException exception) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "An employee with that username already exists.");
        }
        return view(employee);
    }

    public java.util.List<AuthUser> listEmployees() {
        return userRepository.findAll().stream()
                .filter(u -> "EMPLOYEE".equalsIgnoreCase(u.getRole()))
                .map(this::view)
                .toList();
    }

    public Session login(BankingRequests.Login request) {
        String username = normalize(request.getUsername());
        UserDocument user = userRepository.findByUsername(username)
            .filter(candidate -> {
                if (candidate.getPasswordHash() != null) {
                return passwordEncoder.matches(request.getPassword(), candidate.getPasswordHash());
                }
                return allowPlaintextDemoPasswords && candidate.getPassword() != null
                    && candidate.getPassword().equals(request.getPassword());
            })
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Invalid username or password."));
        return new Session(view(user), issueToken(user));
    }

    public String issueToken(UserDocument user) {
        Instant now = Instant.now();
        JwtClaimsSet claims = JwtClaimsSet.builder()
                .issuer("banking-api")
                .subject(user.getId())
                .issuedAt(now)
                .expiresAt(now.plus(TOKEN_LIFETIME_HOURS, ChronoUnit.HOURS))
                .claim("username", user.getUsername())
                .claim("fullName", user.getFullName())
                .claim("role", user.getRole() == null ? "CUSTOMER" : user.getRole())
                .build();
        JwsHeader header = JwsHeader.with(MacAlgorithm.HS256).build();
        return jwtEncoder.encode(JwtEncoderParameters.from(header, claims)).getTokenValue();
    }

    public AuthUser view(UserDocument user) {
        return new AuthUser(user.getId(), user.getUsername(), user.getFullName(), user.getRole() == null ? "CUSTOMER" : user.getRole());
    }

    private static String normalize(String username) {
        return username.trim().toLowerCase(Locale.ROOT);
    }

    public static class Session {
        private AuthUser user;
        private String token;

        public Session() {
        }

        public Session(AuthUser user, String token) {
            this.user = user;
            this.token = token;
        }

        public AuthUser getUser() { return user; }
        public void setUser(AuthUser user) { this.user = user; }

        public String getToken() { return token; }
        public void setToken(String token) { this.token = token; }

        public AuthUser user() { return user; }
        public String token() { return token; }
    }
}