import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import z from "zod";
import { prisma } from "../../../../lib/prisma";

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
    const user = await prisma.user.findUnique({
      where: { gmail: checkToken.gmail },
    });

    if (!user) {
      return NextResponse.json(
        { message: "user not found", code: "NOT_FOUND", statusCode: 404 },
        { status: 404 },
      );
    }

    const menus = await prisma.menu.findMany({
      select: { id: true, name: true, price: true },
    });
    return NextResponse.json(menus);
  } catch {
    return NextResponse.json(
      { message: "Server not Found", code: "SERVER_ERROR", statusCode: 500 },
      { status: 500 },
    );
  }
}