import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { prisma } from "../../../../../lib/prisma";
export async function GET(request:NextRequest){
    try{
        const checkAdmin = await prisma.admin.findMany();
        if(checkAdmin.length === 0){
            return NextResponse.json({message:"Invalid Admin", code:'NOT_FOUND' ,statusCode:404},{status:404})
        }
        return NextResponse.json(checkAdmin) 
    }
    catch(err){
        return NextResponse.json({message:"Server not Found", code:'SERVER_ERROR', statusCode:500},{status:500})
    }
}