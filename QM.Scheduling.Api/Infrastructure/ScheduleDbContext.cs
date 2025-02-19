using Microsoft.EntityFrameworkCore;
using QM.Scheduling.Api.Entities;

namespace QM.Scheduling.Api.Infrastructure;

public class ScheduleDbContext(DbContextOptions<ScheduleDbContext> options) : DbContext(options)
{
    public DbSet<Schedule> Schedules { get; set; }
}