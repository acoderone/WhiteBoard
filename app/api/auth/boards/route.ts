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
      username: session?.user?.name || " ",
    },
  });
  const { title } = await req.json();
  if (existing_user) {
    try {
      await prisma.board.create({
        data: {
          owner_id: existing_user.id,
          title: title,
        },
      });

      return NextResponse.json({
        message: "Board created",
      });
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
}
