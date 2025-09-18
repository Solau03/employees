"use client";
import { useEffect, useState } from "react";
import EmployeeCard from "../components/employeeCard";
import NewEmployeeForm from "../components/newEmployeeForm";

type Employee = {
  employeeId: string;
  firstName: string;
  lastName: string;
  role: string;
  department: string;
  timeAtCompany: string;
  dateOfCreation: string;
  email: string;
  location: string;
  manager: string;
  status: string;
  salaryBand: string;
  skills: string[];
};

export default function EmployeesPage() {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [filtered, setFiltered] = useState<Employee[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    async function fetchEmployees() {
      const res = await fetch("/api/employees");
      const data = await res.json();
      setEmployees(data);
      setFiltered(data);
    }
    fetchEmployees();
  }, []);

  useEffect(() => {
    let result = employees;

    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      result = result.filter(
        (e) =>
          e.firstName.toLowerCase().includes(term) ||
          e.lastName.toLowerCase().includes(term) ||
          e.department.toLowerCase().includes(term)
      );
    }

    if (statusFilter) {
      result = result.filter(
        (e) => e.status.toLowerCase() === statusFilter.toLowerCase()
      );
    }

    setFiltered(result);
  }, [searchTerm, statusFilter, employees]);

  const handleEmployeeCreated = () => {
    setShowForm(false);
    async function fetchEmployees() {
      const res = await fetch("/api/employees");
      const data = await res.json();
      setEmployees(data);
      setFiltered(data);
    }
    fetchEmployees();
  };

  const handleStatusChange = (employeeId: string, newStatus: "Active" | "On Leave") => {
    setEmployees(prev => 
      prev.map(emp => 
        emp.employeeId === employeeId ? { ...emp, status: newStatus } : emp
      )
    );
    setFiltered(prev => 
      prev.map(emp => 
        emp.employeeId === employeeId ? { ...emp, status: newStatus } : emp
      )
    );
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Empleados</h1>
        <button
          onClick={() => setShowForm(!showForm)}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
        >
          {showForm ? "Cancelar" : "Nuevo Empleado"}
        </button>
      </div>

      {showForm && (
        <div className="mb-8">
          <NewEmployeeForm onCreated={handleEmployeeCreated} />
        </div>
      )}

      {/* Filtros */}
      <div className="flex flex-col md:flex-row gap-4 mb-8">
        <div className="relative flex-1 max-w-md">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <svg className="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
            </svg>
          </div>
          <input
            type="text"
            placeholder="Buscar por nombre o departamento..."
            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <select
          className="border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
        >
          <option value="">Todos los estados</option>
          <option value="Active">Active</option>
          <option value="On Leave">On Leave</option>
        </select>
      </div>

      {filtered.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 rounded-lg">
          <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <h3 className="mt-4 text-lg font-medium text-gray-900">No se encontraron empleados</h3>
          <p className="mt-1 text-gray-500">Intenta con otros términos de búsqueda.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((emp) => (
            <EmployeeCard 
              key={emp.employeeId} 
              employee={emp} 
              onStatusChange={handleStatusChange}
            />
          ))}
        </div>
      )}
    </div>
  );
}