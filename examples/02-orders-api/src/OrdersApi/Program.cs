using OrdersApi.Orders;

var builder = WebApplication.CreateBuilder(args);

// Unhandled errors also come back as ProblemDetails, the same shape as validation errors.
builder.Services.AddProblemDetails();

// Endpoints ask for TimeProvider instead of reading DateTime.Now, so tests can fix the clock.
builder.Services.AddSingleton(TimeProvider.System);
builder.Services.AddSingleton<IOrderStore, InMemoryOrderStore>();

var app = builder.Build();

app.UseExceptionHandler();
app.MapOrderEndpoints();

app.Run();
