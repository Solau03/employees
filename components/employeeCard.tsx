import {useState} from "react";
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

type EmployeeCardProps = {
  employee: Employee;
  onStatusChange: (id: string, newStatus: "Active" | "On Leave") => void;
};

export default function EmployeeCard({ employee, onStatusChange }: EmployeeCardProps) {
  const [loading, setLoading] = useState(false);

  const toggleStatus = async () => {
    setLoading(true);
    const newStatus = employee.status === "Active" ? "On Leave" : "Active";

    try {
      await fetch(`/api/employees/${employee.employeeId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });

      onStatusChange(employee.employeeId, newStatus); 
    } catch (err) {
      console.error("Error updating status:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="border border-gray-200 rounded-xl p-5 shadow-md hover:shadow-lg transition-all duration-300 bg-white">
      <div className="flex justify-between items-start mb-4">
        <div>
          <h2 className="text-xl font-bold text-gray-800">
            {employee.firstName} {employee.lastName}
          </h2>
          <p className="text-sm text-gray-600">{employee.role}</p>
        </div>
        <span className={`px-3 py-1 rounded-full text-xs font-medium ${
          employee.status === "Active" 
            ? "bg-green-100 text-green-800" 
            : "bg-yellow-100 text-yellow-800"
        }`}>
          {employee.status}
        </span>
      </div>

      <div className="grid grid-cols-2 gap-3 mb-4">
        <div>
          <p className="text-xs text-gray-500">Departamento</p>
          <p className="text-sm font-medium">{employee.department}</p>
        </div>
        <div>
          <p className="text-xs text-gray-500">Ubicación</p>
          <p className="text-sm font-medium">{employee.location}</p>
        </div>
        <div>
          <p className="text-xs text-gray-500">Email</p>
          <p className="text-sm font-medium truncate">{employee.email}</p>
        </div>
        <div>
          <p className="text-xs text-gray-500">Manager</p>
          <p className="text-sm font-medium">{employee.manager}</p>
        </div>
        <div>
          <p className="text-xs text-gray-500">Tiempo en compañía</p>
          <p className="text-sm font-medium">{employee.timeAtCompany}</p>
        </div>
        <div>
          <p className="text-xs text-gray-500">Banda salarial</p>
          <p className="text-sm font-medium">{employee.salaryBand}</p>
        </div>
      </div>

      <div className="flex justify-between text-xs text-gray-500 mb-4">
        <span>ID: {employee.employeeId}</span>
        <span>Incorporación: {employee.dateOfCreation}</span>
      </div>

      <div className="mb-4">
        <p className="text-xs text-gray-500 mb-2">Habilidades</p>
        <div className="flex flex-wrap gap-2">
          {employee.skills.map((skill, index) => (
            <span 
              key={index}
              className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full"
            >
              {skill}
            </span>
          ))}
        </div>
      </div>

      <button
        onClick={toggleStatus}
        disabled={loading}
        className={`w-full py-2 px-4 rounded-lg font-medium text-sm transition ${
          employee.status === "Active" 
            ? "bg-yellow-100 text-yellow-800 hover:bg-yellow-200" 
            : "bg-green-100 text-green-800 hover:bg-green-200"
        } disabled:opacity-50 disabled:cursor-not-allowed`}
      >
        {loading ? "Cambiando..." : employee.status === "Active" ? "Poner en On Leave" : "Activar"}
      </button>
    </div>
  );
}