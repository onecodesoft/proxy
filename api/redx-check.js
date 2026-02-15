export default async function handler(req, res) {
  try {
    const { phone, token } = req.query;

    if (!phone || !token) {
      return res.status(200).json({ error: "Missing phone/token" });
    }

    const url = `https://redx.com.bd/api/redx_se/admin/parcel/customer-success-return-rate?phoneNumber=88${phone}`;

    const response = await fetch(url, {
      method: "GET",
      headers: {
        "Authorization": `Bearer ${token}`,
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
        "Accept": "application/json, text/plain, */*",
        "Origin": "https://redx.com.bd",
        "Referer": "https://redx.com.bd/"
      }
    });

    const text = await response.text();

    // debug friendly raw return
    return res.status(200).send(text);

  } catch (e) {
    return res.status(200).json({
      crash: true,
      message: e.message
    });
  }
}
