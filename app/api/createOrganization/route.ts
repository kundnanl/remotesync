import { db } from "@/lib/db";
import { NextResponse } from "next/server";
import { v4 as uuidv4 } from "uuid";

export async function POST(req: Request) {
  if (req.method !== "POST") {
    return new NextResponse("Method Not Allowed", { status: 405 });
  }

  try {
    const { name, description, imageUrl, userId } = await req.json();

    const organization = await db.organization.create({
      data: {
        name,
        description,
        imageUrl,
        invitationCode: uuidv4(),
        createdBy: userId, 
        employees: {
          connect: {
            userId 
          }
        },
        ProfileOrganization: {
          create: {
            profile: {
              connect: {
                userId
              }
            },
            role: "ADMIN"
          }
        }
      },
      include: {
        employees: true,
        ProfileOrganization: true
      }
    });

    return NextResponse.json(organization);
  } catch (error) {
    console.error("Error creating organization:", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}