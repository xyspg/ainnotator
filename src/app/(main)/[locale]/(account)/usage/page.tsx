import React from "react";
import { createClient } from "@/lib/supabase/server";
import { cookies } from "next/headers";
import {
  Table,
  TableHeader,
  TableCell,
  TableRow,
  TableBody,
} from "@/app/components/ui/table";
import { format } from "date-fns";

const Page = async () => {
  const supabase = createClient(cookies());
  const {
    data: { user },
  } = await supabase.auth.getUser();
  const { data, error } = await supabase
    .from("ainnotation_log")
    .select("*")
    .eq("user_id", user?.id)
    .order("created_at", { ascending: true });
  return (
    <>
      <div className="flex flex-col gap-2 p-1">
        <Table>
          <TableHeader>
            <TableRow className='text-medium text-2xl'>
              <TableCell className="w-[100px]">Time</TableCell>
              <TableCell className="w-[100px]">File Name</TableCell>
              <TableCell className="w-[100px]">Balance</TableCell>
            </TableRow>
          </TableHeader>
          <TableBody>
            {!data && <h1>Data not available.</h1>}
            {data?.map((entry, idx) => (
              <TableRow key={idx}>
                <TableCell className="w-[100px]">
                  {format(new Date(entry.created_at), "yyyy-MM-dd HH:mm:ss")}
                </TableCell>
                <TableCell className="w-[100px]">{entry.filename}</TableCell>
                <TableCell className="w-[100px]">
                  {entry.current_balance}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </>
  );
};

export default Page;
