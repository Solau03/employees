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

//obtener todos los empleados
export async function getEmployees(): Promise<Employee[]> {
  try {
    console.log('Fetching employees from API ');
    const response = await fetch('/api/employees', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      cache: 'no-store'
    });

    console.log('API Response status:', response.status);
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error('API Error response:', errorText);
      throw new Error(`Failed to fetch employees: ${response.status} ${response.statusText}`);
    }

    const employees = await response.json();
    console.log('Employees fetched successfully:', employees.length);
    return employees;
  } catch (error) {
    console.error('Error fetching employees:', error);
    throw error;
  }
}

//actualizar el estado de un empleado
export async function updateEmployeeStatus(employeeId: string, newStatus: string): Promise<Employee> {
  try {
    console.log('Sending PATCH request for:', employeeId, 'New status:', newStatus);
    
    const response = await fetch(`/api/employees/${employeeId}`, {
      method: 'PATCH', 
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ status: newStatus }),
    });

    console.log('Response status:', response.status);
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error('API Error response:', errorText);
      throw new Error(`Failed to update employee status: ${response.status} ${response.statusText}`);
    }

    const updatedEmployee = await response.json();
    console.log('Employee status updated successfully:', updatedEmployee);
    return updatedEmployee;
  } catch (error) {
    console.error('Error updating employee status:', error);
    throw error;
  }
}

//obtener un empleado por ID
export async function getEmployeeById(employeeId: string): Promise<Employee> {
  try {
    console.log('Fetching employee by ID:', employeeId);
    
    const response = await fetch(`/api/employees/${employeeId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    console.log('Response status:', response.status);
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error('API Error response:', errorText);
      throw new Error(`Failed to fetch employee: ${response.status} ${response.statusText}`);
    }

    const employee = await response.json();
    console.log('Employee fetched successfully:', employee);
    return employee;
  } catch (error) {
    console.error('Error fetching employee:', error);
    throw error;
  }
}

//crear un nuevo empleado
export async function createEmployee(employeeData: Omit<Employee, 'employeeId' | 'dateOfCreation' | 'timeAtCompany' | 'skills'>): Promise<Employee> {
  try {
    console.log('Creating new employee:', employeeData);
    
    const response = await fetch('/api/employees', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(employeeData),
    });

    console.log('Response status:', response.status);
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error('API Error response:', errorText);
      throw new Error(`Failed to create employee: ${response.status} ${response.statusText}`);
    }

    const newEmployee = await response.json();
    console.log('Employee created successfully:', newEmployee);
    return newEmployee;
  } catch (error) {
    console.error('Error creating employee:', error);
    throw error;
  }
}

// eliminar un empleado
export async function deleteEmployee(employeeId: string): Promise<void> {
  try {
    console.log('Deleting employee:', employeeId);
    
    const response = await fetch(`/api/employees/${employeeId}`, {
      method: 'DELETE',
    });

    console.log('Response status:', response.status);
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error('API Error response:', errorText);
      throw new Error(`Failed to delete employee: ${response.status} ${response.statusText}`);
    }

    console.log('Employee deleted successfully');
  } catch (error) {
    console.error('Error deleting employee:', error);
    throw error;
  }
}

// obtener empleados filtrados
export async function getEmployeesByDepartment(department: string): Promise<Employee[]> {
  try {
    console.log('Fetching employees by department:', department);
    
    const allEmployees = await getEmployees();
    const filteredEmployees = allEmployees.filter(emp => emp.department === department);
    
    console.log('Department employees fetched successfully:', filteredEmployees.length);
    return filteredEmployees;
  } catch (error) {
    console.error('Error fetching employees by department:', error);
    throw error;
  }
}

// Obtener empleados por estado
export async function getEmployeesByStatus(status: string): Promise<Employee[]> {
  try {
    console.log('📊 Fetching employees by status:', status);
    
    const allEmployees = await getEmployees();
    const filteredEmployees = allEmployees.filter(emp => emp.status === status);
    
    console.log('Status employees fetched successfully:', filteredEmployees.length);
    return filteredEmployees;
  } catch (error) {
    console.error('Error fetching employees by status:', error);
    throw error;
  }
}