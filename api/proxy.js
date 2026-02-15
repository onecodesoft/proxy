export const config = { runtime: 'edge' };

export default async (req) => {
  const { searchParams } = new URL(req.url);
  const targetUrl = searchParams.get("url");

  if (!targetUrl) return new Response("Missing URL", { status: 400 });

  try {
    // 🔥 Purapuri naya headers set korbo, req.headers touch-o korbo na
    const silentHeaders = new Headers();
    silentHeaders.set("User-Agent", "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.0.0 Safari/537.36");
    silentHeaders.set("Accept", "application/json, text/plain, */*");
    silentHeaders.set("Content-Type", "application/json");
    silentHeaders.set("Origin", "https://redx.com.bd");
    silentHeaders.set("Referer", "https://redx.com.bd/");

    // Lambda theke asha Authorization ba Cookie thakle manually nite hobe
    const auth = req.headers.get("authorization");
    if (auth) silentHeaders.set("Authorization", auth);

    const cookie = req.headers.get("cookie");
    if (cookie) silentHeaders.set("Cookie", cookie);

    // Lambda theke asha request body (for POST)
    const body = req.method === "POST" ? await req.text() : null;

    const response = await fetch(targetUrl, {
      method: req.method,
      headers: silentHeaders, // 🔥 No x-forwarded-for here
      body: body,
      redirect: "follow"
    });

    const data = await response.text();

    return new Response(data, {
      status: response.status,
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
        "X-Proxy-Status": "Success"
      }
    });
  } catch (e) {
    return new Response(JSON.stringify({ error: e.message }), { status: 500 });
  }
};
