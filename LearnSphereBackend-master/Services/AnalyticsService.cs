using Microsoft.EntityFrameworkCore;
using MyProject.Api.Data;
using MyProject.Api.DTOs;
using MyProject.Api.Services.Interfaces;

namespace MyProject.Api.Services;

public class AnalyticsService : IAnalyticsService
{
    private readonly AppDbContext _db;

    public AnalyticsService(AppDbContext db)
    {
        _db = db;
    }

    public async Task<AnalyticsSummaryDto> GetSummaryStatsAsync(CancellationToken ct = default)
    {
        var totalCourses = await _db.Courses.CountAsync(ct);
        var totalStudents = await _db.Students.CountAsync(ct);
        
        // "Total Enrolled" - distinct students who have at least one enrollment
        var totalEnrolled = await _db.Enrollments
            .Select(e => e.StudentId)
            .Distinct()
            .CountAsync(ct);

        // "Passed" - Grade A or B
        var totalPassed = await _db.Enrollments
            .CountAsync(e => e.Grade == "A" || e.Grade == "B", ct);

        // "Failed" - Grade C or below (assuming C is failed based on frontend "Failed: Grade C")
        // Frontend comment says: "Subtitle: Grade C" for Failed box.
        var totalFailed = await _db.Enrollments
            .CountAsync(e => e.Grade == "C" || e.Grade == "D" || e.Grade == "F", ct);

        return new AnalyticsSummaryDto
        {
            TotalCourses = totalCourses,
            TotalEnrolled = totalEnrolled,
            TotalPassed = totalPassed,
            TotalFailed = totalFailed,
            TotalStudents = totalStudents
        };
    }

    public async Task<List<StudentPerformanceDto>> GetStudentPerformanceAsync(CancellationToken ct = default)
    {
        var data = await _db.Enrollments
            .Include(e => e.Student)
            .Include(e => e.Course)
            .Select(e => new StudentPerformanceDto
            {
                StudentId = e.StudentId,
                StudentName = e.Student != null ? e.Student.FullName : "Unknown",
                StudentEmail = e.Student != null ? e.Student.Email : "",
                CourseTitle = e.Course != null ? e.Course.Title : "Unknown",
                CourseId = e.CourseId,
                Grade = e.Grade,
                Score = e.Score,
                Status = e.Status,
                Compliance = e.Compliance,
                Attendance = e.Attendance,
                CoursesEnrolled = e.Student != null ? e.Student.Enrollments.Count : 0
            })
            .ToListAsync(ct);

        return data;
    }

    public async Task<List<CoursePerformanceDto>> GetCoursePerformanceAsync(CancellationToken ct = default)
    {
        var courses = await _db.Courses
            .Include(c => c.Enrollments)
            .ToListAsync(ct);

        var result = courses.Select(c => new CoursePerformanceDto
        {
            Id = c.Id,
            Title = c.Title,
            Type = c.Type,
            Categories = !string.IsNullOrEmpty(c.Categories) 
                ? c.Categories.Split(',', StringSplitOptions.RemoveEmptyEntries).Select(s => s.Trim()).ToList() 
                : new List<string>(),
            Enrolled = c.Enrollments.Count,
            Passed = c.Enrollments.Count(e => e.Grade == "A" || e.Grade == "B"),
            Failed = c.Enrollments.Count(e => e.Grade == "C" || e.Grade == "D" || e.Grade == "F"),
            AttendanceStats = new AttendanceStatsDto
            {
                Enrolled = c.Enrollments.Count,
                // Assuming "Attended" means students who have valid attendance data
                Attended = c.Enrollments.Count(e => !string.IsNullOrEmpty(e.Attendance) || e.AttendanceCount > 0)
            }
        }).ToList();

        return result;
    }
}
