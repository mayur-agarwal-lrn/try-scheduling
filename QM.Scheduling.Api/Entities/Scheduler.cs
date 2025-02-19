using System.ComponentModel.DataAnnotations;

namespace QM.Scheduling.Api.Entities;

public class Scheduler
{
    [Key]
    public string UserId { get; set; }
    public string Name { get; set; }
    public string Permissions { get; set; }
    public string RefreshToken { get; set; }
}