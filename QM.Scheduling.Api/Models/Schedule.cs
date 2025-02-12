namespace QM.Scheduling.Api.Models;

public class Schedule
{
    public int Id { get; set; }
    public string ExamName { get; set; }
    public DateTime Date { get; set; }
    public string Location { get; set; }
    public bool Active { get; set; }
}