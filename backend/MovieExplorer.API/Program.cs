using MovieExplorer.API.Services;
using Microsoft.OpenApi.Models;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();

// Configure Swagger
builder.Services.AddSwaggerGen(c =>
{
    c.SwaggerDoc("v1", new OpenApiInfo
    {
        Title = "Movie Explorer API",
        Version = "v1",
        Description = "API para explorar filmes usando TMDB API",
        Contact = new OpenApiContact
        {
            Name = "Movie Explorer Team",
            Email = "dev@movieexplorer.com"
        }
    });
});

// Configure HttpClient
builder.Services.AddHttpClient<IMovieService, TMDbService>();

// Add CORS
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowAngular", policy =>
    {
        policy.WithOrigins("http://localhost:4200", "https://localhost:4200")
              .AllowAnyHeader()
              .AllowAnyMethod()
              .AllowCredentials();
    });
});

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI(c =>
    {
        c.SwaggerEndpoint("/swagger/v1/swagger.json", "Movie Explorer API v1");
        c.RoutePrefix = "swagger"; // Isso faz o Swagger abrir em /swagger
    });
}

app.UseCors("AllowAngular");
app.UseHttpsRedirection();
app.UseAuthorization();
app.MapControllers();

app.Run();