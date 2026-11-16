using System.ComponentModel.DataAnnotations;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Http.HttpResults;
using OrdersApi.Orders;

namespace FirstPr;

// The agent's first pull request, before the repo had any instructions.
// It compiles and its test passes. It breaks three conventions nobody had written down.
public static class CancelOrderEndpoint
{
    public static Results<Ok<Order>, NotFound> Cancel(
        Guid id, CancelOrderRequest request, IOrderStore store)
    {
        if (string.IsNullOrWhiteSpace(request.Reason))
            throw new ValidationException("A reason is required.");
        if (store.Find(id) is not { } order)
            return TypedResults.NotFound();

        var cancelled = order.Cancel(request.Reason, DateTime.Now);
        store.Save(cancelled);
        return TypedResults.Ok(cancelled);
    }
}
