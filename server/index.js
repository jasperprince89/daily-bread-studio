const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const { GoogleGenAI } = require("@google/genai");

dotenv.config();

const app = express();

app.use(
  cors({
    origin: "*",
    methods: ["GET", "POST", "OPTIONS"],
    allowedHeaders: ["Content-Type"],
  })
);

app.use(express.json());

const PORT = process.env.PORT || 5000;

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

if (!GEMINI_API_KEY) {
  console.error("ERROR: GEMINI_API_KEY is missing.");
}

const ai = new GoogleGenAI({
  apiKey: GEMINI_API_KEY,
});

/* =========================================================
   GEMINI MODELS
========================================================= */

const PRIMARY_MODEL = "gemini-3.5-flash";
const FALLBACK_MODEL = "gemini-3.1-flash-lite";

/* =========================================================
   HELPER
========================================================= */

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/* =========================================================
   GEMINI GENERATION WITH RETRY
========================================================= */

async function generateWithRetry(prompt) {
  const models = [
    PRIMARY_MODEL,
    FALLBACK_MODEL,
  ];

  let lastError = null;

  for (const model of models) {
    for (let attempt = 1; attempt <= 3; attempt++) {
      try {
        console.log(
          `Gemini request | model=${model} | attempt=${attempt}`
        );

        const response =
          await ai.models.generateContent({
            model,
            contents: prompt,
            config: {
              responseMimeType: "application/json",
            },
          });

        const text = response.text?.trim();

        if (!text) {
          throw new Error(
            "Gemini returned an empty response."
          );
        }

        console.log(
          `Gemini success | model=${model} | attempt=${attempt}`
        );

        return text;
      } catch (error) {
        lastError = error;

        const status =
          error?.status ||
          error?.code ||
          error?.response?.status;

        const message =
          error?.message || "";

        console.error(
          `Gemini failed | model=${model} | attempt=${attempt}`
        );

        console.error(
          "Status:",
          status
        );

        console.error(
          "Message:",
          message
        );

        /*
         * Retry only temporary availability /
         * rate-limit type failures.
         */
        const isTemporary =
          status === 503 ||
          status === 429 ||
          message.includes("503") ||
          message.includes("UNAVAILABLE") ||
          message.includes("high demand") ||
          message.includes("overloaded") ||
          message.includes("429");

        if (!isTemporary) {
          throw error;
        }

        /*
         * Exponential backoff:
         *
         * attempt 1 → 2 seconds
         * attempt 2 → 4 seconds
         * attempt 3 → 8 seconds
         */
        if (attempt < 3) {
          const waitTime =
            Math.pow(2, attempt) * 1000;

          console.log(
            `Waiting ${waitTime}ms before retry...`
          );

          await sleep(waitTime);
        }
      }
    }

    /*
     * Primary model failed after all retries.
     * Move to fallback model.
     */
    console.warn(
      `Primary model ${model} unavailable.`
    );

    console.warn(
      "Trying next model..."
    );
  }

  throw lastError;
}

/* =========================================================
   ROOT
========================================================= */

app.get("/", (req, res) => {
  res.json({
    message:
      "Daily Bread Studio API is running",
  });
});

/* =========================================================
   HEALTH CHECK
========================================================= */

app.get("/health", (req, res) => {
  res.json({
    success: true,
    status: "healthy",
    service: "Daily Bread Studio API",
  });
});

/* =========================================================
   GENERATE DEVOTIONAL
========================================================= */

app.post(
  "/api/generate-devotional",
  async (req, res) => {
    try {
      const {
        theme,
        reference,
        language = "English",
      } = req.body;

      /* -----------------------------------------------------
         VALIDATION
      ----------------------------------------------------- */

      if (
        !theme?.trim() &&
        !reference?.trim()
      ) {
        return res.status(400).json({
          success: false,
          error:
            "Please provide a theme or Bible reference.",
        });
      }

      /* -----------------------------------------------------
         PROMPT
      ----------------------------------------------------- */

      const prompt = `
You are a Christian devotional writer for a church ministry.

Create today's Daily Bread devotional.

Theme:
${theme?.trim() || "Not provided"}

Bible Reference:
${reference?.trim() || "Not provided"}

Language:
${language}

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

Length:
35-55 words approximately.

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

IMPORTANT:

Return ONLY valid JSON.

Do not include markdown.

Do not include code fences.

Return exactly this structure:

{
  "title": "",
  "hook": "",
  "verse": "",
  "reference": "",
  "reflection": "",
  "prayer": ""
}
`;

      /* -----------------------------------------------------
         CALL GEMINI
      ----------------------------------------------------- */

      const text =
        await generateWithRetry(prompt);

      /* -----------------------------------------------------
         PARSE JSON
      ----------------------------------------------------- */

      let devotional;

      try {
        devotional = JSON.parse(text);
      } catch (error) {
        console.error(
          "Gemini JSON parsing error:"
        );

        console.error(
          "Gemini response:",
          text
        );

        return res.status(500).json({
          success: false,
          error:
            "Gemini returned invalid devotional data.",
        });
      }

      /* -----------------------------------------------------
         RESPONSE
      ----------------------------------------------------- */

      return res.json({
        success: true,

        devotional: {
          title:
            devotional.title || "",

          hook:
            devotional.hook || "",

          verse:
            devotional.verse || "",

          reference:
            devotional.reference || "",

          reflection:
            devotional.reflection || "",

          prayer:
            devotional.prayer || "",

          language,
        },
      });
    } catch (error) {
      console.error(
        "Gemini generation error:"
      );

      console.error(error);

      const status =
        error?.status ||
        error?.code ||
        error?.response?.status;

      /*
       * Friendly response for Gemini overload.
       */
      if (
        status === 503 ||
        error?.message?.includes("high demand") ||
        error?.message?.includes("UNAVAILABLE") ||
        error?.message?.includes("overloaded")
      ) {
        return res.status(503).json({
          success: false,
          error:
            "The AI service is temporarily busy. Please try again in a few seconds.",
          code: "AI_TEMPORARILY_UNAVAILABLE",
        });
      }

      /*
       * Rate limit.
       */
      if (
        status === 429 ||
        error?.message?.includes("429")
      ) {
        return res.status(429).json({
          success: false,
          error:
            "AI request limit reached temporarily. Please try again shortly.",
          code: "AI_RATE_LIMITED",
        });
      }

      /*
       * Generic error.
       */
      return res.status(500).json({
        success: false,
        error:
          error?.message ||
          "Unable to generate devotional.",
      });
    }
  }
);

/* =========================================================
   START SERVER
========================================================= */

app.listen(PORT, () => {
  console.log(
    `Daily Bread API running on http://localhost:${PORT}`
  );
});