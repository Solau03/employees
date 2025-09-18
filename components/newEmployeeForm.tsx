"use client";

import React, { useState } from "react";

type Props = { onCreated?: () => void };

type FormShape = {
  firstName: string;
  lastName: string;
  role: string;
  department: string;
  email: string;
  location: string;
  status: string;
  salaryBand: string;
  skills: string[];
  dateOfCreation: string;
  timeAtCompany: string;
  manager: string;
};

export default function NewEmployeeForm({ onCreated }: Props) {
  const [form, setForm] = useState<FormShape>({
    firstName: "",
    lastName: "",
    role: "",
    department: "",
    email: "",
    location: "",
    status: "Active",
    salaryBand: "Level 2",
    skills: [],
    dateOfCreation: new Date().toISOString().split('T')[0],
    timeAtCompany: "0 años 0 meses",
    manager: ""
  });

  const [years, setYears] = useState(0);
  const [months, setMonths] = useState(0);
  const [skillInput, setSkillInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  React.useEffect(() => {
    setForm(prev => ({
      ...prev,
      timeAtCompany: `${years} años ${months} meses`
    }));
  }, [years, months]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setForm((p) => ({ ...p, [name]: value }));
  };

  const addSkill = () => {
    const s = skillInput.trim();
    if (!s) return;
    if (form.skills.includes(s)) {
      setSkillInput("");
      return;
    }
    setForm((p) => ({ ...p, skills: [...p.skills, s] }));
    setSkillInput("");
  };

  const removeSkill = (s: string) => {
    setForm((p) => ({ ...p, skills: p.skills.filter((x) => x !== s) }));
  };

  const onSkillKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      addSkill();
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    if (!form.firstName || !form.lastName || !form.email) {
      setError("Nombre, apellido y email son obligatorios");
      setLoading(false);
      return;
    }

    try {
      const res = await fetch("/api/employees", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body?.error || "Error creando empleado");
      }

      setForm({
        firstName: "",
        lastName: "",
        role: "",
        department: "",
        email: "",
        location: "",
        status: "Active",
        salaryBand: "Level 2",
        skills: [],
        dateOfCreation: new Date().toISOString().split('T')[0],
        timeAtCompany: "0 años 0 meses",
        manager: ""
      });
      setYears(0);
      setMonths(0);
      setSkillInput("");

      if (onCreated) onCreated();
    } catch (err: any) {
      console.error(err);
      setError(err.message || "Error desconocido");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="border border-gray-200 rounded-xl p-6 shadow-lg bg-white max-w-3xl mx-auto"
    >
      <h3 className="text-xl font-bold text-gray-800 mb-6 pb-2 border-b border-gray-200">
        Nuevo Empleado
      </h3>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6 flex items-center">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
          </svg>
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Nombre *</label>
          <input
            name="firstName"
            value={form.firstName}
            onChange={handleChange}
            placeholder="Nombre"
            className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Apellido *</label>
          <input
            name="lastName"
            value={form.lastName}
            onChange={handleChange}
            placeholder="Apellido"
            className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Cargo</label>
          <input
            name="role"
            value={form.role}
            onChange={handleChange}
            placeholder="Cargo"
            className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Departamento</label>
          <input
            name="department"
            value={form.department}
            onChange={handleChange}
            placeholder="Departamento"
            className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Email *</label>
          <input
            name="email"
            type="email"
            value={form.email}
            onChange={handleChange}
            placeholder="Email"
            className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Ubicación</label>
          <input
            name="location"
            value={form.location}
            onChange={handleChange}
            placeholder="Ubicación"
            className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Manager</label>
          <input
            name="manager"
            value={form.manager}
            onChange={handleChange}
            placeholder="Nombre del manager"
            className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Fecha de Incorporación</label>
          <input
            name="dateOfCreation"
            type="date"
            value={form.dateOfCreation}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
          />
        </div>

        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-2">Tiempo en Compañía</label>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs text-gray-500 mb-1">Años</label>
              <select
                value={years}
                onChange={(e) => setYears(Number(e.target.value))}
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
              >
                {Array.from({ length: 31 }, (_, i) => i).map((year) => (
                  <option key={year} value={year}>
                    {year} años
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs text-gray-500 mb-1">Meses</label>
              <select
                value={months}
                onChange={(e) => setMonths(Number(e.target.value))}
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
              >
                {Array.from({ length: 12 }, (_, i) => i).map((month) => (
                  <option key={month} value={month}>
                    {month} meses
                  </option>
                ))}
              </select>
            </div>
          </div>
          <p className="text-xs text-gray-500 mt-2">
            Tiempo seleccionado: <span className="font-medium">{form.timeAtCompany}</span>
          </p>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Estado</label>
          <select
            name="status"
            value={form.status}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
          >
            <option value="Active">Active</option>
            <option value="On Leave">On Leave</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Banda Salarial</label>
          <select
            name="salaryBand"
            value={form.salaryBand}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
          >
            <option value="Level 1">Level 1</option>
            <option value="Level 2">Level 2</option>
            <option value="Level 3">Level 3</option>
            <option value="Senior">Senior</option>
          </select>
        </div>
      </div>

      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">Habilidades</label>
        <div className="flex gap-2">
          <input
            value={skillInput}
            onChange={(e) => setSkillInput(e.target.value)}
            onKeyDown={onSkillKeyDown}
            placeholder="Escribe una habilidad y presiona Enter o Añadir"
            className="flex-1 border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
          />
          <button
            type="button"
            onClick={addSkill}
            className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition font-medium"
          >
            Añadir
          </button>
        </div>

        <div className="flex flex-wrap gap-2 mt-3">
          {form.skills.map((s) => (
            <span
              key={s}
              className="bg-blue-50 text-blue-700 border border-blue-200 px-3 py-1 rounded-full text-sm flex items-center gap-1 transition"
            >
              {s}
              <button
                type="button"
                onClick={() => removeSkill(s)}
                className="text-blue-900 hover:text-blue-700 hover:bg-blue-100 rounded-full h-5 w-5 flex items-center justify-center ml-1 transition"
                aria-label={`Eliminar ${s}`}
              >
                ×
              </button>
            </span>
          ))}
        </div>
      </div>

      <div className="flex justify-end pt-4 border-t border-gray-200">
        <button
          type="submit"
          disabled={loading}
          className="bg-blue-600 text-white px-6 py-2.5 rounded-lg hover:bg-blue-700 disabled:opacity-60 transition flex items-center font-medium"
        >
          {loading ? (
            <>
              <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Creando...
            </>
          ) : "Crear empleado"}
        </button>
      </div>
    </form>
  );
}