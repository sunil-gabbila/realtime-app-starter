# StockWise Inventory Manager

StockWise is a small-shop inventory and sales app. The backend is Java with Spring Boot, Maven, and MySQL. The frontend is React with JavaScript and Vite. Node.js and npm run the frontend development and build tools; the API remains on Java.

## Current project status

- The backend supports item creation, input validation, and duplicate-name errors.
- The frontend has the responsive StockWise workspace shell and overview placeholders.
- Product management, stock movements, dashboard data, sales, and sign-in will be added in the planned feature branch increments.

## Technology stack

- Java 17, Spring Boot, Spring MVC, Maven
- Spring Data JPA / Hibernate and MySQL
- Jakarta Bean Validation
- React with JavaScript, Vite, Node.js, and npm
- JUnit / Spring Boot Test, Vitest, and React Testing Library

## Requirements

- JDK 17 or later
- Maven 3.6.3 or later
- MySQL Server
- Node.js and npm

## Configure MySQL

Create the development database once:

```sql
CREATE DATABASE kodnest;
```

The default connection uses `localhost:3306`, database `kodnest`, and username `root`. In PowerShell, set environment variables if your MySQL URL or credentials differ:

```powershell
$env:DB_URL = 'jdbc:mysql://localhost:3306/kodnest'
$env:DB_USERNAME = 'root'
$env:DB_PASSWORD = 'your-local-password'
```

## Run locally

Start the backend from the project root in one terminal:

```powershell
mvn spring-boot:run
```

Start the frontend from a second terminal:

```powershell
cd frontend
npm install
npm run dev
```

Open the Vite URL shown in the terminal, usually `http://localhost:5173`. The frontend proxies `/api` requests to the Spring Boot API at `http://localhost:8080`.

## Run checks

From the project root, run the backend tests:

```powershell
mvn test
```

From the `frontend` folder, run the frontend tests and production build:

```powershell
npm run test:run
npm run build
```

## Existing item endpoint

Send a `POST` request to `http://localhost:8080/api/items` with JSON:

```json
{
  "name": "Sample item",
  "description": "An item created through the API"
}
```

A successful request returns `201 Created`. A blank name is rejected by request validation. A duplicate name, ignoring case and surrounding spaces, returns `409 Conflict` with an `ITEM_ALREADY_EXISTS` error code.
