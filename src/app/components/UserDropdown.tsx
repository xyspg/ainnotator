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
  Github, HistoryIcon,
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
import {FaMoneyBill} from "react-icons/fa";
import {useSWRConfig} from "swr";
import {useTranslations} from "next-intl";

export function UserDropdown({ user }: { user: SupabaseUser }) {
  const t = useTranslations('UserDropdown')
  const supabase = createClient();
  const router = useRouter();
  const { mutate } = useSWRConfig()
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
          <DropdownMenuItem className='relative'>
            <CreditCard className="mr-2 h-4 w-4" />
            <Link href="/orders" className='absolute inset-0' />
              <span>{t('order')}</span>
          </DropdownMenuItem>
          <DropdownMenuItem className='relative'>
            <HistoryIcon className="mr-2 h-4 w-4" />
            <Link href="/usage" className='absolute inset-0' />
            <span>{t('usage')}</span>
          </DropdownMenuItem>
          <DropdownMenuItem className='relative'>
            <Settings className="mr-2 h-4 w-4" />
            <Link href="/settings" className='absolute inset-0'/>
              <span>{t('settings')}</span>
          </DropdownMenuItem>
          {/*<DropdownMenuItem>*/}
          {/*  <Keyboard className="mr-2 h-4 w-4" />*/}
          {/*  <span>Keyboard shortcuts</span>*/}
          {/*  <DropdownMenuShortcut>⌘K</DropdownMenuShortcut>*/}
          {/*</DropdownMenuItem>*/}
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem className='relative'>
            <UserPlus className="mr-2 h-4 w-4" />
            <Link href="/referral" className='absolute inset-0' />
              <span>{t('referral')}</span>
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        {/*<DropdownMenuItem>*/}
        {/*  <Github className="mr-2 h-4 w-4" />*/}
        {/*  <span>GitHub</span>*/}
        {/*</DropdownMenuItem>*/}
        <DropdownMenuItem className='relative'>
          <LifeBuoy className="mr-2 h-4 w-4" />
          <Link href="mailto:support@ainnotator.com" data-umami-event="click_support" className='absolute inset-0'/>
          <span>{t('support')}</span>
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
            mutate('user')
            router.refresh();
          }}
        >
          <LogOut className="mr-2 h-4 w-4" />
          <span>{t('logout')}</span>
          <DropdownMenuShortcut>⇧⌘Q</DropdownMenuShortcut>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
