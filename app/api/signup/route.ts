import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
interface User{
username:string;
password:string;
}
const prisma=new PrismaClient();
export async function POST(req:NextRequest){
    const {username,password}:User=await req.json();
    try{
        const existingUser=await prisma.user.findUnique({
            where:{username}
        })
         if(existingUser){
            return NextResponse.json({message:"user already exists"})
         }
         
         const user=await prisma.user.create({
            data:{
                username,password
            }
         })
    
        return NextResponse.json({
            message:"Signup successfull",
            user:user.username
        });
    }
    catch(error:unknown){
        if(error instanceof Error)
        return NextResponse.json({error:error.message},{status:400})
    }
    finally {
        await prisma.$disconnect(); // Ensure the Prisma client disconnects
    }
}