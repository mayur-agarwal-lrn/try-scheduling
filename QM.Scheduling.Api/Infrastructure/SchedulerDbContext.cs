using Microsoft.EntityFrameworkCore;
using QM.Scheduling.Api.Entities;

namespace QM.Scheduling.Api.Infrastructure;

public class SchedulerDbContext(DbContextOptions<SchedulerDbContext> options) : DbContext(options)
{
    public DbSet<Scheduler> Schedulers { get; set; }
}