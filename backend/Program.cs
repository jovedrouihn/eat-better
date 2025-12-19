using FormCMS;
using FormCMS.Auth.Models;
using FormCMS.Cms.Workers;
using FormCMS.Core.Auth;
using FormCMS.Infrastructure.Fts;
using FormCMS.Search.Workers;
using FormCMS.Subscriptions;
using FormCMS.Utils.ResultExt;
using FormCMS.Video.Workers;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;


var builder = WebApplication.CreateBuilder(args);

builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowFrontend",
        policy =>
        {
            policy.WithOrigins("http://localhost:5173") // Default Vite port
                  .AllowAnyHeader()
                  .AllowAnyMethod()
                  .AllowCredentials();
        });
});

builder.Services.AddOutputCache();

const string connectionString = "Data Source=cms.db";
builder.Services.AddSqliteCms(connectionString);

builder.Services.AddDbContext<AppDbContext>(options => options.UseSqlite(connectionString));
builder.Services.AddCmsAuth<CmsUser, IdentityRole, AppDbContext>(new AuthConfig(KeyAuthConfig:new KeyAuthConfig("apikey")));
builder.Services.AddAuditLog();



var app = builder.Build();
//ensure identity tables are created
using var scope = app.Services.CreateScope();
var ctx = scope.ServiceProvider.GetRequiredService<AppDbContext>();
await  ctx.Database.EnsureCreatedAsync();

//use cms' CRUD 
await app.UseCmsAsync();

//add two default admin users
await app.EnsureCmsUser("sadmin@cms.com", "Admin1!", [Roles.Sa]).Ok();
await app.EnsureCmsUser("admin@cms.com", "Admin1!", [Roles.Admin]).Ok();
await app.EnsureCmsUser("temp@cms.com", "Temp1!", ["Temp"]).Ok();

app.UseCors("AllowFrontend");

// app.MapGet("/", () => "Hello World!");

app.Run();


