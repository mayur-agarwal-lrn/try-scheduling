using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.IdentityModel.Tokens;
using QM.Scheduling.Api.Entities;
using QM.Scheduling.Api.Infrastructure;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;

namespace QM.Scheduling.Api.Controllers;

// This controller handles authentication-related actions, specifically refreshing JWT tokens.
// It includes a fake endpoint to mock how to refresh a token. In a real scenario,
// we would use a dedicated authentication microservice (or Portal or Lobby) for getting a new token.
[ApiController]
[Route("scheduling/{tenantId}/api/[controller]")]
public class AuthController(SchedulerDbContext context, IConfiguration configuration) : ControllerBase
{
    // Endpoint to refresh JWT token
    [HttpGet("token")]
    [AllowAnonymous]
    public IActionResult RefreshToken(string tenantId, string refreshToken)
    {
        // Find the scheduler with the provided refresh token
        var scheduler = context.Schedulers.FirstOrDefault(s => s.RefreshToken == refreshToken);
        if (scheduler == null)
        {
            // Return 404 if the refresh token is invalid
            return NotFound("Invalid refresh token.");
        }

        // Generate a new JWT token for this person
        var token = GenerateJwtToken(tenantId, scheduler);

        // Return the new token in the response
        return Ok(new { token });
    }

    // Method to generate a new JWT token
    private string GenerateJwtToken(string tenantId, Scheduler scheduler)
    {
        // Define the claims to be included in the token
        var claims = new List<Claim>
        {
            new Claim(JwtRegisteredClaimNames.Sub, scheduler.UserId),
            new Claim(JwtRegisteredClaimNames.Name, scheduler.Name),
            new Claim("tenantId", tenantId) // TenantId from route {tenantId} is saved in this variable by asp.net
        };

        // Add individual permission claims
        var permissions = scheduler.Permissions.Split(',');
        claims.AddRange(permissions.Select(permission => new Claim("permission", permission)));

        // Create a security key using the secret key from configuration
        var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(configuration["Jwt:Key"]));
        // Define the signing credentials using the security key and HMAC SHA256 algorithm
        var credentials = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

        // Create the JWT token with the specified issuer, audience, claims, expiration time, and signing credentials
        var token = new JwtSecurityToken(
            issuer: configuration["Jwt:Issuer"],
            audience: configuration["Jwt:Audience"],
            claims: claims,
            expires: DateTime.UtcNow.AddMinutes(1),
            signingCredentials: credentials);

        // Return the serialized JWT token
        return new JwtSecurityTokenHandler().WriteToken(token);
    }
}
