import {
  S3Client,
  ListBucketsCommand,
  ListObjectsV2Command,
  GetObjectCommand,
  PutObjectCommand,
} from "@aws-sdk/client-s3";


const ACCOUNT_ID = process.env.R2_ACCOUNT_ID;
const ACCESS_KEY_ID = process.env.R2_ACCESS_KEY_ID || "";
const SECRET_ACCESS_KEY = process.env.R2_SECRET_ACCESS_KEY || "";
const Bucket = process.env.R2_BUCKET || "";

export const S3 = new S3Client({
  region: "auto",
  endpoint: `https://${ACCOUNT_ID}.r2.cloudflarestorage.com`,
  credentials: {
    accessKeyId: ACCESS_KEY_ID,
    secretAccessKey: SECRET_ACCESS_KEY,
  },
});



export async function POST(req: Request) {

  const formData = await req.formData();
  const file = formData.get("file");

  console.log("file",file);

  if (!file) {
    return new Response("No file", { status: 400 });
  }

  const uuid = crypto.randomUUID();

  try {
    //@ts-ignore
    const Body = await file.arrayBuffer();
    S3.send(new PutObjectCommand({ Bucket, Key: `pdf/${uuid}`, Body }));
    return new Response(JSON.stringify({
        uuid
    }), { status: 201 });
  } catch (err: any) {
    return new Response(err.message, { status: 500 });
  }
}
