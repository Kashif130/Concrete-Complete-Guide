// Copy for the site-wide docs search palette (Cmd/Ctrl+K). Spread into the main dictionaries in
// dictionary.ts. English is the source of truth; other locales may omit a key and fall back to it.

export const enSearch = {
  srchButton: "Search docs",
  srchLabel: "Search the guide",
  srchPlaceholder: "Search all 24 guide pages…",
  srchLoading: "Loading search…",
  srchError: "Couldn't load the search index. Check your connection and try again.",
  srchAllPages: "All pages",
  srchResults: "Top matches",
  srchNoResults: "No pages match “{q}”. Try fewer or different keywords.",
  srchNavHint: "navigate",
  srchOpenHint: "open",
  srchCloseHint: "close",
  srchClose: "Close search",
};

type SearchDict = Partial<Record<keyof typeof enSearch, string>>;

export const urSearch: SearchDict = {
  srchButton: "Docs talash karein",
  srchLabel: "Guide mein talash",
  srchPlaceholder: "Guide ke tamam 24 pages mein talash karein…",
  srchLoading: "Search load ho raha hai…",
  srchError: "Search index load nahi ho saka. Internet check karke dobara koshish karein.",
  srchAllPages: "Tamam pages",
  srchResults: "Behtareen nataij",
  srchNoResults: "“{q}” se koi page match nahi hua. Kam ya mukhtalif keywords likhein.",
  srchNavHint: "chalein",
  srchOpenHint: "kholein",
  srchCloseHint: "band karein",
  srchClose: "Search band karein",
};

export const hiSearch: SearchDict = {
  srchButton: "डॉक्स खोजें",
  srchLabel: "गाइड में खोजें",
  srchPlaceholder: "गाइड के सभी 24 पेज खोजें…",
  srchLoading: "सर्च लोड हो रहा है…",
  srchError: "सर्च इंडेक्स लोड नहीं हो सका। इंटरनेट जाँचकर फिर कोशिश करें।",
  srchAllPages: "सभी पेज",
  srchResults: "सबसे अच्छे नतीजे",
  srchNoResults: "“{q}” से कोई पेज मेल नहीं खाया। कम या अलग कीवर्ड आज़माएँ।",
  srchNavHint: "चुनें",
  srchOpenHint: "खोलें",
  srchCloseHint: "बंद करें",
  srchClose: "सर्च बंद करें",
};

export const pcmSearch: SearchDict = {
  srchButton: "Search docs",
  srchLabel: "Search di guide",
  srchPlaceholder: "Search all 24 pages for di guide…",
  srchLoading: "Search dey load…",
  srchError: "We no fit load di search. Check your network, then try again.",
  srchAllPages: "All di pages",
  srchResults: "Best matches",
  srchNoResults: "No page match “{q}”. Try fewer or different keywords.",
  srchNavHint: "waka",
  srchOpenHint: "open",
  srchCloseHint: "close",
  srchClose: "Close search",
};

export const zhSearch: SearchDict = {
  srchButton: "搜索文档",
  srchLabel: "搜索指南",
  srchPlaceholder: "搜索指南全部 24 个页面…",
  srchLoading: "正在加载搜索…",
  srchError: "无法加载搜索索引。请检查网络后重试。",
  srchAllPages: "全部页面",
  srchResults: "最佳匹配",
  srchNoResults: "没有页面匹配“{q}”。请尝试更少或不同的关键词。",
  srchNavHint: "选择",
  srchOpenHint: "打开",
  srchCloseHint: "关闭",
  srchClose: "关闭搜索",
};

export const idSearch: SearchDict = {
  srchButton: "Cari dokumen",
  srchLabel: "Cari di panduan",
  srchPlaceholder: "Cari di semua 24 halaman panduan…",
  srchLoading: "Memuat pencarian…",
  srchError: "Indeks pencarian gagal dimuat. Periksa koneksi lalu coba lagi.",
  srchAllPages: "Semua halaman",
  srchResults: "Hasil terbaik",
  srchNoResults: "Tidak ada halaman yang cocok dengan “{q}”. Coba kata kunci yang lebih sedikit atau berbeda.",
  srchNavHint: "pilih",
  srchOpenHint: "buka",
  srchCloseHint: "tutup",
  srchClose: "Tutup pencarian",
};
