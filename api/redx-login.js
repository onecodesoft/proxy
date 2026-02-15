import axios from "axios";

export default async function handler(req, res) {
  try {
    const userAgent =
      "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/137.0.0.0 Safari/537.36";

    // STEP 1: Login
    const login = await axios.post(
      "https://api.redx.com.bd/v4/auth/login",
      {
        phone: "88" + process.env.REDX_PHONE,
        password: process.env.REDX_PASSWORD,
      },
      {
        headers: {
          "User-Agent": userAgent,
          Accept: "application/json, text/plain, */*",
          Origin: "https://redx.com.bd",
          Referer: "https://redx.com.bd/",
          "Content-Type": "application/json",
        },
        timeout: 15000,
      }
    );

    const token = login.data?.data?.accessToken;

    if (!token) {
      return res.status(401).json({ error: "Login failed" });
    }

    return res.status(200).json({ token });
  } catch (e) {
    return res.status(500).json({
      error: e.response?.data || e.message,
    });
  }
}
