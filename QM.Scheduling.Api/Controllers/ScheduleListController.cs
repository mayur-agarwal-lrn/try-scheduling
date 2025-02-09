using Microsoft.AspNetCore.Mvc;

namespace QM.Scheduling.Api.Controllers;

[ApiController]
[Route("[controller]")]
public class ScheduleListController : ControllerBase
{
    [HttpGet]
    public ActionResult<IEnumerable<Schedule>> Get()
    {
        var schedules = new List<Schedule>
        {
            new Schedule { Id = 1, ExamName = "Math Exam", Date = DateTime.Now.AddDays(1), Location = "Room 101" },
            new Schedule { Id = 2, ExamName = "Science Exam", Date = DateTime.Now.AddDays(2), Location = "Room 202" },
            new Schedule { Id = 3, ExamName = "History Exam", Date = DateTime.Now.AddDays(3), Location = "Room 303" }
        };

        return Ok(schedules);
    }
}