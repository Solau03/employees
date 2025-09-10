'use client';

import { useState } from 'react';

export interface Employee {
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
}

export interface EmployeeCardProps {
  employee: Employee;
  onStatusToggle?: (employeeId: string, newStatus: string) => Promise<void>;
}

export default function EmployeeCard({ employee, onStatusToggle }: EmployeeCardProps) {
  const [currentStatus, setCurrentStatus] = useState(employee.status);
  const [isLoading, setIsLoading] = useState(false);

  const handleStatusToggle = async () => {
    if (!onStatusToggle) return;
    
    setIsLoading(true);
    try {
      const newStatus = currentStatus === "Active" ? "On Leave" : "Active";
      await onStatusToggle(employee.employeeId, newStatus);
      setCurrentStatus(newStatus);
    } catch (error) {
      console.error('Error updating status:', error);
      
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch(status) {
      case "Active":
        return "bg-green-100 text-green-800";
      case "Inactive":
        return "bg-red-100 text-red-800";
      case "On Leave":
        return "bg-yellow-100 text-yellow-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getButtonText = (status: string) => {
    if (isLoading) return "Updating...";
    return status === "Active" ? "Deactivate" : "Activate";
  };

  const getButtonColor = (status: string) => {
    if (isLoading) return "bg-gray-100 text-gray-700";
    return status === "Active" 
      ? "bg-red-100 text-red-700 hover:bg-red-200" 
      : "bg-green-100 text-green-700 hover:bg-green-200";
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-4 hover:shadow-lg transition-shadow">
      <div className="flex justify-between items-start mb-3">
        <div>
          <h3 className="font-semibold text-lg">{employee.firstName} {employee.lastName}</h3>
          <p className="text-gray-600">{employee.role}</p>
          <p className="text-sm text-gray-500">{employee.department} • {employee.location}</p>
        </div>
        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(currentStatus)}`}>
          {currentStatus}
        </span>
      </div>
      
      <div className="text-sm mb-3">
        <p><span className="font-medium">Manager:</span> {employee.manager}</p>
        <p><span className="font-medium">Time at Company:</span> {employee.timeAtCompany}</p>
        <p><span className="font-medium">Salary Band:</span> {employee.salaryBand}</p>
      </div>
      
      <div className="mb-3">
        <h4 className="font-medium text-sm mb-1">Skills:</h4>
        <div className="flex flex-wrap gap-1">
          {employee.skills.map((skill, index) => (
            <span key={index} className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded">
              {skill}
            </span>
          ))}
        </div>
      </div>
      
      <div className="flex justify-between items-center mt-4">
        <p className="text-xs text-gray-500">ID: {employee.employeeId}</p>
        <button 
          onClick={handleStatusToggle}
          disabled={isLoading}
          className={`px-3 py-1 rounded text-xs font-medium ${getButtonColor(currentStatus)} transition-colors disabled:opacity-50`}
        >
          {getButtonText(currentStatus)}
        </button>
      </div>
    </div>
  );
}