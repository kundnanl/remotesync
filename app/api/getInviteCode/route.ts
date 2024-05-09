import { db } from "@/lib/db";
import { NextResponse } from "next/server";

export const POST = async (req: Request) => {
  if (req.method !== "POST") {
    return new NextResponse("Method Not Allowed", { status: 405 });
  }

  try {
    const { organizationId } = await req.json();

    const organization = await db.organization.findUnique({
      where: { id: organizationId as string },
    });

    if (!organization) {
      return new NextResponse("Organization not found", { status: 404 });
    }

    if (!organization.invitationCode) {
      return new NextResponse("Invite code not found", { status: 404 });
    }

    console.log("organization.invitationCode", organization.invitationCode);

    return new NextResponse(organization.invitationCode, { status: 200 });
  } catch (error) {
    console.error("Error getting invite code:", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
};
