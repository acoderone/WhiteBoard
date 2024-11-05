import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";

const prisma = new PrismaClient();

export async function POST(req: NextRequest) {
    const saltRounds = 10;
    const { username,email, typed_password, confirmPassword } = await req.json();

    try {
        const existingUser = await prisma.user.findUnique({
            where: { username },
        });

        if (existingUser) {
            return NextResponse.json({ message: "User already exists" }, { status: 409 }); // Conflict status
        }

        if (typed_password !== confirmPassword) {
            return NextResponse.json({
                message: "Passwords do not match",
            }, { status: 400 }); // Bad request status
        }

        const password = await bcrypt.hash(typed_password, saltRounds);
        const user = await prisma.user.create({
            data: {
                username,
                password,
                email
            },
        });

        return NextResponse.json({
            message: "Signup successful",
            user: user.username,
        });
    } catch (error) {
        if (error instanceof Error) {
            return NextResponse.json({ error: error.message }, { status: 500 }); // Internal server error
        }
        return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
    } finally {
        await prisma.$disconnect(); // Ensure the Prisma client disconnects
    }
}
