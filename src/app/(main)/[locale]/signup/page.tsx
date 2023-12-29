import React from 'react';
import AuthModalPage from "@/app/(main)/[locale]/signup/auth-modal-page";
import { createClient } from "@/lib/supabase/server";
import { cookies } from "next/headers";
import {redirect} from "next/navigation";

const Page = async () => {
  const supabase = createClient(cookies());
  const {data: {user}} = await supabase.auth.getUser();
  if (user) {
    redirect('/')
  }
  return (
      <div>
        <AuthModalPage/>
      </div>
  );
};

export default Page;