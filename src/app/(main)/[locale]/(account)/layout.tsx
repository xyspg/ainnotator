import { Separator } from "@/app/components/ui/separator";
import { SidebarNav } from "@/app/components/sidebar-nav";

const sidebarNavItems = [
  {
    title: "订单记录",
    href: "/orders",
  },
  {
    title: "引荐计划",
    href: "/referral",
  },
  {
    title: "设置",
    href: "/settings",
  },
];

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <div className="p-8">
        <div className="p-6 space-y-6 md:p-10 pb-16 md:block dark:text-neutral-200">
          <Separator className="my-6" />
          <div className="flex flex-col space-y-8 lg:flex-row lg:space-x-12 lg:space-y-0">
            <aside className="-mx-4 lg:w-1/5 dark:text-neutral-200">
              <SidebarNav items={sidebarNavItems} />
            </aside>
            <div className="flex-1 lg:max-w-2xl">{children}</div>
          </div>
        </div>
      </div>
    </>
  );
}
