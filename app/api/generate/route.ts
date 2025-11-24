import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { generateContent } from "@/lib/ai/gemini";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
    try {
        const session = await getServerSession();

        if (!session || !session.user?.email) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const { prompt, style } = await req.json();

        if (!prompt) {
            return NextResponse.json({ error: "Prompt is required" }, { status: 400 });
        }

        // Call Gemini AI
        const result = await generateContent(prompt, style);

        // Save to Database
        const user = await prisma.user.findUnique({
            where: { email: session.user.email }
        });

        if (user) {
            await prisma.generationLog.create({
                data: {
                    userId: user.id,
                    prompt: prompt,
                    model: "gemini-2.0-flash",
                    content: JSON.stringify(result),
                } as any
            });

            // Optionally save as a Document automatically or let user decide
            // For now, we just log it.
        }

        return NextResponse.json(result);

    } catch (error: any) {
        console.error("API Error:", error);
        return NextResponse.json(
            { error: error.message || "Internal Server Error" },
            { status: 500 }
        );
    }
}
