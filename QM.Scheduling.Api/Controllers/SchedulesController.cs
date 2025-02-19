using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using QM.Scheduling.Api.Entities;
using QM.Scheduling.Api.Infrastructure;
using QM.Scheduling.Api.Models;
using System.Reflection;

namespace QM.Scheduling.Api.Controllers;

[ApiController]
[Route("scheduling/{tenantId}/api/[controller]")]
public class SchedulesController(ScheduleDbContext context) : ControllerBase
{
    // Get all schedules - requires Schedule:Read permission
    [HttpGet]
    [Authorize(Policy = "ScheduleReadPolicy")]
    public ActionResult<IEnumerable<Schedule>> GetAll()
    {
        return Ok(context.Schedules.ToList());
    }

    // Get a specific schedule by ID - requires Schedule:Read permission
    [HttpGet("{id}")]
    [Authorize(Policy = "ScheduleReadPolicy")]
    public ActionResult<Schedule> Get(int id)
    {
        var schedule = context.Schedules.Find(id);
        if (schedule == null)
        {
            return NotFound();
        }
        return Ok(schedule);
    }

    // Create a new schedule - requires Schedule:Create permission
    [HttpPost]
    [Authorize(Policy = "ScheduleAllPolicy")]
    public ActionResult<Schedule> CreateSchedule([FromBody] CreateScheduleRequest newSchedule)
    {
        var schedule = new Schedule
        {
            ExamName = newSchedule.ExamName,
            Date = newSchedule.Date,
            Location = newSchedule.Location,
            Active = newSchedule.Active
        };

        context.Schedules.Add(schedule);
        context.SaveChanges();

        var tenantId = User.FindFirst("tenantId")?.Value;
        return CreatedAtAction(nameof(Get), new { id = schedule.Id, tenantId }, schedule);
    }

    // Delete a schedule by ID - requires Schedule:Delete permission
    [HttpDelete("{id}")]
    [Authorize(Policy = "ScheduleAllPolicy")]
    public ActionResult Delete(int id)
    {
        var schedule = context.Schedules.Find(id);
        if (schedule == null)
        {
            return NotFound();
        }

        context.Schedules.Remove(schedule);
        context.SaveChanges();
        return NoContent();
    }

    // Update a schedule by ID - requires Schedule:Update permission
    [HttpPatch("{id}")]
    [Authorize(Policy = "ScheduleAllPolicy")]
    public ActionResult UpdateSchedule(int id, [FromBody] ScheduleUpdateRequest updateRequest)
    {
        var schedule = context.Schedules.Find(id);
        if (schedule == null)
        {
            return NotFound();
        }

        var properties = typeof(ScheduleUpdateRequest).GetProperties(BindingFlags.Public | BindingFlags.Instance);
        foreach (var property in properties)
        {
            var value = property.GetValue(updateRequest);
            if (value == null)
                continue;

            var scheduleProperty = schedule.GetType().GetProperty(property.Name, BindingFlags.IgnoreCase | BindingFlags.Public | BindingFlags.Instance);
            if (scheduleProperty != null && scheduleProperty.CanWrite)
            {
                scheduleProperty.SetValue(schedule, value);
            }
        }

        context.SaveChanges();
        return NoContent();
    }
}