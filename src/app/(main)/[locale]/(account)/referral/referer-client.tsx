"use client";
import { Input } from "@/app/components/ui/input";
import { Button } from "@/app/components/ui/button";
import React from "react";

export function RefererLinkCopier({ link }: { link: string }) {
  return (
    <>
      <div className="flex flex-row items-center gap-2">
        <Input className="" value={link} />
        <Button
          onClick={() => {
            navigator.clipboard.writeText(link);
          }}
          className="outline"
        >
          Copy
        </Button>
      </div>
    </>
  );
}
