"use client";

import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import { locales, localeNames, type Locale } from "@/lib/i18n";
import { useLocale } from "@/lib/LocaleProvider";
import {
  BOT_NAME,
  LANG_PROMPT,
  TOPIC_FOLLOWUPS,
  TOPIC_IDS,
  TOPIC_LINKS,
  TOPIC_PAGES,
  copy,
  isBroadQuery,
  matchTopic,
  sanitizeBotText,
  topicForSlug,
  type BotLink,
  type DocTopicId,
  type TopicId,
} from "@/lib/helpBot";
import { HELP_LIMITS, type FeedbackRequest, type HelpMode, type HelpSource, type StreamEvent } from "@/lib/helpProtocol";
import { looksLikeSecret } from "@/lib/help/guard";
import { Inline } from "@/components/Inline";

// Help Center chat widget.
//
// How an answer is produced:
//   1. POST /api/help streams a Claude answer grounded in the guide's own pages (RAG), in the user's
//      language, with source links.
//   2. If the AI can't be used (no key, daily budget, rate limit, upstream error, offline) the widget
//      falls back to its original keyword bot: topic routing + the in-browser docs search
//      (lib/docSearch.ts). The keyword bot needs no server round-trip and never shows stale facts —
//      it quotes the guide's current text.
// 👍/👎 and "nothing found" are reported anonymously to /api/help/feedback so the owner can see what
// the guide is missing (see /help-insights).

type Step = "lang" | "name" | "chat";
type Note = "advice" | "stale";

type Msg = {
  id: number;
  from: "bot" | "user";
  text: string;
  links?: BotLink[];
  /** Related-topic quick replies (only rendered under the newest message). */
  chips?: TopicId[];
  /** Show 👍/👎 (only under the newest message, until rated). */
  rateable?: boolean;
  rated?: "up" | "down";
  /** The question this answer responds to — used for feedback and to hand off to the docs search. */
  q?: string;
  /** Show a "Search all docs" button that opens the Cmd+K palette pre-filled with this. */
  searchQuery?: string;
  /** Extra notices under the answer (not-financial-advice, guide possibly stale). */
  notes?: Note[];
  /** Guide "last verified" date (YYYY-MM-DD) shown under AI answers. */
  verifiedAt?: string;
  /** How the answer was produced — reported with feedback. */
  mode?: HelpMode | "local";
  slugs?: string[];
  streaming?: boolean;
};

// One answer from the docs, normalised from either the local index or the /api/help fallback.
type Hit = { title: string; heading: string; snippet: string; href: string; cover: number };

// Speech-recognition locale for the mic button. Roman Urdu ("ur" here) has no romanized speech-
// recognition locale in browsers, so it falls back to Urdu script recognition — still useful, since
// typing over it still works fine.
const SPEECH_LANG: Record<Locale, string> = {
  en: "en-US",
  ur: "ur-PK",
  hi: "hi-IN",
  pcm: "en-NG",
  zh: "zh-CN",
  id: "id-ID",
};

type SpeechRecognitionLike = {
  lang: string;
  interimResults: boolean;
  continuous: boolean;
  maxAlternatives: number;
  onresult: ((e: { results: ArrayLike<ArrayLike<{ transcript: string }>> }) => void) | null;
  onerror: (() => void) | null;
  onend: (() => void) | null;
  start: () => void;
  stop: () => void;
};

const STORAGE_KEY = "mkashifalikcp-bot-session";
const NAME_MAX = 40;
const HISTORY_MAX = 40;

function isMsg(v: unknown): v is Msg {
  if (!v || typeof v !== "object") return false;
  const m = v as Record<string, unknown>;
  return typeof m.id === "number" && (m.from === "bot" || m.from === "user") && typeof m.text === "string";
}

function isLocale(v: unknown): v is Locale {
  return typeof v === "string" && (locales as readonly string[]).includes(v);
}

const isDocTopic = (id: TopicId): id is DocTopicId => id !== "tools";

