package com.example.banking.service;

import java.math.BigDecimal;
import java.math.MathContext;
import java.math.RoundingMode;
import java.security.SecureRandom;
import java.util.List;
import java.util.Locale;

import com.example.banking.account.AccountDocument;
import com.example.banking.account.AccountRepository;
import com.example.banking.api.BankingRequests;
import com.example.banking.api.BankingViews;
import com.example.banking.loan.LoanDocument;
import com.example.banking.loan.LoanRepository;
import com.example.banking.transaction.TransactionDocument;
import com.example.banking.transaction.TransactionRepository;
import com.example.banking.user.UserRepository;
import org.springframework.data.domain.Sort;
import org.springframework.data.mongodb.core.FindAndModifyOptions;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.data.mongodb.core.query.Update;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

@Service
public class BankingService {
    private static final MathContext CALCULATION_CONTEXT = MathContext.DECIMAL128;
    private static final SecureRandom RANDOM = new SecureRandom();

    @Autowired
    private AccountRepository accounts;

    @Autowired
    private LoanRepository loans;

    @Autowired
    private TransactionRepository transactions;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private MongoTemplate mongoTemplate;

    public BankingService() {
    }

    public BankingService(AccountRepository accounts, LoanRepository loans,
            TransactionRepository transactions, MongoTemplate mongoTemplate) {
        this.accounts = accounts;
        this.loans = loans;
        this.transactions = transactions;
        this.mongoTemplate = mongoTemplate;
    }

    public List<BankingViews.Account> listAccounts(String userId) {
        return accounts.findByUserIdOrderByOpenedAtDesc(userId).stream().map(BankingService::view).toList();
    }

    public BankingViews.Account getAccount(String userId, String accountId) {
        return view(requireAccount(userId, accountId));
    }

