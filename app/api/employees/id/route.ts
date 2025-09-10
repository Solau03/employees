import { NextRequest, NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';

const dataFilePath = path.join(process.cwd(), 'data', 'employees.json');


async function readData() {
  try {
    const data = await fs.readFile(dataFilePath, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    console.error('Error reading data file:', error);
    return [];
  }
}

async function writeData(data: any) {
  try {
    await fs.writeFile(dataFilePath, JSON.stringify(data, null, 2));
    return true;
  } catch (error) {
    console.error('Error writing data file:', error);
    return false;
  }
}

// Cambiar un dato
export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const employeeId = params.id;
    console.log('PATCH request received for employee:', employeeId);
    
    const updates = await request.json();
    console.log('Updates received:', updates);


    const employees = await readData();
    console.log('Total employees:', employees.length);


    const employeeIndex = employees.findIndex((emp: any) => emp.employeeId === employeeId);
    
    if (employeeIndex === -1) {
      console.log('Employee not found:', employeeId);
      return NextResponse.json(
        { error: 'Employee not found' },
        { status: 404 }
      );
    }

    console.log('Employee found:', employees[employeeIndex].firstName, employees[employeeIndex].lastName);
    
 
    employees[employeeIndex] = {
      ...employees[employeeIndex],
      ...updates
    };

    const success = await writeData(employees);
    
    if (!success) {
      return NextResponse.json(
        { error: 'Failed to save data' },
        { status: 500 }
      );
    }

    console.log('Employee updated successfully:', employees[employeeIndex]);
    return NextResponse.json(employees[employeeIndex]);
  } catch (error) {
    console.error('Error updating employee:', error);
    return NextResponse.json(
      { error: 'Failed to update employee' },
      { status: 500 }
    );
  }
}

// obtener un empleado específico
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const employeeId = params.id;
    console.log('GET request for employee:', employeeId);
    
    const employees = await readData();
    const employee = employees.find((emp: any) => emp.employeeId === employeeId);

    if (!employee) {
      return NextResponse.json(
        { error: 'Employee not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(employee);
  } catch (error) {
    console.error('Error fetching employee:', error);
    return NextResponse.json(
      { error: 'Failed to fetch employee' },
      { status: 500 }
    );
  }
}

// Eliminar un empleado
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const employeeId = params.id;
    console.log('DELETE request for employee:', employeeId);
    
    const employees = await readData();
    const filteredEmployees = employees.filter((emp: any) => emp.employeeId !== employeeId);

    if (employees.length === filteredEmployees.length) {
      return NextResponse.json(
        { error: 'Employee not found' },
        { status: 404 }
      );
    }

    const success = await writeData(filteredEmployees);
    
    if (!success) {
      return NextResponse.json(
        { error: 'Failed to save data' },
        { status: 500 }
      );
    }

    return NextResponse.json({ message: 'Employee deleted successfully' });
  } catch (error) {
    console.error('Error deleting employee:', error);
    return NextResponse.json(
      { error: 'Failed to delete employee' },
      { status: 500 }
    );
  }
}