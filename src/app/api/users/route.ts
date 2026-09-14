import { NextRequest, NextResponse } from "next/server";
import { prisma } from "../../../../lib/prisma";
import z from "zod";
import jwt  from "jsonwebtoken"; 
const secret = "adminsecret"
export async function GET(request:NextRequest) {
  try {
    const authToken = request.cookies.get("token")?.value
    if(!authToken){
      return NextResponse.json(  { message: "ยังไม่ได้ Login", code: "UNAUTHORIZED", statusCode: 401 },{status:401})
    }
    const tokenSchema = z.object({gmail:z.string().email()})
    const checkToken = tokenSchema.parse(jwt.verify(authToken,secret))
    // if(typeof checkToken !== "object" || typeof checkToken.gmail !== "string"){
    //   return NextResponse.json({message:"Invalid checkToken", code:"UNAUTHORIZED", statusCode:401},{status:401})
    // }
    const admin = await prisma.admin.findUnique({where:{gmail:checkToken.gmail}})
    if(!admin){
      return NextResponse.json( 
        { message: "user not found", code: "NOT_FOUND", statusCode: 404 },
        { status: 404 },
      );
    }
   const checkResult = await prisma.user.findMany({select:{
    id:true,
    username:true,
    gmail:true,
    post:{
        select:{
            id:true,
            details:true,
            createdAt:true,
            status:true,
            item:{
              select:{quantity:true,menu:{select:{name:true,price:true}}}
            }
        }
    }
   }});
    return NextResponse.json(checkResult);
  } catch(err) {
    console.log(err)
    return NextResponse.json(
      { message: "Server not Found", code: "SERVER_ERROR", statusCode: 500 },
      { status: 500 },
    );
  }
}
