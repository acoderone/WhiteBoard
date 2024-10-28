import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";
interface User{
username:string;
typed_password:string;
confirmPassword:string
}
const prisma=new PrismaClient();

export async function POST(req:NextRequest){
    const saltRounds=10;
    const {username,typed_password,confirmPassword}:User=await req.json();
    try{
        const existingUser=await prisma.user.findUnique({
            where:{username}
        })
         if(existingUser){
            return NextResponse.json({message:"user already exists"})
         }
         if(typed_password===confirmPassword){
            const password=await bcrypt.hash(typed_password,saltRounds);
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
         
    }
    catch(error:unknown){
        if(error instanceof Error)
        return NextResponse.json({error:error.message},{status:400})
    }
    finally {
        await prisma.$disconnect(); // Ensure the Prisma client disconnects
    }
}

