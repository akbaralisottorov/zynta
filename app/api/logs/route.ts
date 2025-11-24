import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
    try {
        const session = await getServerSession();

        if (!session || !session.user?.email) {
            console.log("No session or email");
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const user = await prisma.user.findUnique({
            where: { email: session.user.email }
        });

        if (!user) {
            console.log("User not found:", session.user.email);
            return NextResponse.json({ error: "User not found" }, { status: 404 });
        }

        console.log("Fetching logs for user:", user.id);
        const logs = await prisma.generationLog.findMany({
            where: { userId: user.id },
            orderBy: { createdAt: 'desc' },
            select: {
                id: true,
                prompt: true,
                model: true,
                createdAt: true,
            }
        });

        console.log("Found logs:", logs.length);
        return NextResponse.json(logs);

    } catch (error: any) {
        console.error("Fetch Error:", error);
        console.error("Error stack:", error.stack);
        return NextResponse.json(
            { error: error.message || "Internal Server Error" },
            { status: 500 }
        );
    }
}
