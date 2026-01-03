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
using Microsoft.Extensions.FileProviders;

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
builder.Services.AddSqliteCms(connectionString, x =>
{
    x.MapCmsHomePage = false;
    x.KnownPaths = [.. x.KnownPaths, "vite.ico", "assets"];
});

builder.Services.AddDbContext<AppDbContext>(options => options.UseSqlite(connectionString));
builder.Services.AddCmsAuth<CmsUser, IdentityRole, AppDbContext>(new AuthConfig(KeyAuthConfig: new KeyAuthConfig("apikey")));
builder.Services.AddAuditLog();

var app = builder.Build();

// Configure static files for app subdirectory
var appPath = Path.Combine(app.Environment.WebRootPath, "app");
if (Directory.Exists(appPath))
{
    app.UseDefaultFiles(new DefaultFilesOptions
    {
        FileProvider = new PhysicalFileProvider(appPath),
        RequestPath = ""
    });

    app.UseStaticFiles(new StaticFileOptions
    {
        FileProvider = new PhysicalFileProvider(appPath),
        RequestPath = ""
    });
}

//use cms' CRUD 
await app.UseCmsAsync();

//ensure identity tables are created
using var scope = app.Services.CreateScope();
var ctx = scope.ServiceProvider.GetRequiredService<AppDbContext>();
await ctx.Database.EnsureCreatedAsync();

//add two default admin users
await app.EnsureCmsUser("sadmin@cms.com", "Admin1!", [Roles.Sa]).Ok();
await app.EnsureCmsUser("admin@cms.com", "Admin1!", [Roles.Admin]).Ok();

app.UseCors("AllowFrontend");

app.MapFallbackToFile("app/index.html");

app.Run();
