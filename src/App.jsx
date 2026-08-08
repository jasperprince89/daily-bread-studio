import { useState } from "react";
import {
  BookOpen,
  CalendarDays,
  ChevronDown,
  Clock3,
  Heart,
  Menu,
  Sparkles,
  UserRound,
  X,
  RefreshCw,
  Pencil,
} from "lucide-react";

import PosterStudio from "./components/PosterStudio";

function App() {
  const [mobileMenu, setMobileMenu] = useState(false);
  const [showPosterStudio, setShowPosterStudio] = useState(false);

  const [theme, setTheme] = useState("");
  const [reference, setReference] = useState("");
  const [language, setLanguage] = useState("English");

  const [loading, setLoading] = useState(false);
  const [devotional, setDevotional] = useState(null);
  const [error, setError] = useState("");
  const [editing, setEditing] = useState(false);

  const today = new Date().toLocaleDateString("en-IN", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  const updateDevotional = (field, value) => {
    setDevotional((previous) => ({
      ...previous,
      [field]: value,
    }));
  };

  const handleGenerate = async () => {
    if (!theme.trim() && !reference.trim()) {
      setError("Please enter a theme or Bible reference.");
      return;
    }

    setLoading(true);
    setError("");
    setDevotional(null);
    setEditing(false);

    try {
      const API_URL =
  import.meta.env.VITE_API_URL || "http://localhost:5000";

const response = await fetch(
  `${API_URL}/api/generate-devotional`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            theme,
            reference,
            language,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.error || "Unable to generate devotional."
        );
      }

      setDevotional(data.devotional);
    } catch (err) {
      setError(
        err.message ||
          "Unable to connect to the Daily Bread AI service."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleOpenPoster = () => {
    if (!devotional) return;

    setShowPosterStudio(true);
  };

  if (showPosterStudio) {
    return (
      <PosterStudio
        onBack={() => setShowPosterStudio(false)}
        devotional={devotional}
      />
    );
  }

  return (
    <div className="min-h-screen bg-[#faf8f3] text-[#29251f]">

      {/* HEADER */}

      <header className="sticky top-0 z-50 border-b border-[#e9e2d6] bg-[#faf8f3]/95 backdrop-blur">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-5 sm:px-8">

          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#6d4c41] text-white shadow-sm">
              <BookOpen size={21} />
            </div>

            <div>
              <h1 className="font-serif text-lg font-semibold tracking-tight">
                Daily Bread
              </h1>

              <p className="text-[10px] uppercase tracking-[0.2em] text-[#9a8976]">
                Studio
              </p>
            </div>
          </div>

          <nav className="hidden items-center gap-7 md:flex">
            <button className="text-sm font-medium text-[#6d4c41]">
              Dashboard
            </button>

            <button className="text-sm text-[#81766a] transition hover:text-[#6d4c41]">
              My Devotionals
            </button>

            <button className="text-sm text-[#81766a] transition hover:text-[#6d4c41]">
              Templates
            </button>

            <div className="ml-2 flex h-9 w-9 items-center justify-center rounded-full border border-[#dfd5c7] bg-white">
              <UserRound
                size={17}
                className="text-[#6d4c41]"
              />
            </div>
          </nav>

          <button
            onClick={() => setMobileMenu(!mobileMenu)}
            className="rounded-lg p-2 transition hover:bg-[#f1ebe2] md:hidden"
          >
            {mobileMenu ? (
              <X size={22} />
            ) : (
              <Menu size={22} />
            )}
          </button>
        </div>

        {mobileMenu && (
          <div className="border-t border-[#e9e2d6] bg-white px-5 py-4 md:hidden">
            <div className="flex flex-col gap-4 text-sm">
              <button className="text-left font-medium text-[#6d4c41]">
                Dashboard
              </button>

              <button className="text-left text-[#81766a]">
                My Devotionals
              </button>

              <button className="text-left text-[#81766a]">
                Templates
              </button>
            </div>
          </div>
        )}
      </header>

      {/* MAIN */}

      <main className="mx-auto max-w-7xl px-5 py-8 sm:px-8 lg:py-12">

        {/* WELCOME */}

        <section className="mb-8">
          <div className="mb-3 flex items-center gap-2 text-sm text-[#9a8976]">
            <CalendarDays size={15} />
            <span>{today}</span>
          </div>

          <h2 className="font-serif text-3xl font-semibold tracking-tight sm:text-4xl">
            Good morning 🌿
          </h2>

          <p className="mt-2 max-w-xl text-sm leading-6 text-[#81766a] sm:text-base">
            Create a beautiful devotional and share
            God&apos;s Word with someone today.
          </p>
        </section>

        {/* GENERATOR + PREVIEW */}

        <section className="grid gap-6 lg:grid-cols-[1fr_0.85fr]">

          {/* GENERATOR */}

          <div className="rounded-3xl border border-[#e8dfd2] bg-white p-6 shadow-[0_10px_40px_rgba(82,62,45,0.06)] sm:p-8">

            <div className="mb-7 flex items-start justify-between gap-4">

              <div>
                <div className="mb-3 flex h-11 w-11 items-center justify-center rounded-2xl bg-[#f4ece2] text-[#6d4c41]">
                  <Sparkles size={21} />
                </div>

                <h3 className="font-serif text-2xl font-semibold">
                  Create Daily Bread
                </h3>

                <p className="mt-1 text-sm text-[#938779]">
                  Let AI help you prepare today&apos;s devotional.
                </p>
              </div>

              <span className="rounded-full bg-[#f8f2e9] px-3 py-1 text-[11px] font-medium text-[#806b58]">
                AI MODE
              </span>
            </div>

            {/* THEME */}

            <div className="mb-5">
              <label className="mb-2 block text-sm font-medium">
                Today&apos;s theme
              </label>

              <input
                type="text"
                value={theme}
                onChange={(e) => setTheme(e.target.value)}
                placeholder="e.g. Hope, Faith, Peace, Strength..."
                className="w-full rounded-xl border border-[#ded5c9] bg-[#fdfcf9] px-4 py-3 text-sm outline-none transition placeholder:text-[#b2a79b] focus:border-[#8b6b57] focus:ring-2 focus:ring-[#8b6b57]/10"
              />
            </div>

            {/* REFERENCE */}

            <div className="mb-5">
              <label className="mb-2 block text-sm font-medium">
                Bible reference{" "}
                <span className="font-normal text-[#aaa096]">
                  (optional)
                </span>
              </label>

              <input
                type="text"
                value={reference}
                onChange={(e) => setReference(e.target.value)}
                placeholder="e.g. Isaiah 41:10"
                className="w-full rounded-xl border border-[#ded5c9] bg-[#fdfcf9] px-4 py-3 text-sm outline-none transition placeholder:text-[#b2a79b] focus:border-[#8b6b57] focus:ring-2 focus:ring-[#8b6b57]/10"
              />
            </div>

            {/* OPTIONS */}

            <div className="mb-7 grid gap-4 sm:grid-cols-2">

              <div>
                <label className="mb-2 block text-sm font-medium">
                  Language
                </label>

                <div className="relative">
                  <select
                    value={language}
                    onChange={(e) => setLanguage(e.target.value)}
                    className="w-full appearance-none rounded-xl border border-[#ded5c9] bg-[#fdfcf9] px-4 py-3 text-sm outline-none focus:border-[#8b6b57]"
                  >
                    <option>English</option>
                    <option>Telugu</option>
                    <option>English + Telugu</option>
                  </select>

                  <ChevronDown
                    size={16}
                    className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-[#938779]"
                  />
                </div>
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium">
                  Style
                </label>

                <div className="flex items-center rounded-xl border border-[#ded5c9] bg-[#fdfcf9] px-4 py-3 text-sm">
                  <span className="flex-1">
                    Elegant
                  </span>

                  <ChevronDown
                    size={16}
                    className="text-[#938779]"
                  />
                </div>
              </div>

            </div>

            {/* GENERATE */}

            <button
              onClick={handleGenerate}
              disabled={loading}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#6d4c41] px-5 py-3.5 text-sm font-semibold text-white shadow-lg shadow-[#6d4c41]/15 transition hover:bg-[#5d4037] active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? (
                <>
                  <RefreshCw
                    size={18}
                    className="animate-spin"
                  />
                  Creating your devotional...
                </>
              ) : (
                <>
                  <Sparkles size={18} />
                  Generate Daily Bread
                </>
              )}
            </button>

            {/* ERROR */}

            {error && (
              <div className="mt-4 rounded-xl bg-red-50 px-4 py-3 text-center text-sm text-red-600">
                {error}
              </div>
            )}

            <p className="mt-3 text-center text-xs text-[#aaa096]">
              AI will create the title, verse, reflection and prayer.
            </p>

            {/* MANUAL POSTER */}

            <div className="my-6 flex items-center gap-3">
              <div className="h-px flex-1 bg-[#eee6dc]" />
              <span className="text-xs text-[#aaa096]">
                OR
              </span>
              <div className="h-px flex-1 bg-[#eee6dc]" />
            </div>

            <button
              onClick={() => setShowPosterStudio(true)}
              className="w-full rounded-xl border border-[#d9cfc1] bg-[#fdfbf8] px-5 py-3 text-sm font-semibold text-[#6d4c41] transition hover:border-[#6d4c41] hover:bg-[#f8f2e9]"
            >
              Create Poster Manually
            </button>
          </div>

          {/* PREVIEW */}

          <div className="rounded-3xl border border-[#e8dfd2] bg-[#f3ede4] p-5 sm:p-6">

            <div className="mb-4 flex items-center justify-between">
              <div>
                <h3 className="font-serif text-xl font-semibold">
                  Preview
                </h3>

                <p className="text-xs text-[#968879]">
                  Your devotional will appear here.
                </p>
              </div>

              <Clock3
                size={18}
                className="text-[#9b8978]"
              />
            </div>

            {/* PREVIEW POSTER */}

            <div className="relative mx-auto aspect-[4/5] max-w-[390px] overflow-hidden rounded-2xl bg-gradient-to-br from-[#40342b] via-[#75604d] to-[#c2a27b] shadow-xl">

              <div className="absolute inset-0 bg-[radial-gradient(circle_at_75%_20%,rgba(255,230,180,0.5),transparent_30%)]" />

              <div className="relative flex h-full flex-col justify-between p-6 text-white sm:p-7">

                <div>
                  <div className="mb-4 flex items-center gap-2 text-[#f4d58d]">
                    <BookOpen size={16} />

                    <span className="text-[10px] font-semibold uppercase tracking-[0.25em]">
                      Daily Bread
                    </span>
                  </div>

                  <h4 className="font-serif text-3xl leading-tight">
                    {devotional?.title || (
                      <>
                        Your daily
                        <br />
                        Word of God
                      </>
                    )}
                  </h4>

                  <div className="mt-4 h-px w-20 bg-[#e9c878]" />
                </div>

                <div>
                  <p className="text-xs uppercase tracking-[0.2em] text-[#f2d48c]">
                    {devotional
                      ? "Today's Word"
                      : "Today's Promise"}
                  </p>

                  <p className="mt-3 font-serif text-xl leading-relaxed">
                    “
                    {devotional?.verse ||
                      "The Lord will fight for you, and you have only to be silent."}
                    ”
                  </p>

                  <p className="mt-3 text-sm text-[#f0d18b]">
                    {devotional?.reference ||
                      "Exodus 14:14"}
                  </p>
                </div>

                <div className="flex items-center justify-between border-t border-white/20 pt-4">
                  <span className="text-xs text-white/70">
                    Daily Bread Studio
                  </span>

                  <Heart
                    size={16}
                    className="fill-[#e9c878] text-[#e9c878]"
                  />
                </div>

              </div>
            </div>

            {/* AI CONTENT */}

            {devotional && (
              <div className="mt-5 rounded-2xl border border-[#e5dacb] bg-white p-5">

                <div className="flex items-center justify-between">
                  <p className="text-xs font-semibold uppercase tracking-widest text-[#9a8976]">
                    AI Generated Content
                  </p>

                  <button
                    onClick={() => setEditing(!editing)}
                    className="flex items-center gap-1.5 rounded-lg border border-[#ded5c9] px-3 py-1.5 text-xs font-semibold text-[#6d4c41] hover:bg-[#f8f3eb]"
                  >
                    <Pencil size={13} />
                    {editing ? "Done" : "Edit"}
                  </button>
                </div>

                {/* TITLE */}

                <div className="mt-4">
                  <label className="text-xs font-semibold uppercase tracking-wider text-[#9a8976]">
                    Title
                  </label>

                  {editing ? (
                    <input
                      value={devotional.title}
                      onChange={(e) =>
                        updateDevotional(
                          "title",
                          e.target.value
                        )
                      }
                      className="mt-2 w-full rounded-xl border border-[#ded5c9] bg-[#fdfcf9] px-4 py-3 font-serif text-xl outline-none focus:border-[#8b6b57]"
                    />
                  ) : (
                    <h4 className="mt-2 font-serif text-2xl font-semibold text-[#4e342e]">
                      {devotional.title}
                    </h4>
                  )}
                </div>

                {/* HOOK */}

                <div className="mt-5">
                  <label className="text-xs font-semibold uppercase tracking-wider text-[#9a8976]">
                    Introduction
                  </label>

                  {editing ? (
                    <textarea
                      value={devotional.hook}
                      onChange={(e) =>
                        updateDevotional(
                          "hook",
                          e.target.value
                        )
                      }
                      rows={3}
                      className="mt-2 w-full resize-none rounded-xl border border-[#ded5c9] bg-[#fdfcf9] px-4 py-3 text-sm leading-6 outline-none focus:border-[#8b6b57]"
                    />
                  ) : (
                    <p className="mt-2 text-sm font-medium leading-6 text-[#806b58]">
                      {devotional.hook}
                    </p>
                  )}
                </div>

                {/* VERSE */}

                <div className="mt-5 rounded-xl bg-[#f8f3eb] p-4">

                  <label className="text-xs font-semibold uppercase tracking-wider text-[#9a8976]">
                    Bible Verse
                  </label>

                  {editing ? (
                    <>
                      <textarea
                        value={devotional.verse}
                        onChange={(e) =>
                          updateDevotional(
                            "verse",
                            e.target.value
                          )
                        }
                        rows={4}
                        className="mt-2 w-full resize-none rounded-lg border border-[#ded5c9] bg-white px-3 py-3 font-serif text-lg leading-7 outline-none focus:border-[#8b6b57]"
                      />

                      <input
                        value={devotional.reference}
                        onChange={(e) =>
                          updateDevotional(
                            "reference",
                            e.target.value
                          )
                        }
                        className="mt-3 w-full rounded-lg border border-[#ded5c9] bg-white px-3 py-2 text-sm font-semibold text-[#6d4c41] outline-none focus:border-[#8b6b57]"
                      />
                    </>
                  ) : (
                    <>
                      <p className="mt-3 font-serif text-lg leading-7">
                        “{devotional.verse}”
                      </p>

                      <p className="mt-2 text-sm font-semibold text-[#6d4c41]">
                        — {devotional.reference}
                      </p>
                    </>
                  )}
                </div>

                {/* REFLECTION */}

                <div className="mt-5">
                  <h5 className="font-semibold text-[#6d4c41]">
                    Reflection
                  </h5>

                  {editing ? (
                    <textarea
                      value={devotional.reflection}
                      onChange={(e) =>
                        updateDevotional(
                          "reflection",
                          e.target.value
                        )
                      }
                      rows={7}
                      className="mt-2 w-full resize-none rounded-xl border border-[#ded5c9] bg-[#fdfcf9] px-4 py-3 text-sm leading-6 outline-none focus:border-[#8b6b57]"
                    />
                  ) : (
                    <p className="mt-2 text-sm leading-6 text-[#655b52]">
                      {devotional.reflection}
                    </p>
                  )}
                </div>

                {/* PRAYER */}

                <div className="mt-5">
                  <h5 className="font-semibold text-[#6d4c41]">
                    Today&apos;s Prayer
                  </h5>

                  {editing ? (
                    <textarea
                      value={devotional.prayer}
                      onChange={(e) =>
                        updateDevotional(
                          "prayer",
                          e.target.value
                        )
                      }
                      rows={5}
                      className="mt-2 w-full resize-none rounded-xl border border-[#ded5c9] bg-[#fdfcf9] px-4 py-3 text-sm leading-6 outline-none focus:border-[#8b6b57]"
                    />
                  ) : (
                    <p className="mt-2 text-sm leading-6 text-[#655b52]">
                      {devotional.prayer}
                    </p>
                  )}
                </div>

                {/* ACTIONS */}

                <div className="mt-6 grid gap-3 sm:grid-cols-2">

                  <button
                    onClick={handleGenerate}
                    disabled={loading}
                    className="flex items-center justify-center gap-2 rounded-xl border border-[#d9cfc1] bg-[#fdfbf8] px-5 py-3 text-sm font-semibold text-[#6d4c41] transition hover:bg-[#f8f2e9] disabled:opacity-60"
                  >
                    <RefreshCw
                      size={16}
                      className={
                        loading
                          ? "animate-spin"
                          : ""
                      }
                    />

                    Generate Again
                  </button>

                  <button
                    onClick={handleOpenPoster}
                    className="flex items-center justify-center gap-2 rounded-xl bg-[#6d4c41] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#5d4037]"
                  >
                    <Sparkles size={17} />
                    Design This as a Poster
                  </button>

                </div>

              </div>
            )}
          </div>
        </section>

        {/* RECENT DEVOTIONALS */}

        <section className="mt-10">
          <div className="mb-4 flex items-end justify-between">

            <div>
              <h3 className="font-serif text-2xl font-semibold">
                Recent Devotionals
              </h3>

              <p className="mt-1 text-sm text-[#938779]">
                Your recently created Daily Bread posts.
              </p>
            </div>

            <button className="hidden text-sm font-medium text-[#6d4c41] sm:block">
              View all →
            </button>

          </div>

          <div className="rounded-2xl border border-dashed border-[#d9cfc1] bg-white/60 p-8 text-center">

            <BookOpen
              size={28}
              className="mx-auto mb-3 text-[#b3a394]"
            />

            <p className="text-sm font-medium text-[#65584c]">
              No devotionals yet
            </p>

            <p className="mt-1 text-xs text-[#a69b90]">
              Your generated devotionals will appear here.
            </p>

          </div>
        </section>

      </main>
    </div>
  );
}

export default App;