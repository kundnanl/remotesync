import { db } from "@/lib/db";
import { Prisma } from "@prisma/client";
import { NextResponse } from "next/server";
import { Webhook } from "svix";

const webhookSecret: string = process.env.WEBHOOK_SECRET || "";

export async function POST(request: Request) {
  const payload = await request.json();
  const headers = request.headers;
  const wh = new Webhook(webhookSecret);
  let evt: Event | null = null;
  try {
    evt = wh.verify(JSON.stringify(payload), {
      "svix-id": headers.get("svix-id") || "",
      "svix-timestamp": headers.get("svix-timestamp") || "",
      "svix-signature": headers.get("svix-signature") || "",
    }) as Event;
  } catch (_) {
    return NextResponse.json({}, { status: 400 });
  }

  const { id } = evt.data;
  const eventType: EventType = evt.type;

  if (eventType === "user.created" || eventType === "user.updated") {
    const { id, first_name, last_name, image_url, email_addresses } = evt.data;

    console.log(evt.data.id)


    await db.profile.upsert({
      where: { userId: id },
      update: {
        name: `${first_name} ${last_name}`,
        imageUrl: image_url,
        email:  email_addresses[0]?.email_address || "",
      },
      create: {
        userId: id,
        name: `${first_name} ${last_name}`,
        imageUrl: image_url,
        email: email_addresses[0]?.email_address || "",
      },
    });
  }

  console.log(`User ${id} was ${eventType}`);
  return NextResponse.json({}, { status: 201 });
}

type Event = {
  data: {
    id: string;
    first_name: string;
    last_name: string;
    image_url: string;
    email_addresses: { email_address: string }[];
  };
  object: "event";
  type: EventType;
};

type EventType = "user.created" | "user.updated" | "*";