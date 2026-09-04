import { NextResponse } from "next/server";
import { prisma } from "../../../../lib/prisma";

export async function GET() {
  try {
    const findQueues = await prisma.queue.findMany();
    if (findQueues.length === 0) {
      return NextResponse.json(
        { message: "Queue not found", code: "NOT_FOUND", statusCode: 404 },
        { status: 404 },
      );
    }
    return NextResponse.json(findQueues);
  } catch {
    return NextResponse.json(
      { message: "Server not Found", code: "SERVER_ERROR", statusCode: 500 },
      { status: 500 },
    );
  }
}
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const postQueue = await prisma.queue.create({
      data: {
        status: body.status,
      },
    });
    return NextResponse.json({message:"Post Success",postQueue},{status:201})
  } catch {
    return NextResponse.json(
      { message: "Server not Found", code: "SERVER_ERROR", statusCode: 500 },
      { status: 500 },
    );
  }
}
