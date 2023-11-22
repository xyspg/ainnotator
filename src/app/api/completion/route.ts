import OpenAI from "openai";
import { OpenAIStream, StreamingTextResponse } from "ai";
import oneline from "oneline";

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
  const context = JSON.parse(data).context;

  const content = `You are a PDF annotator. Annotate the given sentence in the context with brief comments. OMIT prefixes like "this sentence/proposal/statement says..." , directly go to the comment content.\n
          Example:
          Sentence: "While the system works well enough for most transactions, it still suffers from the inherent weaknesses of the trust based model."\n
          Context Section: ${oneline`Commerce on the Internet has come to rely almost exclusively on financial institutions serving as
                            trusted third parties to process electronic payments. While the system works well enough for
                            most transactions, it still suffers from the inherent weaknesses of the trust based model.
                            Completely non-reversible transactions are not really possible, since financial institutions cannot
                            avoid mediating disputes. The cost of mediation increases transaction costs, limiting the
                            minimum practical transaction size and cutting off the possibility for small casual transactions,
                            and there is a broader cost in the loss of ability to make non-reversible payments for nonreversible services. W
                            ith the possibility of reversal, the need for trust spreads. Merchants must
                            be wary of their customers, hassling them for more information than they would otherwise need.
                            A certain percentage of fraud is accepted as unavoidable. These costs and payment uncertainties
                            can be avoided in person by using physical currency, but no mechanism exists to make payments
                            over a communications channel without a trusted party.`}
          Comments: "The current financial transaction system, although well-developed, 
                     still has problems when it comes to commerce on the internet.
          // end of example
          Sentence: ${prompt}
            Context Section: ${context}
          Comments:`;
  console.log(content);

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
    ],
  });

  // Convert the response into a friendly text-stream
  const stream = OpenAIStream(response);
  // Respond with the stream
  return new StreamingTextResponse(stream);
}
