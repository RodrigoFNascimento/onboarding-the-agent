namespace OrdersApi.Orders;

public sealed record PlaceOrderRequest(string? Customer, decimal Total);

public sealed record CancelOrderRequest(string? Reason);
