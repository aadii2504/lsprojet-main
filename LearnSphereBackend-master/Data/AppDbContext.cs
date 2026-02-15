using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Storage.ValueConversion;
using MyProject.Api.Models;

namespace MyProject.Api.Data;

public class AppDbContext : DbContext
{
	public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }

	public DbSet<User> Users => Set<User>();
	public DbSet<Student> Students => Set<Student>();
	public DbSet<Course> Courses => Set<Course>();
	public DbSet<Enrollment> Enrollments => Set<Enrollment>();

	protected override void OnModelCreating(ModelBuilder modelBuilder)
	{
		// Unique Email
		modelBuilder.Entity<User>()
			.HasIndex(u => u.Email)
			.IsUnique();

		// 1-1 relation: User <-> Student
		modelBuilder.Entity<User>()
			.HasOne(u => u.StudentProfile)
			.WithOne(s => s.User!)
			.HasForeignKey<Student>(s => s.UserId);

		// 1-N relation: Student <-> Enrollment
		modelBuilder.Entity<Student>()
			.HasMany(s => s.Enrollments)
			.WithOne(e => e.Student!)
			.HasForeignKey(e => e.StudentId)
			.OnDelete(DeleteBehavior.Cascade);

		// 1-N relation: Course <-> Enrollment
		modelBuilder.Entity<Course>()
			.HasMany(c => c.Enrollments)
			.WithOne(e => e.Course!)
			.HasForeignKey(e => e.CourseId)
			.OnDelete(DeleteBehavior.Cascade);

		// Unique constraint: one enrollment per student per course
		modelBuilder.Entity<Enrollment>()
			.HasIndex(e => new { e.StudentId, e.CourseId })
			.IsUnique();

		// DateOnly conversion for SQL Server
		var converter = new ValueConverter<DateOnly?, DateTime?>(
			d => d.HasValue ? d.Value.ToDateTime(TimeOnly.MinValue) : null,
			d => d.HasValue ? DateOnly.FromDateTime(d.Value) : null
		);

		modelBuilder.Entity<Student>()
			.Property(s => s.DateOfBirth)
			.HasConversion(converter);

		base.OnModelCreating(modelBuilder);
	}
}