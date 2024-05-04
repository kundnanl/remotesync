"use client";
import MaxWidthWrapper from "@/components/ui/MaxWidthWrapper";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import Image from "next/image";

const HomePage = () => {
  const handleGetStartedClick = () => {};

  return (
    <MaxWidthWrapper className="mb-12 mt-28 sm:mt-40 flex flex-col items-center justify-center text-center">
    <div className="">
      <div className="">
      <h1 className="text-5xl font-bold">
      Connecting teams 
        <span className="text-pink-400"> Seamlessly </span>
        in a virtual workspace.
      </h1>
      <p className="text-sm mt-4 ">
        RemoteSync is a platform that helps remote teams to work together
        effectively. It provides a virtual workspace where team members can
        collaborate, communicate, and share their work.
      </p>
      </div>
      <Button className="mt-4" onClick={handleGetStartedClick}>
        Get Started
        <ArrowRight className="w-5 h-5 ml-2" />
      </Button>
      {/* <div className="flex items-center justify-center">
          <Image
            className="mt-8 rounded-lg"
            src={"/homepage.png"}
            alt={" "}
            width={850}
            height={1000}
          />
      </div> */}
    </div>
    </MaxWidthWrapper>
  );
};

export default HomePage;
