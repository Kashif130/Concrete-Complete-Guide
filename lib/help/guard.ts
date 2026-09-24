// Guardrails around the help bot: things that must hold no matter what the model does.
//
//  * looksLikeSecret – seed phrases / private keys must never be sent to a model or stored.
//  * redactForLog    – anything that reaches a log is stripped of addresses, emails, URLs, numbers.
//  * wantsAdvice     – "should I deposit / which vault is best / how much will I make" in six
//                      languages. A match makes the server append the "not financial advice"
//                      note itself, so that guarantee doesn't depend on the model complying.

import { stopwordRatio } from "./text";

const HEX64 = /(^|[^0-9a-fA-Fx])[0-9a-fA-F]{64}(?![0-9a-fA-F])/; // 64 hex WITHOUT 0x → private key shaped
const WORDS = /\S+/g;

/** True for BIP-39-style seed phrases (12–24 plain lowercase words, ~no function words) or raw private keys. */
export function looksLikeSecret(text: string): boolean {
  if (HEX64.test(text)) return true;
  const words = text.trim().toLowerCase().match(WORDS) ?? [];
  if (words.length < 12 || words.length > 26) return false;
  if (!words.every((w) => /^[a-z]{3,8}$/.test(w))) return false;
  // A real question is full of "the/how/what/is…"; a seed phrase almost never contains any.
  return stopwordRatio(words) < 0.15;
}

/** Strip identifying / sensitive bits before anything is logged. */
export function redactForLog(text: string): string {
  return text
    .replace(/https?:\/\/\S+/gi, "[url]")
    .replace(/[\w.+-]+@[\w-]+\.[\w.-]+/g, "[email]")
    .replace(/0x[0-9a-fA-F]{64}\b/g, "[tx-hash]")
    .replace(/0x[0-9a-fA-F]{40}\b/g, "[address]")
    .replace(/\b[a-z0-9-]+\.eth\b/gi, "[ens]")
    .replace(/\b[1-9A-HJ-NP-Za-km-z]{32,44}\b/g, "[address]")
    .replace(/\b[0-9a-fA-F]{32,}\b/g, "[hex]")
    .replace(/\d{9,}/g, "[number]")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, 200);
}

const ADVICE: RegExp[] = [
  // en
  /\b(should|shall) i\b/i,
  /\bis it (a )?(good|smart|wise|worth|safe)\b/i,
  /\bworth (it|investing|depositing)\b/i,
  /\b(best|safest|highest|top|better) (vault|apy|yield|strategy|one|choice)\b/i,
  /\bwhich (vault|one|strategy)\b/i,
  /\brecommend|\bguarantee|\badvice\b|\badvise\b/i,
  /\bwill i (make|earn|lose|get|profit)\b/i,
  /\bhow much (will|can|could|do) (i|you) (make|earn|get)\b/i,
  /\b(buy|sell|invest)\b/i,
  // roman urdu
  /\b(chahiye|chahie|behtar(een)?|mashwara|salah|munafa|kitna (kama|milega)|safe hai|lagaun|lagana|invest karun)\b/i,
  // hindi
  /(चाहिए|सलाह|मुनाफ़ा|मुनाफा|गारंटी|बेहतर|सुरक्षित है|कितना (कमा|मिल)|निवेश)/,
  // pidgin
  /\b(make i|i suppose|i go (win|make|gain|lose)|which one (better|best)|e good|na good|wetin i go)\b/i,
  // chinese
  /(应该|要不要|该不该|值得|推荐|建议|能赚|赚多少|保证|哪个好|最好的|投资)/,
  // indonesian
  /\b(haruskah|sebaiknya|rekomendasi|saran|untung|menguntungkan|jaminan|mana yang (terbaik|lebih baik)|layak|investasi)\b/i,
];

export function wantsAdvice(text: string): boolean {
  return ADVICE.some((re) => re.test(text));
}
