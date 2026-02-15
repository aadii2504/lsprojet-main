import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { getAllCourses } from "../components/admin/CourseApi";

const LandingPage = () => {
  const [courses, setCourses] = useState([]);

  useEffect(() => {
    const loadCourses = async () => {
      const data = await getAllCourses();
      setCourses(data || []);
    };
    loadCourses();
  }, []);
  return (
    <div>
      {/* Hero */}
      <section className="px-4 pt-16 pb-10 text-center">
        <div className="mx-auto max-w-4xl">
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold leading-tight tracking-tight">
            <span className="bg-gradient-to-r from-blue-400 to-indigo-300 bg-clip-text text-transparent">
              LearnSphere
            </span>
            , because{" "}
            <span className="bg-gradient-to-r from-blue-400 to-indigo-300 bg-clip-text text-transparent">
              Curves
            </span>{" "}
            ain’t enough!
          </h1>

          <p className="mt-4 max-w-2xl mx-auto text-lg text-[var(--text)]/80">
            A beginner-friendly platform for mastering programming skills.
          </p>

          <div className="mt-6 flex items-center justify-center gap-3">
            <Link
              to="/register"
              className="px-4 py-2.5 rounded-lg font-semibold text-white bg-gradient-to-tr from-indigo-600 to-blue-500 shadow-lg hover:shadow-xl transition"
            >
              Explore Courses
            </Link>
          </div>
        </div>
      </section>

      {/* Auto‑sliding carousel (like the screenshot) */}
      <section className="mx-auto max-w-7xl px-4 pb-8">
        <div className="overflow-hidden hide-scrollbar">
          {/* Duplicate items so the track can scroll continuously */}
          <div className="marquee flex gap-4">
            {courses.length > 0 ? (
              [...courses, ...courses].map((course, idx) => (
                <div
                  key={idx}
                  className="min-w-[280px] sm:min-w-[320px] rounded-xl border border-[var(--border)] bg-[var(--card)] shadow-xl overflow-hidden"
                >
                  <div
                    className="h-40 w-full bg-center bg-cover"
                    style={{
                      backgroundImage: `url('${course.thumbnail || "/assets/placeholder.jpg"}')`,
                    }}
                  />
                  <div className="p-4">
                    <h3 className="text-sm font-bold">{course.title}</h3>
                    {course.summary && (
                      <p className="mt-2 text-sm text-[var(--text)]/80">{course.summary}</p>
                    )}
                    <p className="mt-2 text-xs text-[var(--text)]/60">{course.level}</p>
                  </div>
                </div>
              ))
            ) : (
              <div className="min-w-full text-center py-8 text-[var(--text)]/60">
                Loading courses...
              </div>
            )}
          </div>
        </div>
      </section>
    </div>
  );
};

export default LandingPage;
