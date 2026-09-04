import { NextRequest, NextResponse } from "next/server";
import { prisma } from "../../../../lib/prisma";
import * as argon2 from "argon2";
import  jwt  from "jsonwebtoken";
import z from "zod";
export async function GET(request:NextRequest) {
  try{
    const secret = "mysecret"
/*     const authToken = request.headers.get("authorization") */ 
    const authHeader = request.cookies.get('token')?.value
    // let authHeader = "";
    // if(authToken){
    //   authHeader = authToken.split(" ")[1];
    // } 
    if(!authHeader){
      return NextResponse.json(
        { message: "ยังไม่ได้ login", code: "UNAUTHORIZED", statusCode: 401 },
        { status: 401 },
      )
    }
    const tokenSchema = z.object({gmail:z.string().email()})
    const checkuser = tokenSchema.parse(jwt.verify(authHeader,secret)) 
    // if(typeof checkuser !== "object" || typeof checkuser.gmail !== "string"){
    //   return NextResponse.json({ message: "invalid CheckUser" }, { status: 401 })
    // }
    const checkResult = await prisma.user.findMany({where:{gmail:checkuser.gmail}})
    if(!checkResult[0]){
      return NextResponse.json({message:"user not found",code:'NOT_FOUND',statusCode:404},{status:404})
    }  
    return NextResponse.json(checkResult[0])
  }
  catch{
    return NextResponse.json({message:"Server not Found",code:'SERVER_ERROR',statusCode:500},{status:500})
  }
}
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const hashPassword = await argon2.hash(body.password);
    const postUser = await prisma.user.create({
      data: {
        username: body.username,
        password: hashPassword,
        gmail: body.gmail,
      },
    });

    return NextResponse.json(
      { message: "Post Success", statusCode: 201, postUser },
      { status: 201 },
    );
  } catch (err) {
    console.log(err);
    return NextResponse.json(
      { message: "Server Error", code: "SERVER_ERROR", statusCode: 500 },
      { status: 500 },
    );
  }
}

