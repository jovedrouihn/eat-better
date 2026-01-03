using FormCMS;
using FormCMS.Auth.Models;
using FormCMS.Cms.Workers;
using FormCMS.Core.Auth;
using FormCMS.Infrastructure.Fts;
using FormCMS.Search.Workers;
using FormCMS.Subscriptions;
using FormCMS.Utils.ResultExt;
using FormCMS.Video.Workers;
using GraphQL.Utilities.Visitors;
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

var connectionString = builder.Configuration.GetConnectionString("DefaultConnection") ?? "Data Source=cms.db";
builder.Services.AddSqliteCms(connectionString, x =>
{
     x.RouteOptions.PageBaseUrl = "/page";
    x.MapCmsHomePage = false;
});

builder.Services.AddDbContext<AppDbContext>(options => options.UseSqlite(connectionString));
builder.Services.AddCmsAuth<CmsUser, IdentityRole, AppDbContext>(new AuthConfig(KeyAuthConfig: new KeyAuthConfig("apikey")));
builder.Services.AddAuditLog();

var app = builder.Build();

//ensure identity tables are created
using var scope = app.Services.CreateScope();
var ctx = scope.ServiceProvider.GetRequiredService<AppDbContext>();
await ctx.Database.EnsureCreatedAsync();

//add two default admin users
await app.EnsureCmsUser("sadmin@cms.com", "Admin1!", [Roles.Sa]).Ok();
await app.EnsureCmsUser("admin@cms.com", "Admin1!", [Roles.Admin]).Ok();

//use cms' CRUD 
await app.UseCmsAsync();
app.UseCors("AllowFrontend");

app.MapWhen(context => 
        !context.Request.Path.StartsWithSegments("/_content") &&
        !context.Request.Path.StartsWithSegments("/api"),
    subApp =>
    {
        subApp.UseRouting();
        subApp.UseEndpoints(endpoints =>
        {
            endpoints.MapFallbackToFile("/", $"index.html");
            endpoints.MapFallbackToFile("/{*path:nonfile}", $"index.html");
        });
    }); 

app.Run();
