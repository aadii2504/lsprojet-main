using Microsoft.AspNetCore.Identity;
using MyProject.Api.Data;
using MyProject.Api.Models;

namespace MyProject.Api.Services;

public static class SeedDataService
{
    public static async Task SeedAdminUserAsync(IServiceProvider serviceProvider)
    {
        using var scope = serviceProvider.CreateScope();
        var db = scope.ServiceProvider.GetRequiredService<AppDbContext>();

        // Check if admin already exists
        if (db.Users.Any(u => u.Email == "admin@example.com"))
            return;

        var hasher = new PasswordHasher<User>();
        var adminUser = new User
        {
            Name = "Admin",
            Email = "admin@example.com",
            Role = "admin",
            Status = "active"
        };

        adminUser.PasswordHash = hasher.HashPassword(adminUser, "Instructor@123");

        db.Users.Add(adminUser);
        await db.SaveChangesAsync();
    }
}
