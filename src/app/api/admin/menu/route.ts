import { NextRequest, NextResponse } from "next/server";
import { prisma } from "../../../../../lib/prisma"; 
import jwt  from "jsonwebtoken";
import * as argon2 from "argon2"
import z from "zod";
const secret = "adminsecret";

export async function GET(request:NextRequest){
    try{
        const authHeader = request.cookies.get("token")?.value
        if(!authHeader){
            return NextResponse.json({message:"ยังไม่ได้ Login",code:'UNAUTHORIZED', statusCode:401},{status:401})
        }
        const tokenSchema = z.object({gmail:z.string().email()})
        const checkUser = tokenSchema.parse(jwt.verify(authHeader,secret)) 
        const checkAdmin = await prisma.admin.findUnique({where:{gmail:checkUser.gmail}});
        if(!checkAdmin){
            return NextResponse.json({message:"Gmail not Found", code:'NOT_FOUND' ,statusCode:404},{status:404})
        }
        const menus = await prisma.menu.findMany({select:{name:true,price:true}})
        return NextResponse.json(menus) 
    }
    catch(err){
        return NextResponse.json({message:"Server not Found", code:'SERVER_ERROR', statusCode:500},{status:500})
    }
}
export async function POST(request:NextRequest) {
    try{
        const body = await request.json();
        const authToken = request.cookies.get("token")?.value
        if(!authToken){
            return NextResponse.json({message:"ยังไม่ได้ Login",code:'UNAUTHORIZED', statusCode:401},{status:401})
        }
        const tokenSchema = z.object({gmail:z.string().email()})
        const checkAdmin = tokenSchema.parse(jwt.verify(authToken,secret))
        const admin = await prisma.admin.findUnique({where:{gmail:checkAdmin.gmail}})
        if(!admin){
         return NextResponse.json({message:"Gmail not Found", code:'NOT_FOUND' ,statusCode:404},{status:404})       
        }
        await prisma.menu.create({
            data:{name:body.name,
                price:body.price
            }
        })
        return NextResponse.json({message:"Post Success", statusCode:201},{status:201})
    }
    catch(err){
        console.log(err)
        return NextResponse.json({message:"Server not Found", code:'SERVER_ERROR', statusCode:500},{status:500})
    }
}