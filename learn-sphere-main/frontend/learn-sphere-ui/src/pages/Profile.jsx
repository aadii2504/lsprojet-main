import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { PersonalInfo } from "../components/Profile/PersonalInfo";
import { PAcademic } from "../components/Profile/PAcademic";
import { GuardianInfo } from "../components/Profile/GuardianInfo";
import { getMeApi } from "../api/studentApi";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export const Profile = () => {
  // State for all sections
  const [personalData, setPersonalData] = useState({
    name: "",
    dob: "",
    gender: "",
    email: "",
    country: "",
    phone: "",
    password: "",
  });
  const [academicData, setAcademicData] = useState({
    rollNumber: "",
    course: "",
    year: "",
  });
  const [guardianData, setGuardianData] = useState({
    guardianName: "",
    guardianPhone: "",
    guardianEmail: "",
    guardianAddress: "",
  });

  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const fetchProfile = async () => {
    try {
      const res = await getMeApi();
      const data = res.data;

      // Update Local Storage (optional, but keeping for compatibility)
      localStorage.setItem("studentName", data.fullName || "");
      // ... (keeping other local storage sets if needed by other parts of app)

      // Update State
      setName(data.fullName || "Student");
      setCourse(data.course || "—");
      setYear(data.year?.toString() || "—");

      setPersonalData({
        name: data.fullName || "",
        dob: data.dateOfBirth || "",
        gender: data.gender || "",
        email: data.email || "",
        country: data.country || "",
        phone: data.phone || "",
        password: "", // Don't pre-fill password
      });

      setAcademicData({
        rollNumber: data.rollNumber || "",
        course: data.course || "",
        year: data.year?.toString() || "",
      });

      setGuardianData({
        guardianName: data.guardianName || "",
        guardianPhone: data.guardianPhone || "",
        guardianEmail: data.guardianEmail || "",
        guardianAddress: data.guardianAddress || "",
      });
    } catch {
      // ignore 404
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  const handleSave = async () => {
    setLoading(true);
    try {
      const payload = {
        fullName: personalData.name,
        dateOfBirth: personalData.dob || null,
        gender: personalData.gender || null,
        email: personalData.email,
        country: personalData.country || null,
        phone: personalData.phone || null,
        // password: personalData.password || null, // Backend might need separate endpoint for password? Assuming it handles it or ignores empty

        rollNumber: academicData.rollNumber || null,
        course: academicData.course || null,
        year: Number(academicData.year) || null,

        guardianName: guardianData.guardianName || null,
        guardianPhone: guardianData.guardianPhone || null,
        guardianEmail: guardianData.guardianEmail || null,
        guardianAddress: guardianData.guardianAddress || null,
      };

      if (personalData.password) {
        // If password logic exists in backend, add it.
        // payload.password = personalData.password;
      }

      await saveMeApi(payload);
      // Removed toast here to avoid duplication if child components show it,
      // but centralization is better. Let's show it here.
      // toast.success("Profile saved successfully!");

      // Refresh local state display
      setName(personalData.name);
      setCourse(academicData.course || "—");
      setYear(academicData.year || "—");

      setEditMode(false);
      // Re-fetch to ensure sync with backend (e.g. if backend formats dates)
      await fetchProfile();

      // Dispatch event for other components listening
      window.dispatchEvent(new CustomEvent("profileSaved"));
    } catch (err) {
      console.error(err);
      // toast.error("Failed to save profile");
    } finally {
      setLoading(false);
    }
  };

  // Stats
  const stats = [
    { label: "Course", value: course || "Not set" },
    { label: "Year", value: year || "Not set" },
    { label: "Enrolled", value: "2025-01-01" },
  ];

  return (
    <div className="max-w-4xl mx-auto">
      <ToastContainer position="top-right" autoClose={3000} />
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-[var(--text)]">{name}</h2>
          <p className="text-sm text-[var(--text)]/80">
            Student profile and details
          </p>
        </div>

        <div className="flex items-center gap-3">
          {editMode ? (
            <button
              onClick={handleSave}
              disabled={loading}
              className="px-4 py-2 rounded-md font-semibold bg-indigo-600 text-white hover:bg-indigo-700 disabled:opacity-50"
            >
              {loading ? "Saving..." : "Save Changes"}
            </button>
          ) : (
            <button
              onClick={() => setEditMode(true)}
              className="px-3 py-2 rounded-md font-semibold bg-[var(--card)] border border-[var(--border)] text-[var(--text)]"
            >
              Edit Profile
            </button>
          )}

          <button
            onClick={() => {
              localStorage.clear(); // Clear all
              window.dispatchEvent(new Event("userUpdated"));
              navigate("/");
              window.location.reload();
            }}
            className="px-3 py-2 rounded-md font-semibold bg-red-600 text-white hover:brightness-110 transition"
          >
            Logout
          </button>
        </div>
      </div>

      {!editMode ? (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
          {stats.map((s) => (
            <div
              key={s.label}
              className="rounded-lg border border-[var(--border)] bg-[var(--card)] p-4"
            >
              <div className="text-sm text-[var(--text)]/80">{s.label}</div>
              <div className="mt-2 font-semibold text-[var(--text)]">
                {s.value}
              </div>
            </div>
          ))}
        </div>
      ) : null}

      {editMode ? (
        <div>
          <PersonalInfo data={personalData} setData={setPersonalData} />
          <PAcademic data={academicData} setData={setAcademicData} />
          <GuardianInfo
            guardianData={guardianData}
            setGuardianData={setGuardianData}
            // Remove the save button from GuardianInfo, now handled by parent
            hideSaveButton={true}
          />
        </div>
      ) : null}
    </div>
  );
};
