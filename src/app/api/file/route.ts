import {
  S3Client,
  ListBucketsCommand,
  ListObjectsV2Command,
  GetObjectCommand,
  PutObjectCommand,
} from "@aws-sdk/client-s3";

import { S3 } from "../s3"
import {regularRatelimit} from "@/lib/upstash";

const Bucket = process.env.R2_BUCKET || "";


export async function POST(req: Request) {

  const formData = await req.formData();
  const file = formData.get("file") as Blob;
  console.log(file)
  if (!file) {
    return new Response("No file", { status: 400 });
  }
  const ip = req.headers.get("x-forwarded-for") || '';
  const { success, remaining } = await regularRatelimit.limit(`fileUpload:${ip}`)

    if (!success) {
        return new Response(
        JSON.stringify({
            message: "You have being too frequent. Please try again later.",
        }),
        { status: 429 },
        );
    }

  const uuid = crypto.randomUUID();

  const Body = Buffer.from(await file.arrayBuffer());

  const command = new PutObjectCommand({ Bucket, Key: `pdf/${uuid}`, Body, ContentLength: Body.length })

  if (Body.length > 25 * 1024 ** 2) {
    return new Response("Request Entity Too Large", { status: 413 });
  }
  try {
    await S3.send(command);
    return new Response(JSON.stringify({
        uuid
    }), { status: 201 });
  } catch (err: any) {
    return new Response(err.message, { status: 500 });
  }
}
