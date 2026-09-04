import { NextRequest, NextResponse } from "next/server";
import { prisma } from "../../../../../lib/prisma";
import * as argon2 from "argon2";
import jwt  from "jsonwebtoken";
export async function POST(request : NextRequest){
    try{
    const body = await request.json();
    const {gmail,password} = body;
    const secret = "adminsecret"
    const authToken = request.headers.get("authorization");
    let authHeader = "";
    if(authToken){
        authHeader = authToken.split(" ")[1]
    }   
    const result = await prisma.admin.findMany(
        {where:{gmail:body.gmail}}
    )
    const userData = result[0]
    if(!userData){
        return NextResponse.json({message:"error Fail (worng Gmail)", code:"UNAUTHORIZED", statusCode:401},{status:401})
    }
    const math = await argon2.verify(userData.password,password)
    if(!math){
        return NextResponse.json({message:"error Fail (worng Password)", code:"UNAUTHORIZED", stausCode:401},{status:401})
    }
    const token =  jwt.sign({gmail},secret,{expiresIn:"1hr"})
    const res = NextResponse.json({message:"Login Success"})
    res.cookies.set("token",token,{
        maxAge:3500,
        httpOnly:true,
        secure:true,
        sameSite:"lax",
    })
    return res
    }
    catch(err){
        return NextResponse.json({message:"Server not Found", code:"SERVER_ERROR", statusCode:500},{status:500})
    }
}