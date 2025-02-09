using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Authorization;
using Microsoft.Extensions.Options;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text.Encodings.Web;

namespace QM.Scheduling.Api.Handlers;

// This is just an example to validate JWT token from the browser
// Do not use this in production, we are not actually fully validating the token here
public class JwtAuthenticationHandler(
    IOptionsMonitor<AuthenticationSchemeOptions> options,
    ILoggerFactory logger,
    UrlEncoder encoder)
    : AuthenticationHandler<AuthenticationSchemeOptions>(options, logger, encoder)
{
    protected override Task<AuthenticateResult> HandleAuthenticateAsync()
    {
        var endpoint = Context.GetEndpoint();

        // Allow anonymous access if the endpoint has [AllowAnonymous] attribute
        if (endpoint?.Metadata?.GetMetadata<IAllowAnonymous>() != null)
        {
            return Task.FromResult(AuthenticateResult.NoResult());
        }

        // Bypass authentication for root URL and favicon.ico
        if (Request.Path == "/" || Request.Path == "/favicon.ico")
        {
            return Task.FromResult(AuthenticateResult.NoResult());
        }

        // Check if the Authorization header is present
        if (!Request.Headers.ContainsKey("Authorization"))
        {
            return Task.FromResult(AuthenticateResult.Fail("Authorization header missing"));
        }

        var token = Request.Headers["Authorization"].ToString().Replace("Bearer ", "");

        try
        {
            var tokenHandler = new JwtSecurityTokenHandler();
            var jwtToken = tokenHandler.ReadJwtToken(token);

            // Check if the token has expired
            if (jwtToken.ValidTo < DateTime.UtcNow)
            {
                return Task.FromResult(AuthenticateResult.Fail("Token has expired"));
            }

            var claims = jwtToken.Claims.ToList();

            // Validate tenantId in URL and token
            var tenantIdFromToken = claims.FirstOrDefault(c => c.Type == "tenantId")?.Value;
            var tenantIdFromUrl = Request.RouteValues["tenantId"]?.ToString();

            if (string.IsNullOrEmpty(tenantIdFromToken) || string.IsNullOrEmpty(tenantIdFromUrl) ||
                !tenantIdFromToken.Equals(tenantIdFromUrl, StringComparison.OrdinalIgnoreCase))
            {
                return Task.FromResult(AuthenticateResult.Fail("Invalid tenantId"));
            }

            // Add tenantId to claims
            claims.Add(new Claim("tenantId", tenantIdFromToken));

            // Handle flattened permissions claims
            var permissions = claims.Where(c => c.Type == "permissions").Select(c => c.Value).ToList();
            claims.AddRange(permissions.Select(p => new Claim("permission", p)));

            var identity = new ClaimsIdentity(claims, Scheme.Name);
            var principal = new ClaimsPrincipal(identity);
            var ticket = new AuthenticationTicket(principal, Scheme.Name);

            return Task.FromResult(AuthenticateResult.Success(ticket));
        }
        catch (Exception ex)
        {
            // Log the error and return a failed authentication result
            Logger.LogError(ex, "Token validation failed");
            return Task.FromResult(AuthenticateResult.Fail("Token validation failed"));
        }
    }
}
