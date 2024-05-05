import HomePage from "@/app/components/HomePage";
import NavBar from "@/app/components/NavBar";
import MaxWidthWrapper from "@/app/components/ui/MaxWidthWrapper";

const RootPage = () => {
  
  return (
    <>
      <NavBar />
      <MaxWidthWrapper className="mb-12 mt-28 sm:mt-48 flex flex-col items-center justify-center text-center">
        <HomePage />
      </MaxWidthWrapper>
    </>
  );
};

export default RootPage;
