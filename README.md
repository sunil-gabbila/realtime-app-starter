# Kodnest Spring Boot API

A Java backend REST API built with Spring Boot and Maven. It currently supports creating items, validating requests, and returning a conflict response when an item name already exists.

## Technology stack

- Java 17
- Spring Boot 4.1.2 and Spring MVC
- Spring Data JPA with Hibernate
- MySQL
- Jakarta Bean Validation
- Maven

## Prerequisites

- JDK 17 or later
- Maven 3.6.3 or later
- A running MySQL server

## Configure MySQL

Create the development database once:

```sql
CREATE DATABASE kodnest;
```

The default connection uses `localhost:3306`, database `kodnest`, and username `root`. Set environment variables if your local MySQL credentials or URL differ.

PowerShell example:

```powershell
$env:DB_URL = 'jdbc:mysql://localhost:3306/kodnest'
$env:DB_USERNAME = 'root'
$env:DB_PASSWORD = 'your-local-password'
```

## Run the API

From the project root, run:

```powershell
mvn spring-boot:run
```

Spring Boot starts the API at `http://localhost:8080`. Hibernate updates the development schema when the application starts. Item data is stored in MySQL and remains after the application stops.

## Create an item

Send a `POST` request to `http://localhost:8080/api/items` with JSON:

```json
{
  "name": "Sample item",
  "description": "An item created through the API"
}
```

You can send the request with Postman, an IDE HTTP client, or PowerShell. A successful request returns `201 Created` with the new item. A blank name is rejected by request validation. A duplicate name, ignoring case and surrounding spaces, returns `409 Conflict` with an `ITEM_ALREADY_EXISTS` error code.

## Add flow

`ItemController` receives and validates the HTTP request, `ItemServiceImpl` applies the duplicate-name check and business logic, and `ItemRepository` uses Spring Data JPA to access MySQL. The controller returns an `ItemResponse` after the item is saved.
