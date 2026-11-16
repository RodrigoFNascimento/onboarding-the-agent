namespace OrdersApi.Orders;

public interface IOrderStore
{
    Order? Find(Guid id);

    void Save(Order order);
}
