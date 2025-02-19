using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc.Authorization;
using Microsoft.EntityFrameworkCore;
using QM.Scheduling.Api.Handlers;
using QM.Scheduling.Api.Infrastructure;

namespace QM.Scheduling.Api;

public class Program
{
    public static void Main(string[] args)
    {
        var builder = WebApplication.CreateBuilder(args);

        // Add services to the container.
        builder.Services.AddControllers(config =>
        {
            // Add global authorization filter to enforce authentication by default
            var policy = new AuthorizationPolicyBuilder()
                .RequireAuthenticatedUser()
                .Build();
            config.Filters.Add(new AuthorizeFilter(policy));
        });

        // Configure JWT authentication
        builder.Services.AddAuthentication("Bearer")
            .AddScheme<AuthenticationSchemeOptions, JwtAuthenticationHandler>("Bearer", null);

        // Configure authorization policies
        builder.Services.AddAuthorization(options =>
        {
            options.AddPolicy("ScheduleReadPolicy", policy =>
                policy.RequireClaim("permission", "schedule:read"));

            // Customer policy when multiple permissions are required
            options.AddPolicy("ScheduleAllPolicy", policy =>
                policy.RequireAssertion(context =>
                    // Custom policy to check multiple permissions
                    context.User.HasClaim(c => c is { Type: "permission", Value: "schedule:create" }) &&
                    context.User.HasClaim(c => c is { Type: "permission", Value: "schedule:read" }) &&
                    context.User.HasClaim(c => c is { Type: "permission", Value: "schedule:update" }) &&
                    context.User.HasClaim(c => c is { Type: "permission", Value: "schedule:delete" })
                ));
        });

        // Configure in-memory database for schedules
        builder.Services.AddDbContext<ScheduleDbContext>(options =>
            options.UseInMemoryDatabase("SchedulesDb"));

        // Configure in-memory database for schedulers
        builder.Services.AddDbContext<SchedulerDbContext>(options =>
            options.UseInMemoryDatabase("SchedulersDb"));

        // Enforce HTTPS
        builder.Services.AddHttpsRedirection(options =>
        {
            options.RedirectStatusCode = StatusCodes.Status307TemporaryRedirect;
            options.HttpsPort = 443;
        });

        // Configure secure headers
        builder.Services.AddHsts(options =>
        {
            options.Preload = true;
            options.IncludeSubDomains = true;
            options.MaxAge = TimeSpan.FromDays(365);
        });

        // Register DatabaseInitializer as a fake service (not needed in production code)
        builder.Services.AddTransient<DatabaseInitializer>();

        var app = builder.Build();

        // Seed the databases with initial data (fake setup for demo purposes)
        using (var scope = app.Services.CreateScope())
        {
            var dbInitializer = scope.ServiceProvider.GetRequiredService<DatabaseInitializer>();
            dbInitializer.SeedDatabases();
        }

        // Configure the HTTP request pipeline.
        app.UseStaticFiles(); // Serve static files from wwwroot

        app.UseHttpsRedirection();
        app.UseHsts();
        app.UseAuthentication();
        app.UseAuthorization();
        app.MapControllers();

        if (app.Environment.IsDevelopment())
            app.MapFallbackToFile("index.html"); // Serve React app during development

        app.Run();
    }
}