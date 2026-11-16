# Orders API

A small HTTP API to place, read and cancel orders. .NET 10, ASP.NET Core Minimal APIs,
in-memory storage, xUnit tests.

## Build and test
- Build: `dotnet build`
- Test: `dotnet test`. Run it before saying a change is done.
- Format: `dotnet format`

## Conventions
- Invalid input returns `TypedResults.ValidationProblem(...)`: a 400 with `ProblemDetails`.
  Never throw exceptions for validation.
- Other errors return `ProblemDetails` too: `TypedResults.Problem(...)` with the status code.
- Get the current time from the injected `TimeProvider`. Never use `DateTime.Now` or
  `DateTime.UtcNow`: tests need to control the clock.
- Endpoints are static methods in `src/OrdersApi/Orders/OrderEndpoints.cs` that return
  `TypedResults`, so tests can call them directly.

## Don'ts
- Don't add NuGet packages without asking.
- Don't change existing routes or response shapes without saying so in the PR description.

## More context
- Routes and error responses: [docs/api.md](docs/api.md)
