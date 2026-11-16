# 01: the first pull request

What an agent wrote for "add an endpoint to cancel an order", before the
[Orders API](../02-orders-api/) had any instructions. It builds and its test passes, and it
still gets three review comments: `DateTime.Now` instead of `TimeProvider`, a thrown
`ValidationException` instead of `ProblemDetails`, and a test named `Test1`.
Compare it with `Cancel` in [`OrderEndpoints.cs`](../02-orders-api/src/OrdersApi/Orders/OrderEndpoints.cs).

Run it with `dotnet test` from this folder's `tests/FirstPr.Tests`.
