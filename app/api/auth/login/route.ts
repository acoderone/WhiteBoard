import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";
const prisma = new PrismaClient();
export async function POST(req: NextRequest) {
  const { username, password } = await req.json();
  const user = await prisma.user.findUnique({
    where: {
      username: username,
    },
  });

  if (!user) {
    return NextResponse.json({ message: "user not found" });
  }
  const match_password = await bcrypt.compare(password, user.password);
  if(!match_password){
    return NextResponse.json({message:"Login Failed"});
  }
  return NextResponse.json({message:"Login successfull"}); 
}
