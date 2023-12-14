"use client";
import { Fragment, useEffect } from "react";
import Link from "next/link";
import { Popover, Transition } from "@headlessui/react";
import clsx from "clsx";

import { Button } from "../(landing_page)/components/Button";
import { Container } from "../(landing_page)/components/Container";
import { Logo } from "../(landing_page)/components/Logo";
import { NavLink } from "../(landing_page)/components/NavLink";
import Toast, { toast } from "react-hot-toast";
import { useState } from "react";
import { AuthModal } from "@/app/(main)/[locale]/(auth)/Auth";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import { FaCoins } from "react-icons/fa";
import { CreditIndicator } from "@/app/components/credit-indicator";
import { UserDropdown } from "@/app/components/UserDropdown";

const supabase = createClient();

function MobileNavLink({ href, children }) {
  return (
    <Popover.Button as={Link} href={href} className="block w-full p-2">
      {children}
    </Popover.Button>
  );
}

function MobileNavIcon({ open }) {
  return (
    <svg
      aria-hidden="true"
      className="h-3.5 w-3.5 overflow-visible stroke-slate-700"
      fill="none"
      strokeWidth={2}
      strokeLinecap="round"
    >
      <path
        d="M0 1H14M0 7H14M0 13H14"
        className={clsx(
          "origin-center transition",
          open && "scale-90 opacity-0",
        )}
      />
      <path
        d="M2 2L12 12M12 2L2 12"
        className={clsx(
          "origin-center transition",
          !open && "scale-90 opacity-0",
        )}
      />
    </svg>
  );
}

function MobileNavigation() {
  return (
    <Popover>
      <Popover.Button
        className="relative z-10 flex h-8 w-8 items-center justify-center [&:not(:focus-visible)]:focus:outline-none"
        aria-label="Toggle Navigation"
      >
        {({ open }) => <MobileNavIcon open={open} />}
      </Popover.Button>
      <Transition.Root>
        <Transition.Child
          as={Fragment}
          enter="duration-150 ease-out"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="duration-150 ease-in"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <Popover.Overlay className="fixed inset-0 bg-slate-300/50" />
        </Transition.Child>
        <Transition.Child
          as={Fragment}
          enter="duration-150 ease-out"
          enterFrom="opacity-0 scale-95"
          enterTo="opacity-100 scale-100"
          leave="duration-100 ease-in"
          leaveFrom="opacity-100 scale-100"
          leaveTo="opacity-0 scale-95"
        >
          <Popover.Panel
            as="div"
            className="absolute inset-x-0 top-full mt-4 flex origin-top flex-col rounded-2xl bg-white p-4 text-lg tracking-tight text-slate-900 shadow-xl ring-1 ring-slate-900/5"
          >
            <MobileNavLink href="#features">History</MobileNavLink>
            <MobileNavLink href="#testimonials">Pricing</MobileNavLink>
            <hr className="m-2 border-slate-300/40" />
            <MobileNavLink href="/signup">Sign Up</MobileNavLink>
          </Popover.Panel>
        </Transition.Child>
      </Transition.Root>
    </Popover>
  );
}

export function Header({ user, credit }) {
  const [modalOpen, setModalOpen] = useState(false);
  const router = useRouter();
  return (
    <>
      <header className="py-10">
        <Container>
          <AuthModal showModal={modalOpen} setShowModal={setModalOpen} />

          <nav className="relative z-50 flex justify-between">
            <div className="flex items-center md:gap-x-12">
              <Link href="/" aria-label="Home">
                <Logo className="h-10 w-auto" />
              </Link>
              <div className="hidden md:flex md:gap-x-6">
                <NavLink href="/history">History</NavLink>
                <NavLink href="/pricing">Pricing</NavLink>
              </div>
            </div>
            <div className="flex items-center gap-x-5 md:gap-x-8">
              {user ? (
                <>
                  <UserDropdown user={user} />
                </>
              ) : (
                <>
                  <Button
                    className="hidden md:block"
                    onClick={() => {
                      setModalOpen(true);
                      // analytics.track("Open Sign In Modal")
                    }}
                    color="blue"
                  >
                    <span>Sign In</span>
                  </Button>
                </>
              )}
              {user && <CreditIndicator />}

              <div className="-mr-1 md:hidden">
                <MobileNavigation />
              </div>
            </div>
          </nav>
        </Container>
      </header>
    </>
  );
}
