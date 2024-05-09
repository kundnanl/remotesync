import { db } from "@/lib/db";
import { NextResponse } from "next/server";
import { v4 as uuidv4 } from "uuid";

export const POST = async (req: Request) => {
  if (req.method !== "POST") {
    return new NextResponse("Method Not Allowed", { status: 405 });
  }

  try {
    const { organizationId } = await req.json();

    console.log("organizationId", organizationId);

    const organization = await db.organization.update({
      where: { id: organizationId },
      data: {
        invitationCode: uuidv4(),
      },
    });

    if (!organization) {
      return new NextResponse("Organization not found", { status: 404 });
    }

    if (!organization.invitationCode) {
      return new NextResponse("Error generating invite code", { status: 500 });
    }

    return NextResponse.json(
      { invitationCode: organization.invitationCode },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error generating invite code:", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
};
