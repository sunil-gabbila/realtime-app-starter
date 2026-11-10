# Kodnest Spring Boot API starter

A Spring Boot REST API starter using Java 17, Spring MVC, Spring Data JPA, and an in-memory H2 database. It includes an `Item` creation flow through the controller, service interface, service implementation, and repository.

## Run and test locally

You need Java 17 or later and Maven 3.6.3 or later. From the project root, start the API in a terminal:

```powershell
mvn spring-boot:run
```

Wait until Spring Boot reports that the application has started. Keep this terminal open. Send requests from a second terminal, Postman, or an IDE HTTP client.

### PowerShell

Create an item with:

```powershell
$response = Invoke-WebRequest `
  -Method Post `
  -Uri http://localhost:8080/api/items `
  -ContentType 'application/json' `
  -Body '{"name":"Sample item","description":"An item created through the API"}'

$response.StatusCode
$response.Headers.Location
$response.Content
```

Expected: status `201`, a `Location` header such as `/api/items/1`, and a JSON body with the generated `id`, `name`, and `description`.

Check validation by sending an empty name:

```powershell
Invoke-WebRequest `
  -Method Post `
  -Uri http://localhost:8080/api/items `
  -ContentType 'application/json' `
  -Body '{"name":"","description":"This should fail validation"}'
```

Expected: status `400 Bad Request`, because `name` cannot be blank.

### Postman

1. Create a request with method `POST` and URL `http://localhost:8080/api/items`.
2. Select **Body** → **raw** → **JSON**.
3. Enter `{ "name": "Sample item", "description": "An item created through the API" }` and select **Send**.
4. Confirm the response status is `201 Created`, and inspect the JSON body and `Location` response header.

The H2 database is in-memory and resets when the application stops. Stop the server with `Ctrl+C` in the first terminal.

## Add flow

`ItemController.add` calls `ItemService.add`; `ItemServiceImpl` maps the request to an `Item`, saves it through `ItemRepository`, and returns an `ItemResponse`. The controller returns that response as the body of the created HTTP response.

## Requirements

- Java 17 or later
- Maven 3.6.3 or later

