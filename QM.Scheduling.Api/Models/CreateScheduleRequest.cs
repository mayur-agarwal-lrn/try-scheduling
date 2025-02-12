namespace QM.Scheduling.Api.Models;

public class CreateScheduleRequest
{
    public string ExamName { get; set; }
    public DateTime Date { get; set; }
    public string Location { get; set; }
    public bool Active { get; set; }
}