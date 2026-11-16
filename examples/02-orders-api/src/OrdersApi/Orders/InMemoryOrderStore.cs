using System.Collections.Concurrent;

namespace OrdersApi.Orders;

// In memory on purpose: the example runs with nothing but the .NET SDK.
public sealed class InMemoryOrderStore : IOrderStore
{
    private readonly ConcurrentDictionary<Guid, Order> _orders = new();

    public Order? Find(Guid id) => _orders.GetValueOrDefault(id);

    public void Save(Order order) => _orders[order.Id] = order;
}
