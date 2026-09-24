import type { DocBlock } from "../docs.generated";
import type { Locale } from "@/lib/i18n";

// Full translation of docs/05-reference/04-sources-and-methodology.md.
export const sourcesAndMethodology: Partial<Record<Locale, DocBlock[]>> = {
  ur: [
    {
      "type": "p",
      "text": "Yeh guide **20 September 2026** ko in pages ko seedha parh kar tayyar ki gayi:"
    },
    {
      "type": "ul",
      "items": [
        "concrete.xyz (home, /enterprise) · app.concrete.xyz/earn · points.concrete.xyz",
        "docs.concrete.xyz: Welcome, Yield Vaults & ERC-4626, Vault Shares, Deposit, Withdraw, Vault Transparency, Fees, Points, Architecture: Core Concepts, SDK Overview & Setup, Subgraph Schema & Queries, Event Reference (partially loaded), Live Vaults, Institutional Vaults, AssetCX, Pre-Deposit Vaults, Audits, Risks & Safety, Glossary",
        "github.com/Kashif130/concrete-community-tools aur teeno live community sites (Tracker, Builder Suite, Academy)"
      ]
    },
    {
      "type": "heading",
      "level": 2,
      "text": "Jin usoolon par amal kiya gaya"
    },
    {
      "type": "ol",
      "items": [
        "Haqaiq in sources se paraphrase kiye gaye hain; kuch bhi guarantee ke taur par pesh nahi kiya gaya.",
        "Jahan koi number tezi se badalta hai (TVL, APY, deposits) wahan uski snapshot date likhi gayi hai ya usay chhor diya gaya hai.",
        "Jahan sources mein ikhtilaf hai (jaise points platform: docs Absinthe kehte hain, live site Fuul; \"assets on platform\" vs \"deposits\") wahan ikhtilaf bayan kiya gaya hai.",
        "Concrete ka contract source private hai. Internals ke baare mein jo kuch hai woh developer docs se aata hai; `examples/` ke models taleemi andaze hain.",
        "Community tools ko unke apne READMEs/pages se bayan kiya gaya hai aur musannif ne unhein audit nahi kiya.",
        "TypeScript aur GraphQL examples docs se likhe gaye aur **live infrastructure par execute nahi kiye gaye**. Python examples ke unit tests hain (`examples/python` mein `python -m unittest`)."
      ]
    },
    {
      "type": "heading",
      "level": 2,
      "text": "Maloom kamiyan"
    },
    {
      "type": "ul",
      "items": [
        "X (Twitter) ka content parha nahi ja saka; social tafseelat official pages par dikhaye gaye links par mabni hain.",
        "Restricted Jurisdictions, Completed Campaigns, Enso, SDK method pages aur poora Event Reference mukammal taur par capture nahi hue - docs ke links follow karein.",
        "Har vault ka live APY/TVL captured page text mein mojood nahi tha."
      ]
    },
    {
      "type": "heading",
      "level": 2,
      "text": "Ise taaza rakhna"
    },
    {
      "type": "p",
      "text": "Pehle official docs dobara check karein. Kuch badle to page URL aur date ke saath issue ya PR kholein (dekhein `CONTRIBUTING.md`)."
    }
  ],
  hi: [
    {
      "type": "p",
      "text": "यह guide **20 September 2026** को इन pages को सीधे पढ़कर तैयार की गई:"
    },
    {
      "type": "ul",
      "items": [
        "concrete.xyz (home, /enterprise) · app.concrete.xyz/earn · points.concrete.xyz",
        "docs.concrete.xyz: Welcome, Yield Vaults & ERC-4626, Vault Shares, Deposit, Withdraw, Vault Transparency, Fees, Points, Architecture: Core Concepts, SDK Overview & Setup, Subgraph Schema & Queries, Event Reference (partially loaded), Live Vaults, Institutional Vaults, AssetCX, Pre-Deposit Vaults, Audits, Risks & Safety, Glossary",
        "github.com/Kashif130/concrete-community-tools और तीनों live community sites (Tracker, Builder Suite, Academy)"
      ]
    },
    {
      "type": "heading",
      "level": 2,
      "text": "जिन उसूलों का पालन किया गया"
    },
    {
      "type": "ol",
      "items": [
        "तथ्य इन sources से paraphrase किए गए हैं; कुछ भी guarantee के तौर पर पेश नहीं किया गया।",
        "जहाँ कोई number तेज़ी से बदलता है (TVL, APY, deposits) वहाँ उसकी snapshot date लिखी गई है या उसे छोड़ दिया गया है।",
        "जहाँ sources में मतभेद है (जैसे points platform: docs Absinthe कहते हैं, live site Fuul; \"assets on platform\" vs \"deposits\") वहाँ मतभेद बताया गया है।",
        "Concrete का contract source private है। Internals के बारे में जो कुछ है वह developer docs से आता है; `examples/` के models शैक्षिक अंदाज़े हैं।",
        "Community tools को उनके अपने READMEs/pages से बयान किया गया है और लेखक ने उन्हें audit नहीं किया।",
        "TypeScript और GraphQL examples docs से लिखे गए और **live infrastructure पर execute नहीं किए गए**। Python examples के unit tests हैं (`examples/python` में `python -m unittest`)।"
      ]
    },
    {
      "type": "heading",
      "level": 2,
      "text": "ज्ञात कमियाँ"
    },
    {
      "type": "ul",
      "items": [
        "X (Twitter) का content पढ़ा नहीं जा सका; social details official pages पर दिखाए गए links पर आधारित हैं।",
        "Restricted Jurisdictions, Completed Campaigns, Enso, SDK method pages और पूरा Event Reference पूरी तरह capture नहीं हुए - docs के links follow करें।",
        "हर vault का live APY/TVL captured page text में मौजूद नहीं था।"
      ]
    },
    {
      "type": "heading",
      "level": 2,
      "text": "इसे ताज़ा रखना"
    },
    {
      "type": "p",
      "text": "पहले official docs दोबारा check करें। कुछ बदले तो page URL और date के साथ issue या PR खोलें (देखें `CONTRIBUTING.md`)।"
    }
  ],
  pcm: [
    {
      "type": "p",
      "text": "Dem compile dis guide on **20 September 2026** by reading dis pages directly:"
    },
    {
      "type": "ul",
      "items": [
        "concrete.xyz (home, /enterprise) · app.concrete.xyz/earn · points.concrete.xyz",
        "docs.concrete.xyz: Welcome, Yield Vaults & ERC-4626, Vault Shares, Deposit, Withdraw, Vault Transparency, Fees, Points, Architecture: Core Concepts, SDK Overview & Setup, Subgraph Schema & Queries, Event Reference (partially loaded), Live Vaults, Institutional Vaults, AssetCX, Pre-Deposit Vaults, Audits, Risks & Safety, Glossary",
        "github.com/Kashif130/concrete-community-tools and di three live community sites (Tracker, Builder Suite, Academy)"
      ]
    },
    {
      "type": "heading",
      "level": 2,
      "text": "Rules wey dem follow"
    },
    {
      "type": "ol",
      "items": [
        "Dem paraphrase di facts from dose sources; dem no present anything as guarantee.",
        "Where number dey change fast (TVL, APY, deposits) dem label am with im snapshot date or dem comot am.",
        "Where sources no agree (e.g. points platform: docs talk Absinthe, live site talk Fuul; \"assets on platform\" vs \"deposits\") dem state di disagreement.",
        "Concrete contract source na private. Anything about internals dey come from di developer docs; di models for `examples/` na educational approximations.",
        "Dem describe community tools from dia own READMEs/pages and di author no audit dem.",
        "Dem write TypeScript and GraphQL examples from docs and dem **no run dem against live infrastructure**. Python examples get unit tests (`python -m unittest` for `examples/python`)."
      ]
    },
    {
      "type": "heading",
      "level": 2,
      "text": "Known gaps"
    },
    {
      "type": "ul",
      "items": [
        "Dem no fit read X (Twitter) content; social details dey rely on links wey show for official pages.",
        "Dem no capture Restricted Jurisdictions, Completed Campaigns, Enso, SDK method pages and di full Event Reference well - follow di links for di docs.",
        "Live APY/TVL per vault no dey inside di captured page text."
      ]
    },
    {
      "type": "heading",
      "level": 2,
      "text": "How to keep am current"
    },
    {
      "type": "p",
      "text": "Check di official docs first. Open issue or PR (see `CONTRIBUTING.md`) with di page URL and date wen something change."
    }
  ],
  zh: [
    {
      "type": "p",
      "text": "本指南编制于 **2026 年 9 月 20 日**，直接阅读了以下页面："
    },
    {
      "type": "ul",
      "items": [
        "concrete.xyz (home, /enterprise) · app.concrete.xyz/earn · points.concrete.xyz",
        "docs.concrete.xyz: Welcome, Yield Vaults & ERC-4626, Vault Shares, Deposit, Withdraw, Vault Transparency, Fees, Points, Architecture: Core Concepts, SDK Overview & Setup, Subgraph Schema & Queries, Event Reference (partially loaded), Live Vaults, Institutional Vaults, AssetCX, Pre-Deposit Vaults, Audits, Risks & Safety, Glossary",
        "github.com/Kashif130/concrete-community-tools 以及三个在线社区站点（Tracker、Builder Suite、Academy）"
      ]
    },
    {
      "type": "heading",
      "level": 2,
      "text": "遵循的规则"
    },
    {
      "type": "ol",
      "items": [
        "事实均从上述来源转述；不把任何内容表述为保证。",
        "对于变化很快的数字（TVL、APY、存款），会标注其快照日期，或直接省略。",
        "当来源之间不一致时（例如积分平台：文档写 Absinthe，线上站点写 Fuul；“assets on platform” 与 “deposits”），会明确说明分歧。",
        "Concrete 的合约源码是私有的。关于内部机制的内容均来自开发者文档；`examples/` 中的模型只是教学用的近似。",
        "社区工具根据其自身的 README/页面来描述，作者并未对其进行审计。",
        "TypeScript 和 GraphQL 示例是根据文档编写的，**未在真实基础设施上执行过**。Python 示例带有单元测试（在 `examples/python` 中运行 `python -m unittest`）。"
      ]
    },
    {
      "type": "heading",
      "level": 2,
      "text": "已知缺口"
    },
    {
      "type": "ul",
      "items": [
        "无法读取 X (Twitter) 的内容；社交方面的细节依赖官方页面上展示的链接。",
        "受限司法辖区、已完成活动、Enso、SDK 方法页面以及完整的事件参考未被完整抓取——请点击文档中的链接查看。",
        "所抓取的页面文本中没有各 vault 的实时 APY/TVL。"
      ]
    },
    {
      "type": "heading",
      "level": 2,
      "text": "保持内容最新"
    },
    {
      "type": "p",
      "text": "请先重新核对官方文档。如有变化，请附上页面 URL 和日期，提交 issue 或 PR（参见 `CONTRIBUTING.md`）。"
    }
  ],
  id: [
    {
      "type": "p",
      "text": "Panduan ini disusun pada **20 September 2026** dengan membaca langsung halaman-halaman berikut:"
    },
    {
      "type": "ul",
      "items": [
        "concrete.xyz (home, /enterprise) · app.concrete.xyz/earn · points.concrete.xyz",
        "docs.concrete.xyz: Welcome, Yield Vaults & ERC-4626, Vault Shares, Deposit, Withdraw, Vault Transparency, Fees, Points, Architecture: Core Concepts, SDK Overview & Setup, Subgraph Schema & Queries, Event Reference (partially loaded), Live Vaults, Institutional Vaults, AssetCX, Pre-Deposit Vaults, Audits, Risks & Safety, Glossary",
        "github.com/Kashif130/concrete-community-tools dan tiga situs komunitas live (Tracker, Builder Suite, Academy)"
      ]
    },
    {
      "type": "heading",
      "level": 2,
      "text": "Aturan yang diikuti"
    },
    {
      "type": "ol",
      "items": [
        "Fakta diparafrasekan dari sumber-sumber tersebut; tidak ada yang disajikan sebagai jaminan.",
        "Jika suatu angka cepat berubah (TVL, APY, deposit), angka itu diberi label tanggal snapshot atau dihilangkan.",
        "Jika sumber saling bertentangan (mis. platform poin: docs menyebut Absinthe, situs live menyebut Fuul; \"assets on platform\" vs \"deposits\"), perbedaannya dinyatakan.",
        "Source kontrak Concrete bersifat privat. Semua hal tentang internal berasal dari docs developer; model di `examples/` adalah pendekatan edukatif.",
        "Tool komunitas dijelaskan berdasarkan README/halaman mereka sendiri dan tidak diaudit oleh penulis.",
        "Contoh TypeScript dan GraphQL ditulis dari docs dan **tidak dijalankan terhadap infrastruktur live**. Contoh Python memiliki unit test (`python -m unittest` di `examples/python`)."
      ]
    },
    {
      "type": "heading",
      "level": 2,
      "text": "Celah yang diketahui"
    },
    {
      "type": "ul",
      "items": [
        "Konten X (Twitter) tidak dapat dibaca; detail sosial bergantung pada tautan yang ditampilkan di halaman resmi.",
        "Restricted Jurisdictions, Completed Campaigns, Enso, halaman method SDK, dan Event Reference lengkap tidak sepenuhnya tertangkap - ikuti tautan di docs.",
        "APY/TVL live per vault tidak ada dalam teks halaman yang ditangkap."
      ]
    },
    {
      "type": "heading",
      "level": 2,
      "text": "Menjaga tetap mutakhir"
    },
    {
      "type": "p",
      "text": "Periksa ulang docs resmi terlebih dahulu. Buka issue atau PR (lihat `CONTRIBUTING.md`) dengan URL halaman dan tanggal ketika ada perubahan."
    }
  ],
};
