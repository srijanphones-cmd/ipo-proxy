const express = require("express");
const cors = require("cors");
const axios = require("axios");

const app = express();
app.use(cors());
app.use(express.json());

const CDSC_BASE = "https://iporesult.cdsc.com.np/result";

const HEADERS = {
  "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36",
  "Accept": "application/json, text/plain, */*",
  "Accept-Language": "en-US,en;q=0.9",
  "Accept-Encoding": "gzip, deflate, br",
  "Origin": "https://iporesult.cdsc.com.np",
  "Referer": "https://iporesult.cdsc.com.np/",
  "Connection": "keep-alive",
  "Sec-Fetch-Dest": "empty",
  "Sec-Fetch-Mode": "cors",
  "Sec-Fetch-Site": "same-origin"
};

app.get("/", (req, res) => res.json({ status: "IPO Proxy running" }));

app.get("/companies", async (req, res) => {
  try {
    const response = await axios.get(`${CDSC_BASE}/companyShares/fileUploaded`, {
      headers: HEADERS,
      timeout: 15000
    });
    res.json(response.data);
  } catch (e) {
    console.error("Companies error:", e.message);
    res.status(500).json({ error: "Failed to fetch companies", detail: e.message });
  }
});

app.post("/check", async (req, res) => {
  try {
    const { boid, companyShareId } = req.body;
    const response = await axios.post(
      `${CDSC_BASE}/result/check`,
      { boid, companyShareId },
      {
        headers: { ...HEADERS, "Content-Type": "application/json" },
        timeout: 15000
      }
    );
    res.json(response.data);
  } catch (e) {
    console.error("Check error:", e.message);
    res.status(500).json({ error: "Failed to check result", detail: e.message });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Proxy running on port ${PORT}`));
