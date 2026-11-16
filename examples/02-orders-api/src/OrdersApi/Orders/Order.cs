namespace OrdersApi.Orders;

public enum OrderStatus
{
    Placed,
    Cancelled,
}

public sealed record Order(
    Guid Id,
    string Customer,
    decimal Total,
    OrderStatus Status,
    DateTimeOffset PlacedAt,
    DateTimeOffset? CancelledAt = null,
    string? CancellationReason = null)
{
    public Order Cancel(string reason, DateTimeOffset at) =>
        this with { Status = OrderStatus.Cancelled, CancelledAt = at, CancellationReason = reason };
}
