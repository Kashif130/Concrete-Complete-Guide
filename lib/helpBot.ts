import type { Locale } from "./i18n";
import { STOP } from "./stopwords";
import type { DocTopicId, TopicId } from "./helpProtocol";

// UI copy + fallback routing for the "mkashifalikcp bot" Help Center chat widget.
//
// IMPORTANT: this file no longer contains any *facts* about Concrete (fees, withdrawal times, points
// status…). Those used to be hand-copied here in six languages and silently went stale. Answers now
// come from the guide's own pages — through Claude on the server (app/api/help) or, when the AI is
// unavailable, from the in-browser docs search (lib/docSearch.ts). The only free-text answer left is
// `toolsAnswer`, which describes this website's own features rather than Concrete's terms.

export const BOT_NAME = "mkashifalikcp bot";

export type { TopicId, DocTopicId };

export const TOPIC_IDS: TopicId[] = ["what", "deposit", "withdraw", "fees", "risks", "points", "tools"];

/** The guide page behind each doc topic (the server also uses these to pick the chip answers). */
export const TOPIC_PAGES: Record<DocTopicId, string> = {
  what: "01-beginner/01-what-is-concrete",
  deposit: "01-beginner/03-getting-started",
  withdraw: "01-beginner/05-withdrawals",
  fees: "01-beginner/06-fees",
  risks: "02-intermediate/06-risks",
  points: "01-beginner/07-points-and-rewards",
};

export function topicForSlug(slug: string): DocTopicId | null {
  for (const [id, page] of Object.entries(TOPIC_PAGES)) if (page === slug) return id as DocTopicId;
  return null;
}

export type BotLink = { label: string; href: string };

export const TOPIC_LINKS: Record<TopicId, BotLink[]> = {
  what: [{ label: "What is Concrete?", href: "/docs/01-beginner/01-what-is-concrete" }],
  deposit: [{ label: "Getting started", href: "/docs/01-beginner/03-getting-started" }],
  withdraw: [{ label: "Withdrawals", href: "/docs/01-beginner/05-withdrawals" }],
  fees: [{ label: "Fees", href: "/docs/01-beginner/06-fees" }],
  risks: [{ label: "Risks", href: "/docs/02-intermediate/06-risks" }],
  points: [
    { label: "Points & rewards", href: "/docs/01-beginner/07-points-and-rewards" },
    { label: "Verify $CT (contract, audits)", href: "/tracker/airdrop" },
    { label: "Get notified when $CT launches", href: "/tracker/airdrop" },
  ],
  tools: [
    { label: "Vault Terminal", href: "/vault" },
    { label: "Compare vaults", href: "/vault?tab=compare" },
    { label: "Wallet Tracker", href: "/tracker" },
  ],
};

// Fallback router (used only when the AI is unavailable). Lower-case keywords; a message matching any
// of them routes to that topic. Keep these SPECIFIC: generic question words ("kaise", "how to",
// "start", "first", "wallet", "connect") used to live under "deposit" and made "fee kaise lagti hai"
// answer with the deposit steps, because "kaise" (5 letters) out-scored "fee" (3).
export const TOPIC_KEYWORDS: Record<TopicId, string[]> = {
  what: ["what is concrete", "what is this", "concrete kya", "concrete क्या", "什么是", "apa itu concrete", "wetin be concrete", "blueprint"],
  deposit: ["deposit", "invest", "jama", "जमा", "डिपॉज़िट", "डिपॉजिट", "存入", "存款", "setor", "menyetor", "approve"],
  withdraw: ["withdraw", "redeem", "queue", "epoch", "cooldown", "nikal", "wapis", "निकाल", "निकासी", "提现", "提款", "取款", "tarik", "penarikan", "comot"],
  fees: ["fee", "charge", "commission", "kharcha", "शुल्क", "फ़ीस", "फीस", "费", "biaya"],
  risks: ["risk", "safe", "loss", "lose", "scam", "khatra", "khatr", "nuksan", "जोखिम", "नुकसान", "风险", "risiko", "rugi", "penipuan"],
  points: ["point", "airdrop", "reward", "$ct", "token", "inaam", "इनाम", "积分", "空投", "poin"],
  tools: ["tracker", "terminal", "calculator", "tool", "portfolio", "simulator", "gas", "compare", "comparison", "muqabla", "तुलना", "对比", "工具", "alat", "bandingkan"],
};

