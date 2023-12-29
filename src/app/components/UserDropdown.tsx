import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuPortal,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/app/components/ui/dropdown-menu";
import { Button } from "@/app/components/ui/button";
import {
  Cloud,
  CreditCard,
  Github,
  Keyboard,
  LifeBuoy,
  LogOut,
  Mail,
  MessageSquare,
  Plus,
  PlusCircle,
  Settings,
  User,
  UserPlus,
  Users,
} from "lucide-react";

import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";

import type { User as SupabaseUser } from "@supabase/supabase-js";
import Link from "next/link";
import Image from "next/image";
import { isDev } from "@/lib/utils";

export function UserDropdown({ user }: { user: SupabaseUser }) {
  const supabase = createClient();
  const router = useRouter();
  router.prefetch("/orders");
  router.prefetch("/settings");
  router.prefetch("/referral");
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        {user?.user_metadata?.avatar_url ? (
          <img
            alt={user?.email!}
            className="w-8 h-8 rounded-full"
            width={32}
            height={32}
            src={user?.user_metadata?.avatar_url}
          />
        ) : (
          <p
            className="w-8 h-8 bg-slate-700
             flex justify-center items-center uppercase cursor-pointer
             rounded-full text-white"
          >
            {user.email?.split("")[0]}
          </p>
        )}
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56">
        <DropdownMenuLabel>{user?.email}</DropdownMenuLabel>

        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          {/*<DropdownMenuItem>*/}
          {/*  <User className="mr-2 h-4 w-4" />*/}
          {/*  <span>Profile</span>*/}
          {/*  <DropdownMenuShortcut>⇧⌘P</DropdownMenuShortcut>*/}
          {/*</DropdownMenuItem>*/}
          <DropdownMenuItem>
            <CreditCard className="mr-2 h-4 w-4" />
            <Link href="/orders">
              <span>Orders</span>
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem>
            <Settings className="mr-2 h-4 w-4" />
            <Link href="/settings">
              <span>Settings</span>
            </Link>
          </DropdownMenuItem>
          {/*<DropdownMenuItem>*/}
          {/*  <Keyboard className="mr-2 h-4 w-4" />*/}
          {/*  <span>Keyboard shortcuts</span>*/}
          {/*  <DropdownMenuShortcut>⌘K</DropdownMenuShortcut>*/}
          {/*</DropdownMenuItem>*/}
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem>
            <UserPlus className="mr-2 h-4 w-4" />
            <Link href="/referral">
              <span>Referral Program</span>
            </Link>
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        {/*<DropdownMenuItem>*/}
        {/*  <Github className="mr-2 h-4 w-4" />*/}
        {/*  <span>GitHub</span>*/}
        {/*</DropdownMenuItem>*/}
        <DropdownMenuItem>
          <LifeBuoy className="mr-2 h-4 w-4" />
          <span>Support</span>
        </DropdownMenuItem>
        <DropdownMenuItem disabled>
          <Cloud className="mr-2 h-4 w-4" />
          <span>API</span>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          onClick={async () => {
            await supabase.auth.signOut();
            // analytics.track("Click Sign Out Button");
            router.refresh();
          }}
        >
          <LogOut className="mr-2 h-4 w-4" />
          <span>Log out</span>
          <DropdownMenuShortcut>⇧⌘Q</DropdownMenuShortcut>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
