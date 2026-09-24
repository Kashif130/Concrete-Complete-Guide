// Multilingual tokenizer for the help bot's retriever (server side).
//
// Handles the guide's six languages: English, Roman Urdu, Hindi (Devanagari), Naija Pidgin,
// Chinese and Indonesian. No dictionaries or extra packages:
//  * words are split on Unicode letters/marks/digits (marks matter — the old splitter used
//    \p{L} only and cut Hindi words at every vowel sign);
//  * Han runs become overlapping bigrams (Chinese has no spaces);
//  * a light suffix stemmer folds fee/fees, withdraw/withdrawal/withdrawing, point/points — and,
//    because matching is per *token*, "point" can never match "appointment";
//  * function words are dropped (STOP is shared with the client-side docs search).

import { STOP as BASE_STOP } from "@/lib/stopwords";

const EXTRA_STOP = [
  // en
  "was", "were", "be", "been", "being", "am", "did", "done", "shall", "may", "might", "must", "no", "yes", "these",
  "those", "its", "he", "she", "they", "them", "we", "our", "us", "which", "whom", "whose", "where", "here", "then",
  "than", "so", "such", "very", "just", "also", "any", "some", "more", "most", "other", "again", "too", "or", "but",
  "at", "by", "as", "please", "tell", "want", "need", "know", "explain",
  // roman urdu
  "ho", "tha", "thi", "the", "par", "pe", "bhi", "to", "toh", "yeh", "ye", "woh", "wo", "is", "us", "in", "un", "kese",
  "kyun", "kyu", "kyunke", "kab", "kahan", "kaun", "koi", "kuch", "mujhe", "mujh", "mera", "meri", "mere", "hum",
  "ham", "aap", "apna", "apni", "apne", "tum", "kare", "kia", "kiya", "liye", "lie", "sakta", "sakti", "sakte",
  "chahiye", "chahie", "lagti", "lagta", "lagte", "raha", "rahi", "rahe", "wala", "wali", "wale", "jo", "jab",
  "tak", "sirf", "bohat", "bahut", "nahi", "nahin", "hi", "mai",
  // hindi
  "हो", "था", "थी", "थे", "भी", "तो", "इस", "उस", "कहाँ", "कोई", "कुछ", "मुझे", "हम", "आप", "अपना", "अपनी", "अपने",
  "लिए", "सकता", "सकती", "सकते", "चाहिए", "रहा", "रही", "रहे", "वाला", "वाली", "वाले", "जो", "जब", "तक", "सिर्फ",
  "बहुत", "नहीं", "ही", "या", "ये", "वो",
  // pidgin
  "wey", "una", "abeg", "go", "fit", "make", "dem", "e", "no", "be", "oga", "sef", "sha", "for", "am", "una",
  // indonesian
  "di", "ke", "ini", "atau", "saya", "bisa", "adalah", "akan", "sudah", "belum", "tidak", "ada", "pada", "dalam",
  "oleh", "juga", "kalau", "jika", "karena", "agar", "supaya", "mau", "ingin", "harus", "perlu", "sebuah", "para",
  "lebih", "sangat", "dengan", "itu",
];

export const STOPWORDS: ReadonlySet<string> = new Set([...BASE_STOP, ...EXTRA_STOP]);

const WORD_RE = /[\p{L}\p{M}\p{N}$]+/gu;
const HAN_RE = /[\u3400-\u9fff]+/gu;
const ASCII_WORD = /^[a-z0-9$]+$/;

/** Fold plural/verb endings so fee/fees, withdraw/withdrawal/withdrawing, deposit/depositor match. */
export function stem(w: string): string {
  if (w.length < 4 || !ASCII_WORD.test(w)) return w;
  let s = w;
  if (s.endsWith("ies") && s.length > 4) s = `${s.slice(0, -3)}y`;
  else if (/(ss|us|is)$/.test(s)) return s;
  else if (/(sh|ch|x|z|s)es$/.test(s)) s = s.slice(0, -2);
  else if (s.endsWith("s")) s = s.slice(0, -1);
  for (const suf of ["ations", "ation", "ings", "ing", "ers", "ors", "er", "or", "ed", "al"]) {
    if (s.endsWith(suf) && s.length - suf.length >= 4) {
      s = s.slice(0, -suf.length);
      break;
    }
  }
  return s;
}

export type Token = string;

/** Tokens (stemmed, stop-words removed). Keeps duplicates — callers dedupe when they need a set. */
export function tokenize(input: string): Token[] {
  const text = input
    .normalize("NFKC")
    .toLowerCase()
    .replace(/\[([^\]]+)\]\([^)]*\)/g, "$1") // markdown link → label
    .replace(/[*`_]/g, " ");
  const out: Token[] = [];

  const withoutHan = text.replace(HAN_RE, (run) => {
    if (run.length === 1) {
      out.push(run);
    } else {
      for (let i = 0; i < run.length - 1; i++) {
        const bi = run.slice(i, i + 2);
        if (!STOPWORDS.has(bi)) out.push(bi);
      }
    }
    return " ";
  });

  for (const m of withoutHan.matchAll(WORD_RE)) {
    const w = m[0].replace(/\$+$/, "");
    if (!w || STOPWORDS.has(w)) continue;
    if (w.length < 2 && !/^\d$/.test(w)) continue;
    const st = stem(w);
    if (!STOPWORDS.has(st)) out.push(st);
  }
  return out;
}

export function unique<T>(xs: T[]): T[] {
  return Array.from(new Set(xs));
}

/** Share of words that are function words — real questions have plenty, seed phrases have none. */
export function stopwordRatio(words: string[]): number {
  if (words.length === 0) return 0;
  let n = 0;
  for (const w of words) if (STOPWORDS.has(w)) n++;
  return n / words.length;
}
