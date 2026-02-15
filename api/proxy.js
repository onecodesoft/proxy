export const config = {
  runtime: 'edge',
};

export default async (req) => {
  const { searchParams } = new URL(req.url);
  const targetUrl = searchParams.get("url");

  if (!targetUrl) {
    return new Response(JSON.stringify({ error: "Missing URL parameter" }), { 
      status: 400,
      headers: { "Content-Type": "application/json" }
    });
  }

  try {
    const method = req.method;
    
    // Browser theke test korar shomoy browser-er headers bad diye cleaner headers use kora bhalo
    const cleanHeaders = new Headers();
    cleanHeaders.set("User-Agent", "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.0.0 Safari/537.36");
    cleanHeaders.set("Accept", "application/json, text/plain, */*");

    // Jodi Lambda theke headers ashe, shegula add koro (host bad diye)
    req.headers.forEach((value, key) => {
      if (key.toLowerCase() !== "host" && key.toLowerCase() !== "referer") {
        cleanHeaders.set(key, value);
      }
    });

    const response = await fetch(targetUrl, {
      method: method,
      headers: cleanHeaders,
      body: method === "POST" ? await req.text() : null,
      redirect: "follow"
    });

    const responseData = await response.text();
    
    // Browser-e jate JSON data shundor kore dekha jay
    return new Response(responseData, {
      status: response.status,
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
      },
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), { 
      status: 500,
      headers: { "Content-Type": "application/json" }
    });
  }
};