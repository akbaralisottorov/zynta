import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { prisma } from "@/lib/prisma";

export async function GET(
    req: Request,
    props: { params: Promise<{ id: string }> }
) {
    const params = await props.params;
    try {
        const session = await getServerSession();

        if (!session || !session.user?.email) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const user = await prisma.user.findUnique({
            where: { email: session.user.email }
        });

        if (!user) {
            return NextResponse.json({ error: "User not found" }, { status: 404 });
        }

        const log = await prisma.generationLog.findUnique({
            where: { id: params.id }
        });

        if (!log) {
            console.log("Log not found:", params.id);
            return NextResponse.json({ error: "Not found" }, { status: 404 });
        }

        if (log.userId !== user.id) {
            console.log("Unauthorized access to log:", params.id);
            return NextResponse.json({ error: "Unauthorized" }, { status: 404 });
        }

        console.log("Log found:", log.id, "Content length:", (log as any).content ? (log as any).content.length : 0);
        return NextResponse.json(log);

    } catch (error: any) {
        console.error("Fetch Error:", error);
        return NextResponse.json(
            { error: error.message || "Internal Server Error" },
            { status: 500 }
        );
    }
}

export async function DELETE(
    req: Request,
    props: { params: Promise<{ id: string }> }
) {
    const params = await props.params;
    try {
        const session = await getServerSession();

        if (!session || !session.user?.email) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const user = await prisma.user.findUnique({
            where: { email: session.user.email }
        });

        if (!user) {
            return NextResponse.json({ error: "User not found" }, { status: 404 });
        }

        // Delete the log (ensure it belongs to the user)
        const log = await prisma.generationLog.findUnique({
            where: { id: params.id }
        });

        if (!log || log.userId !== user.id) {
            return NextResponse.json({ error: "Not found or unauthorized" }, { status: 404 });
        }

        await prisma.generationLog.delete({
            where: { id: params.id }
        });

        return NextResponse.json({ success: true });

    } catch (error: any) {
        console.error("Delete Error:", error);
        return NextResponse.json(
            { error: error.message || "Internal Server Error" },
            { status: 500 }
        );
    }
}
