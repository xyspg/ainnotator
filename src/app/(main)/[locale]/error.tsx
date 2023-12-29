"use client";
import React from "react";
import { Footer } from "@/app/(landing_page)/components/Footer";
import { Button } from "@nextui-org/react";

const Error = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <div className="text-4xl font-bold my-32 p-8 flex-grow flex-shrink-0">
        There is an error processing your request
        <p className="text-2xl">We are deeply sorry for the inconvenience. </p>
        <Button onClick={() => (window.location.href = "/")}>
          Go back to home page
        </Button>
      </div>
        <div className='flex-shrink-0'>
      <Footer />
        </div>
    </div>
  );
};

export default Error;
