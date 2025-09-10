'use client';

import { useState } from 'react';
import EmployeeCard from './EmployeeCard';

interface Employee {
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

interface EmployeeListProps {
  employees: Employee[];
  onStatusChange?: (employeeId: string, newStatus: string) => Promise<void>; // Cambiado a Promise<void>
}

export default function EmployeeList({ employees, onStatusChange }: EmployeeListProps) {
  const [departmentFilter, setDepartmentFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');

  // Obtener departamentos para filtro
  const departments = ['All', ...new Set(employees.map(e => e.department))];
  
  const filteredEmployees = employees.filter(employee => {
    const matchesDepartment = departmentFilter === 'All' || employee.department === departmentFilter;
    const matchesStatus = statusFilter === 'All' || employee.status === statusFilter;
    const matchesSearch = searchTerm === '' || 
      employee.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      employee.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      employee.role.toLowerCase().includes(searchTerm.toLowerCase());
    
    return matchesDepartment && matchesStatus && matchesSearch;
  });

  return (
    <div>
      <div className="flex flex-wrap gap-4 mb-6">
        <div>
          <label htmlFor="search" className="block text-sm font-medium text-gray-700 mb-1">
            Search
          </label>
          <input
            type="text"
            id="search"
            placeholder="Search by name or role..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          />
        </div>
        
        <div>
          <label htmlFor="department" className="block text-sm font-medium text-gray-700 mb-1">
            Department
          </label>
          <select
            id="department"
            value={departmentFilter}
            onChange={(e) => setDepartmentFilter(e.target.value)}
            className="rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          >
            {departments.map(dept => (
              <option key={dept} value={dept}>{dept}</option>
            ))}
          </select>
        </div>
        
        <div>
          <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-1">
            Status
          </label>
          <select
            id="status"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          >
            <option value="All">All</option>
            <option value="Active">Active</option>
            <option value="On Leave">On Leave</option>
          </select>
        </div>
      </div>
      
      {filteredEmployees.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-gray-500">No employees found with the selected filters.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredEmployees.map(employee => (
            <EmployeeCard 
              key={employee.employeeId} 
              employee={employee} 
              onStatusToggle={onStatusChange} 
            />
          ))}
        </div>
      )}
    </div>
  );
}