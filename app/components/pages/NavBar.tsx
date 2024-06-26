"use client";
import Link from "next/link";
import { buttonVariants } from "../ui/button";
import { ArrowRight, Loader2 } from "lucide-react";
import { useState, useEffect } from "react";
import { UserButton } from "@clerk/nextjs";

const NavBar = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [isLogin, setIsLogin] = useState(false);
  const [retryCount, setRetryCount] = useState(0);

  useEffect(() => {
    fetch("/api/getUser")
      .then((res) => {
        if (res.status === 401) {
          setIsLogin(false);
        }
        return res.json();
      })
      .then(() => {
        setIsLogin(true);
      })
      .catch((error) => {
        console.error("Error getting user profile:", error);
        if (retryCount < 3) {
          setRetryCount(retryCount + 1);
        } else {
          setIsLogin(false);
        }
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, [retryCount]);

  return (
    <nav className="top-0 px-20 py-2 sticky flex w-full items-center justify-between bg-white">
      <div
        onClick={() => {
          window.location.href = "/";
        }}
        className="cursor-pointer text-black font-bold text-lg"
      >
        RemoteSync.
      </div>
      <div className="flex justify-end items-center space-x-4">
        {isLoading ? (
          <p className="flex">
            Loading... <Loader2 className="ml-2 animate-spin" />
          </p>
        ) : (
          <>
            {isLogin ? (
              <UserButton afterSignOutUrl="/sign-in" />
            ) : (
              <>
                <Link
                  className={buttonVariants({
                    variant: "default",
                    size: "sm",
                  })}
                  href="/sign-in"
                >
                  Sign In
                </Link>
                <Link
                  className={buttonVariants({
                    variant: "default",
                    size: "sm",
                  })}
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
