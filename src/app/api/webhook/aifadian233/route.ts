/**
 * Callback for Aifadian
 */

export async function POST(req: Request) {
  const body = req.body;
  console.log(body);

  const resp = { ec: 200, em: "" }
  return new Response(JSON.stringify(resp), { status: 200 });
}
