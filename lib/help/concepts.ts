// Cross-language concept aliases. The corpus is indexed in all six languages, so most questions
// already match their own language's pages; this table is a safety net for spelling variants and
// mixed-language questions ("fee kya hai", "提款 how long", "withdraw kaise"). When a query hits
// one alias of a concept, the concept's other aliases are added at low weight — never hard filters.
//
// Keep aliases SPECIFIC. Generic question words ("kaise", "how to", "start", "first") do not belong
// here — that is exactly what made the old keyword router send "fee kaise lagti hai" to Deposit.

import { tokenize } from "./text";

const RAW: Record<string, string[]> = {
  deposit: ["deposit", "invest", "jama", "जमा", "डिपॉज़िट", "डिपॉजिट", "存入", "存款", "充值", "setor", "menyetor", "setoran"],
  withdraw: [
    "withdraw", "withdrawal", "redeem", "unstake", "exit", "nikal", "nikalna", "wapis", "निकाल", "निकासी", "विदड्रॉ",
    "提款", "提现", "取款", "提取", "赎回", "取出", "tarik", "penarikan", "comot",
  ],
  fees: ["fee", "charge", "commission", "kharcha", "shulk", "शुल्क", "फ़ीस", "फीस", "费用", "手续费", "费率", "biaya", "ongkos"],
  risks: [
    "risk", "safe", "safety", "loss", "scam", "hack", "khatra", "khatre", "nuksan", "जोखिम", "नुकसान", "खतरा", "风险",
    "亏损", "骗局", "risiko", "rugi", "penipuan", "aman", "wahala",
  ],
  points: ["point", "airdrop", "reward", "inaam", "इनाम", "पॉइंट", "积分", "空投", "奖励", "poin", "hadiah"],
  yield: ["apy", "yield", "munafa", "मुनाफ़ा", "मुनाफा", "收益", "年化", "imbal", "untung", "profit"],
  concusd: ["concusd", "conc usd", "pyusdx"],
  audit: ["audit", "audited", "security", "exploit", "सुरक्षा", "ऑडिट", "审计", "安全", "keamanan"],
  tools: ["tracker", "terminal", "simulator", "portfolio", "compare", "工具", "对比", "alat", "bandingkan", "muqabla", "तुलना"],
};

type Concept = { id: string; terms: Set<string> };

const CONCEPTS: Concept[] = Object.entries(RAW).map(([id, aliases]) => ({
  id,
  terms: new Set(aliases.flatMap((a) => tokenize(a))),
}));

/** Expansion term + which of the user's own terms triggered it (used for coverage accounting). */
export type Expansion = { term: string; origins: string[] };

/** Extra (lower-weight) query terms implied by the concepts the query touches. */
export function expandConcepts(queryTerms: string[]): { concepts: string[]; extra: Expansion[] } {
  const q = new Set(queryTerms);
  const concepts: string[] = [];
  const byTerm = new Map<string, Set<string>>();
  for (const c of CONCEPTS) {
    const origins = queryTerms.filter((t) => c.terms.has(t));
    if (origins.length === 0) continue;
    concepts.push(c.id);
    for (const t of c.terms) {
      if (q.has(t)) continue;
      let set = byTerm.get(t);
      if (!set) byTerm.set(t, (set = new Set()));
      for (const o of origins) set.add(o);
    }
  }
  return { concepts, extra: Array.from(byTerm, ([term, o]) => ({ term, origins: Array.from(o) })) };
}
