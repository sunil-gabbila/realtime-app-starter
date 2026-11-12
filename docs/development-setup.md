# Development setup

## Requirements

- JDK 17 or later
- Maven 3.6.3 or later
- MySQL Server

## Prepare the database

Create a local database:

```sql
CREATE DATABASE kodnest;
```

The default connection is `jdbc:mysql://localhost:3306/kodnest` with username `root` and an empty password. Set these environment variables in the terminal before starting the application when your local setup differs:

```powershell
$env:DB_URL = 'jdbc:mysql://localhost:3306/kodnest'
$env:DB_USERNAME = 'root'
$env:DB_PASSWORD = 'your-local-password'
```

## Start the API

From the project root:

```powershell
mvn spring-boot:run
```

The API listens on `http://localhost:8080`. Hibernate updates the database schema during local development.

## Send a request

Use Postman or another HTTP client:

- Method: `POST`
- URL: `http://localhost:8080/api/items`
- Header: `Content-Type: application/json`
- Body:

```json
{
  "name": "Sample item",
  "description": "Created locally"
}
```

A new item returns `201 Created`. A blank name fails validation. A duplicate item name returns `409 Conflict`.

## Configuration notes

- Keep database credentials in environment variables; do not commit personal credentials.
- MySQL is the configured relational database.
- `spring.jpa.hibernate.ddl-auto=update` is suitable for this starter's local development. Use reviewed migrations for production schema changes.
