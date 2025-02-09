using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace QM.Scheduling.Api.Controllers;

// Example controller to test authentication
[ApiController]
[Route("[controller]")]
public class ExampleController : ControllerBase
{
    // This action allows anonymous access
    [HttpGet]
    [AllowAnonymous]
    public ActionResult<string> GetPublicData()
    {
        return "This is public data.";
    }

    // This action requires authentication
    [HttpGet("protected")]
    public ActionResult<string> GetProtectedData()
    {
        return "This is protected data.";
    }
}
