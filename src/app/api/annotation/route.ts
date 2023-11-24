import { redis } from "@/lib/upstash";
import { regularRatelimit } from "@/lib/upstash";

export async function POST(req: Request) {
  const { pdfId, highlights } = await req.json();
  const ip = req.headers.get("x-forwarded-for") || '127.0.0.1';
  const { success, remaining } = await regularRatelimit.limit(`annotation:${ip}`)
  if (!success) {
    return new Response(
      JSON.stringify({
        message: "You have being too frequent. Please try again later.",
      }),
      { status: 429 },
    );
  }
  const response = await redis.set(pdfId, JSON.stringify(highlights));
  if (response !== "OK") {
    return new Response(
      JSON.stringify({
        message: "There is an error sync your annotation. Please try again.",
      }),
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
