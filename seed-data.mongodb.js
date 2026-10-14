use('banking');

// This resets the entire banking database. Use only with a disposable local database.
db.dropDatabase();

const demoPassword = 'demo1234';
const now = new Date();
const daysAgo = (days) => new Date(now.getTime() - days * 24 * 60 * 60 * 1000);
const decimal = (amount) => NumberDecimal(Number(amount).toFixed(2));
const roundMoney = (amount) => Number(Number(amount).toFixed(2));

const customerNames = [
  'Anika Desai', 'Aarav Mehta', 'Nisha Kapoor', 'Rohan Kulkarni', 'Farah Khan',
  'Vikram Nair', 'Leena Bose', 'Arjun Rao', 'Sana Qureshi', 'Dev Malhotra',
  'Priya Menon', 'Karan Sethi', 'Tara Banerjee', 'Ishaan Verma', 'Meera Joshi',
  'Sameer Das', 'Ananya Pillai', 'Kabir Anand', 'Zoya Mirza', 'Neel Shah',
  'Aisha Patel', 'Rahul Iyer', 'Maya Choudhary', 'Aditya Sen', 'Simran Gill',
  'Nikhil Sood', 'Rhea Mukherjee', 'Manav Bansal', 'Ira Saxena', 'Varun Shetty',
];

const employeeNames = [
  'Elena Thomas', 'Ravi Chawla', 'Jia Fernandes', 'Omar Siddiqui', 'Neha Bhat',
  'Daniel Mathews', 'Kavya Reddy', 'Miguel Dsouza', 'Aditi Rao', 'Yusuf Ali',
  'Pooja Nambiar', 'Armaan Khanna',
];

const customers = customerNames.map((fullName, index) => ({
  _id: new ObjectId(),
  username: `customer${String(index + 1).padStart(2, '0')}`,
  fullName,
  role: 'CUSTOMER',
  password: demoPassword,
  createdAt: daysAgo(500 - index * 7),
}));

const employees = employeeNames.map((fullName, index) => ({
  _id: new ObjectId(),
  username: `employee${String(index + 1).padStart(2, '0')}`,
  fullName,
  role: 'EMPLOYEE',
  password: demoPassword,
  createdAt: daysAgo(450 - index * 9),
}));

const admin = {
  _id: new ObjectId(),
  username: 'admin',
  fullName: 'Jordan Ellis',
  role: 'ADMIN',
  password: demoPassword,
  createdAt: daysAgo(600),
};

db.users.createIndex({ username: 1 }, { unique: true, name: 'ux_users_username' });
db.users.insertMany([admin, ...employees, ...customers]);

db.accounts.createIndex({ accountNumber: 1 }, { unique: true, name: 'ux_accounts_account_number' });
db.accounts.createIndex({ userId: 1 }, { name: 'ix_accounts_user_id' });
db.loans.createIndex({ accountId: 1 }, { name: 'ix_loans_account_id' });
db.transactions.createIndex({ accountId: 1, createdAt: -1 }, { name: 'ix_transactions_account_created' });

function calculateEmi(principal, annualRatePercent, termMonths) {
  const monthlyRate = annualRatePercent / 1200;
  if (monthlyRate === 0) return roundMoney(principal / termMonths);
  const factor = Math.pow(1 + monthlyRate, termMonths);
  return roundMoney((principal * monthlyRate * factor) / (factor - 1));
}

const accounts = [];
const loans = [];
const transactions = [];

