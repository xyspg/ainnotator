import { createClient } from "@/lib/supabase/server";
import { cookies } from "next/headers";
import { Card, CardHeader } from "@nextui-org/react";
import Link from "next/link";

export default async function Page() {
  const cookieStore = cookies();
  const supabase = createClient(cookieStore);
  const { data: user } = await supabase.auth.getUser();
  const { data, error } = await supabase
    .from("uploads")
    .select("filename, file_id")
    .eq("user_id", user?.user?.id);
  console.log(data);

  return (
    <div className="p-32 flex flex-row gap-4">
      {data?.map((file) => (
        <Link key={file.file_id} href={`/pdf/${file.file_id}`}>
          <Card>
            <CardHeader>{file.filename}</CardHeader>
          </Card>
        </Link>
      ))}
    </div>
  );
}
