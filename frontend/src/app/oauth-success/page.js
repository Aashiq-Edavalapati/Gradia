"use client";
import { Suspense, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useError } from "@/contexts/ErrorContext";

const OAuthSuccessContent = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { showError } = useError();

  useEffect(() => {
    const error = searchParams.get("error");
    const message = searchParams.get("message");
    const token = searchParams.get("token");

    if (error && message) {
      router.push(`/?error=${error}&message=${message}`);
      return;
    }

    if (token) {
      router.push("/");
    } else {
      router.push("/signin");
    }
  }, [searchParams, router, showError]);

  return (
    <div className="flex justify-center items-center min-h-screen bg-[#edead7]">
      <div className="flex flex-col items-center space-y-4">
        <div className="animate-spin w-16 h-16 border-t-4 border-black rounded-full"></div>
        <p className="text-2xl text-black font-bold tracking-wider">
          Processing your login...
        </p>
      </div>
    </div>
  );
};

const OAuthSuccess = () => (
  <Suspense fallback={<div>Loading...</div>}>
    <OAuthSuccessContent />
  </Suspense>
);

export default OAuthSuccess;