customers.forEach((customer, index) => {
  const accountId = new ObjectId();
  const accountIdString = accountId.toString();
  const targetBalance = 25000 + index * 3200;
  const withdrawal = 250 + index * 125;
  const hasLoan = index < 8;
  const principal = hasLoan ? 8000 + index * 2500 : 0;
  const annualRatePercent = 7.5 + (index % 5) * 0.4;
  const termMonths = [12, 18, 24, 36][index % 4];
  const paidInstallments = hasLoan ? 1 + (index % 4) : 0;
  const emi = hasLoan ? calculateEmi(principal, annualRatePercent, termMonths) : 0;
  let outstandingPrincipal = principal;
  let totalPaid = 0;

  if (hasLoan) {
    const monthlyRate = annualRatePercent / 1200;
    for (let installment = 0; installment < paidInstallments; installment += 1) {
      const interest = roundMoney(outstandingPrincipal * monthlyRate);
      const payment = installment + 1 >= termMonths
        ? roundMoney(outstandingPrincipal + interest)
        : Math.min(emi, roundMoney(outstandingPrincipal + interest));
      outstandingPrincipal = roundMoney(Math.max(0, outstandingPrincipal - (payment - interest)));
      totalPaid = roundMoney(totalPaid + payment);
    }
  }

  const openingDeposit = targetBalance - principal + totalPaid + withdrawal;
  const openedAt = daysAgo(700 - index * 11);
  let runningBalance = 0;
  const openingType = index % 4 === 0 ? 'TELLER_DEPOSIT' : 'DEPOSIT';

  runningBalance = roundMoney(runningBalance + openingDeposit);
  transactions.push({
    _id: new ObjectId(),
    accountId: accountIdString,
    type: openingType,
    amount: decimal(openingDeposit),
    balanceAfter: decimal(runningBalance),
    description: openingType === 'TELLER_DEPOSIT' ? 'Opening counter deposit' : 'Opening account deposit',
    loanId: null,
    createdAt: daysAgo(150 + index),
  });

  if (hasLoan) {
    const loanId = new ObjectId();
    runningBalance = roundMoney(runningBalance + principal);
    loans.push({
      _id: loanId,
      accountId: accountIdString,
      principal: decimal(principal),
      annualRatePercent: decimal(annualRatePercent),
      termMonths,
      emi: decimal(emi),
      outstandingPrincipal: decimal(outstandingPrincipal),
      paidInstallments,
      status: 'ACTIVE',
      openedAt: daysAgo(120 + index),
    });

    transactions.push({
      _id: new ObjectId(),
      accountId: accountIdString,
      type: 'LOAN_DISBURSEMENT',
      amount: decimal(principal),
      balanceAfter: decimal(runningBalance),
      description: 'Loan disbursement',
      loanId: loanId.toString(),
      createdAt: daysAgo(120 + index),
    });

    let remainingForLedger = principal;
    for (let installment = 0; installment < paidInstallments; installment += 1) {
      const monthlyRate = annualRatePercent / 1200;
      const interest = roundMoney(remainingForLedger * monthlyRate);
      const payment = installment + 1 >= termMonths
        ? roundMoney(remainingForLedger + interest)
        : Math.min(emi, roundMoney(remainingForLedger + interest));
      remainingForLedger = roundMoney(Math.max(0, remainingForLedger - (payment - interest)));
      runningBalance = roundMoney(runningBalance - payment);
      transactions.push({
        _id: new ObjectId(),
        accountId: accountIdString,
        type: 'EMI_PAYMENT',
        amount: decimal(-payment),
        balanceAfter: decimal(runningBalance),
        description: `Loan installment ${installment + 1}`,
        loanId: loanId.toString(),
        createdAt: daysAgo(90 - installment * 20 + (index % 5)),
      });
    }

  }

  if (Math.abs(runningBalance - (targetBalance + withdrawal)) >= 0.01) {
    throw new Error(`Seed ledger does not reconcile for ${customer.username}.`);
  }
  runningBalance = roundMoney(runningBalance - withdrawal);
  transactions.push({
    _id: new ObjectId(),
    accountId: accountIdString,
    type: 'WITHDRAWAL',
    amount: decimal(-withdrawal),
    balanceAfter: decimal(runningBalance),
    description: 'Cash withdrawal',
    loanId: null,
    createdAt: daysAgo(1 + (index % 7)),
  });

  accounts.push({
    _id: accountId,
    userId: customer._id.toString(),
    accountNumber: `BA${String(1000000001 + index).padStart(10, '0')}`,
    holderName: customer.fullName,
    accountType: index % 2 === 0 ? 'SAVINGS' : 'CURRENT',
    balance: decimal(targetBalance),
    openedAt,
  });
});

db.accounts.insertMany(accounts);
db.loans.insertMany(loans);
db.transactions.insertMany(transactions);

print('Synthetic local seed data inserted. Use only with the demo profile and a disposable database.');
print('Customers: ' + customers.length);
print('Employees: ' + employees.length);
print('Admins: ' + 1);
print('Accounts: ' + db.accounts.countDocuments());
print('Loans: ' + db.loans.countDocuments());
print('Transactions: ' + db.transactions.countDocuments());
