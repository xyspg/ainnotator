"use client";
import React, { useEffect } from "react";
import { Footer } from "@/app/(landing_page)/components/Footer";
import { Button } from "@nextui-org/react";

const Error = ({
                 error,
                 reset,
               }: {
  error: Error & { digest?: string };
  reset: () => void;
}) => {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error(error);
  }, [error]);
  return (
    <div className="min-h-screen flex flex-col">
      <div className="text-4xl font-bold my-32 p-8 flex-grow flex-shrink-0">
        There is an error processing your request
        <p className="text-2xl">We are deeply sorry for the inconvenience. </p>
        <p className="text-sm font-light font-mono my-2 bg-neutral-100 px-4 py-2 shadow-md">
          {error?.message}
          {error?.digest && `\nError digest: ${error?.digest}`}
        </p>

        <Button onClick={() => reset()}>Try again</Button>
        <Button color='primary' className='ml-1' onClick={() => {
          window.location.href = "/";
        }}>Go to Home</Button>
      </div>
      <div className="flex-shrink-0">
        <Footer/>
      </div>
    </div>
  );
};

export default Error;
