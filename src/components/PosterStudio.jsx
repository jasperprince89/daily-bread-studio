import { useRef, useState } from "react";
import html2canvas from "html2canvas-pro";
import {
  ArrowLeft,
  Download,
  Sparkles,
} from "lucide-react";

import familyImage from "../assets/Pic/Family.png";
import monthlyBackground from "../assets/backgrounds/Aug.png";
import churchLogo from "../assets/Pic/ChurchLogo.png";

/* =========================================================
   MINISTRY DETAILS
========================================================= */

const fatherName = "John Victor";
const motherName = "Sharon Victor";

const ministryInstagram = "@spfr_melodies";
const ministryYoutube = "@sharonprayerhouseRMPLM";

const ministryPhone1 = "+91 8328187655";
const ministryPhone2 = "+91 7780348832";

/* =========================================================
   POSTER STUDIO
========================================================= */

function PosterStudio({ onBack, devotional }) {
  const posterRef = useRef(null);

  /* =======================================================
     CONTENT
  ======================================================= */

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

  /* =======================================================
     TELUGU DETECTION
  ======================================================= */

  const containsTelugu = (text = "") =>
    /[\u0C00-\u0C7F]/.test(text);

  const isTelugu =
    containsTelugu(title) ||
    containsTelugu(verse) ||
    containsTelugu(reference) ||
    containsTelugu(reflection);

  /* =======================================================
     REFLECTION FONT SIZE
  ======================================================= */

  const getReflectionFontSize = (text = "") => {
    const length = text.trim().length;

    if (length <= 60) {
      return isTelugu
        ? "clamp(10px, 1.05cqw, 17px)"
        : "clamp(9px, 1cqw, 15px)";
    }

    if (length <= 100) {
      return isTelugu
        ? "clamp(9.5px, 0.95cqw, 16px)"
        : "clamp(8.5px, 0.9cqw, 14px)";
    }

    if (length <= 150) {
      return isTelugu
        ? "clamp(9px, 0.88cqw, 15px)"
        : "clamp(8px, 0.82cqw, 13px)";
    }

    if (length <= 200) {
      return isTelugu
        ? "clamp(8.5px, 0.82cqw, 14px)"
        : "clamp(7.5px, 0.76cqw, 12px)";
    }

    if (length <= 260) {
      return isTelugu
        ? "clamp(8px, 0.76cqw, 13px)"
        : "clamp(7px, 0.7cqw, 11px)";
    }

    return isTelugu
      ? "clamp(7.5px, 0.68cqw, 12px)"
      : "clamp(6.5px, 0.62cqw, 10px)";
  };

  /* =======================================================
     BIBLE VERSE FONT SIZE
  ======================================================= */

  const getVerseFontSize = (text = "") => {
    const length = text.trim().length;

    if (length <= 30) {
      return isTelugu
        ? "clamp(11px, 1.15cqw, 18px)"
        : "clamp(11px, 1.2cqw, 19px)";
    }

    if (length <= 50) {
      return isTelugu
        ? "clamp(10px, 1.05cqw, 17px)"
        : "clamp(10px, 1.1cqw, 17px)";
    }

    if (length <= 75) {
      return isTelugu
        ? "clamp(9.5px, 0.96cqw, 16px)"
        : "clamp(9px, 1cqw, 16px)";
    }

    if (length <= 105) {
      return isTelugu
        ? "clamp(9px, 0.88cqw, 15px)"
        : "clamp(8.5px, 0.92cqw, 15px)";
    }

    if (length <= 140) {
      return isTelugu
        ? "clamp(8.5px, 0.82cqw, 14px)"
        : "clamp(8px, 0.84cqw, 14px)";
    }

    if (length <= 180) {
      return isTelugu
        ? "clamp(8px, 0.76cqw, 13px)"
        : "clamp(7.5px, 0.78cqw, 13px)";
    }

    if (length <= 230) {
      return isTelugu
        ? "clamp(7.5px, 0.7cqw, 12px)"
        : "clamp(7px, 0.72cqw, 12px)";
    }

    return isTelugu
      ? "clamp(7px, 0.64cqw, 11px)"
      : "clamp(6.5px, 0.68cqw, 11px)";
  };

  /* =======================================================
     BIBLE REFERENCE FONT SIZE
  ======================================================= */

  const getReferenceFontSize = (text = "") => {
    const length = text.trim().length;

    if (length <= 15) {
      return isTelugu
        ? "clamp(6px, 0.7cqw, 10px)"
        : "clamp(6px, 0.75cqw, 11px)";
    }

    if (length <= 25) {
      return isTelugu
        ? "clamp(5.7px, 0.66cqw, 9px)"
        : "clamp(5.7px, 0.7cqw, 10px)";
    }

    if (length <= 35) {
      return isTelugu
        ? "clamp(5.3px, 0.61cqw, 8.5px)"
        : "clamp(5.3px, 0.65cqw, 9px)";
    }

    if (length <= 45) {
      return isTelugu
        ? "clamp(5px, 0.57cqw, 8px)"
        : "clamp(5px, 0.61cqw, 8.5px)";
    }

    return isTelugu
      ? "clamp(4.6px, 0.53cqw, 7.5px)"
      : "clamp(4.6px, 0.57cqw, 8px)";
  };

  /* =======================================================
     DOWNLOAD POSTER
  ======================================================= */

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
      console.error(
        "Poster download failed:",
        error
      );

      setIsDownloading(false);

      alert(
        "Unable to create the poster image. Please try again."
      );
    }
  };

  /* =======================================================
     RETURN
  ======================================================= */

  return (
    <div className="min-h-screen bg-[#eee7dd] text-[#2c211a]">

      {/* =====================================================
          HEADER
      ===================================================== */}

      <header className="sticky top-0 z-50 border-b border-[#ded3c5] bg-[#fffdfa]/95 backdrop-blur">

        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-5">

          <button
            onClick={onBack}
            className="flex items-center gap-2 text-sm font-medium text-[#654331]"
          >
            <ArrowLeft size={18} />

            <span className="hidden sm:inline">
              Back
            </span>
          </button>

          <div className="flex items-center gap-2">

            <Sparkles
              size={17}
              className="text-[#b88725]"
            />

            <div className="text-center">

              <h1 className="font-serif text-base font-semibold sm:text-lg">
                Poster Studio
              </h1>

              <p className="text-[8px] uppercase tracking-[0.28em] text-[#9a8978] sm:text-[9px]">
                August Daily Bread
              </p>

            </div>

          </div>

          <button
            onClick={downloadPoster}
            disabled={isDownloading}
            className="
              flex
              items-center
              gap-2
              rounded-xl
              bg-[#654331]
              px-3
              py-2
              text-xs
              font-semibold
              text-white
              disabled:opacity-60
              sm:px-4
              sm:py-2.5
              sm:text-sm
            "
          >

            <Download size={16} />

            <span className="hidden sm:inline">
              {isDownloading
                ? "Creating..."
                : "Download"}
            </span>

          </button>

        </div>

      </header>

      {/* =====================================================
          MAIN
      ===================================================== */}

      <main
        className="
          mx-auto
          flex
          max-w-7xl
          flex-col
          gap-6
          px-3
          py-5
          sm:px-5
          sm:py-7
          lg:grid
          lg:grid-cols-[350px_1fr]
        "
      >

        {/* ===================================================
            CONTROLS
        =================================================== */}

        <aside className="order-2 space-y-5 lg:order-1">

          {/* =================================================
              BACKGROUND
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
              className={`
                mb-5
                w-full
                resize-none
                rounded-xl
                border
                border-[#ded3c5]
                bg-[#fdfbf8]
                px-4
                py-3
                text-sm
                outline-none
                ${isTelugu ? "font-potti text-lg" : ""}
              `}
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
              className={`
                mb-5
                w-full
                resize-none
                rounded-xl
                border
                border-[#ded3c5]
                bg-[#fdfbf8]
                px-4
                py-3
                text-sm
                leading-6
                outline-none
                ${isTelugu ? "font-potti text-lg" : ""}
              `}
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
              className={`
                mb-5
                w-full
                rounded-xl
                border
                border-[#ded3c5]
                bg-[#fdfbf8]
                px-4
                py-3
                text-sm
                outline-none
                ${isTelugu ? "font-potti text-lg" : ""}
              `}
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
                className={`
                  w-full
                  resize-none
                  rounded-xl
                  border
                  border-[#ded3c5]
                  bg-[#fdfbf8]
                  px-4
                  py-3
                  text-sm
                  leading-6
                  outline-none
                  ${isTelugu ? "font-potti text-lg" : ""}
                `}
              />
            )}

          </section>

        </aside>

        {/* ===================================================
            POSTER PREVIEW
        =================================================== */}

        <section
          className="
            order-1
            flex
            w-full
            items-start
            justify-center
            overflow-hidden
            rounded-[2rem]
            bg-[#e4dbcf]
            p-2
            sm:p-5
            lg:order-2
            lg:p-8
          "
        >

          {/* =================================================
              POSTER CANVAS
          ================================================= */}

          <div
            ref={posterRef}
            style={{
              containerType: "inline-size",
            }}
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
              draggable="false"
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
                MAIN POSTER AREA
                84%
            ================================================= */}

            <div
              className="
                absolute
                inset-x-0
                top-0
                z-10
                h-[84%]
                overflow-hidden
              "
            >

              {/* LEFT DARK PANEL */}

              <div
                className="
                  pointer-events-none
                  absolute
                  inset-y-0
                  left-0
                  z-10
                  w-[52%]
                  bg-gradient-to-r
                  from-black
                  via-black/95
                  to-black/5
                "
              />

              {/* CENTER BLEND */}

              <div
                className="
                  pointer-events-none
                  absolute
                  inset-y-0
                  left-[36%]
                  z-20
                  w-[22%]
                  bg-gradient-to-r
                  from-black/55
                  via-black/20
                  to-transparent
                "
              />

              {/* =================================================
                  FAMILY IMAGE
              ================================================= */}

              <div
                className="
                  pointer-events-none
                  absolute
                  bottom-0
                  right-0
                  z-30
                  h-full
                  w-[58%]
                "
              >

                <img
                  src={familyImage}
                  alt="Family"
                  draggable="false"
                  className="
                    absolute
                    bottom-0
                    right-0
                    h-full
                    w-full
                    object-contain
                    object-right-bottom
                  "
                />

              </div>

              {/* =================================================
                  LEFT CONTENT
              ================================================= */}

              <div
                className="
                  absolute
                  left-0
                  top-0
                  z-50
                  flex
                  h-full
                  w-[46%]
                  flex-col
                  overflow-hidden
                  px-[6%]
                  pt-[4.5%]
                  pb-[2.5%]
                "
              >

                {/* =================================================
                    DAILY PROMISE
                ================================================= */}

                <div className="shrink-0">

                  <p
                    className="
                      font-semibold
                      uppercase
                      tracking-[0.32em]
                      text-white
                    "
                    style={{
                      fontSize:
                        "clamp(8px, 1.05cqw, 16px)",
                      lineHeight: 1,
                    }}
                  >
                    Daily Promise
                  </p>

                  <div className="mt-[1.8cqw] flex items-center">

                    <div
                      className="
                        h-[0.16cqw]
                        w-[7cqw]
                        bg-[#e2b52d]
                      "
                    />

                    <span
                      className="mx-[1cqw] text-[#e2b52d]"
                      style={{
                        fontSize:
                          "clamp(6px, 0.7cqw, 11px)",
                        lineHeight: 1,
                      }}
                    >
                      ❧
                    </span>

                    <div
                      className="
                        h-[0.16cqw]
                        w-[7cqw]
                        bg-[#e2b52d]
                      "
                    />

                  </div>

                  <p
                    className="
                      mt-[1.8cqw]
                      uppercase
                      tracking-[0.25em]
                      text-white/70
                    "
                    style={{
                      fontSize:
                        "clamp(5px, 0.6cqw, 9px)",
                      lineHeight: 1,
                    }}
                  >
                    A Word For Today
                  </p>

                </div>

                {/* =================================================
                    TITLE
                ================================================= */}

                <div className="mt-[3.6cqw] shrink-0">

                  <h1
                    className={`
                      whitespace-pre-line
                      break-words
                      text-white
                      ${
                        isTelugu
                          ? "font-potti font-normal"
                          : "font-serif font-bold"
                      }
                    `}
                    style={{
                      fontSize: isTelugu
                        ? "clamp(20px, 2.5cqw, 40px)"
                        : "clamp(20px, 2.8cqw, 43px)",
                      lineHeight: 1.08,
                    }}
                  >
                    {title}
                  </h1>

                  <div
                    className="
                      mt-[2cqw]
                      h-[0.2cqw]
                      w-[5.5cqw]
                      bg-[#e2b52d]
                    "
                  />

                </div>

                {/* =================================================
                    TODAY'S PROMISE
                ================================================= */}

                <div className="mt-[2cqw] shrink-0">

                  <span
                    className="
                      inline-flex
                      rounded-full
                      border
                      border-[#e0b42c]
                      px-[1.4cqw]
                      py-[0.55cqw]
                      font-bold
                      uppercase
                      tracking-[0.06em]
                      text-[#f1c844]
                    "
                    style={{
                      fontSize:
                        "clamp(5px, 0.6cqw, 9px)",
                      lineHeight: 1,
                    }}
                  >
                    Today's Promise
                  </span>

                </div>

                {/* =================================================
                    REFLECTION
                ================================================= */}

                {showReflection && (
                  <div
                    className="
                      mt-[1.5cqw]
                      min-h-0
                      shrink
                      overflow-hidden
                      rounded-[1.2cqw]
                      border-[0.14cqw]
                      border-[#c29a3d]
                      bg-black/65
                      px-[2.5cqw]
                      py-[1.7cqw]
                    "
                  >

                    <p
                      className={`
                        break-words
                        whitespace-pre-line
                        text-white
                        ${
                          isTelugu
                            ? "font-potti"
                            : "font-serif"
                        }
                      `}
                      style={{
                        fontSize:
                          getReflectionFontSize(
                            reflection
                          ),
                        lineHeight: 1.38,
                        overflowWrap: "anywhere",
                      }}
                    >
                      {reflection}
                    </p>

                  </div>
                )}

                {/* =================================================
                    BIBLE VERSE + REFERENCE
                ================================================= */}

                <div
                  className="
                    mt-[1.4cqw]
                    min-h-0
                    shrink
                    overflow-hidden
                    rounded-[1.2cqw]
                    border-[0.14cqw]
                    border-[#9d7a32]
                    bg-black/65
                    px-[2.4cqw]
                    py-[1.5cqw]
                  "
                >

                  {/* VERSE */}

                  <p
                    className={`
                      break-words
                      whitespace-pre-line
                      text-white
                      ${
                        isTelugu
                          ? "font-potti"
                          : "font-serif"
                      }
                    `}
                    style={{
                      fontSize:
                        getVerseFontSize(verse),
                      lineHeight: 1.28,
                      overflowWrap: "anywhere",
                      wordBreak: "break-word",
                    }}
                  >
                    “{verse}”
                  </p>

                  {/* REFERENCE */}

                  {reference.trim() && (
                    <p
                      className={`
                        mt-[0.8cqw]
                        break-words
                        whitespace-normal
                        font-semibold
                        text-[#e5bd35]
                        ${
                          isTelugu
                            ? "font-potti"
                            : ""
                        }
                      `}
                      style={{
                        fontSize:
                          getReferenceFontSize(
                            reference
                          ),
                        lineHeight: 1.15,
                        overflowWrap: "anywhere",
                        wordBreak: "break-word",
                      }}
                    >
                      — {reference}
                    </p>
                  )}

                </div>

              </div>

            </div>

            {/* =================================================
                CHURCH LOGO
            ================================================= */}

            <div
              className="
                pointer-events-none
                absolute
                right-[3%]
                top-[2.5%]
                z-[70]
                flex
                h-[15cqw]
                w-[20cqw]
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
                FOOTER
                16%
            ================================================= */}

            <div
              className="
                absolute
                inset-x-0
                bottom-0
                z-[80]
                h-[16%]
                overflow-hidden
                bg-black/95
              "
            >

              {/* GOLD TOP BORDER */}

              <div
                className="
                  absolute
                  left-0
                  right-0
                  top-0
                  h-[0.14cqw]
                  bg-[#dcae20]
                "
              />

              {/* FOOTER CONTENT */}

              <div
                className="
                  flex
                  h-full
                  w-full
                  flex-col
                  items-center
                  justify-center
                  px-[3cqw]
                  text-center
                "
              >

                {/* MINISTRY NAME */}

                <p
                  className="
                    whitespace-nowrap
                    font-serif
                    italic
                    font-semibold
                    text-white
                  "
                  style={{
                    fontSize:
                      "clamp(9.5px, 1.15cqw, 18px)",
                    lineHeight: 1.25,
                  }}
                >
                  Sharon Prayer Fellowship
                </p>

                {/* LOCATION */}

                <p
                  className="
                    mt-[0.35cqw]
                    whitespace-nowrap
                    font-bold
                    uppercase
                    tracking-[0.3em]
                    text-[#e3b52d]
                  "
                  style={{
                    fontSize:
                      "clamp(4px, 0.48cqw, 7px)",
                    lineHeight: 1.5,
                  }}
                >
                  RAMAYYAPALEM
                </p>

                {/* NAMES */}

                <p
                  className="
                    mt-[0.45cqw]
                    whitespace-nowrap
                    font-serif
                    font-semibold
                    text-white
                  "
                  style={{
                    fontSize:
                      "clamp(8px, 0.82cqw, 12px)",
                    lineHeight: 1,
                  }}
                >
                  {fatherName}

                  <span className="mx-[0.7cqw] text-[#e3b52d]">
                    &
                  </span>

                  {motherName}
                </p>

                {/* WEBSITE */}

                <p
                  className="
                    mt-[0.4cqw]
                    max-w-full
                    overflow-hidden
                    text-ellipsis
                    whitespace-nowrap
                    text-white/85
                  "
                  style={{
                    fontSize:
                      "clamp(4.5px, 0.4cqw, 6px)",
                    lineHeight: 1,
                  }}
                >
                  🌐 sharon-prayer-fellowship.vercel.app
                </p>

                {/* SOCIAL MEDIA */}

                <p
                  className="
                    mt-[0.25cqw]
                    max-w-full
                    overflow-hidden
                    text-ellipsis
                    whitespace-nowrap
                    text-white/75
                  "
                  style={{
                    fontSize:
                      "clamp(4.5px, 0.38cqw, 5.8px)",
                    lineHeight: 1,
                  }}
                >
                  Instagram: {ministryInstagram}

                  <span className="mx-[0.6cqw] text-[#e3b52d]">
                    •
                  </span>

                  YouTube: {ministryYoutube}
                </p>

                {/* PHONE */}

                <p
                  className="
                    mt-[0.25cqw]
                    whitespace-nowrap
                    text-white/75
                  "
                  style={{
                    fontSize:
                      "clamp(4.5px, 0.39cqw, 5.8px)",
                    lineHeight: 1,
                  }}
                >
                  ☎ {ministryPhone1}

                  <span className="mx-[0.7cqw] text-[#e3b52d]">
                    •
                  </span>

                  {ministryPhone2}
                </p>

              </div>

            </div>

          </div>

        </section>

      </main>

    </div>
  );
}

export default PosterStudio;