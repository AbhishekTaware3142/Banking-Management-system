# Frontend Architecture

```mermaid
flowchart TD
    Entry[main.jsx<br/>React root + global CSS] --> App[App.jsx]
    App --> Routes[routes/AppRoutes.jsx<br/>authenticated role-based routes]
    Routes --> Shell[pages/BankingDashboard.jsx<br/>shared banking shell and data orchestration]

    Routes --> Auth{Authenticated?}
    Auth -- No --> Login[views/auth/AuthView.jsx<br/>login and registration]
    Login --> AuthAPI[Backend auth endpoints<br/>/api/auth/login, /register, /me]

    Shell --> Context[hooks/useBankingDashboard.js<br/>shared route data and actions]
    Context --> Pages[pages/<br/>one route-level component per page]

    Pages --> CustomerViews[views/customer/<br/>reusable customer screen sections]
    Pages --> AdminViews[views/admin/<br/>reusable admin screen sections]
    Pages --> TellerViews[views/teller/<br/>reusable teller screen sections]
    CustomerViews --> SharedComponents[components/<br/>shared interaction components]
    AdminViews --> SharedComponents
    TellerViews --> SharedComponents

    Shell --> Services[services/<br/>API requests with cookie credentials]
    Services --> BankingAPI[Spring Boot banking API]
    CustomerViews --> Format[utils/formatters.js<br/>currency and date formatting]
    AdminViews --> Format
    TellerViews --> Format

    Shell --> Styles[banking.css]
    Login --> AuthStyles[auth.css]
    Entry --> GlobalStyles[index.css]
```

## Module Responsibilities

- `main.jsx` mounts the React application and global stylesheet.
- `App.jsx` delegates to the route tree.
- `routes/AppRoutes.jsx` declares role-specific routes; `routes/RoleRoute.jsx` restricts each route group to its intended role.
- `pages/BankingDashboard.jsx` owns the shared banking shell, cross-page data orchestration, and modal state.
- `hooks/useBankingDashboard.js` exposes shared data and actions through React Router outlet context.
- `pages/` contains one top-level page file per workflow (for example `DashboardPage.jsx`, `AccountsPage.jsx`, `AdminAccountsPage.jsx`, and `TellerDeskPage.jsx`). Each page composes reusable sections from `views/`.
- `controllers/` owns workflow behavior; `services/` owns backend communication; `utils/formatters.js` centralizes presentation formatting.

Page navigation is URL-based under `/app/customer/*`, `/app/admin/*`, and `/app/teller/*`, so browser history, refreshes, and deep links preserve the active screen.
