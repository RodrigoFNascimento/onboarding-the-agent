namespace OrdersApi.Tests;

// A clock that never moves, so tests can assert on exact timestamps.
// Hand-written instead of a testing package: one override is all we need.
public sealed class FixedTimeProvider(DateTimeOffset now) : TimeProvider
{
    public override DateTimeOffset GetUtcNow() => now;
}
