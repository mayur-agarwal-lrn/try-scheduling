using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc.Authorization;
using QM.Scheduling.Api.Handlers;

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

        var app = builder.Build();

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