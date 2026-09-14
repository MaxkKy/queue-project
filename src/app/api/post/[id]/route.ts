import { NextResponse } from "next/server";
import { prisma } from "../../../../../lib/prisma";

export async function GET({ params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const useId = Number(id);
    if (!Number.isInteger(useId) || useId <= 0) {
      return NextResponse.json(
        {
          message: "Invalid post ID",
          code: "BAD_REQUEST",
          statusCode: 400,
          details: {
            id: [
              "Post ID must be a positive integer.",
            ],
          },
        },
        { status: 400 },
      );
    }
    const findPost = await prisma.post.findUnique({
      where: { id: useId },
    });
    if (!findPost) {
      return NextResponse.json(
        { message: "Post not Found", code: "NOT_FOUND", statusCode: 404 },
        { status: 404 },
      );
    }
    return NextResponse.json({ findPost });
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
    if (!Number.isInteger(useId) || useId <= 0) {
      return NextResponse.json(
        {
          message: "Invalid post ID",
          code: "BAD_REQUEST",
          statusCode: 400,
          details: {
            id: [
              "Post ID must be a positive integer.",
            ],
          },
        },
        { status: 400 },
      );
    }
    const body = await request.json();
    if (body.status !== "WAITING" && body.status !== "COMPLETE") {
      return NextResponse.json(
        {
          message: "Invalid post status",
          code: "BAD_REQUEST",
          statusCode: 400,
          details: {
            status: ["Status must be WAITING or COMPLETE."],
          },
        },
        { status: 400 },
      );
    }
    const findPost = await prisma.post.findUnique({
      where: { id: useId },
    });
    if (!findPost) {
      return NextResponse.json(
        { message: "Post not Found", code: "NOT_FOUND", statusCode: 404 },
        { status: 404 },
      );
    }
    const updatedPost = await prisma.post.update({
      where: { id: useId },
      data: { status: body.status },
    });
    return NextResponse.json({ message: "Update Success", updatedPost });
  } catch {
    return NextResponse.json(
      { message: "Server not Found", code: "SERVER_ERROR", statusCode: 500 },
      { status: 500 },
    );
  }
}
export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    const useId = Number(id);
    if (!Number.isInteger(useId) || useId <= 0) {
      return NextResponse.json(
        { message: "Invalid post ID", code: "BAD_REQUEST", statusCode: 400 },
        { status: 400 },
      );
    }
    const findPost = await prisma.post.findUnique({
      where: { id: useId },
    });
    if (!findPost) {
      return NextResponse.json(
        { message: "Post not Found", code: "NOT_FOUND", statusCode: 404 },
        { status: 404 },
      );
    }
    await prisma.post.delete({
      where: { id: useId },
    });
    return NextResponse.json({ message: "Delete Success" });
  } catch {
    return NextResponse.json(
      { message: "Server not Found", code: "SERVER_ERROR", statusCode: 500 },
      { status: 500 },
    );
  }
}
