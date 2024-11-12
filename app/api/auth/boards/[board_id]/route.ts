import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { getServerSession } from "next-auth";

const prisma = new PrismaClient();

async function getUser() {
  const session = await getServerSession();
  return session;
}

export async function DELETE({ params }: { params: { board_id: string } }) {
  console.log(params);  // Log to see the params object

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

  const board_Id = parseInt(params.board_id);  // This should be logged in params
  try {
    const board = await prisma.board.delete({
      where: {
        owner_id: existing_user?.id,
        id: board_Id,
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
