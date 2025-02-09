namespace QM.Scheduling.Api;

public class Program
{
    public static void Main(string[] args)
    {
        var builder = WebApplication.CreateBuilder(args);

        // Add services to the container.
        builder.Services.AddControllers();

        var app = builder.Build();

        // Configure the HTTP request pipeline.
        app.UseStaticFiles(); // Serve static files from wwwroot

        app.UseHttpsRedirection();
        app.UseAuthorization();
        app.MapControllers();

        if (app.Environment.IsDevelopment())
            app.MapFallbackToFile("index.html"); // Serve React app during development

        app.Run();
    }
}