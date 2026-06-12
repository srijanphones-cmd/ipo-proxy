const express = require("express");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

const CDSC_BASE = "https://iporesult.cdsc.com.np/result";

// Use built-in fetch (Node 18+) with full browser-like headers
const HEADERS = {
  "User-Agent": "Mozilla/5.0 (Linux; Android 13; SM-A065F) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Mobile Safari/537.36",
  "Accept": "application/json, text/plain, */*",
  "Accept-Language": "en-US,en;q=0.9",
  "Origin": "https://iporesult.cdsc.com.np",
  "Referer": "https://iporesult.cdsc.com.np/",
};

app.get("/", (req, res) => res.json({ status: "IPO Proxy running", time: new Date().toISOString() }));

app.get("/companies", async (req, res) => {
  try {
    const r = await fetch(`${CDSC_BASE}/companyShares/fileUploaded`, { headers: HEADERS });
    const text = await r.text();
    console.log("Companies status:", r.status, "body preview:", text.slice(0, 200));
    res.status(r.status).type("application/json").send(text);
  } catch (e) {
    console.error("Companies error:", e.message);
    res.status(500).json({ error: e.message });
  }
});

app.post("/check", async (req, res) => {
  try {
    const { boid, companyShareId } = req.body;
    const r = await fetch(`${CDSC_BASE}/result/check`, {
      method: "POST",
      headers: { ...HEADERS, "Content-Type": "application/json" },
      body: JSON.stringify({ boid, companyShareId })
    });
    const text = await r.text();
    console.log("Check status:", r.status, "body preview:", text.slice(0, 200));
    res.status(r.status).type("application/json").send(text);
  } catch (e) {
    console.error("Check error:", e.message);
    res.status(500).json({ error: e.message });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Proxy running on port ${PORT}`));
