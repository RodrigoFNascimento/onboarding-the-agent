---
name: add-endpoint
description: "Use when adding or changing an HTTP endpoint in the Orders API:
  route, validation, error responses, tests and docs."
---
# Add an endpoint

1. Add a static handler to `src/OrdersApi/Orders/OrderEndpoints.cs`.
   Its return type is `Results<...>` and lists every response it can give.
2. Map the route in `MapOrderEndpoints`, under the `/orders` group.
3. Validate the input first. Return `TypedResults.ValidationProblem(...)`
   with one entry per invalid field. Never throw.
4. If the endpoint needs the current time, take `TimeProvider` as a parameter.
5. Add tests to `tests/OrdersApi.Tests/OrderEndpointsTests.cs`:
   the success case, then one test per error response.
6. Add the route and its responses to `docs/api.md`.
7. Run `dotnet test`. The endpoint is done only when every test passes.
