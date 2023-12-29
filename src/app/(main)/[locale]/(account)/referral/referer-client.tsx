"use client";
import { Input } from "@/app/components/ui/input";
import { Button } from "@/app/components/ui/button";
import React from "react";
import toast, { Toaster } from 'react-hot-toast';
import { createClient } from "@/lib/supabase/client";
import { useUser } from "@/lib/hooks/use-user";

export function RefererLinkCopier({ link }: { link: string }) {
    const { user } = useUser();
    console.log(user);
    return (
    <>
        <Toaster />
      <div className="flex flex-row items-center gap-2">
        <Input readOnly value={link} />
        <Button
            data-umami-event="copy_referer_link"
            data-umami-event-email={user?.email}
          onClick={() => {
            navigator.clipboard.writeText(link);
            toast.success("Copied to clipboard");
          }}
          className="outline"
        >
          Copy
        </Button>
      </div>
    </>
  );
}
