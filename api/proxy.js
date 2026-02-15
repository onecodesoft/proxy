export const config = { runtime: 'edge' };

export default async (req) => {
  const { searchParams } = new URL(req.url);
  const targetUrl = searchParams.get("url");

  if (!targetUrl) return new Response("URL Missing", { status: 400 });

  try {
    const headers = new Headers();
    // Shudu dorkari headers gula pass korbo
    headers.set("User-Agent", "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.0.0 Safari/537.36");
    headers.set("Accept", "application/json, text/plain, */*");
    headers.set("Content-Type", "application/json");

    // Lambda theke asha Auth ba Cookie thakle sheta pass koro
    const auth = req.headers.get("Authorization");
    if (auth) headers.set("Authorization", auth);
    
    const cookie = req.headers.get("Cookie");
    if (cookie) headers.set("Cookie", cookie);

    const response = await fetch(targetUrl, {
      method: req.method,
      headers: headers,
      body: req.method === "POST" ? await req.text() : null,
      // IMPORTANT: Cloudflare bypass korar jonno eita dorkar
      redirect: "follow"
    });

    return new Response(await response.text(), {
      status: response.status,
      headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" }
    });
  } catch (e) {
    return new Response(e.message, { status: 500 });
  }
};
