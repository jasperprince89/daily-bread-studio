const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const { GoogleGenAI } = require("@google/genai");

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 5000;

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

app.get("/", (req, res) => {
  res.json({
    message: "Daily Bread Studio API is running",
  });
});

app.post("/api/generate-devotional", async (req, res) => {
  try {
    const {
      theme,
      reference,
      language = "English",
    } = req.body;

    if (!theme?.trim() && !reference?.trim()) {
      return res.status(400).json({
        error: "Please provide a theme or Bible reference.",
      });
    }

    const prompt = `
You are a Christian devotional writer for a church ministry.

Create today's Daily Bread devotional.

Theme: ${theme?.trim() || "Not provided"}
Bible Reference: ${reference?.trim() || "Not provided"}
Language: ${language}

WRITING REQUIREMENTS:

1. TITLE
Create a short, meaningful and spiritually powerful title.
Keep it 2-5 words whenever possible.

2. HOOK
Create one short sentence introducing today's spiritual message.

3. BIBLE VERSE
If a Bible reference is provided, use that reference.
If no reference is provided, choose an appropriate Bible verse.
Do not invent Bible quotations.

4. REFLECTION
This is extremely important.

Write a SHORT but DEEP reflection.

Length: approximately 35-55 words.

The reflection must:
- Have spiritual depth.
- Focus on one clear biblical truth.
- Be personal and applicable to everyday life.
- Avoid generic motivational language.
- Avoid repeating the verse word-for-word.
- Avoid unnecessary explanation.
- Be suitable for a church WhatsApp/social media Daily Bread post.

5. PRAYER
Write a short heartfelt Christian prayer.
Approximately 30-50 words.

6. TONE
Biblical, peaceful, encouraging, humble and suitable for church ministry.

7. LANGUAGE
If language is Telugu:
- Write ALL content naturally in Telugu.
- Use proper Telugu grammar.
- Use natural Christian Telugu.
- Do not translate word-for-word from English.

If language is English + Telugu:
- Provide the content naturally in both languages.

Return ONLY valid JSON.

{
  "title": "",
  "hook": "",
  "verse": "",
  "reference": "",
  "reflection": "",
  "prayer": ""
}
`;

    const response = await ai.models.generateContent({
      model: "gemini-3.6-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
      },
    });

    const text = response.text?.trim();

    if (!text) {
      return res.status(500).json({
        error: "Gemini returned an empty response.",
      });
    }

    let devotional;

    try {
      devotional = JSON.parse(text);
    } catch (error) {
      console.error("Gemini JSON error:", error);
      console.error("Gemini response:", text);

      return res.status(500).json({
        error: "Gemini returned invalid devotional data.",
      });
    }

    res.json({
      success: true,
      devotional: {
        title: devotional.title || "",
        hook: devotional.hook || "",
        verse: devotional.verse || "",
        reference: devotional.reference || "",
        reflection: devotional.reflection || "",
        prayer: devotional.prayer || "",
        language,
      },
    });
  } catch (error) {
    console.error("Gemini generation error:", error);

    res.status(500).json({
      error:
        error?.message ||
        "Unable to generate devotional.",
    });
  }
});

app.listen(PORT, () => {
  console.log(
    `Daily Bread API running on http://localhost:${PORT}`
  );
});