type Copy = {
  helpCenter: string;
  askName: string;
  namePlaceholder: string;
  nameError: string;
  greeting: string; // {name} — shown after the (optional) name is given
  greetingAnon: string; // shown right after choosing a language
  addName: string;
  topicsHint: string;
  inputPlaceholder: string;
  send: string;
  stop: string;
  stopped: string;
  changeLanguage: string;
  restart: string;
  notFound: string;
  closestPages: string;
  searching: string;
  bestMatch: string; // {title}
  followUp: string;
  helpfulQ: string;
  yes: string;
  no: string;
  thanks: string;
  sorry: string;
  searchAll: string;
  verified: string; // {date}
  staleNote: string;
  adviceNote: string;
  seedWarning: string;
  rateLimited: string;
  error: string;
  footerNote: string;
  voiceStart: string;
  voiceStop: string;
  openLabel: string;
  closeLabel: string;
  topics: Record<TopicId, string>;
  toolsAnswer: string;
};

export const LANG_PROMPT =
  "Welcome to the Help Center! 👋 Please select your language.\nHelp Center mein khush aamdeed! Apni zaban chunain.";

export const copy: Record<Locale, Copy> = {
  en: {
    helpCenter: "Help Center",
    askName: "Great! What's your name?",
    namePlaceholder: "Type your name…",
    nameError: "Please enter your name (1–40 characters).",
    greeting: "Nice to meet you, **{name}**! I'm the mkashifalikcp bot. Pick a topic below or type your question.",
    greetingAnon: "Hi! I'm the mkashifalikcp bot. Ask me anything about Concrete in any language, or pick a topic below.",
    addName: "✎ Add your name (optional)",
    topicsHint: "Topics",
    inputPlaceholder: "Ask a question…",
    send: "Send",
    stop: "Stop",
    stopped: "(stopped)",
    changeLanguage: "Change language",
    restart: "Restart",
    notFound: "I couldn't find a match for that. Try one of the topics below, or rephrase with a few keywords.",
    closestPages: "Closest pages in the guide:",
    searching: "Searching the guide…",
    bestMatch: "Best match in the guide: **{title}**",
    followUp: "Related topics",
    helpfulQ: "Was this helpful?",
    yes: "👍 Yes",
    no: "👎 Not really",
    thanks: "Glad that helped! Ask me anything else.",
    sorry: "Sorry about that. Try rephrasing with a few keywords, or search every page of the guide.",
    searchAll: "Search all docs",
    verified: "Guide last checked {date}",
    staleNote: "⚠️ The guide hasn't been re-checked in a while — fees, limits and vault terms may have changed. Confirm on the vault page.",
    adviceNote: "ℹ️ General information from the guide, not financial advice. Decide for yourself and never put in more than you can afford to lose.",
    seedWarning: "🚫 That looks like a seed phrase or private key. I did NOT process or save it. Never share it with anyone — not with me, not with support. If you pasted a real one anywhere, move your funds to a new wallet now.",
    rateLimited: "You're asking very fast — please wait a minute and try again.",
    error: "Something went wrong. Please try again in a moment.",
    footerNote: "Answers come from the guide · not financial advice",
    voiceStart: "Start voice input",
    voiceStop: "Stop voice input",
    openLabel: "Open help chat",
    closeLabel: "Close help chat",
    topics: {
      what: "What is Concrete?",
      deposit: "How to deposit",
      withdraw: "Withdrawals",
      fees: "Fees",
      risks: "Risks & safety",
      points: "Points & $CT",
      tools: "Tools",
    },
    toolsAnswer:
      "This site has a **Vault Terminal** (simulator, health radar, gas, yield calendar, plus a **Compare** tab to put 2–3 vaults side by side) and a read-only **Wallet Tracker**. Press **Ctrl/Cmd+K** to search every docs page. Read-only tools never need a signature — if one asks you to sign to \"view\" your balance, close it.",
  },
  ur: {
    helpCenter: "Help Center",
    askName: "Bohat khoob! Aap ka naam kya hai?",
    namePlaceholder: "Apna naam likhen…",
    nameError: "Meherbani karke apna naam likhen (1–40 huroof).",
    greeting: "Aap se mil kar khushi hui, **{name}**! Main mkashifalikcp bot hoon. Neeche se topic chunen ya apna sawal likhen.",
    greetingAnon: "Salam! Main mkashifalikcp bot hoon. Concrete ke baare mein kisi bhi zaban mein poochen, ya neeche se topic chunen.",
    addName: "✎ Apna naam likhen (optional)",
    topicsHint: "Topics",
    inputPlaceholder: "Sawal poochen…",
    send: "Bhejen",
    stop: "Rokain",
    stopped: "(ruk gaya)",
    changeLanguage: "Zaban badlen",
    restart: "Dobara shuru",
    notFound: "Is ka koi match nahi mila. Neeche se koi topic chunen ya chand keywords se dobara likhen.",
    closestPages: "Guide ke sab se qareebi pages:",
    searching: "Guide mein talash ho rahi hai…",
    bestMatch: "Guide mein sab se behtar match: **{title}**",
    followUp: "Mutalliqa topics",
    helpfulQ: "Kya yeh madadgar tha?",
    yes: "👍 Haan",
    no: "👎 Nahi",
    thanks: "Khushi hui ke madad hui! Aur kuch poochna ho to poochen.",
    sorry: "Maazrat. Chand keywords ke saath dobara likhen, ya guide ke tamam pages mein talash karen.",
    searchAll: "Tamam docs mein talash",
    verified: "Guide aakhri baar {date} ko check hui",
    staleNote: "⚠️ Guide ko kaafi arse se dobara check nahi kiya gaya — fees, limits aur vault ki shartain badal chuki ho sakti hain. Vault page par confirm karen.",
    adviceNote: "ℹ️ Yeh guide ki aam maloomat hai, financial advice nahi. Faisla khud karen aur wohi lagayen jo kho sakte hon.",
    seedWarning: "🚫 Yeh seed phrase ya private key lag rahi hai. Maine isay process ya save NAHI kiya. Isay kisi ke saath share na karen — na mere saath, na kisi support ke saath. Agar asli key kahin paste ki hai to funds foran naye wallet mein muntaqil karen.",
    rateLimited: "Aap bohat tezi se sawal kar rahe hain — ek minute ruk kar dobara koshish karen.",
    error: "Kuch masla ho gaya. Thori dair baad dobara koshish karen.",
    footerNote: "Jawab guide se hain · financial advice nahi",
    voiceStart: "Voice se likhna shuru karen",
    voiceStop: "Voice se likhna band karen",
    openLabel: "Help chat kholen",
    closeLabel: "Help chat band karen",
    topics: {
      what: "Concrete kya hai?",
      deposit: "Deposit kaise karen",
      withdraw: "Withdrawals",
      fees: "Fees",
      risks: "Khatrat aur hifazat",
      points: "Points aur $CT",
      tools: "Tools",
    },
    toolsAnswer:
      "Is site par **Vault Terminal** (simulator, health radar, gas, yield calendar, aur 2–3 vaults ko aamne saamne rakhne wala **Compare** tab) aur read-only **Wallet Tracker** hai. Har docs page mein talash ke liye **Ctrl/Cmd+K** dabayen. Read-only tools ko kabhi signature nahi chahiye — agar balance \"dekhne\" ke liye sign maangen to band kar den.",
  },
  hi: {
    helpCenter: "हेल्प सेंटर",
    askName: "बढ़िया! आपका नाम क्या है?",
    namePlaceholder: "अपना नाम लिखें…",
    nameError: "कृपया अपना नाम लिखें (1–40 अक्षर)।",
    greeting: "आपसे मिलकर खुशी हुई, **{name}**! मैं mkashifalikcp bot हूँ। नीचे से कोई विषय चुनें या अपना सवाल लिखें।",
    greetingAnon: "नमस्ते! मैं mkashifalikcp bot हूँ। Concrete के बारे में किसी भी भाषा में पूछें, या नीचे से कोई विषय चुनें।",
    addName: "✎ अपना नाम जोड़ें (वैकल्पिक)",
    topicsHint: "विषय",
    inputPlaceholder: "सवाल पूछें…",
    send: "भेजें",
    stop: "रोकें",
    stopped: "(रोका गया)",
    changeLanguage: "भाषा बदलें",
    restart: "फिर से शुरू करें",
    notFound: "इसका कोई मेल नहीं मिला। नीचे से कोई विषय चुनें या कुछ कीवर्ड के साथ दोबारा लिखें।",
    closestPages: "गाइड के सबसे नज़दीकी पेज:",
    searching: "गाइड में खोज रहा हूँ…",
    bestMatch: "गाइड में सबसे अच्छा मेल: **{title}**",
    followUp: "संबंधित विषय",
    helpfulQ: "क्या यह मददगार था?",
    yes: "👍 हाँ",
    no: "👎 नहीं",
    thanks: "खुशी हुई कि मदद मिली! और कुछ पूछना हो तो पूछें।",
    sorry: "माफ़ कीजिए। कुछ कीवर्ड के साथ दोबारा लिखें, या गाइड के सभी पेज खोजें।",
    searchAll: "सभी डॉक्स खोजें",
    verified: "गाइड आख़िरी बार {date} को जाँची गई",
    staleNote: "⚠️ गाइड को काफ़ी समय से दोबारा जाँचा नहीं गया — फ़ीस, लिमिट और वॉल्ट की शर्तें बदल चुकी हो सकती हैं। वॉल्ट पेज पर पुष्टि करें।",
    adviceNote: "ℹ️ यह गाइड की सामान्य जानकारी है, वित्तीय सलाह नहीं। फ़ैसला खुद करें और उतना ही लगाएँ जितना खोने का जोखिम उठा सकें।",
    seedWarning: "🚫 यह सीड फ़्रेज़ या प्राइवेट की जैसा लग रहा है। मैंने इसे प्रोसेस या सेव नहीं किया। इसे किसी के साथ साझा न करें — न मेरे साथ, न किसी सपोर्ट के साथ। अगर असली की कहीं पेस्ट की है तो फंड तुरंत नए वॉलेट में ले जाएँ।",
    rateLimited: "आप बहुत तेज़ी से पूछ रहे हैं — एक मिनट रुककर दोबारा कोशिश करें।",
    error: "कुछ गड़बड़ हो गई। थोड़ी देर बाद फिर कोशिश करें।",
    footerNote: "जवाब गाइड से हैं · वित्तीय सलाह नहीं",
    voiceStart: "आवाज़ से लिखना शुरू करें",
    voiceStop: "आवाज़ से लिखना बंद करें",
    openLabel: "हेल्प चैट खोलें",
    closeLabel: "हेल्प चैट बंद करें",
    topics: {
      what: "Concrete क्या है?",
      deposit: "डिपॉज़िट कैसे करें",
      withdraw: "विदड्रॉअल",
      fees: "फ़ीस",
      risks: "जोखिम और सुरक्षा",
      points: "पॉइंट्स और $CT",
      tools: "टूल्स",
    },
    toolsAnswer:
      "इस साइट पर **Vault Terminal** (सिमुलेटर, हेल्थ रडार, गैस, यील्ड कैलेंडर, और 2–3 वॉल्ट आमने-सामने रखने वाला **Compare** टैब) और रीड-ओनली **Wallet Tracker** है। हर डॉक्स पेज में खोजने के लिए **Ctrl/Cmd+K** दबाएँ। रीड-ओनली टूल को कभी सिग्नेचर नहीं चाहिए — बैलेंस \"देखने\" के लिए साइन माँगे तो बंद कर दें।",
  },
  pcm: {
    helpCenter: "Help Center",
    askName: "Correct! Wetin be your name?",
    namePlaceholder: "Type your name…",
    nameError: "Abeg enter your name (1–40 characters).",
    greeting: "Nice to meet you, **{name}**! I be mkashifalikcp bot. Pick one topic below or type your question.",
    greetingAnon: "How far! I be mkashifalikcp bot. Ask me anything about Concrete for any language, or pick one topic below.",
    addName: "✎ Add your name (if you want)",
    topicsHint: "Topics",
    inputPlaceholder: "Ask your question…",
    send: "Send",
    stop: "Stop",
    stopped: "(stopped)",
    changeLanguage: "Change language",
    restart: "Start again",
    notFound: "I no see match for that one. Try one topic below, or write am again with small keywords.",
    closestPages: "Pages for di guide wey near am pass:",
    searching: "I dey search the guide…",
    bestMatch: "Di best match for di guide: **{title}**",
    followUp: "Related topics",
    helpfulQ: "E help you?",
    yes: "👍 Yes",
    no: "👎 No really",
    thanks: "I glad say e help! Ask me anything else.",
    sorry: "Sorry o. Try write am again with small keywords, or search all di pages for di guide.",
    searchAll: "Search all docs",
    verified: "Di guide last check na {date}",
    staleNote: "⚠️ Dem never check di guide for some time — fees, limits and vault terms fit don change. Confirm for di vault page.",
    adviceNote: "ℹ️ Na general info from di guide be dis, no be financial advice. Decide by yourself and no put wetin you no fit afford to lose.",
    seedWarning: "🚫 Dis one look like seed phrase or private key. I no process am and I no save am. No share am with anybody — no even me, no even support. If you don paste real one anywhere, move your money go new wallet now-now.",
    rateLimited: "You dey ask too fast — wait one minute then try again.",
    error: "Something no go well. Try again small time.",
    footerNote: "Answers dey come from di guide · no be financial advice",
    voiceStart: "Start to talk enter am",
    voiceStop: "Stop di voice input",
    openLabel: "Open help chat",
    closeLabel: "Close help chat",
    topics: {
      what: "Wetin be Concrete?",
      deposit: "How to deposit",
      withdraw: "Withdrawals",
      fees: "Fees",
      risks: "Risks & safety",
      points: "Points & $CT",
      tools: "Tools",
    },
    toolsAnswer:
      "This site get **Vault Terminal** (simulator, health radar, gas, yield calendar, plus **Compare** tab wey go put 2–3 vaults side by side) and read-only **Wallet Tracker**. Press **Ctrl/Cmd+K** to search every docs page. Read-only tools no dey ever need signature — if one ask you to sign to \"view\" your balance, close am.",
  },
  zh: {
    helpCenter: "帮助中心",
    askName: "太好了！请问你叫什么名字？",
    namePlaceholder: "请输入你的名字…",
    nameError: "请输入你的名字（1–40 个字符）。",
    greeting: "很高兴认识你，**{name}**！我是 mkashifalikcp bot。请选择下面的主题，或直接输入你的问题。",
    greetingAnon: "你好！我是 mkashifalikcp bot。可以用任何语言询问 Concrete 的问题，或选择下面的主题。",
    addName: "✎ 添加名字（可选）",
    topicsHint: "主题",
    inputPlaceholder: "输入你的问题…",
    send: "发送",
    stop: "停止",
    stopped: "（已停止）",
    changeLanguage: "切换语言",
    restart: "重新开始",
    notFound: "没有找到匹配的内容。请从下面选择一个主题，或用几个关键词重新描述。",
    closestPages: "指南中最相关的页面：",
    searching: "正在搜索指南…",
    bestMatch: "指南中最匹配的页面：**{title}**",
    followUp: "相关主题",
    helpfulQ: "这个回答有帮助吗？",
    yes: "👍 有帮助",
    no: "👎 没帮助",
    thanks: "很高兴能帮到你！还有问题随时问我。",
    sorry: "抱歉。请用几个关键词重新描述，或搜索指南的全部页面。",
    searchAll: "搜索全部文档",
    verified: "指南最后核对于 {date}",
    staleNote: "⚠️ 指南已有一段时间没有重新核对——费用、限额和金库条款可能已变化。请在金库页面确认。",
    adviceNote: "ℹ️ 这是指南中的一般信息，不构成投资建议。请自行判断，切勿投入超出承受能力的资金。",
    seedWarning: "🚫 这看起来像助记词或私钥。我没有处理也没有保存它。请勿与任何人分享——包括我和客服。如果你在别处粘贴过真实的助记词/私钥，请立即把资金转到新钱包。",
    rateLimited: "提问太快了——请稍等一分钟再试。",
    error: "出错了，请稍后再试。",
    footerNote: "回答来自指南 · 不构成投资建议",
    voiceStart: "开始语音输入",
    voiceStop: "停止语音输入",
    openLabel: "打开帮助聊天",
    closeLabel: "关闭帮助聊天",
    topics: {
      what: "什么是 Concrete？",
      deposit: "如何存入",
      withdraw: "提款",
      fees: "费用",
      risks: "风险与安全",
      points: "积分与 $CT",
      tools: "工具",
    },
    toolsAnswer:
      "本站提供 **Vault Terminal**（模拟器、健康雷达、Gas、收益日历，以及可并排对比 2–3 个金库的 **Compare** 标签页）和只读的 **Wallet Tracker**。按 **Ctrl/Cmd+K** 可搜索所有文档页面。只读工具从不需要签名——如果要求你签名才能“查看”余额，请立即关闭。",
  },
  id: {
    helpCenter: "Pusat Bantuan",
    askName: "Bagus! Siapa nama Anda?",
    namePlaceholder: "Ketik nama Anda…",
    nameError: "Silakan masukkan nama Anda (1–40 karakter).",
    greeting: "Senang bertemu dengan Anda, **{name}**! Saya mkashifalikcp bot. Pilih topik di bawah atau ketik pertanyaan Anda.",
    greetingAnon: "Halo! Saya mkashifalikcp bot. Tanyakan apa saja tentang Concrete dalam bahasa apa pun, atau pilih topik di bawah.",
    addName: "✎ Tambahkan nama (opsional)",
    topicsHint: "Topik",
    inputPlaceholder: "Tulis pertanyaan…",
    send: "Kirim",
    stop: "Berhenti",
    stopped: "(dihentikan)",
    changeLanguage: "Ganti bahasa",
    restart: "Mulai ulang",
    notFound: "Tidak ada yang cocok. Pilih salah satu topik di bawah, atau tulis ulang dengan beberapa kata kunci.",
    closestPages: "Halaman panduan yang paling dekat:",
    searching: "Mencari di panduan…",
    bestMatch: "Kecocokan terbaik di panduan: **{title}**",
    followUp: "Topik terkait",
    helpfulQ: "Apakah ini membantu?",
    yes: "👍 Ya",
    no: "👎 Belum",
    thanks: "Senang bisa membantu! Tanyakan apa saja lagi.",
    sorry: "Maaf ya. Coba tulis ulang dengan beberapa kata kunci, atau cari di semua halaman panduan.",
    searchAll: "Cari di semua dokumen",
    verified: "Panduan terakhir dicek {date}",
    staleNote: "⚠️ Panduan sudah lama tidak dicek ulang — biaya, batas, dan ketentuan vault mungkin sudah berubah. Konfirmasi di halaman vault.",
    adviceNote: "ℹ️ Ini informasi umum dari panduan, bukan nasihat keuangan. Putuskan sendiri dan jangan setor lebih dari yang sanggup Anda tanggung kerugiannya.",
    seedWarning: "🚫 Ini terlihat seperti seed phrase atau private key. Saya TIDAK memproses atau menyimpannya. Jangan bagikan ke siapa pun — termasuk saya maupun support. Jika Anda sudah menempelkan yang asli di tempat lain, segera pindahkan dana ke wallet baru.",
    rateLimited: "Anda bertanya terlalu cepat — tunggu semenit lalu coba lagi.",
    error: "Terjadi kesalahan. Coba lagi sebentar lagi.",
    footerNote: "Jawaban berasal dari panduan · bukan nasihat keuangan",
    voiceStart: "Mulai input suara",
    voiceStop: "Hentikan input suara",
    openLabel: "Buka chat bantuan",
    closeLabel: "Tutup chat bantuan",
    topics: {
      what: "Apa itu Concrete?",
      deposit: "Cara setor",
      withdraw: "Penarikan",
      fees: "Biaya",
      risks: "Risiko & keamanan",
      points: "Poin & $CT",
      tools: "Alat",
    },
    toolsAnswer:
      "Situs ini punya **Vault Terminal** (simulator, health radar, gas, kalender yield, plus tab **Compare** untuk membandingkan 2–3 vault berdampingan) dan **Wallet Tracker** read-only. Tekan **Ctrl/Cmd+K** untuk mencari di semua halaman dokumen. Alat read-only tidak pernah butuh tanda tangan — jika diminta menandatangani untuk \"melihat\" saldo, tutup.",
  },
};