    public BankingViews.Account createAccount(String userId, BankingRequests.CreateAccount request) {
        String type = request.accountType().trim().toUpperCase(Locale.ROOT);
        if (!type.equals("SAVINGS") && !type.equals("CURRENT")) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Account type must be SAVINGS or CURRENT.");
        }
        String accountNumber = "BA" + String.format("%010d", RANDOM.nextInt(1_000_000_000));
        return view(accounts.save(new AccountDocument(userId, accountNumber, request.holderName().trim(), type)));
    }

    @Transactional
    public BankingViews.Account deposit(String userId, String accountId, BigDecimal rawAmount) {
        requireAccount(userId, accountId);
        BigDecimal amount = money(rawAmount);
        AccountDocument account = changeBalance(userId, accountId, amount, false);
        transactions.save(new TransactionDocument(accountId, "DEPOSIT", amount, account.getBalance(), "Cash deposit", null));
        return view(account);
    }

    @Transactional
    public BankingViews.Account withdraw(String userId, String accountId, BigDecimal rawAmount) {
        requireAccount(userId, accountId);
        BigDecimal amount = money(rawAmount);
        AccountDocument account = changeBalance(userId, accountId, amount.negate(), true);
        transactions.save(new TransactionDocument(accountId, "WITHDRAWAL", amount.negate(), account.getBalance(), "Cash withdrawal", null));
        return view(account);
    }

    @Transactional
    public BankingViews.Loan applyForLoan(String userId, String accountId, BankingRequests.LoanApplication request) {
        requireAccount(userId, accountId);
        BigDecimal principal = money(request.principal());
        BigDecimal emi = calculateEmi(principal, request.annualRatePercent(), request.termMonths());
        LoanDocument loan = loans.save(new LoanDocument(accountId, principal,
                request.annualRatePercent(), request.termMonths(), emi));
        AccountDocument account = changeBalance(userId, accountId, principal, false);
        transactions.save(new TransactionDocument(accountId, "LOAN_DISBURSEMENT", principal,
                account.getBalance(), "Loan disbursement", loan.getId()));
        return view(loan);
    }

    @Transactional
    public BankingViews.Loan payEmi(String userId, String accountId, String loanId) {
        requireAccount(userId, accountId);
        LoanDocument loan = loans.findById(loanId)
                .filter(item -> item.getAccountId().equals(accountId))
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Loan not found."));
        if (!loan.getStatus().equals("ACTIVE")) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "This loan is already paid off.");
        }

        BigDecimal monthlyRate = loan.getAnnualRatePercent()
                .divide(BigDecimal.valueOf(1200), 12, RoundingMode.HALF_UP);
        BigDecimal interest = loan.getOutstandingPrincipal().multiply(monthlyRate)
                .setScale(2, RoundingMode.HALF_UP);
        BigDecimal payment = calculateNextPayment(loan.getOutstandingPrincipal(), monthlyRate,
            loan.getEmi(), loan.getTermMonths(), loan.getPaidInstallments());
        BigDecimal principalPaid = payment.subtract(interest).max(BigDecimal.ZERO);
        BigDecimal remaining = loan.getOutstandingPrincipal().subtract(principalPaid)
                .max(BigDecimal.ZERO).setScale(2, RoundingMode.HALF_UP);

        AccountDocument account = changeBalance(userId, accountId, payment.negate(), true);
        loan.setOutstandingPrincipal(remaining);
        loan.setPaidInstallments(loan.getPaidInstallments() + 1);
        if (remaining.signum() == 0) {
            loan.setStatus("PAID");
        }
        loans.save(loan);
        transactions.save(new TransactionDocument(accountId, "EMI_PAYMENT", payment.negate(),
                account.getBalance(), "Loan EMI payment", loanId));
        return view(loan);
    }

    public List<BankingViews.Loan> listLoans(String userId, String accountId) {
        requireAccount(userId, accountId);
        return loans.findByAccountIdOrderByOpenedAtDesc(accountId).stream()
                .map(BankingService::view).toList();
    }

    public List<BankingViews.Transaction> statement(String userId, String accountId) {
        requireAccount(userId, accountId);
        return transactions.findByAccountIdOrderByCreatedAtDesc(accountId).stream()
                .map(BankingService::view).toList();
    }

    // --- Bank Administration & Teller Staff Features ---

    public List<BankingViews.Account> listAllAccounts() {
        return accounts.findAll(Sort.by(Sort.Direction.DESC, "openedAt"))
                .stream().map(BankingService::view).toList();
    }

    public BankingViews.BankStats getBankStats() {
        List<AccountDocument> allAccounts = accounts.findAll();
        BigDecimal totalVaultBalance = allAccounts.stream()
                .map(AccountDocument::getBalance)
                .reduce(BigDecimal.ZERO, BigDecimal::add)
                .setScale(2, RoundingMode.HALF_UP);

        List<TransactionDocument> allTransactions = transactions.findAll();
        BigDecimal totalDeposits = allTransactions.stream()
                .filter(t -> t.getAmount() != null && t.getAmount().compareTo(BigDecimal.ZERO) > 0)
                .map(TransactionDocument::getAmount)
                .reduce(BigDecimal.ZERO, BigDecimal::add)
                .setScale(2, RoundingMode.HALF_UP);

        BigDecimal totalWithdrawals = allTransactions.stream()
                .filter(t -> t.getAmount() != null && t.getAmount().compareTo(BigDecimal.ZERO) < 0)
                .map(t -> t.getAmount().abs())
                .reduce(BigDecimal.ZERO, BigDecimal::add)
                .setScale(2, RoundingMode.HALF_UP);

        List<LoanDocument> allLoans = loans.findAll();
        BigDecimal totalLoanPrincipal = allLoans.stream()
                .map(LoanDocument::getPrincipal)
                .reduce(BigDecimal.ZERO, BigDecimal::add)
                .setScale(2, RoundingMode.HALF_UP);

        BigDecimal totalOutstandingLoans = allLoans.stream()
                .map(LoanDocument::getOutstandingPrincipal)
                .reduce(BigDecimal.ZERO, BigDecimal::add)
                .setScale(2, RoundingMode.HALF_UP);

        long totalAccountsCount = allAccounts.size();
        long totalCustomersCount = userRepository != null ? userRepository.count() : 0;
        long totalTransactionsCount = allTransactions.size();

        return new BankingViews.BankStats(
                totalVaultBalance,
                totalDeposits,
                totalWithdrawals,
                totalLoanPrincipal,
                totalOutstandingLoans,
                totalAccountsCount,
                totalCustomersCount,
                totalTransactionsCount
        );
    }

    public List<BankingViews.TellerGraphPoint> getTellerGraphData() {
        String[] days = {"Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"};
        java.util.Map<String, BigDecimal> depositsMap = new java.util.LinkedHashMap<>();
        java.util.Map<String, BigDecimal> withdrawalsMap = new java.util.LinkedHashMap<>();
        for (String d : days) {
            depositsMap.put(d, BigDecimal.ZERO);
            withdrawalsMap.put(d, BigDecimal.ZERO);
        }

        List<TransactionDocument> allTransactions = transactions.findAll();
        java.time.format.DateTimeFormatter dayFormatter = java.time.format.DateTimeFormatter.ofPattern("EEE", Locale.ENGLISH)
                .withZone(java.time.ZoneOffset.UTC);

        for (TransactionDocument tx : allTransactions) {
            if (tx.getCreatedAt() == null || tx.getAmount() == null) continue;
            String dayOfWeek = dayFormatter.format(tx.getCreatedAt());
            if (!depositsMap.containsKey(dayOfWeek)) continue;

            BigDecimal amount = tx.getAmount();
            if (amount.compareTo(BigDecimal.ZERO) > 0) {
                depositsMap.put(dayOfWeek, depositsMap.get(dayOfWeek).add(amount.abs()));
            } else if (amount.compareTo(BigDecimal.ZERO) < 0) {
                withdrawalsMap.put(dayOfWeek, withdrawalsMap.get(dayOfWeek).add(amount.abs()));
            }
        }

        List<BankingViews.TellerGraphPoint> points = new java.util.ArrayList<>();
        for (String d : days) {
            points.add(new BankingViews.TellerGraphPoint(
                    d,
                    depositsMap.get(d).setScale(2, RoundingMode.HALF_UP),
                    withdrawalsMap.get(d).setScale(2, RoundingMode.HALF_UP)
            ));
        }
        return points;
    }

    @Transactional
    public BankingViews.Account staffDeposit(String accountId, BigDecimal rawAmount, String staffUsername) {
        BigDecimal amount = money(rawAmount);
        AccountDocument account = staffChangeBalance(accountId, amount, false);
        String desc = staffUsername != null ? "Teller Deposit (Staff: " + staffUsername + ")" : "Teller Deposit";
        transactions.save(new TransactionDocument(accountId, "TELLER_DEPOSIT", amount, account.getBalance(), desc, null));
        return view(account);
    }

    @Transactional
    public BankingViews.Account staffWithdraw(String accountId, BigDecimal rawAmount, String staffUsername) {
        BigDecimal amount = money(rawAmount);
        AccountDocument account = staffChangeBalance(accountId, amount.negate(), true);
        String desc = staffUsername != null ? "Teller Withdrawal (Staff: " + staffUsername + ")" : "Teller Withdrawal";
        transactions.save(new TransactionDocument(accountId, "TELLER_WITHDRAWAL", amount.negate(), account.getBalance(), desc, null));
        return view(account);
    }

    public List<BankingViews.Transaction> listAllTransactions() {
        return transactions.findAll(Sort.by(Sort.Direction.DESC, "createdAt"))
                .stream().map(BankingService::view).toList();
    }

    public List<BankingViews.Loan> listAllLoans() {
        return loans.findAll(Sort.by(Sort.Direction.DESC, "openedAt"))
                .stream().map(BankingService::view).toList();
    }

    private AccountDocument staffChangeBalance(String accountId, BigDecimal delta, boolean enforceFunds) {
        Query query = Query.query(Criteria.where("_id").is(accountId));
        if (enforceFunds) {
            query.addCriteria(Criteria.where("balance").gte(delta.abs()));
        }
        AccountDocument account = mongoTemplate.findAndModify(query,
                new Update().inc("balance", delta),
                FindAndModifyOptions.options().returnNew(true), AccountDocument.class);
        if (account == null) {
            if (!accounts.existsById(accountId)) {
                throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Account not found.");
            }
            throw new ResponseStatusException(HttpStatus.CONFLICT, "Insufficient customer funds for withdrawal.");
        }
        return account;
    }

    static BigDecimal calculateEmi(BigDecimal principal, BigDecimal annualRatePercent, int months) {
        BigDecimal monthlyRate = annualRatePercent.divide(BigDecimal.valueOf(1200), CALCULATION_CONTEXT);
        if (monthlyRate.signum() == 0) {
            return principal.divide(BigDecimal.valueOf(months), 2, RoundingMode.HALF_UP);
        }
        BigDecimal factor = BigDecimal.ONE.add(monthlyRate).pow(months, CALCULATION_CONTEXT);
        return principal.multiply(monthlyRate, CALCULATION_CONTEXT).multiply(factor, CALCULATION_CONTEXT)
                .divide(factor.subtract(BigDecimal.ONE), 2, RoundingMode.HALF_UP);
    }

    static BigDecimal calculateNextPayment(BigDecimal outstanding, BigDecimal monthlyRate,
            BigDecimal emi, int termMonths, int paidInstallments) {
        BigDecimal interest = outstanding.multiply(monthlyRate).setScale(2, RoundingMode.HALF_UP);
        BigDecimal totalDue = outstanding.add(interest);
        return paidInstallments + 1 >= termMonths ? totalDue : emi.min(totalDue);
    }

    private AccountDocument changeBalance(String userId, String accountId, BigDecimal delta, boolean enforceFunds) {
        Query query = Query.query(Criteria.where("_id").is(accountId).and("userId").is(userId));
        if (enforceFunds) {
            query.addCriteria(Criteria.where("balance").gte(delta.abs()));
        }
        AccountDocument account = mongoTemplate.findAndModify(query,
                new Update().inc("balance", delta),
                FindAndModifyOptions.options().returnNew(true), AccountDocument.class);
        if (account == null) {
            if (!accounts.existsById(accountId)) {
                throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Account not found.");
            }
            throw new ResponseStatusException(HttpStatus.CONFLICT, "Insufficient funds.");
        }
        return account;
    }

    private AccountDocument requireAccount(String userId, String accountId) {
        return accounts.findById(accountId)
                .filter(account -> userId.equals(account.getUserId()))
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Account not found."));
    }

    private static BigDecimal money(BigDecimal amount) {
        return amount.setScale(2, RoundingMode.HALF_UP);
    }

    private static BankingViews.Account view(AccountDocument account) {
        return new BankingViews.Account(account.getId(), account.getAccountNumber(), account.getHolderName(),
                account.getAccountType(), account.getBalance(), account.getOpenedAt());
    }

    private static BankingViews.Loan view(LoanDocument loan) {
        return new BankingViews.Loan(loan.getId(), loan.getAccountId(), loan.getPrincipal(),
                loan.getAnnualRatePercent(), loan.getTermMonths(), loan.getEmi(),
                loan.getOutstandingPrincipal(), loan.getPaidInstallments(), loan.getStatus(), loan.getOpenedAt());
    }

    private static BankingViews.Transaction view(TransactionDocument transaction) {
        return new BankingViews.Transaction(transaction.getId(), transaction.getAccountId(),
                transaction.getType(), transaction.getAmount(), transaction.getBalanceAfter(),
                transaction.getDescription(), transaction.getLoanId(), transaction.getCreatedAt());
    }
}