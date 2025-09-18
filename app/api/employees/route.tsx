import { NextResponse } from "next/server";
import path from "path";
import fs from "fs/promises"


export async function GET(){
    try{
        const filePath = path.join(process.cwd(), 'data', 'employees.json');
        const fileData= await fs.readFile(filePath, "utf-8");
        const data = JSON.parse(fileData);
        return NextResponse.json(data, {status:200});
    } catch (error){
        console.error("falla: ", error);
        return NextResponse.json(
            { error: "error interno del servidor" },
            {status: 500}
        );
    }  
}

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const filePath = path.join(process.cwd(), "data", "employees.json");
    const fileData = await fs.readFile(filePath, "utf-8");
    const data = JSON.parse(fileData);

  
    let newId = "EMP001";
    if (data.length > 0) {
      const lastEmployee = data[data.length - 1];
      const lastId = lastEmployee.employeeId; 
      const lastNumber = parseInt(lastId.replace("EMP", ""), 10);
      const nextNumber = lastNumber + 1;
      newId = `EMP${String(nextNumber).padStart(3, "0")}`; 
    }

    const newEmployee = { employeeId: newId, ...body };
    data.push(newEmployee);

    await fs.writeFile(filePath, JSON.stringify(data, null, 2));

    return NextResponse.json(newEmployee, { status: 201 });
  } catch (error) {
    console.error("falla: ", error);
    return NextResponse.json(
      { error: "error interno del servidor" },
      { status: 500 }
    );
  }
}

export async function DELETE(request: Request) {
  try {
    const { employeeId } = await request.json(); 

    const filePath = path.join(process.cwd(), "data", "employees.json");
    const fileData = await fs.readFile(filePath, "utf-8");
    let data = JSON.parse(fileData);

    // Verificar si existe
    const exists = data.some((emp: any) => emp.employeeId === employeeId);
    if (!exists) {
      return NextResponse.json(
        { error: `Empleado con ID ${employeeId} no encontrado` },
        { status: 404 }
      );
    }

   
    data = data.filter((emp: any) => emp.employeeId !== employeeId);

    await fs.writeFile(filePath, JSON.stringify(data, null, 2));

    return NextResponse.json(
      { message: `Empleado ${employeeId} eliminado correctamente` },
      { status: 200 }
    );
  } catch (error) {
    console.error("falla: ", error);
    return NextResponse.json(
      { error: "Error interno del servidor" },
      { status: 500 }
    );
  }
}



export async function PATCH(request: Request) {
  try {
    const { employeeId, ...updates } = await request.json(); 

    const filePath = path.join(process.cwd(), "data", "employees.json");
    const fileData = await fs.readFile(filePath, "utf-8");
    const data = JSON.parse(fileData);

    const index = data.findIndex((emp: any) => emp.employeeId === employeeId);

    if (index === -1) {
      return NextResponse.json(
        { error: `Empleado con ID ${employeeId} no encontrado` },
        { status: 404 }
      );
    }

    data[index] = { ...data[index], ...updates };

    await fs.writeFile(filePath, JSON.stringify(data, null, 2));

    return NextResponse.json(
      { message: `Empleado ${employeeId} actualizado correctamente`, employee: data[index] },
      { status: 200 }
    );
  } catch (error) {
    console.error("falla: ", error);
    return NextResponse.json(
      { error: "Error interno del servidor" },
      { status: 500 }
    );
  }
}
