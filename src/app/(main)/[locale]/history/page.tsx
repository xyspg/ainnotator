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

import Link from "next/link";

export default async function Page() {
  const cookieStore = cookies();
  const supabase = createClient(cookieStore);
  const { data: user } = await supabase.auth.getUser();
  const { data, error } = await supabase
    .from("uploads")
    .select("created_at, filename, file_id")
    .eq("user_id", user?.user?.id);
  console.log(data);

  return (
    <div className="p-28 flex flex-row gap-4">
      <Table suppressHydrationWarning={true}>
        <TableHeader>
          <TableRow>
            <TableHead>Filename</TableHead>
            <TableHead>Time</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data?.map((file) => (
            <TableRow key={file.file_id} className="relative">
              <TableCell>{file.filename}</TableCell>
              <TableCell>
                {new Date(file.created_at).toLocaleString("zh-CN")}
              </TableCell>
              <Link
                href={`/pdf/${file.file_id}`}
                className="absolute inset-0"
              />
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
