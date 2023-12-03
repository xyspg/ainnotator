import { redis } from "@/lib/upstash";
import { regularRatelimit } from "@/lib/upstash";
import {createClient} from "@/lib/supabase/server";
import { cookies } from "next/headers";
import {isDev} from "@/lib/utils";

export async function POST(req: Request) {
  const { pdfId, highlights } = await req.json();
  const cookieStore = cookies();
  const supabase = createClient(cookieStore);

  const { data: userData, error } = await supabase.auth.getUser();

  const user = userData.user;

  if (!user) {
    return new Response(JSON.stringify({ message: "Unauthorized" }), {
      status: 401,
    });
  }

  const userId = user.id;
  if (!isDev()) {
    const {success, remaining} = await regularRatelimit.limit(`annotation:${userId}`)
    if (!success) {
      return new Response(
          JSON.stringify({
            message: "You have being too frequent. Please try again later.",
          }),
          {status: 429},
      );
    }
  }
  const { data, error: insertionError } = await supabase
      .from("uploads")
      .update({
        annotations: highlights,
      })
      .eq('file_id', pdfId)

  if (insertionError) {
      return new Response(
      insertionError.message,
      { status: 500 },
      );
  }

  return new Response(
    JSON.stringify({
      message: "Annotation synced successfully.",
    }),
    {
      status: 200,
    },
  );
}
