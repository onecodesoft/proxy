export const config = { runtime: 'edge' };

export default async (req) => {
  const { searchParams } = new URL(req.url);
  const targetUrl = searchParams.get("url");

  if (!targetUrl) return new Response("Missing URL", { status: 400 });

  try {
    const method = req.method;
    const body = method === "POST" ? await req.text() : null;

    // Strict headers: AWS Lambda-r kono trace thakbe na eikhane
    const headers = new Headers();
    headers.set("User-Agent", "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.0.0 Safari/537.36");
    headers.set("Accept", "application/json, text/plain, */*");
    headers.set("Accept-Language", "en-US,en;q=0.9");
    headers.set("Content-Type", "application/json");

    // Shudhu Auth ba Cookie thakle Lambda theke nao, baki shob discard
    const auth = req.headers.get("Authorization");
    if (auth) headers.set("Authorization", auth);
    
    const cookie = req.headers.get("Cookie");
    if (cookie) headers.set("Cookie", cookie);

    // [IMPORTANT] RedX jate bujhte na pare eita proxy, tai ashol origin set koro
    headers.set("Origin", "https://redx.com.bd");
    headers.set("Referer", "https://redx.com.bd/");

    const response = await fetch(targetUrl, {
      method: method,
      headers: headers,
      body: body,
      redirect: "follow"
    });

    const data = await response.text();
    
    return new Response(data, {
      status: response.status,
      headers: { 
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*"
      }
    });
  } catch (error) {
    return new Response(error.message, { status: 500 });
  }
};
