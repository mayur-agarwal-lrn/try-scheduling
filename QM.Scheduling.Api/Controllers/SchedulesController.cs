using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using QM.Scheduling.Api.Models;
using System.Reflection;

namespace QM.Scheduling.Api.Controllers;

[ApiController]
[Route("scheduling/{tenantId}/api/[controller]")]
public class SchedulesController : ControllerBase
{
    // In-memory list of schedules
    private static readonly List<Schedule> Schedules =
    [
        new Schedule { Id = 1, ExamName = "Math Exam", Date = DateTime.Now.AddDays(1), Location = "Room 101", Active = true},
        new Schedule { Id = 2, ExamName = "Science Exam", Date = DateTime.Now.AddDays(2), Location = "Room 202" },
        new Schedule { Id = 3, ExamName = "History Exam", Date = DateTime.Now.AddDays(3), Location = "Room 303", Active = true }
    ];

    // Get all schedules - requires Schedule:Read permission
    [HttpGet]
    [Authorize(Policy = "ScheduleReadPolicy")]
    public ActionResult<IEnumerable<Schedule>> GetAll()
    {
        return Ok(Schedules);
    }

    // Get a specific schedule by ID - requires Schedule:Read permission
    [HttpGet("{id}")]
    [Authorize(Policy = "ScheduleReadPolicy")]
    public ActionResult<Schedule> Get(int id)
    {
        // Find the schedule by ID
        var schedule = Schedules.FirstOrDefault(s => s.Id == id);
        if (schedule == null)
        {
            // Return 404 if not found
            return NotFound();
        }

        // Return the found schedule
        return Ok(schedule);
    }

    // Create a new schedule - requires Schedule:Create permission
    [HttpPost]
    [Authorize(Policy = "ScheduleAllPolicy")]
    public ActionResult<Schedule> CreateSchedule([FromBody] CreateScheduleRequest newSchedule)
    {
        // Generate a new ID for the schedule
        var newId = Schedules.Max(s => s.Id) + 1;
        var schedule = new Schedule
        {
            Id = newId,
            ExamName = newSchedule.ExamName,
            Date = newSchedule.Date,
            Location = newSchedule.Location,
            Active = newSchedule.Active
        };

        // Add the new schedule to the list
        Schedules.Add(schedule);

        // Retrieve the tenant ID from the user's claims
        var tenantId = User.FindFirst("tenantId")?.Value;

        // Return the created schedule with a 201 status code
        return CreatedAtAction(nameof(Get), new { id = schedule.Id, tenantId }, schedule);
    }

    // Delete a schedule by ID - requires Schedule:Delete permission
    [HttpDelete("{id}")]
    [Authorize(Policy = "ScheduleAllPolicy")]
    public ActionResult Delete(int id)
    {
        // Find the schedule by ID
        var schedule = Schedules.FirstOrDefault(s => s.Id == id);
        if (schedule == null)
        {
            // Return 404 if not found
            return NotFound();
        }

        // Remove the schedule from the list
        Schedules.Remove(schedule);
        return NoContent();
    }

    // Update a schedule by ID - requires Schedule:Update permission
    [HttpPatch("{id}")]
    [Authorize(Policy = "ScheduleAllPolicy")]
    public ActionResult UpdateSchedule(int id, [FromBody] ScheduleUpdateRequest updateRequest)
    {
        // Find the schedule by ID
        var schedule = Schedules.FirstOrDefault(s => s.Id == id);
        if (schedule == null)
        {
            // Return 404 if not found
            return NotFound();
        }

        // Use reflection to update the schedule properties with the provided values
        var properties = typeof(ScheduleUpdateRequest).GetProperties(BindingFlags.Public | BindingFlags.Instance);
        foreach (var property in properties)
        {
            var value = property.GetValue(updateRequest);
            if (value == null)
                continue;

            // Find the corresponding property in the Schedule class and update its value
            var scheduleProperty = schedule.GetType().GetProperty(property.Name, BindingFlags.IgnoreCase | BindingFlags.Public | BindingFlags.Instance);
            if (scheduleProperty != null && scheduleProperty.CanWrite)
            {
                scheduleProperty.SetValue(schedule, value);
            }
        }

        return NoContent();
    }
}