function sendFeedback(body: FeedbackRequest) {
  try {
    void fetch("/api/help/feedback", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(body),
      keepalive: true,
    }).catch(() => {});
  } catch {
    /* feedback is best-effort */
  }
}

const DATE_TAG: Record<Locale, string> = { en: "en-GB", ur: "en-GB", hi: "hi-IN", pcm: "en-GB", zh: "zh-CN", id: "id-ID" };
function fmtDate(iso: string, lang: Locale): string {
  try {
    return new Intl.DateTimeFormat(DATE_TAG[lang], { dateStyle: "medium", timeZone: "UTC" }).format(new Date(`${iso}T00:00:00Z`));
  } catch {
    return iso;
  }
}

/** Search the guide in the user's language (local index); fall back to the English-only API. */
async function searchGuide(q: string, lang: Locale): Promise<Hit[]> {
  try {
    const mod = await import("@/lib/docSearch");
    const index = await mod.getIndex(lang);
    return mod
      .searchIndex(index, q, { limit: 3, coverage: 0.6, dropStop: true })
      .map((r) => ({ title: r.title, heading: r.heading, snippet: r.snippet, href: r.href, cover: r.cover }));
  } catch {
    const res = await fetch(`/api/help?q=${encodeURIComponent(q)}`);
    const data = (await res.json()) as { results?: { slug: string; title: string; snippet: string }[] };
    return (data.results ?? []).map((r) => ({ title: r.title, heading: "", snippet: r.snippet, href: `/docs/${r.slug}`, cover: 1 }));
  }
}

