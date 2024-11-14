import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { getServerSession } from "next-auth";

const prisma = new PrismaClient();
async function getUser() {
  const session = await getServerSession();
  return session;
}
export async function POST(req: NextRequest) {
  const session = await getUser();

  if (!session?.user) {
    return NextResponse.json(
      { error: "User not authenticated" },
      { status: 401 } // Unauthorized
    );
  }

  const existing_user = await prisma.user.findUnique({
    where: {
      email: session?.user?.email || " ",
    },
  });
  const { title } = await req.json();

  if (!existing_user) {
    return NextResponse.json({
      message: "User not exist",
    });
  }
  try {
    const board=await prisma.board.create({
      data: {
        owner_id: existing_user.id,
        title: title,
      },
    });

    return NextResponse.json(
      
      board
    );
  } catch (error) {
    if (error instanceof Error) {
      return NextResponse.json({ error: error.message }, { status: 500 }); // Internal server error
    }
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    );
  }
}

export async function GET() {
  const session = await getUser();
  if (!session?.user) {
    return NextResponse.json(
      { error: "User not authenticated" },
      { status: 401 } // Unauthorized
    );
  }
  //console.log(session);
  const existing_user = await prisma.user.findUnique({
    where: {
      email: session?.user?.email || " ",
    },
  });
  if (!existing_user) {
    return NextResponse.json({
      message: "user not found",
    });
  }
  //console.log(existing_user);
  const boards = await prisma.board.findMany({
    where: {
      owner_id: existing_user.id,
    },
  });
  if (!boards || boards.length === 0) {
    NextResponse.json({
      message: "Boards not found",
    });
  }
  //console.log(boards);
  return NextResponse.json({
    boards,
  });
}

