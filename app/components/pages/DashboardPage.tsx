"use client"
import { useEffect, useState } from "react";
import { Profile, Organization, ProfileOrganization } from "@prisma/client";
import { Button } from "@/components/ui/button";
import CreateOrganizationModal from "../modals/create-organization-modal";
import router from "next/router";
import Link from "next/link";
import { Crown, Ghost, Loader2, Plus, Trash, Users } from "lucide-react";
import { format } from "date-fns";
import { InviteOrganizationModal } from "../modals/InviteOrganizationModal";
import { useModal } from "@/hooks/use-modal-store";

const DashboardPage = () => {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [isCreateOrganizationModalOpen, setCreateOrganizationModalOpen] =
    useState(false);
  const [organizations, setOrganizations] = useState<Organization[]>([]);
  const [profileOrganization, setProfileOrganization] = useState<
    ProfileOrganization[]
  >([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDeletingOrganization, setIsDeletingOrganization] = useState<
    Record<string, boolean>
  >({});
  const [selectedOrganizationId, setSelectedOrganizationId] = useState("");
  const { onOpen } = useModal();

  useEffect(() => {
    fetch("/api/getUserProfile")
      .then((res) => {
        if (res.status === 401) {
          router.push("/sign-in");
        }
        return res.json();
      })
      .then((data) => {
        setProfile(data);
      })
      .catch((error) => {
        console.error("Error getting user profile:", error);
      });
  }, []);

  useEffect(() => {
    if (profile) {
      fetchOrganizations(profile.userId);
    }
  }, [profile]);

  const fetchOrganizations = (userId: string) => {
    setIsLoading(true);
    fetch("/api/getOrganization", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ userId }),
    })
      .then((res) => {
        if (res.status === 401) {
          router.push("/sign-in");
        }
        return res.json();
      })
      .then((data) => {
        const { organization, profileOrganization } = data;
        setOrganizations(organization);
        setProfileOrganization(profileOrganization);
      })
      .catch((error) => {
        console.error("Error getting organization data:", error);
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  const handleCreateOrganization = () => {
    setCreateOrganizationModalOpen(true);
  };

  const handleOrganizationUpdated = () => {
    if (profile) {
      fetchOrganizations(profile.userId);
    }
  };

  const openInviteModal = (organizationId: string) => {
    setSelectedOrganizationId(organizationId);
    onOpen("inviteOrganization");
  };

  const deleteOrganization = (organizationId: string) => {
    setIsDeletingOrganization((prev) => ({ ...prev, [organizationId]: true }));
    fetch("/api/deleteOrganization", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ organizationId }),
    })
      .then((res) => {
        if (res.status === 401) {
        }
        return res.json();
      })
      .then(() => {
        setOrganizations((prevOrganizations) =>
          prevOrganizations.filter(
            (organization) => organization.id !== organizationId
          )
        );
      })
      .catch((error) => {
        console.error("Error deleting organization:", error);
      })
      .finally(() => {
        setIsDeletingOrganization((prev) => ({
          ...prev,
          [organizationId]: false,
        }));
        handleOrganizationUpdated();
      });
  };

  return (
    <>
      <main className="mx-auto max-w-7xl md:p-10">
        <div className="flex flex-col gap-4 sm:flex sm:!flex-row sm:!items-center sm:!gap-0 items-start justify-between border-b border-gray-200 pb-5">
          <h1 className="mb-3 font-bold text-5xl text-gray-900">
            Organizations
          </h1>

          <Button
            variant={"ghost"}
            className="border"
            onClick={handleCreateOrganization}
          >
            Create Organization
          </Button>
        </div>

        {organizations && organizations?.length !== 0 ? (
          <ul className="mt-8 grid grid-cols-1 gap-4 divide-y divide-zinc-200 md:grid-cols-2 lg:grid-cols-3">
            {organizations
              .sort(
                (a, b) =>
                  new Date(b.createdAt).getTime() -
                  new Date(a.createdAt).getTime()
              )
              .map((organization) => {
                const isAdmin = profileOrganization.some(
                  (profileOrg) =>
                    profileOrg.organizationId === organization.id &&
                    profileOrg.role === "ADMIN"
                );
                return (
                  <li
                    key={organization.id}
                    className="col-span-1 divide-y divide-gray-200 rounded-lg bg-white shadow transition hover:shadow-lg"
                  >
                    <Link
                      href={`/dashboard/${organization.id}`}
                      className="flex flex-col gap-2"
                    >
                      <div className="flex flex-col ">
                        <div className="pt-6 px-6 flex w-full items-center justify-between space-x-6">
                          <div className="relative h-10 w-10 flex-shrink-0 rounded-full">
                            <img
                              src={organization.imageUrl}
                              alt={organization.name}
                              className="h-10 w-10 rounded-full object-cover"
                            />
                            {isAdmin ? (
                              <div className="absolute -top-1 -right-1 z-10">
                                <Crown className="w-4 h-4 text-yellow-600 fill-yellow-600" />
                              </div>
                            ) : (
                              <div className="absolute -top-1 -right-1 z-10">
                                <Users className="w-4 h-4 text-gray-600 fill-gray-600" />
                              </div>
                            )}
                          </div>
                          <div className="flex-1 truncate">
                            <div className="flex items-center space-x-3">
                              <h3 className="truncate text-lg font-medium text-zinc-900">
                                {organization.name}
                              </h3>
                            </div>
                          </div>
                        </div>
                        <div>
                          <p className="px-6 py-4 text-sm text-zinc-500">
                            {organization.description}
                          </p>
                        </div>
                      </div>
                    </Link>

                    <div className="px-6 grid grid-cols-3 place-items-center py-2 gap-6 text-xs text-zinc-500">
                      <Button
                        onClick={() => openInviteModal(organization.id)}
                        size="sm"
                        className="w-full"
                        variant="default"
                      >
                        <Plus className="h-4 w-4 mr-2" />
                        Invite
                      </Button>

                      {format(new Date(organization.createdAt), "dd MMM yyyy")}

                      <Button
                        onClick={() => deleteOrganization(organization.id)}
                        size="sm"
                        className="w-full"
                        variant="destructive"
                      >
                        {isDeletingOrganization[organization.id] ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          <Trash className="h-4 w-4" />
                        )}
                      </Button>
                    </div>
                  </li>
                );
              })}
          </ul>
        ) : isLoading ? (
          <Loader2 height={100} className="my-2 ml-4 animate-spin" />
        ) : (
          <div className="mt-16 flex flex-col items-center gap-2">
            <Ghost className="h-8 w-8 text-zinc-800" />
            <h3 className="font-semibold text-xl">Pretty empty around here</h3>
            <p>Let&apos;s upload your first PDF.</p>
          </div>
        )}
      </main>
      <InviteOrganizationModal organizationId={selectedOrganizationId} />
      <CreateOrganizationModal
        isOpen={isCreateOrganizationModalOpen}
        onClose={() => setCreateOrganizationModalOpen(false)}
        onOrganizationCreated={handleOrganizationUpdated}
      />
    </>
  );
};

export default DashboardPage;
