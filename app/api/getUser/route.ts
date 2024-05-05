import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function GET(
) {
    try {
    const user = await auth();
        console.log(`User found: ${user}`)
    if (user.userId === null) {
        return new NextResponse("Unauthorized", { status: 401 });
    }

    return NextResponse.json(user);
    
    } catch (error) {
        console.log(`User not found: ${error}`)
        return new NextResponse("Internal Error", { status: 500})
    }
}