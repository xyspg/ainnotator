import { PDF } from "@/app/app/pdf"
import {GetObjectCommand} from "@aws-sdk/client-s3";
import { S3 } from "@/app/api/file/route"
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

const Bucket = process.env.R2_BUCKET || "";

export default async function Page({ params }: { params: { slug: string } }) {
    const command = new GetObjectCommand({ Bucket, Key: `pdf/${params.slug}` });
    const src = await getSignedUrl(S3, command, { expiresIn: 86400 });
    console.log("src-->",src)
  return (
      <>
      <PDF pdf={src} />
      </>
  )
}
