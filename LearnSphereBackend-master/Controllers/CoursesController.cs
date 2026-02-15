using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using MyProject.Api.DTOs;
using MyProject.Api.Models;
using MyProject.Api.Repositories.Interfaces;

namespace MyProject.Api.Controllers;

[ApiController]
[Route("api/courses")]
public class CoursesController : ControllerBase
{
    private readonly ICourseRepository _repo;

    public CoursesController(ICourseRepository repo)
    {
        _repo = repo;
    }

    /// <summary>
    /// Get all courses (public)
    /// </summary>
    [HttpGet]
    [AllowAnonymous]
    public async Task<IActionResult> GetAll()
    {
        var courses = await _repo.GetAllAsync();
        var dtos = courses.Select(c => new CourseResponseDto
        {
            Id = c.Id,
            Title = c.Title,
            Slug = c.Slug,
            Summary = c.Summary,
            Description = c.Description,
            Thumbnail = c.Thumbnail,
            Categories = c.Categories,
            Duration = c.Duration,
            Level = c.Level,
            Price = c.Price,
            Students = c.Students,
            Status = c.Status,
            CreatedAt = c.CreatedAt,
            UpdatedAt = c.UpdatedAt
        });
        return Ok(dtos);
    }

    /// <summary>
    /// Get course by ID (public)
    /// </summary>
    [HttpGet("{id}")]
    [AllowAnonymous]
    public async Task<IActionResult> GetById(int id)
    {
        var course = await _repo.GetByIdAsync(id);
        if (course == null) return NotFound(new { error = "Course not found" });

        return Ok(new CourseResponseDto
        {
            Id = course.Id,
            Title = course.Title,
            Slug = course.Slug,
            Summary = course.Summary,
            Description = course.Description,
            Thumbnail = course.Thumbnail,
            Categories = course.Categories,
            Duration = course.Duration,
            Level = course.Level,
            Price = course.Price,
            Students = course.Students,
            Status = course.Status,
            CreatedAt = course.CreatedAt,
            UpdatedAt = course.UpdatedAt
        });
    }

    /// <summary>
    /// Create course (admin/instructor only)
    /// POST /api/v1/courses
    /// Returns 201 Created on success, 403 if not admin, 400 if validation fails
    /// </summary>
    [HttpPost]
    [Authorize]
    public async Task<IActionResult> Create([FromBody] CourseCreateRequestDto req)
    {
        // Validate: must have admin role
        if (!User.Identity?.IsAuthenticated ?? true)
            return StatusCode(401, new { error = "Unauthorized" });

        if (!User.IsInRole("admin"))
            return StatusCode(403, new { error = "Only admins can create courses" });

        // Validate required fields
        if (string.IsNullOrWhiteSpace(req.Title))
            return BadRequest(new { error = "Title is required" });
        if (string.IsNullOrWhiteSpace(req.Slug))
            return BadRequest(new { error = "Slug is required" });
        if (string.IsNullOrWhiteSpace(req.Summary))
            return BadRequest(new { error = "Summary is required" });

        try
        {
            var course = new Course
            {
                Title = req.Title,
                Slug = req.Slug,
                Summary = req.Summary,
                Description = req.Description,
                Thumbnail = req.Thumbnail,
                Categories = req.Categories,
                Duration = req.Duration,
                Level = req.Level,
                Price = req.Price,
                Status = req.Status,
                CreatedAt = DateTime.UtcNow,
                UpdatedAt = DateTime.UtcNow
            };

            var created = await _repo.AddAsync(course);
            var dto = new CourseResponseDto
            {
                Id = created.Id,
                Title = created.Title,
                Slug = created.Slug,
                Summary = created.Summary,
                Description = created.Description,
                Thumbnail = created.Thumbnail,
                Categories = created.Categories,
                Duration = created.Duration,
                Level = created.Level,
                Price = created.Price,
                Students = created.Students,
                Status = created.Status,
                CreatedAt = created.CreatedAt,
                UpdatedAt = created.UpdatedAt
            };

            return CreatedAtAction(nameof(GetById), new { id = created.Id }, dto);
        }
        catch (Exception ex)
        {
            return StatusCode(500, new { error = ex.Message });
        }
    }

    /// <summary>
    /// Update course (admin only)
    /// </summary>
    [HttpPut("{id}")]
    [Authorize]
    public async Task<IActionResult> Update(int id, [FromBody] CourseCreateRequestDto req)
    {
        if (!User.Identity?.IsAuthenticated ?? true)
            return StatusCode(401, new { error = "Unauthorized" });

        if (!User.IsInRole("admin"))
            return StatusCode(403, new { error = "Only admins can update courses" });

        var course = new Course
        {
            Title = req.Title,
            Slug = req.Slug,
            Summary = req.Summary,
            Description = req.Description,
            Thumbnail = req.Thumbnail,
            Categories = req.Categories,
            Duration = req.Duration,
            Level = req.Level,
            Price = req.Price,
            Status = req.Status
        };

        var updated = await _repo.UpdateAsync(id, course);
        if (updated == null) return NotFound(new { error = "Course not found" });

        return Ok(new CourseResponseDto
        {
            Id = updated.Id,
            Title = updated.Title,
            Slug = updated.Slug,
            Summary = updated.Summary,
            Description = updated.Description,
            Thumbnail = updated.Thumbnail,
            Categories = updated.Categories,
            Duration = updated.Duration,
            Level = updated.Level,
            Price = updated.Price,
            Students = updated.Students,
            Status = updated.Status,
            CreatedAt = updated.CreatedAt,
            UpdatedAt = updated.UpdatedAt
        });
    }

    /// <summary>
    /// Delete course (admin only)
    /// </summary>
    [HttpDelete("{id}")]
    [Authorize]
    public async Task<IActionResult> Delete(int id)
    {
        if (!User.Identity?.IsAuthenticated ?? true)
            return StatusCode(401, new { error = "Unauthorized" });

        if (!User.IsInRole("admin"))
            return StatusCode(403, new { error = "Only admins can delete courses" });

        var ok = await _repo.RemoveAsync(id);
        if (!ok) return NotFound(new { error = "Course not found" });

        return NoContent();
    }
}
