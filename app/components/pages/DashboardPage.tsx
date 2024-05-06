"use client"
import { useEffect, useState } from "react";
import { Profile } from "@prisma/client";
import { Button } from "@/components/ui/button";
import CreateOrganizationModal from "../modals/create-organization-modal";
import router from "next/router";

const DashboardPage = () => {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [isCreateOrganizationModalOpen, setCreateOrganizationModalOpen] = useState(false);

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


  const handleCreateOrganization = () => {
    setCreateOrganizationModalOpen(true);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <h1>Dashboard</h1>
      <p>Welcome {profile?.userId}</p>
      <Button onClick={handleCreateOrganization}>Create Organization</Button>
      <CreateOrganizationModal isOpen={isCreateOrganizationModalOpen} onClose={() => setCreateOrganizationModalOpen(false)} />
    </div>
  );
};

export default DashboardPage;