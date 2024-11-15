import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { getServerSession } from "next-auth";

const prisma = new PrismaClient();

async function getUser() {
  const session = await getServerSession();
  return session;
}

export async function DELETE(request:Request) {
    // Log to see the params object
const url=new URL(request.url);
const board_id=url.pathname.split("/").pop() || "";
const board_ID=parseInt(board_id);
  const session = await getUser();
  if (!session) {
    return NextResponse.json({
      message: "User not authenticated",
    }, { status: 401 });
  }

  const email = session?.user?.email;
  const existing_user = await prisma.user.findUnique({
    where: {
      email: email || " ",
    },
  });

  if (!existing_user) {
    return NextResponse.json({
      message: "User not found",
    }, { status: 404 });
  }
  try{
  const existingBoard = await prisma.board.findFirst({
    where: {
      id: board_ID,
      owner_id: existing_user.id,
    },
  });
  
  if (!existingBoard) {
    return NextResponse.json(
      { message: "Board not found or not owned by the user" },
      { status: 404 }
    );
  }
 
  const board = await prisma.board.delete({
    where: {
      id: board_ID,
    },
  });

    return NextResponse.json(
     
      { message: "Board deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { message: "Board not found or not owned by the user" },
      { status: 404 }
    );
  }
}

export async function GET(request:Request){
const url=new URL(request.url);
const board_id=url.pathname.split("/").pop() ||" ";
const board_ID=parseInt(board_id);
const board=await prisma.board.findFirst({
  where:{
    id:board_ID
  }
})
console.log(board);
return NextResponse.json(board);
}
