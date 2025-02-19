using QM.Scheduling.Api.Entities;

namespace QM.Scheduling.Api.Infrastructure;

public class DatabaseInitializer(ScheduleDbContext scheduleContext, SchedulerDbContext schedulerContext)
{
    public void SeedDatabases()
    {
        SeedScheduleDatabase();
        SeedSchedulerDatabase();
    }

    private void SeedScheduleDatabase()
    {
        if (scheduleContext.Schedules.Any()) return;

        // Seed the Schedule database with some initial fake schedule data
        scheduleContext.Schedules.AddRange(
            new Schedule { ExamName = "Math Exam", Date = DateTime.Now.AddDays(1), Location = "Small Room 1", Active = true },
            new Schedule { ExamName = "Science Exam", Date = DateTime.Now.AddDays(2), Location = "Room 202" },
            new Schedule { ExamName = "History Exam", Date = DateTime.Now.AddDays(3), Location = "Big Room 3", Active = true }
        );
        scheduleContext.SaveChanges();
    }

    private void SeedSchedulerDatabase()
    {
        if (schedulerContext.Schedulers.Any()) return;

        // Seed the Scheduler database with some initial fake user data
        schedulerContext.Schedulers.AddRange(
            new Scheduler { UserId = "12345", Name = "John Doe", Permissions = "schedule:read,schedule:create,schedule:update,schedule:delete", RefreshToken = "VeryLongRefreshToken-123" },
            new Scheduler { UserId = "67890", Name = "Jane Smith", Permissions = "schedule:read", RefreshToken = "VeryLongRefreshToken-456" }
        );
        schedulerContext.SaveChanges();
    }
}