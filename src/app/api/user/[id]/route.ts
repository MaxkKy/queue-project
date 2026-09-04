import { isNumber } from "util";
import { prisma } from "../../../../../lib/prisma";
import { NextResponse } from "next/server";
import { RedirectType } from "next/navigation";

export async function GET(
  requert: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    const numId = Number(id);
    if (!Number.isInteger(numId) || numId <= 0) {
      return NextResponse.json(
        {
          message: `Invalid not ID`,
          code: `BAD_REQUEST`,
          details: {
            id: [
              `Invalid request parameters. User ID must be a positive integer.`,
            ],
          },
          statusCode: 400,
        },
        { status: 400 },
      );
    }
    const findUser = await prisma.user.findUnique({
      where: {
        id: numId,
      },
      select: {
        username: true,
        gmail: true,
        queueId: true,
      },
    });
    return NextResponse.json({ findUser });
  } catch {
    return NextResponse.json(
      { message: "Server Error", code: "SERVER_ERROR", statusCode: 500 },
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
    const userId = Number(id);
    const data = await request.json();
    if (!Number.isInteger(userId) || userId <= 0) {
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
    const findUser = await prisma.user.findUnique({
      where: { id: userId },
    });
    if (!findUser) {
      return NextResponse.json(
        { message: "User not Found", code: "NOT_FOUND", statusCode: 404 },
        { status: 404 },
      );
    }
    await prisma.user.update({
      where: { id: userId },
      data: {
        username: data.username,
        password: data.password,
        gmail: data.gmail,
        queueId: data.queueId,
      },
    });
    return NextResponse.json({ message: "Success Update" });
  } catch {
    return NextResponse.json(
      { message: "Server Error", code: "SERVER_ERROR", statusCode: 500 },
      { status: 500 },
    );
  }
}
export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const id = await params;
    const useId = Number(id);
    const findUser = await prisma.user.findUnique({
      where: { id: useId },
    });
    if (!findUser) {
      return NextResponse.json(
        { message: "User not Found", code: "NOT_FOUND", statusCode: 404 },
        { status: 404 },
      );
    }
    await prisma.user.delete({
      where: { id: useId },
    });
  } catch {
    return NextResponse.json(
      { message: "Server not Found", code: "SERVER_ERROR", statusCode: 500 },
      { status: 500 },
    );
  }
}
