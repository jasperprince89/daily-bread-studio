import { useRef, useState } from "react";
import html2canvas from "html2canvas-pro";
import {
  ArrowLeft,
  Download,
  Heart,
  Sparkles,
} from "lucide-react";

import familyImage from "../assets/Pic/Family.png";
import monthlyBackground from "../assets/backgrounds/Aug.png";
import churchLogo from "../assets/Pic/ChurchLogo.png";

const fatherName = "John Victor";
const motherName = "Sharon Victor";

const ministryWebsite =
  "https://sharon-prayer-fellowship.vercel.app/";

const ministryInstagram = "@spfr_melodies";
const ministryYoutube = "@sharonprayerhouseRMPLM";

const ministryPhone1 = "+91 8328187655";
const ministryPhone2 = "+91 7780348832";

function PosterStudio({ onBack, devotional }) {
  const posterRef = useRef(null);

  /* =========================================================
     CONTENT
  ========================================================= */

  const [title, setTitle] = useState(
    devotional?.title || "విశ్వాసముతో\nఅడుగులు"
  );

  const [verse, setVerse] = useState(
    devotional?.verse ||
      "మనమే క్రైస్తవంతులై కాక విశ్వాసముగలవారము."
  );

  const [reference, setReference] = useState(
    devotional?.reference || "2 కొరింథీయులకు 5:7"
  );

  const [reflection, setReflection] = useState(
    devotional?.reflection ||
      "మన పరిస్థితులు మారినా దేవునిపై విశ్వాసం మారకూడదు. ఆయనను నమ్మి వేసే ప్రతి అడుగు మనలను తన చిత్తానికి దగ్గర చేస్తుంది."
  );

  const [showReflection, setShowReflection] = useState(true);
  const [isDownloading, setIsDownloading] = useState(false);

  /* =========================================================
     TELUGU DETECTION
  ========================================================= */

  const containsTelugu = (text = "") =>
    /[\u0C00-\u0C7F]/.test(text);

  const isTelugu =
    containsTelugu(title) ||
    containsTelugu(verse) ||
    containsTelugu(reference) ||
    containsTelugu(reflection);

  /* =========================================================
     AUTOMATIC FONT SIZE

     Short text  -> larger
     Long text   -> smaller

     This prevents overflow while keeping short content
     visually strong.
  ========================================================= */

  const getAutoFontSize = (text = "", type = "verse") => {
    const length = text.trim().length;

    /* ---------------------------------------------------------
       BIBLE VERSE
    --------------------------------------------------------- */

    if (type === "verse") {
      if (length <= 45) {
        return isTelugu ? 19 : 21;
      }

      if (length <= 70) {
        return isTelugu ? 17 : 19;
      }

      if (length <= 100) {
        return isTelugu ? 15 : 17;
      }

      if (length <= 140) {
        return isTelugu ? 13.5 : 15;
      }

      if (length <= 180) {
        return isTelugu ? 12 : 13.5;
      }

      if (length <= 220) {
        return isTelugu ? 11.5 : 13;
      }

      return isTelugu ? 10.5 : 12;
    }

    /* ---------------------------------------------------------
       REFLECTION

       Reflection is now the main content, so it is
       intentionally larger than before.
    --------------------------------------------------------- */

    if (length <= 80) {
      return isTelugu ? 16 : 13;
    }

    if (length <= 130) {
      return isTelugu ? 14 : 12;
    }

    if (length <= 180) {
      return isTelugu ? 12.5 : 11;
    }

    if (length <= 240) {
      return isTelugu ? 11.5 : 10;
    }

    if (length <= 320) {
      return isTelugu ? 10.5 : 9;
    }

    if (length <= 400) {
      return isTelugu ? 10 : 8.5;
    }

    return isTelugu ? 9.5 : 8;
  };

  /* =========================================================
     DOWNLOAD POSTER
  ========================================================= */

  const downloadPoster = async () => {
    if (!posterRef.current || isDownloading) return;

    setIsDownloading(true);

    try {
      if (document.fonts?.ready) {
        await document.fonts.ready;
      }

      const images =
        posterRef.current.querySelectorAll("img");

      await Promise.all(
        Array.from(images).map((img) => {
          if (img.complete) {
            return Promise.resolve();
          }

          return new Promise((resolve) => {
            img.onload = resolve;
            img.onerror = resolve;
          });
        })
      );

      await new Promise((resolve) =>
        setTimeout(resolve, 500)
      );

      const canvas = await html2canvas(
        posterRef.current,
        {
          scale: 3,
          useCORS: true,
          allowTaint: false,
          backgroundColor: null,
          logging: false,
          imageTimeout: 15000,
        }
      );

      canvas.toBlob((blob) => {
        if (!blob) {
          setIsDownloading(false);
          alert("Unable to create the poster image.");
          return;
        }

        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");

        link.href = url;
        link.download = "daily-bread-august.png";

        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

        setTimeout(() => {
          URL.revokeObjectURL(url);
        }, 1000);

        setIsDownloading(false);
      }, "image/png");
    } catch (error) {
      console.error("Poster download failed:", error);

      setIsDownloading(false);

      alert(
        "Unable to create the poster image. Please try again."
      );
    }
  };

  return (
    <div className="min-h-screen bg-[#eee7dd] text-[#2c211a]">

      {/* =====================================================
          HEADER
      ===================================================== */}

      <header className="sticky top-0 z-50 border-b border-[#ded3c5] bg-[#fffdfa]/95 backdrop-blur">

        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-5">

          <button
            onClick={onBack}
            className="flex items-center gap-2 text-sm font-medium text-[#654331]"
          >
            <ArrowLeft size={18} />
            Back
          </button>

          <div className="flex items-center gap-2">

            <Sparkles
              size={17}
              className="text-[#b88725]"
            />

            <div className="text-center">

              <h1 className="font-serif text-lg font-semibold">
                Poster Studio
              </h1>

              <p className="text-[9px] uppercase tracking-[0.28em] text-[#9a8978]">
                August Daily Bread
              </p>

            </div>

          </div>

          <button
            onClick={downloadPoster}
            disabled={isDownloading}
            className="flex items-center gap-2 rounded-xl bg-[#654331] px-4 py-2.5 text-sm font-semibold text-white disabled:opacity-60"
          >
            <Download size={17} />

            {isDownloading
              ? "Creating..."
              : "Download"}
          </button>

        </div>

      </header>

      {/* =====================================================
          MAIN
      ===================================================== */}

      <main className="mx-auto grid max-w-7xl gap-7 px-5 py-7 lg:grid-cols-[350px_1fr]">

        {/* ===================================================
            LEFT CONTROLS
        =================================================== */}

        <aside className="space-y-5">

          {/* =================================================
              MONTHLY BACKGROUND
          ================================================= */}

          <section className="rounded-3xl border border-[#e5dbcf] bg-white p-5 shadow-sm">

            <div className="mb-4 flex items-center gap-3">

              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#f5ede1]">

                <Sparkles
                  size={17}
                  className="text-[#a66e25]"
                />

              </div>

              <div>

                <h2 className="text-sm font-semibold">
                  Monthly Background
                </h2>

                <p className="text-[11px] text-[#9a8979]">
                  Change this every month
                </p>

              </div>

            </div>

            <div className="overflow-hidden rounded-2xl border border-[#e4d9cc]">

              <img
                src={monthlyBackground}
                alt="August background"
                className="h-36 w-full object-cover"
              />

              <div className="bg-[#fcfaf7] p-3">

                <p className="text-sm font-semibold">
                  Aug.png
                </p>

                <p className="mt-1 text-[11px] text-[#978879]">
                  src/assets/backgrounds/Aug.png
                </p>

              </div>

            </div>

          </section>

          {/* =================================================
              POSTER CONTENT
          ================================================= */}

          <section className="rounded-3xl border border-[#e5dbcf] bg-white p-5 shadow-sm">

            <h2 className="font-serif text-xl font-semibold">
              Poster Content
            </h2>

            <p className="mb-5 mt-1 text-xs text-[#988879]">
              Edit the content shown on the poster.
            </p>

            {/* TITLE */}

            <label className="mb-2 block text-[11px] font-semibold uppercase tracking-[0.12em] text-[#765a42]">
              Title
            </label>

            <textarea
              value={title}
              onChange={(e) =>
                setTitle(e.target.value)
              }
              rows={2}
              className={`mb-5 w-full resize-none rounded-xl border border-[#ded3c5] bg-[#fdfbf8] px-4 py-3 text-sm outline-none ${
                isTelugu
                  ? "font-potti text-lg"
                  : ""
              }`}
            />

            {/* BIBLE VERSE */}

            <label className="mb-2 block text-[11px] font-semibold uppercase tracking-[0.12em] text-[#765a42]">
              Bible Verse
            </label>

            <textarea
              value={verse}
              onChange={(e) =>
                setVerse(e.target.value)
              }
              rows={4}
              className={`mb-5 w-full resize-none rounded-xl border border-[#ded3c5] bg-[#fdfbf8] px-4 py-3 text-sm leading-6 outline-none ${
                isTelugu
                  ? "font-potti text-lg"
                  : ""
              }`}
            />

            {/* REFERENCE */}

            <label className="mb-2 block text-[11px] font-semibold uppercase tracking-[0.12em] text-[#765a42]">
              Bible Reference
            </label>

            <input
              value={reference}
              onChange={(e) =>
                setReference(e.target.value)
              }
              className={`mb-5 w-full rounded-xl border border-[#ded3c5] bg-[#fdfbf8] px-4 py-3 text-sm outline-none ${
                isTelugu
                  ? "font-potti text-lg"
                  : ""
              }`}
            />

            {/* REFLECTION */}

            <div className="mb-2 flex items-center justify-between">

              <label className="text-[11px] font-semibold uppercase tracking-[0.12em] text-[#765a42]">
                Reflection
              </label>

              <button
                onClick={() =>
                  setShowReflection(
                    !showReflection
                  )
                }
                className="text-xs font-semibold text-[#a16d30]"
              >
                {showReflection
                  ? "Hide"
                  : "Show"}
              </button>

            </div>

            {showReflection && (
              <textarea
                value={reflection}
                onChange={(e) =>
                  setReflection(
                    e.target.value
                  )
                }
                rows={6}
                className={`w-full resize-none rounded-xl border border-[#ded3c5] bg-[#fdfbf8] px-4 py-3 text-sm leading-6 outline-none ${
                  isTelugu
                    ? "font-potti text-lg"
                    : ""
                }`}
              />
            )}

          </section>

        </aside>

        {/* ===================================================
            POSTER PREVIEW
        =================================================== */}

        <section className="flex items-start justify-center rounded-[2rem] bg-[#e4dbcf] p-4 sm:p-8">

          <div
            ref={posterRef}
            className="
              relative
              aspect-[4/5]
              w-full
              max-w-[720px]
              overflow-hidden
              bg-black
              shadow-[0_25px_70px_rgba(35,22,12,0.35)]
            "
          >

            {/* =================================================
                BACKGROUND
            ================================================= */}

            <img
              src={monthlyBackground}
              alt=""
              className="
                absolute
                inset-0
                z-0
                h-full
                w-full
                object-cover
              "
            />

            {/* =================================================
                CHURCH LOGO
                TOP RIGHT
            ================================================= */}

            <div
              className="
                absolute
                right-[3%]
                top-[2.5%]
                z-50
                flex
                h-[90px]
                w-[130px]
                items-center
                justify-center
              "
            >

              <img
                src={churchLogo}
                alt="Church Logo"
                draggable="false"
                className="
                  max-h-full
                  max-w-full
                  object-contain
                  drop-shadow-[0_3px_8px_rgba(0,0,0,0.45)]
                "
              />

            </div>

            {/* =================================================
                MAIN POSTER AREA
                FOOTER IS SEPARATE
            ================================================= */}

            <div
              className="
                absolute
                inset-x-0
                top-0
                z-10
                h-[79%]
              "
            >

              {/* =================================================
                  LEFT DARK CONTENT PANEL
              ================================================= */}

              <div
                className="
                  pointer-events-none
                  absolute
                  inset-y-0
                  left-0
                  z-[1]
                  w-[47%]
                  bg-gradient-to-r
                  from-black
                  via-black/95
                  to-black/10
                "
              />

              {/* =================================================
                  LEFT CONTENT
              ================================================= */}

              <div
                className="
                  absolute
                  left-0
                  top-0
                  z-30
                  h-full
                  w-[47%]
                  px-[9%]
                  pt-[6%]
                "
              >

                {/* DAILY PROMISE */}

                <div>

                  <p className="text-[10px] font-semibold uppercase tracking-[0.34em] text-white">
                    Daily Promise
                  </p>

                  <div className="mt-3 flex items-center">

                    <div className="h-[2px] w-[58px] bg-[#e2b52d]" />

                    <span className="mx-2 text-[9px] text-[#e2b52d]">
                      ❧
                    </span>

                    <div className="h-[2px] w-[58px] bg-[#e2b52d]" />

                  </div>

                  <p className="mt-3 text-[7px] uppercase tracking-[0.34em] text-white/70">
                    A Word For Today
                  </p>

                </div>

                {/* =================================================
                    TITLE
                ================================================= */}

                <div className="mt-[8%]">

                  <h1
                    className={`
                      whitespace-pre-line
                      break-words
                      text-white
                      ${
                        isTelugu
                          ? "font-potti text-[clamp(24px,3.1vw,45px)] font-normal leading-[1.12]"
                          : "font-serif text-[clamp(28px,3.5vw,50px)] font-bold leading-[1.04]"
                      }
                    `}
                  >
                    {title}
                  </h1>

                  <div className="mt-5 h-[3px] w-[55px] bg-[#e2b52d]" />

                </div>

                {/* =================================================
                    TODAY'S PROMISE
                ================================================= */}

                <div className="mt-5">

                  <span
                    className="
                      inline-flex
                      rounded-full
                      border
                      border-[#e0b42c]
                      px-3
                      py-1.5
                      text-[7px]
                      font-bold
                      uppercase
                      tracking-[0.13em]
                      text-[#f1c844]
                    "
                  >
                    Today&apos;s Promise
                  </span>

                </div>

                {/* =================================================
                    MAIN REFLECTION CONTENT

                    IMPORTANT:
                    The old verse area now displays
                    the Reflection content.
                ================================================= */}

                {showReflection && (
                  <div className="mt-4">

                    <p
                      className={`
                        break-words
                        text-white
                        ${
                          isTelugu
                            ? "font-potti"
                            : "font-serif"
                        }
                      `}
                      style={{
                        fontSize: `${getAutoFontSize(
                          reflection,
                          "reflection"
                        )}px`,
                        lineHeight: 1.5,
                      }}
                    >
                      {reflection}
                    </p>

                  </div>
                )}

                {/* =================================================
                    BIBLE VERSE BOX

                    Bible verse + reference now appear here.
                ================================================= */}

                <div
                  className="
                    mt-5
                    w-full
                    rounded-[18px]
                    border-[2px]
                    border-[#c29a3d]
                    bg-black/65
                    px-5
                    py-5
                    shadow-[0_5px_18px_rgba(0,0,0,0.25)]
                  "
                >

                  <p
                    className={`
                      w-full
                      break-words
                      text-white
                      ${
                        isTelugu
                          ? "font-potti"
                          : "font-serif"
                      }
                    `}
                    style={{
                      fontSize: `${getAutoFontSize(
                        verse,
                        "verse"
                      )}px`,
                      lineHeight: 1.45,
                    }}
                  >
                    “{verse}”
                  </p>

                  <p
                    className={`
                      mt-3
                      font-semibold
                      text-[#e5bd35]
                      ${
                        isTelugu
                          ? "font-potti"
                          : ""
                      }
                    `}
                    style={{
                      fontSize: isTelugu
                        ? "12px"
                        : "10px",
                      lineHeight: 1.3,
                    }}
                  >
                    — {reference}
                  </p>

                </div>

              </div>

              {/* =================================================
                  FAMILY IMAGE

                  Dedicated RIGHT SIDE.
                  It cannot overlap the left content because
                  it is confined to the right-side zone.
              ================================================= */}

              <div
                className="
                  absolute
                  right-0
                  top-0
                  z-20
                  h-full
                  w-[54%]
                  overflow-hidden
                  pointer-events-none
                "
              >

                <div
                  className="
                    absolute
                    inset-0
                    flex
                    items-end
                    justify-end
                  "
                >

                  <img
                    src={familyImage}
                    alt="Family"
                    draggable="false"
                    className="
                      block
                      h-auto
                      w-auto
                      max-h-full
                      max-w-full
                      object-contain
                      object-right-bottom
                    "
                  />

                </div>

              </div>

            </div>

            {/* =================================================
                FULL WIDTH FOOTER

                This section spans BOTH left and right.
            ================================================= */}

            <div
              className="
                absolute
                inset-x-0
                bottom-0
                z-40
                h-[21%]
                bg-black/90
              "
            >

              {/* TOP GOLD LINE */}

              <div className="absolute left-0 right-0 top-0 h-[1.5px] bg-[#dcae20]/80" />

              <div
                className="
                  flex
                  h-full
                  flex-col
                  items-center
                  justify-center
                  px-5
                  text-center
                "
              >

                {/* DECORATIVE LINE */}

                <div className="mb-2.5 flex w-[45%] items-center">

                  <div className="h-[2px] flex-1 bg-[#dcae20]" />

                  <span className="mx-3 text-[15px] text-[#e2b52d]">
                    ♛
                  </span>

                  <div className="h-[2px] flex-1 bg-[#dcae20]" />

                </div>

                {/* MINISTRY */}

                <p className="font-serif text-[clamp(14px,1.5vw,20px)] italic text-white">
                  Sharon Prayer Fellowship
                </p>

                {/* LOCATION */}

                <p className="mt-1 text-[8px] font-bold uppercase tracking-[0.4em] text-[#e3b52d]">
                  Ramayyapalem
                </p>

                {/* PARENTS */}

                <p className="mt-2 font-serif text-[clamp(12px,1.2vw,16px)] font-semibold text-white">

                  {fatherName}

                  <span className="mx-3 text-[#e3b52d]">
                    &
                  </span>

                  {motherName}

                </p>

                {/* WEBSITE / INSTAGRAM / YOUTUBE */}

                <div
                  className="
                    mt-2
                    flex
                    flex-wrap
                    items-center
                    justify-center
                    gap-x-4
                    gap-y-1.5
                    text-[clamp(7px,0.72vw,10px)]
                    text-white/90
                  "
                >

                  <span>
                    🌐 {ministryWebsite}
                  </span>

                  <span className="text-[#e3b52d]">
                    •
                  </span>

                  <span>
                    Instagram: {ministryInstagram}
                  </span>

                  <span className="text-[#e3b52d]">
                    •
                  </span>

                  <span>
                    YouTube: {ministryYoutube}
                  </span>

                </div>

                {/* PHONE NUMBERS */}

                <div
                  className="
                    mt-1.5
                    flex
                    items-center
                    justify-center
                    gap-3
                    text-[clamp(7px,0.72vw,10px)]
                    text-white/85
                  "
                >

                  <span>
                    ☎ {ministryPhone1}
                  </span>

                  <span className="text-[#e3b52d]">
                    •
                  </span>

                  <span>
                    {ministryPhone2}
                  </span>

                </div>

                {/* TAGLINE */}

                <p className="mt-1.5 text-[6px] font-semibold uppercase tracking-[0.35em] text-white/70">
                  Share God&apos;s Word
                </p>

                <Heart
                  size={10}
                  className="mt-1 fill-[#e3b52d] text-[#e3b52d]"
                />

              </div>

            </div>

          </div>

        </section>

      </main>

    </div>
  );
}

export default PosterStudio;