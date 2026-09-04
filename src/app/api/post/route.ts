import { NextRequest, NextResponse } from "next/server";
import { prisma } from "../../../../lib/prisma";
import jwt from "jsonwebtoken";
import z from "zod";
const secret = "mysecret";
export async function GET(request: NextRequest) {
  try {
    const authToken = request.cookies.get("token")?.value;
    if (!authToken) {
      return NextResponse.json(
        { message: "ยังไม่ได้ Login", code: "UNAUTHORIZED", statusCode: 401 },
        { status: 401 },
      );
    }
    const tokenSchema = z.object({ gmail: z.string().email() });
    const checkToken = tokenSchema.parse(jwt.verify(authToken, secret));
    const user = await prisma.user.findMany({
      where: { gmail: checkToken.gmail },
    });
    if (!user[0]) {
      return NextResponse.json(
        { message: "user not found", code: "NOT_FOUND", statusCode: 404 },
        { status: 404 },
      );
    }
    const findPosts = await prisma.post.findMany({
      where: { userId: user[0].id },
      include: {
        queue: true,
      },
    });

    return NextResponse.json(findPosts);
  } catch {
    return NextResponse.json(
      { message: "Server not Found", code: "SERVER_ERROR", statusCode: 500 },
      { status: 500 },
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const authToken = request.cookies.get("token")?.value;
    if (!authToken) {
      return NextResponse.json(
        { message: "ยังไม่ได้ Login", code: "UNAUTHORIZED", statusCode: 401 },
        { status: 401 },
      );
    }
    const tokenSchema = z.object({gmail:z.string().email()})
    const checkToken = tokenSchema.parse(jwt.verify(authToken, secret));
    // if (
    //   typeof checkToken !== "object" ||
    //   typeof checkToken.gmail !== "string"
    // ) {
    //   return NextResponse.json(
    //     {
    //       message: "Invalid CheckToken",
    //       code: "UNAUTHORIZED",
    //       statusCode: 401,
    //     },
    //     { status: 401 },
    //   );
    // }
    const user = await prisma.user.findMany({
      where: { gmail: checkToken.gmail },
    });
    if (!user[0]) {
      return NextResponse.json(
        { message: "user not found", code: "NOT_FOUND", statusCode: 404 },
        { status: 404 },
      );
    }
    // let queue = await prisma.queue.findFirst({
    //   where: { status: "WAITING" },
    // });
    // if (!queue) {
    //   queue = await prisma.queue.create({ data: { status: "WAITING" } });
    // }
    const createPost = await prisma.post.create({
      data: {
        name: body.name,
        details: body.details,
        user: { connect: { id: user[0].id } },
        queue: {
          // connect: {
          //   id: queue.id,
          // },
          create: { status: "WAITING" },
        },
      },
    });
    return NextResponse.json(
      { message: "Post Success", createPost },
      { status: 201 },
    );
  } catch {
    return NextResponse.json(
      { message: "Server not Found", code: "SERVER_ERROR", statusCode: 500 },
      { status: 500 },
    );
  }
}
