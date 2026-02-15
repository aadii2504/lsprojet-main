import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { loginApi } from "../api/authApi";
import { normalizeEmail } from "../components/registration/Validation";
import { InputField } from "../components/registration/InputField";

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState(""); 
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const onSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const normalized = normalizeEmail(email);

      const res = await loginApi({
        email: normalized,
        password: password,
      });

      const data = res.data; // { token, name, email, role }

      // ✅ store JWT
      localStorage.setItem("token", data.token);

      // ✅ store user for navbar/role checks
      localStorage.setItem(
        "learnsphere_user",
        JSON.stringify({ name: data.name, email: data.email, role: data.role })
      );

      // optional: keep your existing keys used in Profile UI
      localStorage.setItem("studentName", data.name);
      localStorage.setItem("studentEmail", data.email);

      window.dispatchEvent(new Event("userUpdated"));

      if (data.role === "admin") navigate("/admin");
      else navigate("/dashboard");
    } catch (err) {
      const msg =
        err?.response?.data ||
        err?.response?.data?.message ||
        "Invalid email or password";
      setError(typeof msg === "string" ? msg : "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-md px-4 py-10">
      <h2 className="text-2xl font-bold text-slate-100 mb-6">Login</h2>

      <form onSubmit={onSubmit} noValidate>
        <label className="block mb-2 text-sm">Email</label>
        <input
          className="w-full rounded-md px-3 py-2 mb-4 bg-[var(--card)] border border-[var(--border)]"
          type="email"
          value={email}
          placeholder="you@example.com"
          onChange={(e) => setEmail(e.target.value)}
          required
          autoComplete="email"
        />

        <InputField
          label="Password"
          name="password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          autoComplete="current-password"
        />

        {error && (
          <div className="text-sm text-red-400 mb-3">{error}</div>
        )}

        <button
          type="submit"
          className="w-full rounded-lg px-4 py-2.5 font-semibold text-white bg-gradient-to-tr from-indigo-600 to-blue-500 disabled:opacity-60"
          disabled={loading}
        >
          {loading ? "Checking..." : "Login"}
        </button>
      </form>
    </div>
  );
};

export default LoginPage;
