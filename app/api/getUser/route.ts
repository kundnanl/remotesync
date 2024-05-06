import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function GET(
) {
    try {
    const { userId } = await auth();
        console.log(`User found: ${userId}`)
    if (userId === null) {
        return new NextResponse("Unauthorized", { status: 401 });
    }

    return NextResponse.json(userId);
    
    } catch (error) {
        console.log(`User not found: ${error}`)
        return new NextResponse("Internal Error", { status: 500})
    }
}