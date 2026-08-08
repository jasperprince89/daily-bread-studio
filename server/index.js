const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const { GoogleGenAI } = require("@google/genai");

dotenv.config();

/* =========================================================
   APP
========================================================= */

const app = express();

app.use(
  cors({
    origin: "*",
    methods: ["GET", "POST", "OPTIONS"],
    allowedHeaders: ["Content-Type"],
  })
);

app.use(express.json());

/* =========================================================
   PORT
========================================================= */

const PORT = process.env.PORT || 5000;

/* =========================================================
   GEMINI
========================================================= */

const GEMINI_API_KEY =
  process.env.GEMINI_API_KEY;

if (!GEMINI_API_KEY) {
  console.error(
    "❌ GEMINI_API_KEY is missing."
  );
}

const ai = new GoogleGenAI({
  apiKey: GEMINI_API_KEY,
});

/*
 * Stable Gemini model.
 */
const GEMINI_MODEL = "gemini-3.5-flash";

/* =========================================================
   HELPER - SLEEP
========================================================= */

function sleep(ms) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}

/* =========================================================
   HELPER - CLEAN JSON
========================================================= */

function cleanJsonText(text) {
  if (!text) {
    return "";
  }

  let cleaned = String(text).trim();

  /*
   * Remove Markdown code fences.
   */

  cleaned = cleaned.replace(
    /^```json\s*/i,
    ""
  );

  cleaned = cleaned.replace(
    /^```\s*/i,
    ""
  );

  cleaned = cleaned.replace(
    /\s*```$/i,
    ""
  );

  cleaned = cleaned.trim();

  /*
   * Find JSON object.
   */

  const firstBrace =
    cleaned.indexOf("{");

  const lastBrace =
    cleaned.lastIndexOf("}");

  if (
    firstBrace !== -1 &&
    lastBrace !== -1 &&
    lastBrace > firstBrace
  ) {
    cleaned =
      cleaned.substring(
        firstBrace,
        lastBrace + 1
      );
  }

  return cleaned.trim();
}

/* =========================================================
   HELPER - NORMALIZE DEVOTIONAL
========================================================= */

function normalizeDevotional(data) {
  if (
    !data ||
    typeof data !== "object"
  ) {
    throw new Error(
      "Gemini returned an invalid devotional object."
    );
  }

  const devotional = {
    title:
      typeof data.title === "string"
        ? data.title.trim()
        : "",

    hook:
      typeof data.hook === "string"
        ? data.hook.trim()
        : "",

    verse:
      typeof data.verse === "string"
        ? data.verse.trim()
        : "",

    reference:
      typeof data.reference === "string"
        ? data.reference.trim()
        : "",

    reflection:
      typeof data.reflection === "string"
        ? data.reflection.trim()
        : "",

    prayer:
      typeof data.prayer === "string"
        ? data.prayer.trim()
        : "",
  };

  /*
   * Validate required fields.
   */

  if (!devotional.title) {
    throw new Error(
      "Gemini returned incomplete devotional data: title missing."
    );
  }

  if (!devotional.verse) {
    throw new Error(
      "Gemini returned incomplete devotional data: verse missing."
    );
  }

  if (!devotional.reference) {
    throw new Error(
      "Gemini returned incomplete devotional data: reference missing."
    );
  }

  if (!devotional.reflection) {
    throw new Error(
      "Gemini returned incomplete devotional data: reflection missing."
    );
  }

  if (!devotional.prayer) {
    throw new Error(
      "Gemini returned incomplete devotional data: prayer missing."
    );
  }

  return devotional;
}

/* =========================================================
   GENERATE DEVOTIONAL
========================================================= */

async function generateDevotional({
  theme,
  reference,
  language,
}) {
  const prompt = `
You are a Christian devotional writer for a church ministry.

Create today's Daily Bread devotional.

THEME:
${theme || "Not provided"}

BIBLE REFERENCE:
${reference || "Not provided"}

LANGUAGE:
${language}


IMPORTANT LANGUAGE RULE:

If the language is Telugu:

- Write ALL fields naturally in Telugu.
- Use proper Telugu grammar.
- Use natural Christian Telugu.
- Do NOT translate English word-for-word.
- Do NOT unnecessarily mix English and Telugu.

If the language is English:

- Write all fields in natural English.

If the language is English + Telugu:

- Write naturally in both languages.


TITLE:

Create a short, meaningful and spiritually powerful title.

Prefer 2-5 words.


HOOK:

Create one short sentence introducing today's spiritual message.


BIBLE VERSE:

If a Bible reference was provided, use that exact Bible reference.

Provide the correct Bible verse associated with that reference.

Do NOT invent a Bible quotation.

If no Bible reference was provided, choose an appropriate Bible verse and provide its correct reference.

Keep the verse reasonably short for a church social-media Daily Bread poster.


REFLECTION:

Write a short but spiritually deep reflection.

Approximately 35-55 words.

The reflection must:

- Focus on one clear biblical truth.
- Be personally applicable.
- Be spiritually meaningful.
- Be suitable for a church Daily Bread post.
- Avoid generic motivational language.
- Avoid repeating the verse word-for-word.
- Avoid unnecessary explanation.


PRAYER:

Write a short heartfelt Christian prayer.

Approximately 30-50 words.

The prayer should naturally connect with the devotional message.


TONE:

Biblical.
Peaceful.
Encouraging.
Humble.
Christ-centered.
Suitable for church ministry.


VERY IMPORTANT:

Return ONLY valid JSON.

Do not use Markdown.

Do not use code fences.

Do not add explanations.

Do not add text before or after the JSON.

Use EXACTLY this structure:

{
  "title": "short title",
  "hook": "short hook",
  "verse": "Bible verse text",
  "reference": "Bible reference",
  "reflection": "short reflection",
  "prayer": "short prayer"
}
`;

  const maxAttempts = 3;

  let lastError = null;

  for (
    let attempt = 1;
    attempt <= maxAttempts;
    attempt++
  ) {
    try {
      console.log(
        "========================================"
      );

      console.log(
        `Gemini request`
      );

      console.log(
        `Model: ${GEMINI_MODEL}`
      );

      console.log(
        `Attempt: ${attempt}/${maxAttempts}`
      );

      console.log(
        "========================================"
      );

      /*
       * IMPORTANT:
       *
       * No responseSchema.
       * No responseFormat.
       * No temperature.
       *
       * This avoids SDK/model configuration
       * compatibility problems.
       */

      const response =
        await ai.models.generateContent({
          model: GEMINI_MODEL,
          contents: prompt,
        });

      const rawText =
        response.text?.trim();

      console.log(
        "----------------------------------------"
      );

      console.log(
        "Gemini raw response:"
      );

      console.log(rawText);

      console.log(
        "----------------------------------------"
      );

      if (!rawText) {
        throw new Error(
          "Gemini returned an empty response."
        );
      }

      /*
       * Clean JSON.
       */

      const jsonText =
        cleanJsonText(rawText);

      console.log(
        "Cleaned JSON:"
      );

      console.log(jsonText);

      /*
       * Parse JSON.
       */

      let parsed;

      try {
        parsed =
          JSON.parse(jsonText);
      } catch (parseError) {
        console.error(
          "❌ JSON parsing failed."
        );

        console.error(
          "Raw Gemini response:"
        );

        console.error(rawText);

        console.error(
          "Cleaned response:"
        );

        console.error(jsonText);

        throw new Error(
          "Gemini returned invalid JSON."
        );
      }

      /*
       * Validate.
       */

      const devotional =
        normalizeDevotional(parsed);

      console.log(
        "✅ Devotional generated successfully."
      );

      return devotional;

    } catch (error) {
      lastError = error;

      console.error(
        "========================================"
      );

      console.error(
        `❌ Gemini attempt ${attempt} failed`
      );

      console.error(
        "Message:",
        error?.message
      );

      console.error(
        "Status:",
        error?.status
      );

      console.error(
        "Code:",
        error?.code
      );

      console.error(
        "Full error:",
        error
      );

      console.error(
        "========================================"
      );

      const status =
        error?.status ||
        error?.code ||
        error?.response?.status;

      const message =
        error?.message || "";

      /*
       * Retry temporary Gemini errors.
       */

      const temporaryError =
        status === 408 ||
        status === 429 ||
        status === 500 ||
        status === 502 ||
        status === 503 ||
        status === 504 ||
        message.includes(
          "UNAVAILABLE"
        ) ||
        message.includes(
          "high demand"
        ) ||
        message.includes(
          "overloaded"
        ) ||
        message.includes(
          "temporarily"
        ) ||
        message.includes(
          "RESOURCE_EXHAUSTED"
        );

      if (
        temporaryError &&
        attempt < maxAttempts
      ) {
        const waitTime =
          attempt === 1
            ? 2000
            : 4000;

        console.log(
          `Retrying in ${waitTime}ms...`
        );

        await sleep(waitTime);

        continue;
      }

      /*
       * Don't retry permanent errors.
       */

      throw error;
    }
  }

  throw lastError;
}

/* =========================================================
   ROOT
========================================================= */

app.get(
  "/",
  (req, res) => {
    res.json({
      success: true,
      message:
        "Daily Bread Studio API is running",
      model:
        GEMINI_MODEL,
    });
  }
);

/* =========================================================
   HEALTH CHECK
========================================================= */

app.get(
  "/health",
  (req, res) => {
    res.json({
      success: true,
      status: "healthy",
      service:
        "Daily Bread Studio API",
      model:
        GEMINI_MODEL,
    });
  }
);

/* =========================================================
   GENERATE DEVOTIONAL API
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

      console.log(
        "========================================"
      );

      console.log(
        "POST /api/generate-devotional"
      );

      console.log(
        "Theme:",
        theme
      );

      console.log(
        "Reference:",
        reference
      );

      console.log(
        "Language:",
        language
      );

      console.log(
        "========================================"
      );

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
          code:
            "MISSING_INPUT",
        });
      }

      /* -----------------------------------------------------
         GENERATE
      ----------------------------------------------------- */

      const devotional =
        await generateDevotional({
          theme:
            theme?.trim() || "",
          reference:
            reference?.trim() || "",
          language:
            language?.trim() ||
            "English",
        });

      /* -----------------------------------------------------
         SUCCESS
      ----------------------------------------------------- */

      console.log(
        "✅ Sending devotional to frontend."
      );

      return res.json({
        success: true,

        devotional: {
          title:
            devotional.title,

          hook:
            devotional.hook,

          verse:
            devotional.verse,

          reference:
            devotional.reference,

          reflection:
            devotional.reflection,

          prayer:
            devotional.prayer,

          language:
            language?.trim() ||
            "English",
        },
      });

    } catch (error) {
      console.error(
        "========================================"
      );

      console.error(
        "❌ DEVOTIONAL GENERATION ERROR"
      );

      console.error(
        "Message:",
        error?.message
      );

      console.error(
        "Status:",
        error?.status
      );

      console.error(
        "Code:",
        error?.code
      );

      console.error(
        "Full error:"
      );

      console.error(error);

      console.error(
        "========================================"
      );

      const status =
        error?.status ||
        error?.code ||
        error?.response?.status;

      const message =
        error?.message || "";

      /* -----------------------------------------------------
         AUTHENTICATION
      ----------------------------------------------------- */

      if (
        status === 401 ||
        status === 403 ||
        message.includes(
          "API key"
        ) ||
        message.includes(
          "API_KEY"
        ) ||
        message.includes(
          "authentication"
        ) ||
        message.includes(
          "Unauthenticated"
        )
      ) {
        return res.status(500).json({
          success: false,

          error:
            "Gemini API authentication failed. Please check GEMINI_API_KEY.",

          code:
            "GEMINI_AUTH_ERROR",
        });
      }

      /* -----------------------------------------------------
         MODEL NOT FOUND
      ----------------------------------------------------- */

      if (
        status === 404 ||
        message.includes(
          "NOT_FOUND"
        ) ||
        message.includes(
          "not found"
        )
      ) {
        return res.status(500).json({
          success: false,

          error:
            `Gemini model "${GEMINI_MODEL}" is unavailable.`,

          code:
            "GEMINI_MODEL_NOT_FOUND",

          model:
            GEMINI_MODEL,
        });
      }

      /* -----------------------------------------------------
         RATE LIMIT
      ----------------------------------------------------- */

      if (
        status === 429 ||
        message.includes(
          "429"
        ) ||
        message.includes(
          "RESOURCE_EXHAUSTED"
        )
      ) {
        return res.status(429).json({
          success: false,

          error:
            "Gemini request limit reached temporarily. Please try again shortly.",

          code:
            "AI_RATE_LIMITED",
        });
      }

      /* -----------------------------------------------------
         TEMPORARILY UNAVAILABLE
      ----------------------------------------------------- */

      if (
        status === 503 ||
        message.includes(
          "UNAVAILABLE"
        ) ||
        message.includes(
          "high demand"
        ) ||
        message.includes(
          "overloaded"
        )
      ) {
        return res.status(503).json({
          success: false,

          error:
            "The AI service is temporarily busy. Please try again in a few seconds.",

          code:
            "AI_TEMPORARILY_UNAVAILABLE",
        });
      }

      /* -----------------------------------------------------
         INVALID JSON
      ----------------------------------------------------- */

      if (
        message.includes(
          "invalid JSON"
        )
      ) {
        return res.status(500).json({
          success: false,

          error:
            "Gemini returned an unexpected response. Please try again.",

          code:
            "INVALID_AI_RESPONSE",
        });
      }

      /* -----------------------------------------------------
         INCOMPLETE DATA
      ----------------------------------------------------- */

      if (
        message.includes(
          "incomplete devotional"
        )
      ) {
        return res.status(500).json({
          success: false,

          error:
            "Gemini returned incomplete devotional content. Please try again.",

          code:
            "INCOMPLETE_AI_RESPONSE",
        });
      }

      /* -----------------------------------------------------
         GENERIC ERROR
      ----------------------------------------------------- */

      return res.status(500).json({
        success: false,

        error:
          message ||
          "Unable to generate devotional.",

        code:
          "DEVOTIONAL_GENERATION_ERROR",
      });
    }
  }
);

/* =========================================================
   START SERVER
========================================================= */

app.listen(
  PORT,
  () => {
    console.log(
      "========================================"
    );

    console.log(
      "Daily Bread Studio API"
    );

    console.log(
      `Running on http://localhost:${PORT}`
    );

    console.log(
      `Gemini model: ${GEMINI_MODEL}`
    );

    console.log(
      "========================================"
    );
  }
);