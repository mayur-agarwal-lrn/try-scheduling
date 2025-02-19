namespace QM.Scheduling.Api.Entities;

public class Schedule
{
    public int Id { get; set; }
    public string ExamName { get; set; }
    public DateTime Date { get; set; }
    public string Location { get; set; }
    public bool Active { get; set; }
}