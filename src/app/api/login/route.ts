import { NextRequest, NextResponse } from "next/server";
import { prisma } from "../../../../lib/prisma";
import * as argon2 from "argon2";
import jwt from "jsonwebtoken";

export async function POST(request: NextRequest) {
  try {
    const secret = "mysecret";
    const body = await request.json();
    const { gmail, password } = body;

    // ส่งข้อมูล Login ผ่าน request โดยหา user ผ่าน gmail
    // แล้ว request ที่ระบุ gmail ไว้มันจะดึงข้อมูลตัวแรกเสมอผ่าน results[0](ข้อมูลทั้งก้อนของ results[0] ที่หาผ่านทาง gmail)
    // password ต้องได้รับการเทียบ Password จาก request เทียบกับ hash ใน database
    const results = await prisma.user.findMany({
      where: { gmail: body.gmail },
    });
    const userData = results[0];
    if (!userData) {
      return NextResponse.json(
        {
          message: "Error Fail (wrong Gmail)",
          code: "UNAUTHORIZED",
          statusCode: 401,
        },
        { status: 401 },
      );
    }
    const math = await argon2.verify(userData.password, password);
    if (!math) {
      return NextResponse.json(
        { message: "Error Fail (wrong Password)" },
        { status: 400 },
      );
    }
    // create jwt token
    // เป็นการเทียบ token กับ secret
    const token = jwt.sign({ gmail }, secret, { expiresIn: "1hr" });
    const response = NextResponse.json({ message: "Login Success", statusCode:201});
    response.cookies.set("token", token, {
      maxAge: 3500,
      secure: true, //บังคับส่งผ่าน HTTPS เท่านั้น
      httpOnly: true,
      sameSite: "lax", // login แล้วไปหน้าในเว็บตัวเอง cookie ยังไป
      //ก็คือตอน login เรามี username password ทั้งหมดนี้มันก็ไปด้วย ใช่ไหม และป้องกันการใช้ลิ้งปลอม ในการยิงเข้ามาเว็บเรา
    });
    return response;
  } catch {
    return NextResponse.json(
      { message: "Server Error", code: "SERVER_ERROR", statusCode: 500 },
      { status: 500 },
    );
  }
}
