"use client"
import { useAuth } from "@clerk/nextjs";
import { useRouter } from "next/navigation";

const Dashboard = () => {
    const { userId } = useAuth();
    const router = useRouter();

    if (!userId) {
        router.push("/");
    }

  return (
    <div className="flex items-center justify-center min-h-screen">
      <h1>Dashboard</h1>
    </div>
  );
};

export default Dashboard;
