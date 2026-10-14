# Horizon Digital Banking Platform

A full-stack enterprise-grade banking application built with **Java 17 LTS**, **Spring Boot**, **Spring Security (OAuth2 / JWT)**, **MongoDB Multi-Document ACID Transactions**, and an **Advanced React 19 + Vite** financial dashboard.

---

## Architecture Overview

```
                      ┌───────────────────────────────────────┐
                      │    React 19 + Vite Financial Client   │
                      │  (Dashboard, Transfers, Loans, Cards) │
                      └──────────────────┬────────────────────┘
                                         │ HTTP-Only Cookie / Bearer
                                         ▼
                      ┌───────────────────────────────────────┐
                      │        Spring Security Filter         │
                      │    (JWT Verification & RBAC Roles)    │
                      └──────────────────┬────────────────────┘
                                         │
                   ┌─────────────────────┴─────────────────────┐
                   ▼                                           ▼
        ┌──────────────────────┐                    ┌──────────────────────┐
        │  Account & Transfers │                    │    Loan Management   │
        │      Controller      │                    │      Controller      │
        └──────────┬───────────┘                    └──────────┬───────────┘
                   │                                           │
                   └─────────────────────┬─────────────────────┘
                                         │
                                         ▼
                      ┌───────────────────────────────────────┐
                      │          Core Banking Service         │
                      │ (Atomic Balance Updates, Decimal128)  │
                      └──────────────────┬────────────────────┘
                                         │ @Transactional
                                         ▼
                      ┌───────────────────────────────────────┐
                      │      MongoDB Atlas / Replica Set      │
                      │ (Users, Accounts, Loans, Transactions)│
                      └───────────────────────────────────────┘
```

### Key Engineering Decisions & Interview Talking Points

1. **Standard Java 17 Spring Boot Pattern (`@Autowired`, `ResponseEntity<T>`)**:
   - Built to industry standard Java 17 LTS conventions with `@Autowired` dependency injection, typed `ResponseEntity<T>` controller returns, and clean JavaBean / POJO DTOs with standard getters/setters.
   - Clean, readable, and 100% familiar for technical interview evaluations.

2. **Advanced Fintech UI**:
   - **Cash Flow Visualizer**: 6-month interactive visual bar analytics tracking inflows vs outflows with live surplus margin calculations.
   - **Virtual Platinum Debit Card**: Realistic gold EMV circuit chip, contactless wave, 1-click clipboard card number copy, and interactive freeze/unfreeze security overlay.
   - **Quick Wire Beneficiary Strip**: 1-click transfers to frequent beneficiaries (Asha Patel, Kabir Shah, Rohan Sharma, Sarah Miller, AWS Cloud).
   - **Interactive Statement Search**: Real-time multi-field search filtering descriptions, transaction types, and amounts as you type, with 1-click CSV statement download.
   - **Financial Health & Credit Standing Gauge**: Live bureau score meter (845 / 900 Prime Tier) with credit facility utilization metrics.
   - **Privacy Mode**: 1-click masked balances (`₹••••••`) for secure display in public environments.

3. **Stateless JWT Security with HTTP-Only Cookie Support**:
   - Authentication issues signed HMAC-SHA256 JWT tokens with 8-hour lifetime.
   - Dual token resolution (`BearerTokenResolver`): inspects both standard `Authorization: Bearer` headers and secure HTTP-Only `BANKING_TOKEN` cookies to prevent XSS-based token theft.
   - Centralized CORS configuration via Spring Security's `CorsConfigurationSource` ensures proper preflight handling without redundant MVC mappings.

2. **ACID Multi-Document Transactions**:
   - Financial operations (deposits, withdrawals, loan disbursements, EMI deductions) execute within `@Transactional` boundaries using `MongoTransactionManager`.
   - Guaranteed consistency between account balances and append-only transaction ledger records.

3. **Financial Math Precision**:
   - Money and calculations strictly use `BigDecimal` and `MathContext.DECIMAL128` with half-up rounding to prevent floating-point calculation errors.

4. **API-Backed Frontend**:
   - The frontend loads account, loan, and transaction records from the Spring Boot API. Banking data is not preloaded or simulated in the browser; the backend and its configured database must be available for authenticated banking workflows.

---

## Project Structure

