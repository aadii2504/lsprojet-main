import { http } from "./http";

const BASE_URL = "/api/courses";

export const courseApi = {
  // Fetch all courses (public)
  getAll: async () => {
    try {
      const res = await http.get(BASE_URL);
      return res.data;
    } catch (e) {
      console.error("Failed to fetch courses", e);
      throw e;
    }
  },

  // Fetch single course by ID (public)
  getById: async (id) => {
    try {
      const res = await http.get(`${BASE_URL}/${id}`);
      return res.data;
    } catch (e) {
      console.error(`Failed to fetch course ${id}`, e);
      throw e;
    }
  },

  // Create course (admin/instructor only)
  // Validates: title, slug, summary (required)
  // Returns 201 Created or throws error (403 if not admin, 400 if validation fails)
  create: async (payload) => {
    // Client-side validation
    if (!payload.title || !payload.title.trim()) {
      throw new Error("Title is required");
    }
    if (!payload.slug || !payload.slug.trim()) {
      throw new Error("Slug is required");
    }
    if (!payload.summary || !payload.summary.trim()) {
      throw new Error("Summary is required");
    }

    try {
      const res = await http.post(BASE_URL, payload);
      return res.data;
    } catch (err) {
      // Handle specific error responses from backend
      if (err.response?.status === 403) {
        throw new Error("You must be an admin to create courses");
      }
      if (err.response?.status === 400) {
        throw new Error(err.response.data?.error || "Invalid course data");
      }
      if (err.response?.status === 401) {
        throw new Error("Unauthorized. Please login as admin.");
      }
      throw new Error(err.response?.data?.error || "Failed to create course");
    }
  },

  // Update course (admin only)
  update: async (id, payload) => {
    try {
      const res = await http.put(`${BASE_URL}/${id}`, payload);
      return res.data;
    } catch (err) {
      if (err.response?.status === 403) {
        throw new Error("Only admins can update courses");
      }
      if (err.response?.status === 404) {
        throw new Error("Course not found");
      }
      throw new Error(err.response?.data?.error || "Failed to update course");
    }
  },

  // Delete course (admin only)
  delete: async (id) => {
    try {
      await http.delete(`${BASE_URL}/${id}`);
      return true;
    } catch (err) {
      if (err.response?.status === 403) {
        throw new Error("Only admins can delete courses");
      }
      if (err.response?.status === 404) {
        throw new Error("Course not found");
      }
      throw new Error(err.response?.data?.error || "Failed to delete course");
    }
  },
};