export function HelpChatBot() {
  const { locale: siteLocale } = useLocale();
  const [open, setOpen] = useState(false);
  const [step, setStep] = useState<Step>("lang");
  const [lang, setLang] = useState<Locale | null>(null);
  const [userName, setUserName] = useState("");
  const [messages, setMessages] = useState<Msg[]>([]);
  const [input, setInput] = useState("");
  /** Waiting for the first token (or a canned reply) — shows the typing dots. */
  const [typing, setTyping] = useState(false);
  /** A request is in flight (waiting or streaming) — blocks new questions, shows Stop. */
  const [busy, setBusy] = useState(false);

  const idRef = useRef(0);
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const timers = useRef<number[]>([]);
  const abortRef = useRef<AbortController | null>(null);
  const messagesRef = useRef<Msg[]>([]);
  messagesRef.current = messages;
  const [listening, setListening] = useState(false);
  const [voiceSupported, setVoiceSupported] = useState(false);
  const recognitionRef = useRef<SpeechRecognitionLike | null>(null);

  useEffect(() => {
    const w = window as unknown as {
      SpeechRecognition?: new () => SpeechRecognitionLike;
      webkitSpeechRecognition?: new () => SpeechRecognitionLike;
    };
    setVoiceSupported(!!(w.SpeechRecognition || w.webkitSpeechRecognition));
  }, []);

  const toggleListening = useCallback(() => {
    if (!lang) return;
    if (listening) {
      recognitionRef.current?.stop();
      return;
    }
    const w = window as unknown as {
      SpeechRecognition?: new () => SpeechRecognitionLike;
      webkitSpeechRecognition?: new () => SpeechRecognitionLike;
    };
    const Ctor = w.SpeechRecognition || w.webkitSpeechRecognition;
    if (!Ctor) return;
    const recognition = new Ctor();
    recognition.lang = SPEECH_LANG[lang];
    recognition.interimResults = false;
    recognition.continuous = false;
    recognition.maxAlternatives = 1;
    recognition.onresult = (e) => {
      const transcript = e.results?.[0]?.[0]?.transcript;
      if (transcript) setInput((prev) => (prev ? `${prev} ${transcript}` : transcript));
    };
    recognition.onerror = () => setListening(false);
    recognition.onend = () => setListening(false);
    recognitionRef.current = recognition;
    setListening(true);
    recognition.start();
  }, [lang, listening]);

  useEffect(() => {
    return () => recognitionRef.current?.stop();
  }, []);


  const t = lang ? copy[lang] : null;
  const lastId = messages.length > 0 ? messages[messages.length - 1].id : -1;

  const push = useCallback((m: Omit<Msg, "id">): number => {
    idRef.current += 1;
    const id = idRef.current;
    setMessages((prev) => [...prev, { ...m, id }]);
    return id;
  }, []);

  const patch = useCallback((id: number, f: (m: Msg) => Msg) => {
    setMessages((prev) => prev.map((m) => (m.id === id ? f(m) : m)));
  }, []);

  // Bot reply with a short "typing" pause so canned replies don't feel abrupt.
  const botSay = useCallback(
    (m: Omit<Msg, "id" | "from">, delay = 350) => {
      setTyping(true);
      const h = window.setTimeout(() => {
        push({ from: "bot", ...m });
        setTyping(false);
      }, delay);
      timers.current.push(h);
    },
    [push]
  );

  useEffect(() => {
    const pending = timers.current;
    return () => {
      pending.forEach((h) => window.clearTimeout(h));
      abortRef.current?.abort();
    };
  }, []);

  const start = useCallback(() => {
    timers.current.forEach((h) => window.clearTimeout(h));
    timers.current = [];
    abortRef.current?.abort();
    setTyping(false);
    setBusy(false);
    setStep("lang");
    setLang(null);
    setUserName("");
    setInput("");
    idRef.current = 1;
    setMessages([{ id: 1, from: "bot", text: LANG_PROMPT }]);
    try {
      window.sessionStorage.removeItem(STORAGE_KEY);
    } catch {
      /* ignore */
    }
  }, []);

  // Restore an in-progress session (same tab) or start fresh. The name is optional, so a session only
  // needs a language.
  useEffect(() => {
    try {
      const raw = window.sessionStorage.getItem(STORAGE_KEY);
      if (raw) {
        const s = JSON.parse(raw) as { lang?: unknown; name?: unknown; messages?: unknown };
        if (isLocale(s.lang)) {
          const name = typeof s.name === "string" ? s.name.trim().slice(0, NAME_MAX) : "";
          const saved = Array.isArray(s.messages) ? s.messages.filter(isMsg).filter((m) => !m.streaming).slice(-HISTORY_MAX) : [];
          setLang(s.lang);
          setUserName(name);
          setStep("chat");
          if (saved.length > 0) {
            idRef.current = Math.max(...saved.map((m) => m.id));
            setMessages(saved);
          } else {
            idRef.current = 1;
            setMessages([
              { id: 1, from: "bot", text: name ? copy[s.lang].greeting.replace("{name}", name) : copy[s.lang].greetingAnon },
            ]);
          }
          return;
        }
      }
    } catch {
      /* ignore */
    }
    start();
  }, [start]);

  // Keep the conversation for this tab so a reload doesn't wipe it (sessionStorage, never sent anywhere).
  useEffect(() => {
    if (step === "lang" || !lang) return;
    try {
      window.sessionStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({ lang, name: userName, messages: messages.filter((m) => !m.streaming).slice(-HISTORY_MAX) })
      );
    } catch {
      /* ignore */
    }
  }, [step, lang, userName, messages]);

  // Warm the local docs index (the offline fallback) once the chat is usable.
  useEffect(() => {
    if (!open || step === "lang" || !lang) return;
    void import("@/lib/docSearch").then((m) => m.getIndex(lang)).catch(() => {});
  }, [open, step, lang]);

  // Keep the newest message in view and focus the right control.
  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: busy ? "auto" : "smooth" });
  }, [messages, typing, open, busy]);

  useEffect(() => {
    if (open && step !== "lang") inputRef.current?.focus();
  }, [open, step, typing]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      // The docs-search palette handles (and consumes) its own Escape.
      if (e.key === "Escape" && !e.defaultPrevented) setOpen(false);
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open]);

  // ---- onboarding -----------------------------------------------------------------------------

  function chooseLang(l: Locale) {
    setLang(l);
    push({ from: "user", text: localeNames[l] });
    setStep("chat"); // straight to chat — the name is optional (see the addName chip)
    botSay({ text: copy[l].greetingAnon });
  }

  function beginNameStep() {
    if (!lang || busy) return;
    setStep("name");
    botSay({ text: copy[lang].askName }, 200);
  }

  function submitName(raw: string) {
    if (!lang) return;
    const name = raw.trim().replace(/\s+/g, " ");
    if (name.length < 1 || name.length > NAME_MAX) {
      botSay({ text: copy[lang].nameError }, 150);
      return;
    }
    push({ from: "user", text: name });
    setUserName(name);
    setStep("chat");
    botSay({ text: copy[lang].greeting.replace("{name}", name) });
  }

  // ---- answers ----------------------------------------------------------------------------------

  const linkFor = useCallback(
    (s: HelpSource): BotLink => {
      const anchor = s.anchors[siteLocale];
      return { label: s.title, href: `/docs/${s.slug}${anchor ? `#${anchor}` : ""}` };
    },
    [siteLocale]
  );

  /** Topic summary straight from the guide's own page (no AI, no copied facts). */
  async function topicFromDocs(id: DocTopicId, l: Locale, q: string): Promise<boolean> {
    try {
      const mod = await import("@/lib/docSearch");
      const sum = mod.pageSummary(await mod.getIndex(l), TOPIC_PAGES[id]);
      if (!sum) return false;
      push({
        from: "bot",
        text: `${copy[l].bestMatch.replace("{title}", sum.title)}\n\n${sum.snippet}`,
        links: TOPIC_LINKS[id],
        chips: TOPIC_FOLLOWUPS[id],
        rateable: true,
        q,
        mode: "local",
        slugs: [TOPIC_PAGES[id]],
      });
      return true;
    } catch {
      return false;
    }
  }

  /** The original keyword bot: topic routing + local docs search. Used whenever the AI can't answer. */
  async function localAnswer(q: string, l: Locale, topic?: DocTopicId) {
    const c = copy[l];
    setTyping(true);
    try {
      let routed: TopicId | null = topic ?? null;
      if (!routed) {
        const m = matchTopic(q);
        if (m && isBroadQuery(q)) routed = m;
      }
      if (routed === "tools") {
        push({ from: "bot", text: c.toolsAnswer, links: TOPIC_LINKS.tools, chips: TOPIC_FOLLOWUPS.tools, rateable: true, q, mode: "local" });
        return;
      }
      if (routed && (await topicFromDocs(routed, l, q))) return;

      let hits: Hit[] = [];
      try {
        hits = await searchGuide(q, l);
      } catch {
        hits = [];
      }
      // A hit whose section holds under half the question's terms is a loose match; if the question
      // also names a topic, prefer that topic's page summary over surfacing a weak section.
      const weak = hits.length > 0 && hits[0].cover < 0.5;
      const named = matchTopic(q);
      if (weak && named && named !== "tools" && (await topicFromDocs(named, l, q))) return;

      if (hits.length > 0) {
        const [top, ...rest] = hits;
        const head = c.bestMatch.replace("{title}", top.title);
        push({
          from: "bot",
          text: `${head}${top.heading ? ` › ${top.heading}` : ""}${top.snippet ? `\n\n${top.snippet}` : ""}`,
          links: [
            { label: top.heading ? `${top.title} › ${top.heading}` : top.title, href: top.href },
            ...rest.map((r) => ({ label: r.title, href: r.href })),
          ],
          rateable: true,
          q,
          mode: "local",
          chips: named ? TOPIC_FOLLOWUPS[named] : undefined,
        });
      } else {
        push({ from: "bot", text: c.notFound, searchQuery: q });
        sendFeedback({ kind: "unanswered", lang: l, mode: "local", q });
      }
    } finally {
      setTyping(false);
    }
  }

  /** Ask the server (Claude + RAG) and stream the answer into the chat. */
  async function runRemote(req: { q?: string; topic?: DocTopicId }, label: string) {
    if (!lang) return;
    const l = lang;
    const c = copy[l];
    const ctrl = new AbortController();
    abortRef.current = ctrl;
    setBusy(true);
    setTyping(true);

    const history = messagesRef.current
      .filter((m) => !m.streaming && m.text)
      .slice(-HELP_LIMITS.history)
      .map((m) => ({ role: m.from === "user" ? ("user" as const) : ("assistant" as const), text: m.text.slice(0, HELP_LIMITS.turn) }));

    // Mutated from the stream handler, so kept in one object (TS can't track closure assignments).
    const st = {
      botId: null as number | null,
      mode: "fallback" as HelpMode,
      sources: [] as HelpSource[],
      verifiedAt: "",
      stale: false,
      ended: false,
      failed: false,
    };

    const handle = (ev: StreamEvent) => {
      if (ev.t === "meta") {
        st.mode = ev.mode;
        st.sources = ev.sources;
        st.verifiedAt = ev.verifiedAt;
        st.stale = ev.stale;
      } else if (ev.t === "delta") {
        if (st.botId === null) {
          setTyping(false);
          st.botId = push({
            from: "bot",
            text: ev.d,
            streaming: true,
            links: st.sources.map(linkFor),
            mode: "llm",
            q: label,
            slugs: st.sources.map((s) => s.slug),
            verifiedAt: st.verifiedAt,
          });
        } else {
          patch(st.botId, (m) => ({ ...m, text: m.text + ev.d }));
        }
      } else if (ev.t === "end") {
        st.ended = true;
        if (st.botId !== null) {
          const topicFromSource = req.topic ?? st.sources.map((s) => topicForSlug(s.slug)).find(Boolean) ?? undefined;
          patch(st.botId, (m) => ({
            ...m,
            streaming: false,
            rateable: true,
            notes: [...(ev.advice ? (["advice"] as Note[]) : []), ...(st.stale ? (["stale"] as Note[]) : [])],
            chips: topicFromSource ? TOPIC_FOLLOWUPS[topicFromSource] : undefined,
            searchQuery: ev.unanswered ? label : undefined,
          }));
        }
      } else if (ev.t === "error") {
        st.failed = true;
      }
    };

    try {
      const res = await fetch("/api/help", {
        method: "POST",
        headers: { "content-type": "application/json" },
        signal: ctrl.signal,
        body: JSON.stringify({ q: req.q, topic: req.topic, lang: l, history }),
      });
      if (res.status === 429) {
        setTyping(false);
        push({ from: "bot", text: c.rateLimited });
        return;
      }
      if (!res.ok || !res.body) throw new Error(`http ${res.status}`);

      const reader = res.body.getReader();
      const dec = new TextDecoder();
      let buf = "";
      for (;;) {
        const { done, value } = await reader.read();
        if (done) break;
        buf += dec.decode(value, { stream: true });
        let nl: number;
        while ((nl = buf.indexOf("\n")) >= 0) {
          const line = buf.slice(0, nl).trim();
          buf = buf.slice(nl + 1);
          if (!line) continue;
          try {
            handle(JSON.parse(line) as StreamEvent);
          } catch {
            /* ignore a malformed line */
          }
        }
      }

      setTyping(false);
      if (st.botId !== null) {
        if (st.failed || !st.ended) {
          patch(st.botId, (m) => ({ ...m, streaming: false, rateable: false }));
          push({ from: "bot", text: c.error });
        }
      } else if (st.mode === "blocked") {
        push({ from: "bot", text: c.seedWarning });
      } else if (st.mode === "none") {
        push({ from: "bot", text: c.notFound, searchQuery: label });
      } else {
        // "fallback", an empty stream, or an upstream error before any text → keyword bot.
        await localAnswer(label, l, req.topic);
      }
    } catch {
      setTyping(false);
      if (ctrl.signal.aborted) {
        if (st.botId !== null) {
          patch(st.botId, (m) => ({ ...m, streaming: false, text: `${m.text} ${c.stopped}` }));
        }
      } else if (st.botId !== null) {
        patch(st.botId, (m) => ({ ...m, streaming: false, rateable: false }));
        push({ from: "bot", text: c.error });
      } else {
        // Network/server problem → the offline keyword bot still answers from the guide.
        await localAnswer(label, l, req.topic);
      }
    } finally {
      abortRef.current = null;
      setTyping(false);
      setBusy(false);
    }
  }

  async function askQuestion(raw: string) {
    if (!lang || busy) return;
    const q = raw.trim().slice(0, HELP_LIMITS.question);
    if (!q) return;
    // Seed phrases / private keys never leave the browser (and never stay in the transcript).
    if (looksLikeSecret(q)) {
      push({ from: "user", text: "🔒 ••••••••" });
      botSay({ text: copy[lang].seedWarning }, 200);
      return;
    }
    push({ from: "user", text: q });
    await runRemote({ q }, q);
  }

  function pickTopic(id: TopicId) {
    if (!lang || busy || typing) return;
    if (step === "name") setStep("chat"); // tapping a topic cancels the optional name prompt
    const label = copy[lang].topics[id];
    push({ from: "user", text: label });
    if (!isDocTopic(id)) {
      botSay({ text: copy[lang].toolsAnswer, links: TOPIC_LINKS.tools, chips: TOPIC_FOLLOWUPS.tools, rateable: true, q: label, mode: "local" });
      return;
    }
    void runRemote({ topic: id }, label);
  }

  function stop() {
    abortRef.current?.abort();
  }

  function openDocsSearch(query: string) {
    window.dispatchEvent(new CustomEvent("concrete:open-docsearch", { detail: { query } }));
  }

  function rate(id: number, r: "up" | "down") {
    if (!lang || busy || typing) return;
    const m = messagesRef.current.find((x) => x.id === id);
    patch(id, (x) => ({ ...x, rated: r }));
    sendFeedback({ kind: "vote", vote: r, lang, mode: m?.mode ?? "local", q: m?.q, slugs: m?.slugs });
    if (r === "up") botSay({ text: copy[lang].thanks });
    else botSay({ text: copy[lang].sorry, searchQuery: m?.q ?? "" });
  }

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (busy || typing) return;
    const value = input;
    setInput("");
    if (step === "name") submitName(value);
    else if (step === "chat") void askQuestion(value);
  }

  const chatOpen = step !== "lang" && !!t;

  return (
    <>
      {open && (
        <section
          role="dialog"
          aria-label={`${BOT_NAME} — ${t?.helpCenter ?? "Help Center"}`}
          className="fixed bottom-20 right-3 z-50 flex h-[min(560px,calc(100vh-7rem))] w-[calc(100vw-1.5rem)] max-w-sm flex-col overflow-hidden rounded-sm border border-line bg-paper shadow-2xl sm:right-5"
        >
          <header className="flex items-center justify-between gap-2 bg-blueprint px-4 py-3 text-paper">
            <div className="min-w-0 leading-tight">
              <p className="truncate font-display text-sm font-semibold">🗿 {BOT_NAME}</p>
              <p className="truncate text-[11px] text-paper/70">{t?.helpCenter ?? "Help Center"}</p>
            </div>
            <div className="flex shrink-0 items-center gap-1">
              {step !== "lang" && t && (
                <button
                  type="button"
                  onClick={start}
                  className="focus-ring rounded-sm px-2 py-1 text-[11px] text-paper/80 transition-colors hover:bg-paper/10 hover:text-paper"
                  title={t.changeLanguage}
                >
                  ⟲ {t.restart}
                </button>
              )}
              <button
                type="button"
                onClick={() => setOpen(false)}
                aria-label={t?.closeLabel ?? "Close help chat"}
                className="focus-ring rounded-sm px-2 py-1 text-lg leading-none text-paper/80 transition-colors hover:bg-paper/10 hover:text-paper"
              >
                ×
              </button>
            </div>
          </header>

          <div
            ref={scrollRef}
            className="flex-1 space-y-3 overflow-y-auto bg-paper2/40 px-3 py-4"
            role="log"
            aria-live="polite"
            aria-busy={busy}
          >
            {messages.map((m) => (
              <div key={m.id} className={`flex ${m.from === "user" ? "justify-end" : "justify-start"}`}>
                <div
                  className={`max-w-[85%] whitespace-pre-line rounded-sm px-3 py-2 text-sm leading-relaxed ${
                    m.from === "user" ? "bg-rebar text-paper" : "border border-line bg-paper text-ink"
                  }`}
                >
                  {m.from === "bot" ? <Inline text={sanitizeBotText(m.text)} /> : m.text}
                  {m.streaming && (
                    <span className="ml-0.5 inline-block h-3.5 w-1.5 animate-pulse bg-inkfaint align-middle" aria-hidden />
                  )}
                  {t &&
                    !m.streaming &&
                    m.notes?.map((n) => (
                      <p key={n} className="mt-2 whitespace-normal rounded-sm border-l-2 border-rebar/60 bg-rebar/5 px-2 py-1 text-xs text-ink/80">
                        {n === "advice" ? t.adviceNote : t.staleNote}
                      </p>
                    ))}
                  {m.links && m.links.length > 0 && !m.streaming && (
                    <div className="mt-2 flex flex-wrap gap-1.5">
                      {m.links.map((l) => (
                        <Link
                          key={l.href}
                          href={l.href}
                          className="focus-ring rounded-sm border border-blueprint/30 px-2 py-1 text-xs font-medium text-blueprint transition-colors hover:bg-blueprint hover:text-paper"
                        >
                          {l.label} →
                        </Link>
                      ))}
                    </div>
                  )}
                  {m.verifiedAt && !m.streaming && lang && t && (
                    <p className="mt-2 whitespace-normal text-[10px] text-inkfaint">
                      {t.verified.replace("{date}", fmtDate(m.verifiedAt, lang))}
                    </p>
                  )}
                  {m.searchQuery !== undefined && t && (
                    <button
                      type="button"
                      onClick={() => openDocsSearch(m.searchQuery ?? "")}
                      className="focus-ring mt-2 rounded-sm border border-rebar/40 px-2 py-1 text-xs font-medium text-rebar transition-colors hover:bg-rebar hover:text-paper"
                    >
                      🔎 {t.searchAll}
                    </button>
                  )}
                  {m.from === "bot" && m.id === lastId && !typing && !busy && t && m.chips && m.chips.length > 0 && (
                    <div className="mt-3 border-t border-line pt-2">
                      <p className="mb-1.5 text-[11px] uppercase tracking-wide text-inkfaint">{t.followUp}</p>
                      <div className="flex flex-wrap gap-1.5">
                        {m.chips.map((id) => (
                          <button
                            key={id}
                            type="button"
                            onClick={() => pickTopic(id)}
                            className="focus-ring rounded-full border border-line px-2.5 py-1 text-xs font-medium text-ink transition-colors hover:border-rebar hover:text-rebar"
                          >
                            {t.topics[id]}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                  {m.from === "bot" && m.id === lastId && !typing && !busy && t && m.rateable && !m.rated && (
                    <div className="mt-2 flex items-center gap-2 text-xs text-inkfaint">
                      <span>{t.helpfulQ}</span>
                      <button
                        type="button"
                        onClick={() => rate(m.id, "up")}
                        className="focus-ring rounded-sm border border-line px-2 py-0.5 text-ink transition-colors hover:border-rebar"
                      >
                        {t.yes}
                      </button>
                      <button
                        type="button"
                        onClick={() => rate(m.id, "down")}
                        className="focus-ring rounded-sm border border-line px-2 py-0.5 text-ink transition-colors hover:border-rebar"
                      >
                        {t.no}
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))}

            {step === "lang" && (
              <div className="flex flex-wrap gap-2 pt-1">
                {locales.map((l) => (
                  <button
                    key={l}
                    type="button"
                    onClick={() => chooseLang(l)}
                    className="focus-ring rounded-sm border border-blueprint/40 bg-paper px-3 py-1.5 text-sm font-medium text-blueprint transition-colors hover:bg-blueprint hover:text-paper"
                  >
                    {localeNames[l]}
                  </button>
                ))}
              </div>
            )}

            {typing && (
              <div className="flex justify-start">
                <div className="rounded-sm border border-line bg-paper px-3 py-2 text-sm text-inkfaint" aria-label={t?.searching}>
                  <span className="inline-flex gap-1" aria-hidden>
                    <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-inkfaint" />
                    <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-inkfaint [animation-delay:150ms]" />
                    <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-inkfaint [animation-delay:300ms]" />
                  </span>
                </div>
              </div>
            )}
          </div>

          {chatOpen && t && (
            <div className="flex gap-1.5 overflow-x-auto border-t border-line bg-paper px-3 py-2" aria-label={t.topicsHint}>
              {TOPIC_IDS.map((id) => (
                <button
                  key={id}
                  type="button"
                  onClick={() => pickTopic(id)}
                  disabled={busy || typing}
                  className="focus-ring shrink-0 whitespace-nowrap rounded-full border border-line px-3 py-1 text-xs font-medium text-ink transition-colors hover:border-rebar hover:text-rebar disabled:opacity-50"
                >
                  {t.topics[id]}
                </button>
              ))}
              {step === "chat" && !userName && (
                <button
                  type="button"
                  onClick={beginNameStep}
                  disabled={busy || typing}
                  className="focus-ring shrink-0 whitespace-nowrap rounded-full border border-dashed border-line px-3 py-1 text-xs text-inkfaint transition-colors hover:border-rebar hover:text-rebar disabled:opacity-50"
                >
                  {t.addName}
                </button>
              )}
            </div>
          )}

          {chatOpen && t && (
            <div className="border-t border-line bg-paper">
              <form onSubmit={onSubmit} className="flex items-center gap-2 px-3 pb-1 pt-2.5">
                <input
                  ref={inputRef}
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  maxLength={step === "name" ? NAME_MAX : HELP_LIMITS.question}
                  placeholder={step === "name" ? t.namePlaceholder : t.inputPlaceholder}
                  aria-label={step === "name" ? t.namePlaceholder : t.inputPlaceholder}
                  autoComplete={step === "name" ? "given-name" : "off"}
                  className="focus-ring min-w-0 flex-1 rounded-sm border border-line bg-paper px-3 py-2 text-sm text-ink placeholder:text-inkfaint"
                />
                {step === "chat" && voiceSupported && (
                  <button
                    type="button"
                    onClick={toggleListening}
                    aria-pressed={listening}
                    aria-label={listening ? t.voiceStop : t.voiceStart}
                    title={listening ? t.voiceStop : t.voiceStart}
                    className={`focus-ring shrink-0 rounded-sm border px-2.5 py-2 text-sm transition-colors ${
                      listening
                        ? "animate-pulse border-rebar bg-rebar text-paper"
                        : "border-line text-ink hover:border-rebar hover:text-rebar"
                    }`}
                  >
                    🎙️
                  </button>
                )}
                {busy ? (
                  <button
                    type="button"
                    onClick={stop}
                    className="focus-ring rounded-sm border border-rebar px-3 py-2 text-sm font-semibold text-rebar transition-colors hover:bg-rebar hover:text-paper"
                  >
                    {t.stop}
                  </button>
                ) : (
                  <button
                    type="submit"
                    disabled={typing || !input.trim()}
                    className="focus-ring rounded-sm bg-rebar px-3 py-2 text-sm font-semibold text-paper transition-colors hover:bg-rebar/90 disabled:opacity-50"
                  >
                    {t.send}
                  </button>
                )}
              </form>
              <p className="truncate px-3 pb-2 text-[10px] text-inkfaint">{t.footerNote}</p>
            </div>
          )}
        </section>
      )}

      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-label={open ? (t?.closeLabel ?? "Close help chat") : (t?.openLabel ?? "Open help chat")}
        aria-expanded={open}
        className="focus-ring fixed bottom-4 right-3 z-50 flex h-12 items-center gap-2 rounded-full bg-rebar px-4 text-sm font-semibold text-paper shadow-lg transition-colors hover:bg-rebar/90 sm:right-5"
      >
        <span aria-hidden>{open ? "×" : "💬"}</span>
        <span className="hidden sm:inline">{t?.helpCenter ?? "Help Center"}</span>
      </button>
    </>
  );
}
