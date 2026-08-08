import {
  useLayoutEffect,
  useRef,
  useState,
} from "react";

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

  const [showReflection, setShowReflection] =
    useState(true);

  const [isDownloading, setIsDownloading] =
    useState(false);

  /* =======================================================
     TEXT FIT REFS
  ======================================================= */

  const reflectionBoxRef = useRef(null);
  const reflectionTextRef = useRef(null);

  const verseBoxRef = useRef(null);
  const verseContentRef = useRef(null);

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
     REFLECTION TEXT FITTING

     Reflection gets the larger content area.

     Long reflection:
     - automatically reduces font size
     - never overlaps footer
     - never escapes its box
  ======================================================= */

  const fitReflectionText = () => {
    const box = reflectionBoxRef.current;
    const textElement = reflectionTextRef.current;

    if (
      !box ||
      !textElement ||
      !showReflection
    ) {
      return;
    }

    const boxStyle =
      getComputedStyle(box);

    const paddingTop =
      parseFloat(boxStyle.paddingTop) || 0;

    const paddingBottom =
      parseFloat(boxStyle.paddingBottom) || 0;

    const paddingLeft =
      parseFloat(boxStyle.paddingLeft) || 0;

    const paddingRight =
      parseFloat(boxStyle.paddingRight) || 0;

    const availableHeight =
      box.clientHeight -
      paddingTop -
      paddingBottom;

    const availableWidth =
      box.clientWidth -
      paddingLeft -
      paddingRight;

    if (
      availableHeight <= 0 ||
      availableWidth <= 0
    ) {
      return;
    }

    /* =====================================================
       FONT LIMITS

       Reflection can be larger than Bible verse.
    ===================================================== */

    const maxSize = isTelugu
      ? 16
      : 15;

    const minSize = isTelugu
      ? 6.5
      : 6;

    let low = minSize;
    let high = maxSize;
    let bestSize = minSize;

    /* =====================================================
       RESET TEXT
    ===================================================== */

    textElement.style.height = "auto";
    textElement.style.maxHeight = "none";
    textElement.style.overflow = "visible";

    /* =====================================================
       BINARY SEARCH
    ===================================================== */

    for (let i = 0; i < 14; i++) {
      const size =
        (low + high) / 2;

      textElement.style.fontSize =
        `${size}px`;

      textElement.style.lineHeight =
        "1.30";

      void textElement.offsetHeight;

      const requiredHeight =
        textElement.scrollHeight;

      const requiredWidth =
        textElement.scrollWidth;

      const fitsHeight =
        requiredHeight <=
        availableHeight + 1;

      const fitsWidth =
        requiredWidth <=
        availableWidth + 1;

      if (
        fitsHeight &&
        fitsWidth
      ) {
        bestSize = size;
        low = size;
      } else {
        high = size;
      }
    }

    /* =====================================================
       APPLY FINAL SIZE
    ===================================================== */

    textElement.style.fontSize =
      `${bestSize}px`;

    textElement.style.lineHeight =
      "1.30";

    textElement.style.height =
      "auto";

    textElement.style.maxHeight =
      "100%";

    textElement.style.overflow =
      "hidden";
  };

  /* =======================================================
     BIBLE VERSE + REFERENCE FITTING

     IMPORTANT:

     Verse is intentionally smaller than reflection.

     Verse:
       Maximum = 12px
       Minimum = 6.5px

     Reference:
       Maximum = 8px
       Minimum = 5px

     Verse and reference have completely
     separate areas so they cannot overlap.
  ======================================================= */

  const fitVerseText = () => {
    const box = verseBoxRef.current;
    const content = verseContentRef.current;

    if (!box || !content) {
      return;
    }

    const verseWrapper =
      content.querySelector("[data-verse-wrapper]");

    const verseElement =
      content.querySelector("[data-verse-text]");

    const referenceElement =
      content.querySelector("[data-reference-text]");

    if (!verseWrapper || !verseElement) {
      return;
    }

    /*
     * IMPORTANT:
     *
     * Do NOT use the current flex child's height as the
     * measurement source. The flex layout can change its
     * height while we are trying different font sizes.
     *
     * Instead:
     *
     * 1. Measure the reference first.
     * 2. Reserve the reference height.
     * 3. Calculate the exact remaining height for the verse.
     * 4. Measure the verse against that fixed area.
     * 5. Apply the final font size.
     *
     * This makes the verse auto-fit reliably.
     */

    const contentStyle =
      window.getComputedStyle(content);

    const gapSize =
      parseFloat(contentStyle.gap) || 0;

    const availableWidth =
      verseWrapper.clientWidth;

    const totalContentHeight =
      content.clientHeight;

    if (
      availableWidth <= 0 ||
      totalContentHeight <= 0
    ) {
      return;
    }

    /* =====================================================
       FONT LIMITS
    ===================================================== */

    const MAX_VERSE_SIZE = isTelugu ? 14 : 15;
    const MIN_VERSE_SIZE = isTelugu ? 5.5 : 6;

    const MAX_REFERENCE_SIZE = isTelugu ? 8 : 8;
    const MIN_REFERENCE_SIZE = isTelugu ? 4.5 : 5;

    /* =====================================================
       MEASUREMENT ELEMENT CREATOR
    ===================================================== */

    const createMeasurementElement = ({
      sourceElement,
      width,
      fontSize,
      lineHeight,
    }) => {
      const sourceStyle =
        window.getComputedStyle(sourceElement);

      const element =
        document.createElement("div");

      element.textContent =
        sourceElement.textContent;

      element.style.position =
        "fixed";

      element.style.left =
        "-100000px";

      element.style.top =
        "0";

      element.style.visibility =
        "hidden";

      element.style.pointerEvents =
        "none";

      element.style.boxSizing =
        "border-box";

      element.style.width =
        `${Math.max(width, 1)}px`;

      element.style.height =
        "auto";

      element.style.minHeight =
        "0";

      element.style.maxHeight =
        "none";

      element.style.padding =
        "0";

      element.style.margin =
        "0";

      element.style.border =
        "0";

      element.style.whiteSpace =
        "pre-line";

      element.style.overflow =
        "visible";

      element.style.overflowWrap =
        "anywhere";

      element.style.wordBreak =
        "break-word";

      element.style.fontFamily =
        sourceStyle.fontFamily;

      element.style.fontWeight =
        sourceStyle.fontWeight;

      element.style.fontStyle =
        sourceStyle.fontStyle;

      element.style.letterSpacing =
        sourceStyle.letterSpacing;

      element.style.textTransform =
        sourceStyle.textTransform;

      element.style.fontSize =
        `${fontSize}px`;

      element.style.lineHeight =
        `${lineHeight}`;

      document.body.appendChild(element);

      return element;
    };

    /* =====================================================
       MEASURE REFERENCE FIRST
    ===================================================== */

    let referenceHeight = 0;
    let finalReferenceSize =
      MAX_REFERENCE_SIZE;

    if (
      referenceElement &&
      referenceElement.textContent.trim()
    ) {
      const referenceWidth =
        referenceElement.parentElement?.clientWidth ||
        availableWidth;

      const referenceMeasurement =
        createMeasurementElement({
          sourceElement: referenceElement,
          width: referenceWidth,
          fontSize: MAX_REFERENCE_SIZE,
          lineHeight: 1.15,
        });

      let low =
        MIN_REFERENCE_SIZE;

      let high =
        MAX_REFERENCE_SIZE;

      let best =
        MIN_REFERENCE_SIZE;

      for (let i = 0; i < 15; i++) {
        const size =
          (low + high) / 2;

        referenceMeasurement.style.fontSize =
          `${size}px`;

        referenceMeasurement.style.lineHeight =
          "1.15";

        void referenceMeasurement.offsetHeight;

        const height =
          referenceMeasurement.scrollHeight;

        /*
         * Reference should normally stay on one or
         * two lines. We use its natural height here.
         */
        if (height > 0) {
          best = size;
          low = size;
        } else {
          high = size;
        }
      }

      finalReferenceSize = best;

      referenceMeasurement.style.fontSize =
        `${finalReferenceSize}px`;

      referenceMeasurement.style.lineHeight =
        "1.15";

      void referenceMeasurement.offsetHeight;

      referenceHeight =
        referenceMeasurement.scrollHeight;

      referenceMeasurement.remove();
    }

    /* =====================================================
       CALCULATE EXACT VERSE HEIGHT
    ===================================================== */

    /*
     * content.clientHeight is the actual inside height of
     * the verse box.
     *
     * The reference occupies its own height.
     * The margin/gap between verse and reference is also
     * reserved.
     */

    const verseAvailableHeight =
      Math.max(
        1,
        totalContentHeight -
          referenceHeight -
          gapSize
      );

    /* =====================================================
       LOCK VERSE AREA TO THE CALCULATED HEIGHT
    ===================================================== */

    verseWrapper.style.flex =
      "none";

    verseWrapper.style.height =
      `${verseAvailableHeight}px`;

    verseWrapper.style.minHeight =
      "0";

    verseWrapper.style.maxHeight =
      `${verseAvailableHeight}px`;

    verseWrapper.style.overflow =
      "hidden";

    /* =====================================================
       CREATE UNCONSTRAINED VERSE MEASUREMENT
    ===================================================== */

    const verseMeasurement =
      createMeasurementElement({
        sourceElement: verseElement,
        width: availableWidth,
        fontSize: MAX_VERSE_SIZE,
        lineHeight: 1.22,
      });

    /* =====================================================
       FIND LARGEST VERSE FONT THAT FITS
    ===================================================== */

    let low =
      MIN_VERSE_SIZE;

    let high =
      MAX_VERSE_SIZE;

    let best =
      MIN_VERSE_SIZE;

    for (let i = 0; i < 20; i++) {
      const size =
        (low + high) / 2;

      verseMeasurement.style.fontSize =
        `${size}px`;

      verseMeasurement.style.lineHeight =
        "1.22";

      void verseMeasurement.offsetHeight;

      const requiredHeight =
        verseMeasurement.scrollHeight;

      const fits =
        requiredHeight <=
        verseAvailableHeight + 0.5;

      if (fits) {
        best = size;
        low = size;
      } else {
        high = size;
      }
    }

    verseMeasurement.remove();

    /* =====================================================
       APPLY FINAL VERSE SIZE
    ===================================================== */

    verseElement.style.fontSize =
      `${best}px`;

    verseElement.style.lineHeight =
      "1.22";

    verseElement.style.width =
      "100%";

    verseElement.style.height =
      "auto";

    verseElement.style.maxHeight =
      `${verseAvailableHeight}px`;

    verseElement.style.overflow =
      "hidden";

    verseElement.style.display =
      "block";

    /* =====================================================
       APPLY FINAL REFERENCE SIZE
    ===================================================== */

    if (referenceElement) {
      referenceElement.style.fontSize =
        `${finalReferenceSize}px`;

      referenceElement.style.lineHeight =
        "1.15";

      referenceElement.style.width =
        "100%";

      referenceElement.style.height =
        "auto";

      referenceElement.style.maxHeight =
        "100%";

      referenceElement.style.overflow =
        "hidden";
    }
  };

  /* =======================================================
     RUN TEXT FITTING
  ======================================================= */

  const runTextFit = async () => {
    try {
      if (document.fonts?.ready) {
        await document.fonts.ready;
      }
    } catch (error) {
      console.warn(
        "Font loading check failed:",
        error
      );
    }

    await new Promise((resolve) => {
      requestAnimationFrame(() => {
        resolve();
      });
    });

    fitReflectionText();
    fitVerseText();
  };

  /* =======================================================
     REFIT WHEN CONTENT CHANGES
  ======================================================= */

  useLayoutEffect(() => {
    let cancelled = false;

    const run = async () => {
      if (cancelled) {
        return;
      }

      await runTextFit();

      if (cancelled) {
        return;
      }

      requestAnimationFrame(() => {
        if (cancelled) {
          return;
        }

        fitReflectionText();
        fitVerseText();
      });
    };

    run();

    return () => {
      cancelled = true;
    };
  }, [
    title,
    verse,
    reference,
    reflection,
    showReflection,
    isTelugu,
  ]);

  /* =======================================================
     REFIT ON WINDOW RESIZE
  ======================================================= */

  useLayoutEffect(() => {
    let resizeTimer;

    const handleResize = () => {
      clearTimeout(resizeTimer);

      resizeTimer = setTimeout(() => {
        runTextFit();
      }, 80);
    };

    window.addEventListener(
      "resize",
      handleResize
    );

    return () => {
      clearTimeout(resizeTimer);

      window.removeEventListener(
        "resize",
        handleResize
      );
    };
  }, [
    showReflection,
    isTelugu,
  ]);

  /* =======================================================
     DOWNLOAD POSTER
  ======================================================= */

  const downloadPoster = async () => {
    if (
      !posterRef.current ||
      isDownloading
    ) {
      return;
    }

    setIsDownloading(true);

    try {
      /* Wait for fonts */
      if (document.fonts?.ready) {
        await document.fonts.ready;
      }

      /* Refit before capture */
      await runTextFit();

      /* Wait another frame */
      await new Promise((resolve) => {
        requestAnimationFrame(() => {
          resolve();
        });
      });

      /* ===================================================
         WAIT FOR IMAGES
      =================================================== */

      const images =
        posterRef.current.querySelectorAll(
          "img"
        );

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

      /* Rendering delay */
      await new Promise((resolve) =>
        setTimeout(resolve, 400)
      );

      /* ===================================================
         CREATE CANVAS
      =================================================== */

      const canvas =
        await html2canvas(
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

      /* ===================================================
         DOWNLOAD
      =================================================== */

      canvas.toBlob((blob) => {
        if (!blob) {
          setIsDownloading(false);

          alert(
            "Unable to create the poster image."
          );

          return;
        }

        const url =
          URL.createObjectURL(blob);

        const link =
          document.createElement("a");

        link.href = url;

        link.download =
          "daily-bread-august.png";

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
    <div
      className="
        min-h-screen
        bg-[#eee7dd]
        text-[#2c211a]
      "
    >

      {/* =====================================================
          HEADER
      ===================================================== */}

      <header
        className="
          sticky
          top-0
          z-50
          border-b
          border-[#ded3c5]
          bg-[#fffdfa]/95
          backdrop-blur
        "
      >

        <div
          className="
            mx-auto
            flex
            h-16
            max-w-7xl
            items-center
            justify-between
            px-4
            sm:px-5
          "
        >

          {/* BACK */}

          <button
            onClick={onBack}
            className="
              flex
              items-center
              gap-2
              text-sm
              font-medium
              text-[#654331]
            "
          >

            <ArrowLeft size={18} />

            <span className="hidden sm:inline">
              Back
            </span>

          </button>

          {/* TITLE */}

          <div
            className="
              flex
              items-center
              gap-2
            "
          >

            <Sparkles
              size={17}
              className="text-[#b88725]"
            />

            <div className="text-center">

              <h1
                className="
                  font-serif
                  text-base
                  font-semibold
                  sm:text-lg
                "
              >
                Poster Studio
              </h1>

              <p
                className="
                  text-[8px]
                  uppercase
                  tracking-[0.28em]
                  text-[#9a8978]
                  sm:text-[9px]
                "
              >
                August Daily Bread
              </p>

            </div>

          </div>

          {/* DOWNLOAD */}

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

        <aside
          className="
            order-2
            space-y-5
            lg:order-1
          "
        >

          {/* =================================================
              BACKGROUND
          ================================================= */}

          <section
            className="
              rounded-3xl
              border
              border-[#e5dbcf]
              bg-white
              p-5
              shadow-sm
            "
          >

            <div
              className="
                mb-4
                flex
                items-center
                gap-3
              "
            >

              <div
                className="
                  flex
                  h-9
                  w-9
                  items-center
                  justify-center
                  rounded-xl
                  bg-[#f5ede1]
                "
              >

                <Sparkles
                  size={17}
                  className="text-[#a66e25]"
                />

              </div>

              <div>

                <h2
                  className="
                    text-sm
                    font-semibold
                  "
                >
                  Monthly Background
                </h2>

                <p
                  className="
                    text-[11px]
                    text-[#9a8979]
                  "
                >
                  Change this every month
                </p>

              </div>

            </div>

            <div
              className="
                overflow-hidden
                rounded-2xl
                border
                border-[#e4d9cc]
              "
            >

              <img
                src={monthlyBackground}
                alt="August background"
                className="
                  h-36
                  w-full
                  object-cover
                "
              />

              <div
                className="
                  bg-[#fcfaf7]
                  p-3
                "
              >

                <p
                  className="
                    text-sm
                    font-semibold
                  "
                >
                  Aug.png
                </p>

                <p
                  className="
                    mt-1
                    text-[11px]
                    text-[#978879]
                  "
                >
                  src/assets/backgrounds/Aug.png
                </p>

              </div>

            </div>

          </section>

          {/* =================================================
              POSTER CONTENT
          ================================================= */}

          <section
            className="
              rounded-3xl
              border
              border-[#e5dbcf]
              bg-white
              p-5
              shadow-sm
            "
          >

            <h2
              className="
                font-serif
                text-xl
                font-semibold
              "
            >
              Poster Content
            </h2>

            <p
              className="
                mb-5
                mt-1
                text-xs
                text-[#988879]
              "
            >
              Edit the content shown on the poster.
            </p>

            {/* =================================================
                TITLE
            ================================================= */}

            <label
              className="
                mb-2
                block
                text-[11px]
                font-semibold
                uppercase
                tracking-[0.12em]
                text-[#765a42]
              "
            >
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
                ${
                  isTelugu
                    ? "font-potti text-lg"
                    : ""
                }
              `}
            />

            {/* =================================================
                BIBLE VERSE
            ================================================= */}

            <label
              className="
                mb-2
                block
                text-[11px]
                font-semibold
                uppercase
                tracking-[0.12em]
                text-[#765a42]
              "
            >
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
                ${
                  isTelugu
                    ? "font-potti text-lg"
                    : ""
                }
              `}
            />

            {/* =================================================
                REFERENCE
            ================================================= */}

            <label
              className="
                mb-2
                block
                text-[11px]
                font-semibold
                uppercase
                tracking-[0.12em]
                text-[#765a42]
              "
            >
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
                ${
                  isTelugu
                    ? "font-potti text-lg"
                    : ""
                }
              `}
            />

            {/* =================================================
                REFLECTION
            ================================================= */}

            <div
              className="
                mb-2
                flex
                items-center
                justify-between
              "
            >

              <label
                className="
                  text-[11px]
                  font-semibold
                  uppercase
                  tracking-[0.12em]
                  text-[#765a42]
                "
              >
                Reflection
              </label>

              <button
                onClick={() =>
                  setShowReflection(
                    !showReflection
                  )
                }
                className="
                  text-xs
                  font-semibold
                  text-[#a16d30]
                "
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
                  ${
                    isTelugu
                      ? "font-potti text-lg"
                      : ""
                  }
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

                FOOTER = 16%
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

              {/* =================================================
                  LEFT DARK PANEL
              ================================================= */}

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

              {/* =================================================
                  CENTER BLEND
              ================================================= */}

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

                  <div
                    className="
                      mt-[1.8cqw]
                      flex
                      items-center
                    "
                  >

                    <div
                      className="
                        h-[0.16cqw]
                        w-[7cqw]
                        bg-[#e2b52d]
                      "
                    />

                    <span
                      className="
                        mx-[1cqw]
                        text-[#e2b52d]
                      "
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

                <div
                  className="
                    mt-[3.6cqw]
                    shrink-0
                  "
                >

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
                        ? "clamp(15px, 2.5cqw, 40px)"
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

                <div
                  className="
                    mt-[2cqw]
                    shrink-0
                  "
                >

                  <span
                    className="
                      inline-flex
                      rounded-full
                      border
                      border-[#e0b42c]
                      px-[1.4cqw]
                      py-[1cqw]
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
                    CONTENT AREA

                    Reflection = 62.5%
                    Bible = 37.5%

                    The Bible section is deliberately smaller.
                ================================================= */}

                <div
                  className={`
                    mt-[1.5cqw]
                    min-h-0
                    flex-1
                    grid
                    gap-[1.2cqw]
                    ${
                      showReflection
                        ? "grid-rows-[1.25fr_0.75fr]"
                        : "grid-rows-[1fr]"
                    }
                  `}
                >

                  {/* =================================================
                      REFLECTION BOX
                  ================================================= */}

                  {showReflection ? (
                    <div
                      ref={reflectionBoxRef}
                      className="
                        min-h-0
                        overflow-hidden
                        rounded-[1.2cqw]
                        border-[0.14cqw]
                        border-[#c29a3d]
                        bg-black/65
                        px-[2.5cqw]
                        py-[1.6cqw]
                      "
                    >

                      <div
                        ref={reflectionTextRef}
                        className={`
                          h-full
                          min-h-0
                          w-full
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
                          fontSize: "16px",
                          lineHeight: 1.30,
                          overflowWrap: "anywhere",
                          wordBreak: "break-word",
                          overflow: "hidden",
                        }}
                      >
                        {reflection}
                      </div>

                    </div>
                  ) : null}

                  {/* =================================================
                      BIBLE VERSE + REFERENCE

                      IMPORTANT:

                      Verse and reference are separated.

                      Verse:
                        flex-1

                      Reference:
                        shrink-0

                      This prevents overlap.
                  ================================================= */}

                  <div
                    ref={verseBoxRef}
                    className="
                      min-h-0
                      overflow-hidden
                      rounded-[1.2cqw]
                      border-[0.14cqw]
                      border-[#9d7a32]
                      bg-black/65
                      px-[2.4cqw]
                      py-[1.5cqw]
                    "
                  >

                    <div
                      ref={verseContentRef}
                      className="
                        flex
                        h-full
                        min-h-0
                        w-full
                        flex-col
                        overflow-hidden
                      "
                    >

                      {/* =================================================
                          VERSE AREA
                      ================================================= */}

                      <div
                        data-verse-wrapper
                        className="
                          min-h-0
                          w-full
                          flex-1
                          overflow-hidden
                        "
                      >

                        <p
                          data-verse-text
                          className={`
                            m-0
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
                            fontSize: "7.5px",
                            lineHeight: 1,
                            overflowWrap: "anywhere",
                            wordBreak: "break-word",
                            overflow: "hidden",
                          }}
                        >
                          “{verse}”
                        </p>

                      </div>

                      {/* =================================================
                          REFERENCE AREA
                      ================================================= */}

                      {reference.trim() && (
                        <div
                          className="
                            mt-[0.8cqw]
                            shrink-0
                            max-w-full
                            overflow-hidden
                          "
                        >

                          <p
                            data-reference-text
                            className={`
                              m-0
                              break-words
                              whitespace-pre-line
                              font-semibold
                              text-[#e5bd35]
                              ${
                                isTelugu
                                  ? "font-potti"
                                  : ""
                              }
                            `}
                            style={{
                              fontSize: "8px",
                              lineHeight: 1.15,
                              overflowWrap: "anywhere",
                              wordBreak: "break-word",
                              maxWidth: "100%",
                              overflow: "hidden",
                            }}
                          >
                            — {reference}
                          </p>

                        </div>
                      )}

                    </div>

                  </div>

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

                FIXED 16%
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

                  <span
                    className="
                      mx-[0.7cqw]
                      text-[#e3b52d]
                    "
                  >
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

                  <span
                    className="
                      mx-[0.6cqw]
                      text-[#e3b52d]
                    "
                  >
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

                  <span
                    className="
                      mx-[0.7cqw]
                      text-[#e3b52d]
                    "
                  >
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