```
├── backend/
│   ├── src/main/java/com/example/banking/
│   │   ├── account/          # Account entity & repository
│   │   ├── api/              # REST controllers, DTOs & exception handling
│   │   ├── config/           # Spring Security, JWT, Mongo transaction config
│   │   ├── loan/             # Loan entity & repository
│   │   ├── service/          # Banking domain service & EMI calculation
│   │   ├── transaction/      # Ledger transaction log entity & repository
│   │   └── user/             # User credentials & BCrypt hashing
│   ├── config/
│   │   ├── .env.example      # Environment variable template
│   │   └── .env              # Local environment configuration
│   └── pom.xml               # Clean Maven project descriptor
├── frontend/
│   ├── src/                  # React dashboard components & design system
│   ├── .env.example          # Frontend environment template
│   └── package.json          # Vite client dependencies
├── seed-data.mongodb.js      # Seed script for demo accounts & test data
└── README.md
```

---

## Prerequisites

- **Java JDK 17+ (Java 17, 21, or 25 supported)**
- **Node.js 20+**
- **MongoDB 7+ (Replica Set / MongoDB Atlas)**: Multi-document transactions require a replica set.

---

## Configuration

1. **Backend Environment** (`backend/config/.env`):
   ```env
   MONGODB_URI=mongodb+srv://<username>:<password>@cluster0.example.mongodb.net/banking
   SERVER_PORT=8080
   JWT_SECRET=<Base64-encoded-32-byte-secret>
   JWT_COOKIE_SECURE=false
   ```
   *Generate a 32-byte secret in PowerShell:*
   ```powershell
   [Convert]::ToBase64String((1..32 | ForEach-Object { Get-Random -Minimum 0 -Maximum 256 } | ForEach-Object { [byte]$_ }))
   ```

2. **Frontend Environment** (`frontend/.env`):
   ```env
   VITE_API_URL=http://localhost:8080/api
   ```

---

## Running the Application

### 1. Start Backend API
```powershell
# From project root
.\backend\mvnw.cmd -f backend\pom.xml spring-boot:run
```
The server will start on `http://localhost:8080`.

For a local-only demo using the seeded plaintext credentials, first run `seed-data.mongodb.js`, then start the backend:
```powershell
.\backend\mvnw.cmd -f backend\pom.xml spring-boot:run
```
The seed creates synthetic records for 30 customers (`customer01`–`customer30`), 12 employees (`employee01`–`employee12`), and one administrator (`admin`). All use the 8-character password `demo1234`, stored as plaintext in MongoDB for this local demo. The script drops and recreates the `banking` database; run it only against a disposable local database. Plaintext-password login is enabled in the default profile to support these seeded accounts. Never use this configuration or password storage with hosted or production data; registered users continue to have BCrypt-hashed passwords.

### 2. Start Frontend Dashboard
```powershell
# From frontend folder
cd frontend
npm install
npm run dev
```
Open `http://localhost:5173` in your browser.

### 3. Create Your Own Account
Register a new user in the app, or create your own seeded data locally with a fresh MongoDB database.

---

## REST API Endpoints

| Method | Endpoint | Description | Auth Required |
|---|---|---|---|
| `POST` | `/api/auth/register` | Register new user + initial savings account | Public |
| `POST` | `/api/auth/login` | Authenticate user & set JWT cookie | Public |
| `POST` | `/api/auth/logout` | Clear auth cookie | Public |
| `GET` | `/api/auth/me` | Fetch active user profile | Yes |
| `GET` | `/api/accounts` | List accounts belonging to authenticated user | Yes |
| `GET` | `/api/accounts/{id}` | Get account details by ID | Yes |
| `POST` | `/api/accounts` | Open a new Savings or Current account | Yes |
| `POST` | `/api/accounts/{id}/deposits` | Credit funds to account & log ledger | Yes |
| `POST` | `/api/accounts/{id}/withdrawals` | Debit funds from account with balance check | Yes |
| `GET` | `/api/accounts/{id}/statement` | Retrieve chronological transaction statement | Yes |
| `GET` | `/api/accounts/{id}/loans` | List loans for the account | Yes |
| `POST` | `/api/accounts/{id}/loans` | Apply for loan, compute EMI, disburse funds | Yes |
| `POST` | `/api/accounts/{id}/loans/{loanId}/payments` | Deduct EMI installment & reduce principal | Yes |

---

## Verification & Testing

```powershell
# Run backend test suite (unit + security integration tests)
.\backend\mvnw.cmd -f backend\pom.xml test

# Verify frontend linting & production build
npx oxlint --ignore-path ../.gitignore --prefix frontend
npm run build --prefix frontend
```
