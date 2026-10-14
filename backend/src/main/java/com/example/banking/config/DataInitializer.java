package com.example.banking.config;

import java.math.BigDecimal;
import java.util.Optional;

import com.example.banking.account.AccountDocument;
import com.example.banking.account.AccountRepository;
import com.example.banking.loan.LoanDocument;
import com.example.banking.loan.LoanRepository;
import com.example.banking.transaction.TransactionDocument;
import com.example.banking.transaction.TransactionRepository;
import com.example.banking.user.UserDocument;
import com.example.banking.user.UserRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

/**
 * Startup hook kept intentionally empty so the app does not create built-in
 * credentials or demo accounts. New users must be created through the app flow.
 */
@Component
public class DataInitializer implements CommandLineRunner {

    private static final Logger log = LoggerFactory.getLogger(DataInitializer.class);

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private AccountRepository accountRepository;

    @Autowired
    private TransactionRepository transactionRepository;

    @Autowired
    private LoanRepository loanRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) {
        try {
            seedUsersAndAccounts();
        } catch (Exception e) {
            log.warn("Database initialization skipped or deferred: {}", e.getMessage());
        }
    }

    private void seedUsersAndAccounts() {
        log.info("No built-in demo credentials or sample accounts are seeded.");
    }
}
