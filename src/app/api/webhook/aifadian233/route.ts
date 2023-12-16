/**
 * Callback for Aifadian
 */
import {createClient} from "@supabase/supabase-js";

export async function POST(req: Request) {
  const body = await req.json();
  console.log(body);

  const { ec, em, data } = body;


  // save to database
  const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!,
  );

  const { error } = await supabase
      .from('webhook_aifadian')
      .insert([{
        code: ec,
        message: em,
        data
      }]);

  if (error) {
    console.error('Error inserting data:', error);
    return new Response(JSON.stringify({ ec: 500, em: 'Internal Server Error' }), { status: 500 });
  }

  const resp = { ec: 200, em: "" }
  return new Response(JSON.stringify(resp), { status: 200 });
}