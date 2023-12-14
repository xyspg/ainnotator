import { createClient } from "@/lib/supabase/server";
import { cookies } from "next/headers";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/app/components/ui/table";
import { Button } from "@nextui-org/react";
import Link from "next/link";

export default async function Page() {
  const cookieStore = cookies();
  const supabase = createClient(cookieStore);
  const {
    data: { user },
  } = await supabase.auth.getUser();
  const { data: orders, error } = await supabase
    .from("orders")
    .select("*")
    .eq("user_id", user?.id)
    .order("created_at", { ascending: false });
  const mapping = {
    pending: "等待支付",
    paid: "已支付",
  };

  // TODO: Add order by raw order id
  if (!orders) {
    return (
      <>
        <div className="p-32 flex flex-col gap-4">
          You have no orders.
          <Button color="primary">
            <Link href="/pricing">I Will Have Order!</Link>
          </Button>
        </div>
      </>
    );
  }
  return (
    <>
      <div className="">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Order ID</TableHead>
              <TableHead>Created At</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Amount</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {orders?.map((order) => (
              <TableRow key={order.id}>
                <TableCell>{order.order_id}</TableCell>
                <TableCell>
                  {new Date(order.created_at).toLocaleString("zh-CN")}
                </TableCell>
                <TableCell>{order.status}</TableCell>
                <TableCell>{order.product.name}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </>
  );
}
