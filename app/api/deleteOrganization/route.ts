import { db } from "@/lib/db";
import { NextResponse } from "next/server";

export const POST = async (req: Request) => {
  if (req.method !== "POST") {
    return new NextResponse("Method Not Allowed", { status: 405 });
  }

  try {
    const { organizationId } = await req.json();

    const organization = await db.organization.findUnique({
      where: { id: organizationId },
    });

    if (!organization) {
      return new NextResponse("Organization not found", { status: 404 });
    }

    // Delete from ProfileOrganization table
    await db.profileOrganization.deleteMany({
      where: { organizationId },
    });

    // Delete from Organization table
    await db.organization.delete({
      where: { id: organizationId },
    });

    return new NextResponse("Organization deleted successfully", {
      status: 200,
    });
  } catch (error) {
    console.error("Error deleting organization:", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
};
