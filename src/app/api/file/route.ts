import {
  S3Client,
  ListBucketsCommand,
  ListObjectsV2Command,
  GetObjectCommand,
  PutObjectCommand,
} from "@aws-sdk/client-s3";

import { S3 } from "../s3"

const Bucket = process.env.R2_BUCKET || "";


export async function POST(req: Request) {

  const formData = await req.formData();
  const file = formData.get("file") as Blob;

  if (!file) {
    return new Response("No file", { status: 400 });
  }
  // 15 mb max

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
