import React, { useState, useEffect } from "react";
import { useLocation, useParams } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { enrollCourse } from "../components/EnrollmentStore";
import { getCourseById } from "../components/admin/CourseApi";

const CourseDetailPage = () => {
  const { id } = useParams();
  const [course, setCourse] = useState(null);

  useEffect(() => {
    const loadCourse = async () => {
      const data = await getCourseById(id);
      setCourse(data);
    };
    loadCourse();
  }, [id]);

  if (!course) {
    return <div className="p-6">Course not found.</div>;
  }

  const handleEnroll = () => {
    enrollCourse({
      id: course.id,
      title: course.title,
      level: course.level || "N/A",
      lessons: course.lessons || 0,
      thumbnail: course.thumbnail || "/assets/placeholder.jpg",
    });

    toast.success("Successfully Enrolled", {
      position: "top-right",
      autoClose: 2500,
      closeOnClick: true,
      pauseOnHover: false,
      draggable: false,
      theme: "light",
    });
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-6">
      <ToastContainer position="top-right" autoClose={2500} theme="light" />
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Section */}
        <div className="lg:col-span-2">
          <h1 className="text-2xl font-bold mb-4">{course.title}</h1>
          <p className="text-sm opacity-80 mb-4">{course.level}</p>
          <p className="text-sm mb-6">
            {course.description || "No description available."}
          </p>

          <h2 className="text-lg font-semibold mb-2">What you'll learn</h2>
          <ul className="list-disc list-inside mb-6">
            {course.learningPoints?.map((point, index) => (
              <li key={index}>{point}</li>
            )) || <li>No learning points available.</li>}
          </ul>

          <h2 className="text-lg font-semibold mb-2">Requirements</h2>
          <ul className="list-disc list-inside mb-6">
            {course.requirements?.map((req, index) => (
              <li key={index}>{req}</li>
            )) || <li>No requirements specified.</li>}
          </ul>

          <h2 className="text-lg font-semibold mb-2">Description</h2>
          <p className="text-sm mb-6">
            Master backend development with Node.js by building real-world
            applications using PostgreSQL, Drizzle ORM, MongoDB, JWT, Docker,
            and more. This course takes you from JavaScript fundamentals to
            deploying production-grade applications, step-by-step.
          </p>
          <p className="text-sm mb-6">
            Whether you’re just getting started or want to level up your backend
            skills, this course is designed to give you a solid foundation and
            deep understanding of modern backend development practices.
          </p>
          <p className="text-sm mb-6">
            Start with Strong JavaScript Fundamentals. Before diving into
            Node.js, we revisit core JavaScript concepts that are essential for
            any backend developer. From variable scope, functions, closures, to
            async/await and event-driven programming, this foundation ensures
            you don’t just write code - you understand it.
          </p>
        </div>

        {/* Right Section */}
        <div className="bg-gray-100 p-4 rounded-lg shadow h-88">
          <div
            className="h-52 w-full bg-center bg-cover rounded-lg mb-4"
            style={{ backgroundImage: `url('${course.thumbnail}')` }}
            aria-label={course.title}
          />
          <p className="text-lg font-bold mb-4" style={{ color: "#4CAF50" }}>
            Price: $0
          </p>
          <button
            onClick={handleEnroll}
            className="w-full rounded-lg px-4 py-2 font-semibold text-white bg-gradient-to-tr from-indigo-600 to-blue-500 shadow hover:shadow-md transition"
          >
            Enroll Now
          </button>
        </div>
      </div>
    </div>
  );
};

export default CourseDetailPage;
