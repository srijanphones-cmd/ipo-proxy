const express = require("express");
const cors = require("cors");
const axios = require("axios");

const app = express();
app.use(cors());
app.use(express.json());

const CDSC_BASE = "https://iporesult.cdsc.com.np/result";

// Get company list
app.get("/companies", async (req, res) => {
  try {
    const response = await axios.get(`${CDSC_BASE}/companyShares/fileUploaded`, {
      headers: {
        "User-Agent": "Mozilla/5.0",
        "Accept": "application/json"
      }
    });
    res.json(response.data);
  } catch (e) {
    res.status(500).json({ error: "Failed to fetch companies", detail: e.message });
  }
});

// Check single BOID
app.post("/check", async (req, res) => {
  try {
    const { boid, companyShareId } = req.body;
    const response = await axios.post(`${CDSC_BASE}/result/check`, {
      boid,
      companyShareId
    }, {
      headers: {
        "User-Agent": "Mozilla/5.0",
        "Content-Type": "application/json",
        "Accept": "application/json"
      }
    });
    res.json(response.data);
  } catch (e) {
    res.status(500).json({ error: "Failed to check result", detail: e.message });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Proxy running on port ${PORT}`));
