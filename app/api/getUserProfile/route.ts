import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function GET() {
    try {
        const { userId } = await auth();

        if (!userId) {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        const profile = await db.profile.findUnique({
            where: {
                userId,
            },
        });

        if (!profile) {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        console.log(`profile: ${profile}`);

        return NextResponse.json(profile);
    }
    catch (error) {
        console.log(`User not found: ${error}`);
        return new NextResponse("Internal Error", { status: 500 });
    }
}
