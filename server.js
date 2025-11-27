import express from "express";
import fetch from "node-fetch";
import cors from "cors";
import dotenv from "dotenv";

// Load environment variables
dotenv.config();

const app = express();

// CORS configuration for production
const corsOptions = {
  origin: process.env.CORS_ORIGIN || "http://localhost:5173",
  optionsSuccessStatus: 200,
};

app.use(cors(corsOptions));
app.use(express.json({ limit: "10mb" }));

// Get API key from environment variables
const API_KEY = process.env.GEMINI_API_KEY;
const PORT = process.env.PORT || 5000;

// --- Gemini API route ---
app.post("/api/lara", async (req, res) => {
  try {
    const userText = req.body.text;
    if (!userText) return res.status(400).json({ error: "Missing text input" });

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${API_KEY}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [
            {
              role: "user",
              parts: [{ text: userText }],
            },
          ],
        }),
      }
    );

    const data = await response.json();

    // Extract and simplify model response
    const modelReply =
      data?.candidates?.[0]?.content?.parts?.[0]?.text ||
      "Sorry, I couldn’t generate a response.";

    res.json({ reply: modelReply });
  } catch (err) {
    console.error("Error:", err);
    res.status(500).json({ error: err.message });
  }
});

// --- Start Server ---
app.listen(5000, () =>
  console.log("✅ Server running on http://localhost:5000")
);
