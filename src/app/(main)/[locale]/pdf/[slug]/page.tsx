import { PDF } from "@/app/pdf-helpers/pdf";
import { notFound } from "next/navigation";

import { GetObjectCommand, HeadObjectCommand } from "@aws-sdk/client-s3";
import { S3 } from "@/app/api/s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { createClient } from "@/lib/supabase/server";
import { IHighlight } from "@/lib/react-pdf-highlighter";
import { ClientOnly } from "@/lib/clientOnly";
import { cookies } from "next/headers";

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
      <PDF
        pdf={src}
        annotation={annotation[0].annotations}
        filename={annotation[0].filename}
      />
    </>
  );
}

async function getAnnotation(id: string) {
  const supabase = createClient(cookies());
  const { data: { user } } = await supabase.auth.getUser();
  const { data, error } = await supabase
    .from("uploads")
    .select("annotations, filename")
    .eq("file_id", id)
    .eq("user_id", user?.id)
  if (error) {
    console.log(error);
    return [];
  }
  return data;
}
