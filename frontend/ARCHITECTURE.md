# Frontend Architecture

```mermaid
flowchart TD
    Entry[main.jsx<br/>React root + global CSS] --> App[App.jsx]
    App --> Shell[pages/BankingDashboard.jsx<br/>session, role, view, data and modal state]

    Shell --> Auth{Authenticated?}
    Auth -- No --> Login[features/auth/AuthPage.jsx<br/>login and registration]
    Login --> AuthAPI[Backend auth endpoints<br/>/api/auth/login, /register, /me]
    AuthAPI --> Shell

    Auth -- Yes --> Role{Active role and selected view}
    Role --> Customer[features/customer/index.js]
    Role --> Admin[features/admin/index.js]
    Role --> Teller[features/teller/index.js]

    Customer --> CustomerPages[Customer pages<br/>Overview, Accounts, Transfers,<br/>Activity, Loans]
    CustomerPages --> CustomerComponents[Customer components<br/>ActionModal, TransactionTableView]

    Admin --> AdminPages[Admin pages<br/>Overview, Accounts, Loans,<br/>Audit, Employees]
    Teller --> TellerPages[Teller pages<br/>Desk, Accounts, History, Loans]
    TellerPages --> TellerComponents[Teller ActionModal]

    Shell --> API[API requests with cookie credentials]
    API --> BankingAPI[Spring Boot banking API]
    Shell --> Demo[data/demoData.js<br/>offline/demo fixtures]
    Shell --> Format[shared/formatters.js<br/>currency and date formatting]
    CustomerPages --> Format
    AdminPages --> Format
    TellerPages --> Format

    Shell --> Styles[banking.css]
    Login --> AuthStyles[auth.css]
    Entry --> GlobalStyles[index.css]
```

## Module Responsibilities

- `main.jsx` mounts the React application and global stylesheet.
- `App.jsx` selects the top-level dashboard page.
- `pages/BankingDashboard.jsx` owns authentication state, role selection, current view, API orchestration, and modal state.
- `features/auth/` contains the sign-in and registration page.
- `features/customer/`, `features/admin/`, and `features/teller/` contain role-specific pages, reusable components, and barrel exports.
- `data/demoData.js` supplies demo fixtures; `shared/formatters.js` centralizes currency and date formatters.

Navigation is currently controlled by the dashboard's `view` state; page selections do not change the browser URL.
