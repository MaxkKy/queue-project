import { NextResponse } from "next/server";
import { prisma } from "../../../../../lib/prisma";

export async function GET({ params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const useId = Number(id);
    if (Number.isInteger(useId) || useId <= 0) {
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
    const findPost = await prisma.post.findUnique({
      where: { id: useId },
    });
    if (!findPost) {
      return NextResponse.json(
        { message: "Post not Found", code: "NOT_FOUND", statusCode: 404 },
        { status: 404 },
      );
    }
    if (body.status === "WAITING" || body.status === "COMPLETE") {
      if (!findPost.queueId) {
        const queue = await prisma.queue.create({
          data: { status: body.status },
        });
        await prisma.post.update({
          where: { id: useId },
          data: { queueId: queue.id },
        });
        return NextResponse.json({ queue });
      }
      const shared = await prisma.post.count({
        where: { queueId: findPost.queueId },
      });
      if (shared > 1) {
        const queue = await prisma.queue.create({
          data: { status: body.status },
        });
        await prisma.post.update({
          where: { id: useId },
          data: { queueId: queue.id },
        });
        return NextResponse.json({ queue });
      }
      const queue = await prisma.queue.update({
        where: { id: findPost.queueId },
        data: { status: body.status },
      });
      return NextResponse.json({ queue });
    }
    await prisma.post.update({
      where: { id: useId },
      data: { name: body.name, queueId: body.queueId },
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
    const id = await params;
    const findPost = await prisma.post.findUnique({
      where: { id: Number(id) },
    });
    if (!findPost) {
      return NextResponse.json(
        { message: "Post not Found", code: "NOT_FOUND", statusCode: 404 },
        { status: 404 },
      );
    }
    await prisma.post.delete({
      where: { id: Number(id) },
    });
  } catch {
    return NextResponse.json(
      { message: "Server not Found", code: "SERVER_ERROR", statusCode: 500 },
      { status: 500 },
    );
  }
}
