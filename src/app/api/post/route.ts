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
        item:{select:{quantity:true,menu:{select:{id:true,name:true,price:true}}}}
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
    const user = await prisma.user.findUnique({
      where: { gmail: checkToken.gmail },
    });
    if (!user) {
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
    if(!Array.isArray(body.item) || body.item.length === 0){
      return NextResponse.json({message:"สั่งอย่างน้อย 1 รายการ",statusCode:400},{status:400})
    }
    const menuItem = []
    for(const i of body.item){
     menuItem.push({menuId:Number(i.menuId),
      quantity:Number(i.quantity ?? 1) })
    }
    const createPost = await prisma.post.create({
      data: {
        details: body.details,
        user: { connect: { id: user.id } },
        // queue: {
        //   // connect: {
        //   //   id: queue.id,
        //   // },
        //   create: { status: "WAITING" },
        // },
        status:"WAITING",
        item:{
          create:menuItem
        }
      },include:{item:{include:{menu:true}}}
    });
    return NextResponse.json(
      { message: "Post Success", createPost },
      { status: 201 },
    );
  } catch(err) {
    console.log(err)
    return NextResponse.json(
      { message: "Server not Found", code: "SERVER_ERROR", statusCode: 500 },
      { status: 500 },
    );
  }
}
