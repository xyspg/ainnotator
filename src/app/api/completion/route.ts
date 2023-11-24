import OpenAI from "openai";
import { OpenAIStream, StreamingTextResponse } from "ai";
import oneline from "oneline";
import { openaiRatelimit, regularRatelimit } from "@/lib/upstash";
if (!process.env.OPENAI_API_KEY) {
  throw new Error("OPENAI_API_KEY not set");
}
// Create an OpenAI API client (that's edge friendly!)
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
  baseURL: "https://api.openai-sb.com/v1",
});

// Set the runtime to edge for best performance
export const runtime = "edge";

export async function POST(req: Request) {
  if (req.method !== "POST") {
    return new Response("Method not allowed", { status: 405 });
  }
  const { prompt, data } = await req.json();

  const ip = req.headers.get("x-forwarded-for");
  const { success, remaining } = await openaiRatelimit.limit(
    `completion:${ip}`,
  );
  if (!success) {
    return new Response(
      JSON.stringify({
        message: "You have being too frequent. Please try again later.",
      }),
      { status: 429 },
    );
  }

  const context = data.context;

  const content = `You are Ainnotator, a PDF annotator powered by AI. Annotate the given $sentence in the $context section with brief $comments. 
  OMIT prefixes like "this sentence/proposal/statement says..." , directly go to the comment content.
  DO NOT keep referencing the title of the document or the overall context (eg. this sentence is a part of an analysis on the movie xxxx).
  People work in this annotator continuously so just focus on the given comments.
  PAY GREAT ATTENTION TO THE $Sentence! all you need to give comment to is to give content
  after the $Sentence. Even if the context section has great amount of information,
  if $sentence is not associated with it, you SHOULD NOT give comments / summarize the context section. 
  \n
         
          `;

  // Ask OpenAI for a streaming completion given the prompt
  const response = await openai.chat.completions.create({
    model: "gpt-3.5-turbo-1106",
    stream: true,
    temperature: 0.6,
    max_tokens: 300,
    messages: [
      {
        role: "system",
        content: content,
      },
      {
        role: "user",
        content: `$Sentence: ${prompt}
                  $Context Section: ${context}
                  $Comments:`,
      },
    ],
  });
  /* Below code block can be used for testing input


  return new Response(JSON.stringify([
    {
      role: "system",
      content: content,
    },
    {
      role: "user",
      content: `$Sentence: ${prompt}
                  $Context Section: ${context}
                  $Comments:`,
    },
  ], null, 2), { status: 200 });


   */

  const stream = OpenAIStream(response);
  return new StreamingTextResponse(stream);
}
