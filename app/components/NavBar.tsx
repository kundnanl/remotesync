"use client";
import Link from "next/link";
import { Button, buttonVariants } from "./ui/button";
import { ArrowRight, Loader2 } from "lucide-react";
import { useState, useEffect } from "react";
import { useClerk } from "@clerk/nextjs";
import { useRouter } from "next/navigation";

const NavBar = () => {
  const { signOut } = useClerk();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [isLogin, setIsLogin] = useState(false);
  const [retryCount, setRetryCount] = useState(0);

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

  const handleSignOut = () => {
    signOut(() => {
      setIsLogin(false);
      router.push("/");
    });
  };

  return (
    <nav className="top-0 px-20 py-2 sticky flex w-full items-center justify-between bg-white">
      <div className="text-black font-bold text-lg">RemoteSync</div>
      <div className="flex justify-end items-center space-x-4">
        {isLoading ? (
          <p className="flex">
            Loading... <Loader2 className="ml-2 animate-spin" />
          </p>
        ) : (
          <>
            {isLogin ? (
              <button
                className={
                  buttonVariants({
                    variant: "default",
                    size: "sm",
                    className: "cursor-pointer",
                  })
                }
                onClick={handleSignOut}
              >
                Sign Out
              </button>
            ) : (
              <>
                  <Link className={
                    buttonVariants({
                      variant: "default",
                      size: "sm",
                    })
                  } href="/sign-in">Sign In</Link>
                <Link
                className={
                  buttonVariants({
                    variant: "default",
                    size: "sm",
                  })
                }
                href="/sign-up"
                >
                  Get Started <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </>
            )}
          </>
        )}
      </div>
    </nav>
  );
};

export default NavBar;
