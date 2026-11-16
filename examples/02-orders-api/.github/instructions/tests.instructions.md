---
applyTo: "tests/**"
---
# Tests

- Name tests `Method_Scenario_Expected`, e.g. `Cancel_UnknownOrder_ReturnsNotFound`.
- Every endpoint has a test for the success case and one for each error it returns.
- Call the endpoint methods directly. No web server, no `WebApplicationFactory`.
- Use `FixedTimeProvider` for time, and assert on the exact timestamp it returns.
- One behaviour per test, laid out as arrange, act, assert.
