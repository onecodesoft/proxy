import axios from "axios";

export default async function handler(req, res) {
  try {
    const { phone, token } = req.query;

    if (!phone || !token) {
      return res.status(400).json({ error: "Missing phone/token" });
    }

    const userAgent =
      "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/137.0.0.0 Safari/537.36";

    const url = `https://redx.com.bd/api/redx_se/admin/parcel/customer-success-return-rate?phoneNumber=88${phone}`;

    const rr = await axios.get(url, {
      headers: {
        Authorization: `Bearer ${token}`,
        "User-Agent": userAgent,
        Accept: "application/json, text/plain, */*",
        Origin: "https://redx.com.bd",
        Referer: "https://redx.com.bd/",
      },
      timeout: 15000,
    });

    return res.status(200).json(rr.data);
  } catch (e) {
    return res.status(500).json({
      error: e.response?.data || e.message,
    });
  }
}
