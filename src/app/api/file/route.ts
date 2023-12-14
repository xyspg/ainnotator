import { PutObjectCommand } from "@aws-sdk/client-s3";

import { createClient } from "@/lib/supabase/server";

import { S3 } from "../s3";
import { regularRatelimit } from "@/lib/upstash";
import { isDev } from "@/lib/utils";
import { cookies } from "next/headers";

const Bucket = process.env.R2_BUCKET || "";

export async function POST(req: Request): Promise<Response> {
  const formData = await req.formData();

  const file = formData.get("file") as Blob;
  //@ts-expect-error
  const filename = file.name;
  const cookieStore = cookies();
  const supabase = createClient(cookieStore);

  const { data: userData, error } = await supabase.auth.getUser();

  const user = userData.user;

  if (!user) {
    return new Response(JSON.stringify({ message: "Unauthorized" }), {
      status: 401,
    });
  }


  if (!file) {
    return new Response("No file", { status: 400 });
  }
  const userId = user.id;

  /*
   * Rate Limiting
   * Not enabled in localhost
   */

  if (!isDev()) {
    const { success, remaining } = await regularRatelimit.limit(
      `fileUpload:${userId}`,
    );

    if (!success) {
      return new Response(
        JSON.stringify({
          message: "You have being too frequent. Please try again later.",
        }),
        { status: 429 },
      );
    }
  }

  const uuid = crypto.randomUUID();

  const Body = Buffer.from(await file.arrayBuffer());

  const command = new PutObjectCommand({
    Bucket,
    Key: `pdf/${uuid}`,
    Body,
  });

  if (Body.length > 25 * 1024 ** 2) {
    return new Response("Request Entity Too Large", { status: 413 });
  }

  try {
    await S3.send(command);
  } catch (err: any) {
    return new Response(err.message, { status: 500 });
  }
  console.log(user.email);

  const { error: insertionError } = await supabase.from("uploads").insert({
    user_id: userId,
    email: user.email,
    filename,
    file_id: uuid,
    filesize: file.size,
  });
  if (insertionError) {
    return new Response(insertionError.message, { status: 500 });
  }
  return new Response(
    JSON.stringify({
      uuid,
    }),
    { status: 201 },
  );
}
