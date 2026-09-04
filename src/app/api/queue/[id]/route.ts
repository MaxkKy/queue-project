import { NextResponse } from "next/server";
import { prisma } from "../../../../../lib/prisma";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    const useId = Number(id);
    if (!Number.isInteger(useId) || useId <= 0) {
      return NextResponse.json({
        message: "Invalid not ID",
        code: "BAD_REQUEST",
        statusCode: 400,
        details: {
          id: [
            `Invalid request parameters. User ID must be a positive integer.`,
          ],
        },
      });
    }
    const findUser = await prisma.queue.findUnique({
      where: { id: useId },
    });
    if (!findUser) {
      return NextResponse.json(
        { message: "Queue not Found", code: "NOT_FOUND", statusCode: 404 },
        { status: 404 },
      );
    }
  } catch {
    return NextResponse.json(
      { message: "Server not Found", code: "SERVER_ERROR", statusCode: 500 },
      { status: 500 },
    );
  }
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    const useId = Number(id);
    const body = await request.json();
    if (!Number.isInteger(useId) || useId <= 0) {
      return NextResponse.json(
        {
          message: "Invalid not ID",
          code: "BAD_REQUEST",
          statusCode: 400,
          details: {
            id: [
              "Invalid request parameters. User ID must be a positive integer.",
            ],
          },
        },
        { status: 400 },
      );
    }
    const findQueue = await prisma.queue.findUnique({
      where: { id: useId },
    });
    if (!findQueue) {
      return NextResponse.json(
        { message: "Queue not Found", code: "NOT_FOUND", statusCode: 404 },
        { status: 404 },
      );
    }
    await prisma.queue.update({
      where: { id: useId },
      data: {
        status: body.status,
      },
    });
    return NextResponse.json({ message: "Update Success" });
  } catch {
    return NextResponse.json(
      { message: "Server not Found", code: "SERVER_ERROR", statusCode: 500 },
      { status: 500 },
    );
  }
}
export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    const useId = Number(id);
    const findQueue = await prisma.queue.findUnique({
        where:{id:useId}
    })
    if(!findQueue){
        return NextResponse.json({message:"Queue not Found", code:'NOT_FOUND', statusCode:404},{status:404})
    }
    const DeleteQueue = await prisma.queue.delete({
      where: { id: useId },
    });
    return NextResponse.json(DeleteQueue);
  } catch {
    return NextResponse.json(
      { message: "Server not Found", code: "SERVER_ERROR", statusCode: 500 },
      { status: 500 },
    );
  }
}
