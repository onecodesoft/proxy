export default async function handler(req, res) {
  try {
    const phone = process.env.REDX_PHONE;
    const password = process.env.REDX_PASSWORD;

    if (!phone || !password) {
      return res.status(200).json({
        error: "ENV missing",
      });
    }

    const response = await fetch("https://api.redx.com.bd/v4/auth/login", {
      method: "POST",
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
        "Accept": "application/json, text/plain, */*",
        "Content-Type": "application/json",
        "Origin": "https://redx.com.bd",
        "Referer": "https://redx.com.bd/"
      },
      body: JSON.stringify({
        phone: "88" + phone,
        password: password,
      }),
    });

    const text = await response.text();

    // raw response return for debugging
    return res.status(200).send(text);

  } catch (err) {
    return res.status(200).json({
      crash: true,
      message: err.message,
      stack: err.stack,
    });
  }
}