// Quick-reply chips shown under a topic answer.
export const TOPIC_FOLLOWUPS: Record<TopicId, TopicId[]> = {
  what: ["deposit", "risks", "fees"],
  deposit: ["fees", "withdraw", "risks"],
  withdraw: ["fees", "risks"],
  fees: ["deposit", "withdraw"],
  risks: ["withdraw", "tools"],
  points: ["risks", "tools"],
  tools: ["deposit", "fees"],
};

// Han/kana/Devanagari keywords can't be word-split, so they (and multi-word phrases, and "$ct")
// are matched as plain substrings. Everything else must match a whole word: short keywords exactly
// (plus a plural "s"/"es"), longer ones as a word prefix ("deposit" → "deposits", "depositing").
// This stops "start" firing on "restart", "fee" on "coffee", "point" on "viewpoint", etc.
const SCRIPT_RE = /[\u0900-\u097f\u3040-\u30ff\u3400-\u9fff]/;
const WORD_SPLIT = /[^\p{L}\p{M}\p{N}$]+/u;

function keywordHit(s: string, tokens: string[], k: string): boolean {
  if (SCRIPT_RE.test(k) || k.includes(" ") || k.startsWith("$")) return s.includes(k);
  if (k.length >= 5) return tokens.some((t) => t.startsWith(k));
  return tokens.some((t) => t === k || t === `${k}s` || t === `${k}es`);
}

