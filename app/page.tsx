'use client';

import { useState, useEffect } from 'react';
import EmployeeList from '../components/EmployeeList';
import { getEmployees, updateEmployeeStatus, Employee } from '../services/employeeService';

export default function Dashboard() {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadEmployees();
  }, []);

  const loadEmployees = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getEmployees();
      setEmployees(data);
    } catch (err) {
      setError('Failed to load employees');
      console.error('Error loading employees:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (employeeId: string, newStatus: string): Promise<void> => {
    try {
      // Actualizar en el backend
      const updatedEmployee = await updateEmployeeStatus(employeeId, newStatus);
      
      // Actualizar el estado local
      setEmployees(prev => prev.map(emp => 
        emp.employeeId === employeeId ? updatedEmployee : emp
      ));
    } catch (error) {
      console.error('Error updating status:', error);
      alert('Failed to update employee status');
      await loadEmployees(); 
      throw error; 
    }
  };

  if (loading) {
    return <div className="flex justify-center items-center h-64">Loading employees...</div>;
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-red-600">{error}</div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">Employee Dashboard</h1>
      <EmployeeList 
        employees={employees} 
        onStatusChange={handleStatusChange} 
      />
    </div>
  );
}