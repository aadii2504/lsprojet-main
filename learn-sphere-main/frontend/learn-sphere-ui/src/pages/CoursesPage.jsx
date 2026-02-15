import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { getAllCourses } from "../components/admin/CourseApi";

const CoursesPage = () => {
  const location = useLocation();
  const [courses, setCourses] = useState([]);

  useEffect(() => {
    const loadCourses = async () => {
      const data = await getAllCourses();
      setCourses(data || []);
    };
    loadCourses();
  }, []);

  if (!courses.length) {
    return <div className="p-6">No courses available.</div>;
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-6">
      <h1 className="text-2xl font-bold mb-6">All Courses</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {courses.map((course) => (
          <article
            key={course.id}
            className="rounded-xl border overflow-hidden group"
            style={{
              borderColor: "var(--border)",
              background: "var(--card)",
            }}
          >
            <div
              className="h-52 w-full bg-center bg-cover"
              style={{ backgroundImage: `url('${course.thumbnail || "/assets/placeholder.jpg"}')` }}
              aria-label={course.title}
            />
            <div className="p-4">
              <h4 className="text-sm font-bold">{course.title}</h4>
              <p className="mt-1 text-sm opacity-80">{course.level || "N/A"}</p>
              <p className="mt-1 text-sm opacity-70">
                {course.duration || "N/A"}
              </p>
              <div className="mt-3 flex items-center gap-2">
                <Link className="rounded-lg px-3 py-2 text-sm font-semibold text-white bg-gradient-to-tr from-indigo-600 to-blue-500 shadow hover:shadow-md transition">
                  Join Now
                </Link>
                <Link
                  to={`/course/${course.id}`}
                  className="rounded-lg px-3 py-2 text-sm font-semibold border transition"
                  style={{
                    borderColor: "var(--border)",
                    background: "var(--card)",
                    color: "var(--text)",
                  }}
                >
                  Details
                </Link>
              </div>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
};

export default CoursesPage;
