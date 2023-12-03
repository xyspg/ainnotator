import { PDF } from "@/app/app/pdf";
import { notFound } from "next/navigation";

import { GetObjectCommand, HeadObjectCommand } from "@aws-sdk/client-s3";
import { S3 } from "@/app/api/s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { createClient } from "@/lib/supabase/client";
import { IHighlight } from "@/lib/react-pdf-highlighter";

const Bucket = process.env.R2_BUCKET || "";

export default async function Page({ params }: { params: { slug: string } }) {
  const isExist = await S3.send(
    new HeadObjectCommand({
      Bucket,
      Key: `pdf/${params.slug}`,
    }),
  )
    .then(() => true)
    .catch(() => false);
  const command = new GetObjectCommand({ Bucket, Key: `pdf/${params.slug}` });
  const src = await getSignedUrl(S3, command, { expiresIn: 86400 });

  const annotation = await getAnnotation(params.slug);

  if (!isExist) {
    notFound();
  }

  return (
    <>
      <PDF pdf={src} annotation={annotation} />
    </>
  );
}

async function getAnnotation(id: string): Promise<IHighlight[]> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("uploads")
    .select("annotations")
    .eq("file_id", id);
  if (error) {
    console.log(error);
    return [];
  }
  return data[0].annotations as unknown as IHighlight[];
}
