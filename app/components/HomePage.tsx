"use client";
import { ArrowRight, Loader2 } from "lucide-react";
import { Button } from "./ui/button";
import { useRouter } from "next/navigation";
import { useUser } from "@clerk/nextjs";
import { useState, useEffect } from "react";

const HomePage = () => {
  const router = useRouter();

  const [isLogin, setIsLogin] = useState(false);
  const [retryCount, setRetryCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkUserStatus = async () => {
      try {
        const res = await fetch("/api/getUser");
        if (res.status === 200) {
          setIsLogin(true);
        }
      } catch (error) {
        console.error("Error checking user status:", error);
        if (retryCount < 3) {
          setTimeout(() => {
            setRetryCount(retryCount + 1);
          }, 3000);
        } else {
          setIsLoading(false);
        }
      } finally {
        setIsLoading(false);
      }
    };

    checkUserStatus();
  }, [retryCount]);

  const handleGetStartedClick = () => {
    router.push("/sign-up");
  };

  return (
    <div className="flex flex-col items-center justify-center">
      <div className="flex flex-col items-center justify-center">
        <p className="border rounded-full max-w-fit px-2 py-1 sm:px-4 sm:py-2 shadow-sm bg-white text-xs sm:text-sm font-semibold mb-2">
          Started Working on Remote Sync :{")"}
        </p>
        <h1 className="text-2xl sm:text-5xl font-bold">
          Connecting teams
          <span className="text-blue-600"> Seamlessly </span>
          in a virtual workspace.
        </h1>
        <p className="text-sm mt-4 mx-16 sm:text-md sm:mt-6 sm:mx-28">
          RemoteSync is a platform that helps remote teams to work together
          effectively. It provides a virtual workspace where team members can
          collaborate, communicate, and share their work.
        </p>
      </div>
      {isLoading ? (
        <p className="mt-4 flex ">
          Loading... <Loader2 className="ml-2 animate-spin" />
        </p>
      ) : (
        <>
          {!isLogin ? (
            <Button className="mt-4 rounded-lg" onClick={handleGetStartedClick}>
              Get Started
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
          ) : (
            <Button
              className="mt-4 rounded-lg"
              onClick={() => {
                router.push("/dashboard");
              }}
            >
              Go to DashBoard
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
          )}{" "}
        </>
      )}
    </div>
  );
};

export default HomePage;
