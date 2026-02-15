import { useState, useEffect } from "react";
import { InputField } from "../registration/InputField";

export const PersonalInfo = ({ data, setData }) => {
  const handleChange = (e) => {
    const { name, value } = e.target;
    setData((prev) => ({ ...prev, [name]: value }));
  };

  const fieldClass =
    "w-full rounded-md px-3 py-2 mb-3 bg-[var(--card)] border border-[var(--border)] text-[var(--text)]";

  return (
    <section className="mb-8 max-w-3xl">
      <div className="rounded-lg border border-[var(--border)] bg-[var(--card)] p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-lg font-semibold text-[var(--text)]">
              Personal Information
            </h3>
            <p className="text-sm text-[var(--text)]/80">
              Changes saved automatically
            </p>
          </div>
        </div>

        <input
          name="name"
          type="text"
          placeholder="Full Name"
          value={data.name}
          onChange={handleChange}
          className={fieldClass}
        />

        <input
          name="dob"
          type="date"
          value={data.dob}
          onChange={handleChange}
          className={fieldClass}
        />

        <select
          name="gender"
          value={data.gender}
          onChange={handleChange}
          className={fieldClass}
        >
          <option value="">Select Gender</option>
          <option>Male</option>
          <option>Female</option>
          <option>Other</option>
        </select>

        <input
          name="email"
          type="email"
          placeholder="Email"
          value={data.email}
          onChange={handleChange}
          className={fieldClass}
        />

        <select
          name="country"
          value={data.country}
          onChange={handleChange}
          className={fieldClass}
        >
          <option value="">Select Country</option>
          <option>India</option>
          <option>USA</option>
          <option>UK</option>
          <option>Canada</option>
        </select>

        <input
          name="phone"
          type="tel"
          placeholder="Phone (10 digits)"
          value={data.phone}
          onChange={handleChange}
          className={fieldClass}
        />

        <InputField
          label="Password"
          name="password"
          type="password"
          value={data.password}
          onChange={handleChange}
          placeholder="Password (min 8 characters)"
          className={fieldClass}
        />
      </div>
    </section>
  );
};
