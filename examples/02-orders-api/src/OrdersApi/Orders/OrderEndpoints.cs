using Microsoft.AspNetCore.Http.HttpResults;

namespace OrdersApi.Orders;

// Handlers are static methods returning TypedResults, so tests call them directly
// and the Results<...> signature lists every response an endpoint can give.
public static class OrderEndpoints
{
    public static IEndpointRouteBuilder MapOrderEndpoints(this IEndpointRouteBuilder app)
    {
        var orders = app.MapGroup("/orders");
        orders.MapPost("/", Place);
        orders.MapGet("/{id:guid}", Get);
        orders.MapPost("/{id:guid}/cancel", Cancel);
        return app;
    }

    public static Results<Created<Order>, ValidationProblem> Place(
        PlaceOrderRequest request, IOrderStore store, TimeProvider time)
    {
        var errors = new Dictionary<string, string[]>();
        if (string.IsNullOrWhiteSpace(request.Customer))
            errors["customer"] = ["Customer is required."];
        if (request.Total <= 0)
            errors["total"] = ["Total must be greater than zero."];
        if (errors.Count > 0)
            return TypedResults.ValidationProblem(errors);

        var order = new Order(
            Guid.NewGuid(), request.Customer!, request.Total, OrderStatus.Placed, time.GetUtcNow());
        store.Save(order);
        return TypedResults.Created($"/orders/{order.Id}", order);
    }

    public static Results<Ok<Order>, NotFound> Get(Guid id, IOrderStore store) =>
        store.Find(id) is { } order ? TypedResults.Ok(order) : TypedResults.NotFound();

    #region cancel-endpoint
    public static Results<Ok<Order>, NotFound, ValidationProblem, ProblemHttpResult> Cancel(
        Guid id, CancelOrderRequest request, IOrderStore store, TimeProvider time)
    {
        if (string.IsNullOrWhiteSpace(request.Reason))
            return TypedResults.ValidationProblem(Error("reason", "A reason is required."));
        if (store.Find(id) is not { } order)
            return TypedResults.NotFound();
        if (order.Status == OrderStatus.Cancelled)
            return TypedResults.Problem("The order is already cancelled.", statusCode: 409);

        var cancelled = order.Cancel(request.Reason, time.GetUtcNow());
        store.Save(cancelled);
        return TypedResults.Ok(cancelled);
    }
    #endregion

    private static Dictionary<string, string[]> Error(string field, string message) =>
        new() { [field] = [message] };
}
