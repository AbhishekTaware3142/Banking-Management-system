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
    Context --> Customer[pages/customer/<br/>route-level customer pages]
    Context --> Admin[pages/admin/<br/>route-level admin pages]
    Context --> Teller[pages/teller/<br/>route-level teller pages]

    Customer --> CustomerViews[views/customer/<br/>reusable screen sections]
    Admin --> AdminViews[views/admin/<br/>reusable screen sections]
    Teller --> TellerViews[views/teller/<br/>reusable screen sections]
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
- `pages/customer/`, `pages/admin/`, and `pages/teller/` contain one route-level page per banking workflow. These pages compose reusable sections from `views/`.
- `controllers/` owns workflow behavior; `services/` owns backend communication; `utils/formatters.js` centralizes presentation formatting.

Page navigation is URL-based under `/app/customer/*`, `/app/admin/*`, and `/app/teller/*`, so browser history, refreshes, and deep links preserve the active screen.