/** The topic a message is about, or null when nothing matches — or when it mixes several topics. */
export function matchTopic(input: string): TopicId | null {
  const s = input.toLowerCase();
  const tokens = s.split(WORD_SPLIT).filter(Boolean);
  let best: TopicId | null = null;
  let bestScore = 0;
  let matched = 0;
  for (const id of TOPIC_IDS) {
    let score = 0;
    for (const k of TOPIC_KEYWORDS[id]) if (keywordHit(s, tokens, k)) score += k.length;
    if (score > 0) matched++;
    if (score > bestScore) {
      best = id;
      bestScore = score;
    }
  }
  // Two topics in one message ("withdraw fee kitni hai") is a specific question, not a topic pick.
  return matched === 1 ? best : null;
}

/**
 * A short, generic question ("fees?", "how to deposit") is best served by the topic's page summary.
 * A longer, specific one ("how long is the withdrawal cooldown on queued vaults") should search the
 * docs instead, so a topic keyword doesn't hijack it. (Fallback path only — the AI handles both.)
 */
export function isBroadQuery(input: string): boolean {
  const tokens = input.toLowerCase().split(WORD_SPLIT).filter(Boolean);
  return tokens.filter((t) => t.length >= 4 && !STOP.has(t)).length <= 3;
}

// ---- rendering safety ----------------------------------------------------------------------------
// Bot text goes through <Inline>, which turns markdown links into <a href>. Model output must never
// be able to smuggle in a link to somewhere else (or a javascript: URL), so only site paths and the
// official Concrete domains survive; any other link is reduced to its label.
const SAFE_HOSTS = new Set(["concrete.xyz", "app.concrete.xyz", "points.concrete.xyz", "docs.concrete.xyz"]);

function isSafeHref(href: string): boolean {
  if (/^\/(docs\/|vault|tracker)/.test(href)) return true;
  try {
    const u = new URL(href);
    return u.protocol === "https:" && SAFE_HOSTS.has(u.hostname);
  } catch {
    return false;
  }
}

export function sanitizeBotText(text: string): string {
  return text.replace(/\[([^\]]+)\]\(([^)]*)\)/g, (m, label: string, href: string) => (isSafeHref(href.trim()) ? m : label));
}
