using Microsoft.AspNetCore.Http.HttpResults;
using OrdersApi.Orders;

namespace FirstPr.Tests;

// The test that came with the first pull request: it passes, but its name says nothing,
// and it can't check CancelledAt because the endpoint reads the real clock.
public class UnitTest1
{
    [Fact]
    public void Test1()
    {
        var store = new InMemoryOrderStore();
        var order = new Order(
            Guid.NewGuid(), "Ada", 42m, OrderStatus.Placed, DateTimeOffset.UtcNow);
        store.Save(order);

        var result = CancelOrderEndpoint.Cancel(order.Id, new("Changed my mind"), store);

        var cancelled = Assert.IsType<Ok<Order>>(result.Result).Value!;
        Assert.Equal(OrderStatus.Cancelled, cancelled.Status);
    }
}
