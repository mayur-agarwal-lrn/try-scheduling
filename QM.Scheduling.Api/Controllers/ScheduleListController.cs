using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace QM.Scheduling.Api.Controllers;

[ApiController]
[Route("scheduling/{tenantId}/api/[controller]")]
public class ScheduleListController : ControllerBase
{
    // This action requires the Schedule:Read permission
    [HttpGet]
    [Authorize(Policy = "ScheduleReadPolicy")]
    public ActionResult<IEnumerable<Schedule>> Get()
    {
        var tenantId = User.FindFirst("tenantId")?.Value;

        // Use tenantId as needed
        var schedules = new List<Schedule>
        {
            new Schedule { Id = 1, ExamName = "Math Exam", Date = DateTime.Now.AddDays(1), Location = "Room 101" },
            new Schedule { Id = 2, ExamName = "Science Exam", Date = DateTime.Now.AddDays(2), Location = "Room 202" },
            new Schedule { Id = 3, ExamName = "History Exam", Date = DateTime.Now.AddDays(3), Location = "Room 303" },
            new Schedule { Id = 4, ExamName = tenantId, Date = DateTime.Now.AddDays(4), Location = tenantId }
        };

        return Ok(schedules);
    }
}