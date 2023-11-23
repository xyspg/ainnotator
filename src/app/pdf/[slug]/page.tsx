import { PDF } from "@/app/app/pdf"
import {GetObjectCommand, HeadObjectCommand} from "@aws-sdk/client-s3";
import { S3 } from "@/app/api/file/route"
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { Button } from "@nextui-org/react";
import Link from "next/link";

const Bucket = process.env.R2_BUCKET || "";

export default async function Page({ params }: { params: { slug: string } }) {
    const isExist = await S3.send(new HeadObjectCommand({ Bucket, Key: `pdf/${params.slug}` })).then(() => true).catch(() => false);
    const command = new GetObjectCommand({ Bucket, Key: `pdf/${params.slug}` });
    const src = await getSignedUrl(S3, command, { expiresIn: 86400 });

    if (!isExist) {
        return (
            <div className="p-8 mt-24 md:mt-0 md:p-48 flex flex-col gap-8 items-start">
            <h1 className="font-mono text-5xl font-medium">404 Not Found</h1>
                <p className="text-2xl font-medium font-sans">The requested PDF does not exist. Uploaded PDF will only be saved for 7 days.</p>
                <Link href="/" ><Button color="primary">Go Back</Button></Link>
            </div>
        )
    }

  return (
      <>
      <PDF pdf={src} />
      </>
  )
}
