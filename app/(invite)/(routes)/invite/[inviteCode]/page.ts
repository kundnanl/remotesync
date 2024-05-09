import { currentProfile } from "@/lib/current-profile";
import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { NextResponse } from "next/server";

interface InviteCodePageProps {
  params: {
    inviteCode: string;
  };
}

const InviteCodePage = async ({ params }: InviteCodePageProps) => {
  const profile = await currentProfile();

  if (!profile) {
    return auth().redirectToSignIn();
  }

  if (!params.inviteCode) {
    return redirect("/");
  }

  const existingOrganization = await db.organization.findFirst({
    where: {
      invitationCode: params.inviteCode,
    },
  });

  if (!existingOrganization) {
    return new NextResponse("Not Found", { status: 404 });
  }

  const existingMember = await db.profileOrganization.findFirst({
    where: {
      organizationId: existingOrganization.id,
      profileId: profile.id,
    },
  });

  if (existingMember) {
    return redirect(`/organizations/${existingOrganization.id}`);
  }

  await db.organization.update({
    where: {
      id: existingOrganization.id,
    },
    data: {
      employees: {
        connect: {
          userId: profile.userId,
        },
      },
    },
  });

  const created = await db.profileOrganization.create({
    data: {
      organizationId: existingOrganization.id,
      profileId: profile.id,
      role: "MEMBER",
    },
  });

  if (!created) {
    return new NextResponse("Error joining organization", { status: 500 });
  }

  return redirect(`/dashboard`);
};

export default InviteCodePage;
