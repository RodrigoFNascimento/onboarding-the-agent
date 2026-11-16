using Microsoft.AspNetCore.Http.HttpResults;
using OrdersApi.Orders;

namespace OrdersApi.Tests;

public class OrderEndpointsTests
{
    private static readonly DateTimeOffset Now = new(2026, 11, 16, 9, 30, 0, TimeSpan.Zero);

    private readonly InMemoryOrderStore _store = new();
    private readonly FixedTimeProvider _time = new(Now);

    [Fact]
    public void Place_ValidRequest_CreatesOrderPlacedNow()
    {
        var result = OrderEndpoints.Place(new PlaceOrderRequest("Ada", 42m), _store, _time);

        var created = Assert.IsType<Created<Order>>(result.Result);
        Assert.Equal(OrderStatus.Placed, created.Value!.Status);
        Assert.Equal(Now, created.Value.PlacedAt);
        Assert.Equal(created.Value, _store.Find(created.Value.Id));
    }

    [Fact]
    public void Place_MissingCustomerAndZeroTotal_ReturnsValidationProblemForBoth()
    {
        var result = OrderEndpoints.Place(new PlaceOrderRequest(" ", 0m), _store, _time);

        var problem = Assert.IsType<ValidationProblem>(result.Result);
        Assert.Equal(["customer", "total"], problem.ProblemDetails.Errors.Keys.Order());
    }

    [Fact]
    public void Get_ExistingOrder_ReturnsOrder()
    {
        var order = PlaceOrder();

        var result = OrderEndpoints.Get(order.Id, _store);

        Assert.Equal(order, Assert.IsType<Ok<Order>>(result.Result).Value);
    }

    [Fact]
    public void Get_UnknownOrder_ReturnsNotFound()
    {
        var result = OrderEndpoints.Get(Guid.NewGuid(), _store);

        Assert.IsType<NotFound>(result.Result);
    }

    #region cancel-test
    [Fact]
    public void Cancel_PlacedOrder_RecordsTimeFromTimeProvider()
    {
        var order = PlaceOrder();

        var result = OrderEndpoints.Cancel(
            order.Id, new CancelOrderRequest("Changed my mind"), _store, _time);

        var cancelled = Assert.IsType<Ok<Order>>(result.Result).Value!;
        Assert.Equal(OrderStatus.Cancelled, cancelled.Status);
        Assert.Equal(Now, cancelled.CancelledAt);
    }
    #endregion

    [Theory]
    [InlineData(null)]
    [InlineData("")]
    [InlineData("   ")]
    public void Cancel_MissingReason_ReturnsValidationProblem(string? reason)
    {
        var order = PlaceOrder();

        var result = OrderEndpoints.Cancel(order.Id, new CancelOrderRequest(reason), _store, _time);

        var problem = Assert.IsType<ValidationProblem>(result.Result);
        Assert.Equal(400, problem.StatusCode);
        Assert.Contains("reason", problem.ProblemDetails.Errors.Keys);
        Assert.Equal(OrderStatus.Placed, _store.Find(order.Id)!.Status);
    }

    [Fact]
    public void Cancel_UnknownOrder_ReturnsNotFound()
    {
        var result = OrderEndpoints.Cancel(
            Guid.NewGuid(), new CancelOrderRequest("Changed my mind"), _store, _time);

        Assert.IsType<NotFound>(result.Result);
    }

    [Fact]
    public void Cancel_AlreadyCancelledOrder_ReturnsConflictProblem()
    {
        var order = PlaceOrder();
        OrderEndpoints.Cancel(order.Id, new CancelOrderRequest("First"), _store, _time);

        var result = OrderEndpoints.Cancel(order.Id, new CancelOrderRequest("Again"), _store, _time);

        var problem = Assert.IsType<ProblemHttpResult>(result.Result);
        Assert.Equal(409, problem.StatusCode);
    }

    private Order PlaceOrder()
    {
        var result = OrderEndpoints.Place(new PlaceOrderRequest("Ada", 42m), _store, _time);
        return Assert.IsType<Created<Order>>(result.Result).Value!;
    }
}
