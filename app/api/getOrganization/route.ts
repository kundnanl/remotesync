import { db } from "@/lib/db";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  if (req.method !== "POST") {
    return new NextResponse("Method Not Allowed", { status: 405 });
  }

  try {
    const { userId } = await req.json();

    const organization = await db.organization.findMany({
        where: {
            employees: {
                some: {
                    userId
                }
            }
        }
    })

    const profileOrganization = await db.profileOrganization.findMany({
        where: {
          profile: {
            userId
          }
        }
    })


    console.log("Organization:", organization);
    console.log("Profile Organization:", profileOrganization);

    return NextResponse.json({ organization, profileOrganization });
  } catch (error) {
    console.error("Error creating organization:", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}