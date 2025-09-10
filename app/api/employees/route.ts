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

// Obtener todos los empleados
export async function GET() {
  try {
    console.log('📋 GET request for all employees');
    const employees = await readData();
    return NextResponse.json(employees);
  } catch (error) {
    console.error('Error fetching employees:', error);
    return NextResponse.json(
      { error: 'Failed to fetch employees' },
      { status: 500 }
    );
  }
}

// Agregar nuevo empleado
export async function POST(request: NextRequest) {
  try {
    console.log('POST request for new employee');
    const employees = await readData();
    const newEmployeeData = await request.json();
    
  
    const newId = `EMP${String(employees.length + 1).padStart(3, '0')}`;
    
  
    const currentDate = new Date().toISOString().split('T')[0];
    
    const newEmployee = {
      employeeId: newId,
      ...newEmployeeData,
      dateOfCreation: currentDate,
      timeAtCompany: '0 years 0 months',
      status: 'Active',
      skills: []
    };
    
    employees.push(newEmployee);
    
    const success = await writeData(employees);
    
    if (!success) {
      return NextResponse.json(
        { error: 'Failed to save employee' },
        { status: 500 }
      );
    }

    console.log('Employee created successfully:', newEmployee);
    return NextResponse.json(newEmployee, { status: 201 });
  } catch (error) {
    console.error('Error creating employee:', error);
    return NextResponse.json(
      { error: 'Failed to create employee' },
      { status: 500 }
    );
  }
}