import { NextRequest, NextResponse } from "next/server";
import { prisma } from "../../../../lib/prisma";
import jwt  from "jsonwebtoken";
import * as argon2 from "argon2"
export async function GET(request:NextRequest){
    try{
        const secret = "adminsecret";
        const authHeader = request.cookies.get("token")?.value
        if(!authHeader){
            return NextResponse.json({message:"ยังไม่ได้ Login",code:'UNAUTHORIZED', statusCode:401},{status:401})
        }
        const checkUser = jwt.verify(authHeader,secret) as {gmail:string}
        const checkAdmin = await prisma.admin.findMany({where:{gmail:checkUser.gmail}});
        if(!checkAdmin[0]){
            return NextResponse.json({message:"Gmail not Found", code:'NOT_FOUND' ,statusCode:404},{status:404})
        }
        return NextResponse.json(checkAdmin[0]) 
    }
    catch(err){
        return NextResponse.json({message:"Server not Found", code:'SERVER_ERROR', statusCode:500},{status:500})
    }
}
export async function POST(request:NextRequest) {
    try{
        const body = await request.json();
        const hashPassword = await argon2.hash(body.password)
        await prisma.admin.create({
            data:{username:body.username,
                gmail:body.gmail,
                password:hashPassword,
                role:body.role
            }
        })
        return NextResponse.json({message:"Post Success", statusCode:201},{status:201})
    }
    catch(err){
        return NextResponse.json({message:"Server not Found", code:'SERVER_ERROR', statusCode:500},{status:500})
    }
}