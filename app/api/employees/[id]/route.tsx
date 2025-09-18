import { NextResponse } from "next/server";
import path from "path";
import fs from "fs/promises"

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params; 

    const filePath = path.join(process.cwd(), "data", "employees.json");
    const fileData = await fs.readFile(filePath, "utf-8");
    const data = JSON.parse(fileData);
    
    const employee = data.find((emp: any) => emp.employeeId === id);

    if (!employee) {
      return NextResponse.json(
        { message: `Empleado con ID ${id} no encontrado` },
        { status: 404 }
      );
    }

    return NextResponse.json(employee, { status: 200 });
  } catch (error) {
    console.error("falla: ", error);
    return NextResponse.json(
      { error: "error interno del servidor" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;

    const filePath = path.join(process.cwd(), "data", "employees.json");
    const fileData = await fs.readFile(filePath, "utf-8");
    let data = JSON.parse(fileData);

    const exists = data.some((emp: any) => emp.employeeId === id);
    if (!exists) {
      return NextResponse.json(
        { error: `Empleado con ID ${id} no encontrado` },
        { status: 404 }
      );
    }

    data = data.filter((emp: any) => emp.employeeId !== id);

    await fs.writeFile(filePath, JSON.stringify(data, null, 2));

    return NextResponse.json(
      { message: `Empleado ${id} eliminado correctamente` },
      { status: 200 }
    );
  } catch (error) {
    console.error("falla: ", error);
    return NextResponse.json({ error: "error interno del servidor" }, { status: 500 });
  }
}

export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    const updates = await request.json();

    const filePath = path.join(process.cwd(), "data", "employees.json");
    const fileData = await fs.readFile(filePath, "utf-8");
    const data = JSON.parse(fileData);

    const index = data.findIndex((emp: any) => emp.employeeId === id);
    if (index === -1) {
      return NextResponse.json(
        { error: `Empleado con ID ${id} no encontrado` },
        { status: 404 }
      );
    }

    data[index] = { ...data[index], ...updates };

    await fs.writeFile(filePath, JSON.stringify(data, null, 2));

    return NextResponse.json(
      { message: `Empleado ${id} actualizado correctamente`, employee: data[index] },
      { status: 200 }
    );
  } catch (error) {
    console.error("falla: ", error);
    return NextResponse.json({ error: "error interno del servidor" }, { status: 500 });
  }
}