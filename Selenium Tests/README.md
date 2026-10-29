# Selenium Tests (Java)

Browser end-to-end tests for the Memtime React app using **Selenium 4**, **JUnit 5**, and **Maven**.

## Prerequisites

1. JDK 17+
2. Maven 3.9+
3. Google Chrome
4. App running locally:

```bash
cd ../React
npm run dev
```

## Run

```bash
cd "Selenium Tests"
mvn test
```

Visible browser:

```bash
HEADLESS=0 mvn test
```

Custom app URL:

```bash
BASE_URL=http://localhost:5173 mvn test
```

## Coverage

- App shell loads (brand + main panels)
- Clients load from the API
- Hierarchy empty states before selection
- Client → project → task selection loads children
- Create time entry form + success toast
