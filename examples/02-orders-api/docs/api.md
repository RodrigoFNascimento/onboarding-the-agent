# Orders API: routes

Every error body is `ProblemDetails` (`application/problem+json`). Validation errors are
a 400 with an `errors` object, one entry per invalid field.

| Method | Route                 | Body                   | Responses                       |
|--------|-----------------------|------------------------|---------------------------------|
| POST   | `/orders`             | `{ customer, total }`  | 201 order · 400 validation      |
| GET    | `/orders/{id}`        |                        | 200 order · 404                 |
| POST   | `/orders/{id}/cancel` | `{ reason }`           | 200 order · 400 validation · 404 · 409 already cancelled |
