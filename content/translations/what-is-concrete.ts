import type { DocBlock } from "../docs.generated";
import type { Locale } from "@/lib/i18n";

// Full translation of docs/01-beginner/01-what-is-concrete.md.
// Internal links point at the same /docs/... routes as the English version.
export const whatIsConcrete: Partial<Record<Locale, DocBlock[]>> = {
  ur: [
    { type: "quote", text: "**Level:** Beginner · **Reading time:** 8 minute" },
    { type: "heading", level: 2, text: "Aik paragraph mein jawab" },
    {
      type: "p",
      text: "**Concrete** ([concrete.xyz](https://concrete.xyz)) *on-chain yield infrastructure* hai. Yeh log aur institutions ko apne crypto assets (BTC, ETH, stablecoins waghera) **vaults** mein dalne deta hai. Har vault deposit ko parkhi hui yield strategies mein lagata hai, aur depositor ko aik **vault share token** deta hai (jise `ctAsset` kehte hain, jaisay `ctWBTC`) jiski qeemat vault ki kamai ke saath barhti hai. Concrete ko **Blueprint Finance** ne banaya hai (concrete.xyz ke footer par likha hai \"© 2026 Blueprint Finance\").",
    },
    { type: "heading", level: 2, text: "Mental model: deposit → get → earn → use" },
    { type: "p", text: "Homepage puray product ko chaar verbs mein samjhata hai:" },
    {
      type: "table",
      headers: ["Step", "Kya hota hai"],
      rows: [
        ["**Deposit**", "Aap koi asset deposit karte hain jaisay WBTC, USDe, USDT, weETH ya EIGEN."],
        ["**Get**", "Aapko aik **vault share** milta hai - aik ERC-20 token."],
        ["**Earn**", "Vault yield kamata hai (aur kuch vaults par points bhi)."],
        ["**Use**", "Shares aam ERC-20 hain, is liye site inhein DeFi mein kahin aur (Pendle, Morpho, Euler) istemal hotay dikhati hai."],
      ],
    },
    { type: "heading", level: 2, text: "Teen product pillars" },
    {
      type: "ol",
      items: [
        "**Earn** - retail-facing app [app.concrete.xyz/earn](https://app.concrete.xyz/earn) par. Automated vault strategies: aik baar deposit karein aur system allocate, rebalance aur compound karta rehta hai.",
        "**Enterprise** - protocols, issuers aur funds ke liye white-label / institutional vault platform (\"Vaults that scale with you\"). Partners apni strategy aur wallets khud laate hain. Dekhein [Enterprise, AssetCX aur institutional](/docs/02-intermediate/03-institutional-assetcx-enterprise).",
        "**AssetCX** - un assets ko on-chain yield kamane deta hai jo qualified custodian ke paas rehna zaroori hain (Anchorage, BitGo, Ceffu, Coinbase, Cobo, Copper, Fireblocks, Hex Trust, Zodia enquiry form par listed hain), custody chhoray bagair.",
      ],
    },
    { type: "heading", level: 2, text: "Scale (snapshot, 20 Sep 2026)" },
    { type: "p", text: "Yeh figures upar wali tareekh ko live sites se li gayi thin. Yeh hamesha badalti hain aur alag pages alag definitions istemal karte hain, is liye **hamesha source dobara check karein**." },
    {
      type: "table",
      headers: ["Metric", "Value", "Kahan dikhaya gaya"],
      rows: [
        ["Assets on platform", "$902.3M", "concrete.xyz homepage"],
        ["Assets processed", "$11.25B", "concrete.xyz homepage / Enterprise page (har mahina update)"],
        ["Total deposits, all live vaults", "$1.296B", "app.concrete.xyz/earn"],
        ["Volume (deposits + transfers + withdrawals)", "$23.48B", "app.concrete.xyz/earn"],
        ["Depositors", "53.76K", "app.concrete.xyz/earn"],
      ],
    },
    { type: "heading", level: 2, text: "Iske peechay kaun hai?" },
    {
      type: "ul",
      items: [
        "**Company:** Blueprint Finance (Concrete iski yield infrastructure product line hai).",
        "**Leadership (Enterprise page par):** Nic Roberts-Huntley (CEO), Dillon Liang (CSO), Luke Hajdukiewicz (CGO).",
        "**Backers (concrete.xyz par):** Polychain, VanEck, YZi Labs, Portal Ventures, Hashed, Tribe Capital, Hypersphere, Auros, Leadblock Partners, Presto, Halo Capital, Lightshift (current list ke liye site dekhein).",
        "**Security & monitoring partners:** audits Halborn, Cantina, Zellic aur Code4rena se; monitoring ke liye Hypernative; emergency pause ke liye ZeroShadow. Dekhein [Security](/docs/02-intermediate/05-security-and-audits).",
      ],
    },
    { type: "heading", level: 2, text: "Concrete kya *nahi* hai" },
    {
      type: "ul",
      items: [
        "Yeh yield ki **guarantee nahi** deta. APY variable hai aur vaults nuksan bhi kar saktay hain.",
        "Yeh koi **bank account nahi** hai aur koi deposit insurance nahi hai.",
        "Ab tak koi **token ya airdrop announce nahi hua**. Iske khilaaf koi bhi claim community ka what-if ya scam hai (dekhein [FAQ → A](/docs/05-reference/01-faq-a-to-z)).",
      ],
    },
    { type: "heading", level: 2, text: "Aage kahan jayein" },
    {
      type: "ul",
      items: [
        "DeFi mein naye hain? → [02 · DeFi primer](/docs/01-beginner/02-defi-primer)",
        "Try karne ke liye tayyar? → [03 · Getting started](/docs/01-beginner/03-getting-started)",
      ],
    },
  ],

  hi: [
    { type: "quote", text: "**स्तर:** शुरुआती · **पढ़ने का समय:** 8 मिनट" },
    { type: "heading", level: 2, text: "एक पैराग्राफ़ में जवाब" },
    {
      type: "p",
      text: "**Concrete** ([concrete.xyz](https://concrete.xyz)) एक *ऑन-चेन यील्ड इन्फ्रास्ट्रक्चर* है। यह लोगों और संस्थानों को अपने क्रिप्टो एसेट्स (BTC, ETH, स्टेबलकॉइन आदि) **वॉल्ट्स** में डालने देता है। हर वॉल्ट डिपॉज़िट को जाँची-परखी यील्ड स्ट्रैटेजीज़ में लगाता है, और डिपॉज़िटर को एक **वॉल्ट शेयर टोकन** देता है (जिसे `ctAsset` कहते हैं, जैसे `ctWBTC`) जिसकी कीमत वॉल्ट की कमाई के साथ बढ़ती है। Concrete को **Blueprint Finance** ने बनाया है (concrete.xyz के फ़ुटर में लिखा है \"© 2026 Blueprint Finance\")।",
    },
    { type: "heading", level: 2, text: "मानसिक मॉडल: डिपॉज़िट → पाएं → कमाएं → इस्तेमाल करें" },
    { type: "p", text: "होमपेज पूरे प्रोडक्ट को चार क्रियाओं में समझाता है:" },
    {
      type: "table",
      headers: ["चरण", "क्या होता है"],
      rows: [
        ["**डिपॉज़िट**", "आप कोई एसेट डालते हैं, जैसे WBTC, USDe, USDT, weETH या EIGEN।"],
        ["**पाएं**", "आपको एक **वॉल्ट शेयर** मिलता है - एक ERC-20 टोकन।"],
        ["**कमाएं**", "वॉल्ट यील्ड कमाता है (और कुछ वॉल्ट्स पर पॉइंट्स भी)।"],
        ["**इस्तेमाल करें**", "शेयर सामान्य ERC-20 हैं, इसलिए साइट इन्हें DeFi में कहीं और (Pendle, Morpho, Euler) इस्तेमाल होते दिखाती है।"],
      ],
    },
    { type: "heading", level: 2, text: "तीन प्रोडक्ट स्तंभ" },
    {
      type: "ol",
      items: [
        "**Earn** - रिटेल-फ़ेसिंग ऐप [app.concrete.xyz/earn](https://app.concrete.xyz/earn) पर। ऑटोमेटेड वॉल्ट स्ट्रैटेजीज़: एक बार डिपॉज़िट करें और सिस्टम अलोकेट, रीबैलेंस और कंपाउंड करता रहता है।",
        "**Enterprise** - प्रोटोकॉल्स, इश्यूअर्स और फंड्स के लिए व्हाइट-लेबल / इंस्टीट्यूशनल वॉल्ट प्लेटफ़ॉर्म (\"Vaults that scale with you\")। पार्टनर्स अपनी स्ट्रैटेजी और वॉलेट्स खुद लाते हैं। देखें [Enterprise, AssetCX और institutional](/docs/02-intermediate/03-institutional-assetcx-enterprise)।",
        "**AssetCX** - उन एसेट्स को कस्टडी छोड़े बिना ऑन-चेन यील्ड कमाने देता है जिन्हें किसी क्वालिफ़ाइड कस्टोडियन के पास रहना ज़रूरी है (Anchorage, BitGo, Ceffu, Coinbase, Cobo, Copper, Fireblocks, Hex Trust, Zodia एनक्वायरी फ़ॉर्म पर सूचीबद्ध हैं)।",
      ],
    },
    { type: "heading", level: 2, text: "स्केल (स्नैपशॉट, 20 सितंबर 2026)" },
    { type: "p", text: "ये आंकड़े ऊपर दी गई तारीख़ को लाइव साइट्स से लिए गए थे। ये लगातार बदलते हैं और अलग-अलग पेज अलग परिभाषाएं इस्तेमाल करते हैं, इसलिए **हमेशा सोर्स दोबारा जाँचें**।" },
    {
      type: "table",
      headers: ["मेट्रिक", "वैल्यू", "कहाँ दिखाया गया"],
      rows: [
        ["Assets on platform", "$902.3M", "concrete.xyz होमपेज"],
        ["Assets processed", "$11.25B", "concrete.xyz होमपेज / Enterprise पेज (हर महीने अपडेट)"],
        ["Total deposits, all live vaults", "$1.296B", "app.concrete.xyz/earn"],
        ["Volume (deposits + transfers + withdrawals)", "$23.48B", "app.concrete.xyz/earn"],
        ["Depositors", "53.76K", "app.concrete.xyz/earn"],
      ],
    },
    { type: "heading", level: 2, text: "इसके पीछे कौन है?" },
    {
      type: "ul",
      items: [
        "**कंपनी:** Blueprint Finance (Concrete इसकी यील्ड इन्फ्रास्ट्रक्चर प्रोडक्ट लाइन है)।",
        "**लीडरशिप (Enterprise पेज पर):** Nic Roberts-Huntley (CEO), Dillon Liang (CSO), Luke Hajdukiewicz (CGO)।",
        "**बैकर्स (concrete.xyz पर):** Polychain, VanEck, YZi Labs, Portal Ventures, Hashed, Tribe Capital, Hypersphere, Auros, Leadblock Partners, Presto, Halo Capital, Lightshift (मौजूदा लिस्ट के लिए साइट देखें)।",
        "**सुरक्षा व निगरानी साझेदार:** ऑडिट Halborn, Cantina, Zellic और Code4rena से; निगरानी के लिए Hypernative; इमरजेंसी पॉज़ के लिए ZeroShadow। देखें [Security](/docs/02-intermediate/05-security-and-audits)।",
      ],
    },
    { type: "heading", level: 2, text: "Concrete क्या *नहीं* है" },
    {
      type: "ul",
      items: [
        "यह यील्ड की **गारंटी नहीं** देता। APY बदलता रहता है और वॉल्ट्स में नुकसान भी हो सकता है।",
        "यह कोई **बैंक अकाउंट नहीं** है और कोई डिपॉज़िट इंश्योरेंस नहीं है।",
        "अब तक किसी **टोकन या एयरड्रॉप की घोषणा नहीं** हुई है। इसके उलट कोई भी दावा या तो कम्युनिटी का व्हाट-इफ़ है या स्कैम (देखें [FAQ → A](/docs/05-reference/01-faq-a-to-z))।",
      ],
    },
    { type: "heading", level: 2, text: "आगे कहाँ जाएँ" },
    {
      type: "ul",
      items: [
        "DeFi में नए हैं? → [02 · DeFi primer](/docs/01-beginner/02-defi-primer)",
        "Try करने के लिए तैयार? → [03 · Getting started](/docs/01-beginner/03-getting-started)",
      ],
    },
  ],

  pcm: [
    { type: "quote", text: "**Level:** Beginner · **Time wey e go take you read:** 8 minutes" },
    { type: "heading", level: 2, text: "One-paragraph answer" },
    {
      type: "p",
      text: "**Concrete** ([concrete.xyz](https://concrete.xyz)) na *on-chain yield infrastructure*. E dey allow people and institutions put their crypto assets (BTC, ETH, stablecoins and others) inside **vaults**. Every vault go put di deposit inside strategies wey dem don vet, and e go give di depositor **vault share token** (dem dey call am `ctAsset`, like `ctWBTC`) wey e value dey grow as di vault dey earn. **Blueprint Finance** build Concrete (na dem footer dey for concrete.xyz, e write \"© 2026 Blueprint Finance\").",
    },
    { type: "heading", level: 2, text: "Di mental model: deposit → get → earn → use" },
    { type: "p", text: "Homepage explain di whole product with four verbs:" },
    {
      type: "table",
      headers: ["Step", "Wetin dey happen"],
      rows: [
        ["**Deposit**", "You deposit asset like WBTC, USDe, USDT, weETH or EIGEN."],
        ["**Get**", "You go receive **vault share** - na ERC-20 token."],
        ["**Earn**", "Di vault dey earn yield (and for some vaults, points too)."],
        ["**Use**", "Shares na normal ERC-20 tokens, so di site show say you fit use dem for other DeFi place (Pendle, Morpho, Euler)."],
      ],
    },
    { type: "heading", level: 2, text: "Di three product pillars" },
    {
      type: "ol",
      items: [
        "**Earn** - di retail app for [app.concrete.xyz/earn](https://app.concrete.xyz/earn). Automated vault strategies: deposit one time and di system go dey allocate, rebalance and compound am.",
        "**Enterprise** - white-label / institutional vault platform for protocols, issuers and funds (\"Vaults that scale with you\"). Partners go bring their own strategy and wallets. Check [Enterprise, AssetCX and institutional](/docs/02-intermediate/03-institutional-assetcx-enterprise).",
        "**AssetCX** - e dey allow assets wey must stay with qualified custodian (Anchorage, BitGo, Ceffu, Coinbase, Cobo, Copper, Fireblocks, Hex Trust, Zodia dey listed for di enquiry form) earn on-chain yield without leaving custody.",
      ],
    },
    { type: "heading", level: 2, text: "Scale (snapshot, 20 Sep 2026)" },
    { type: "p", text: "Dis figures na wetin dem read from di live sites on di date wey dey up. Dem dey change anytime and different pages dey use different definitions, so **always go check di source again**." },
    {
      type: "table",
      headers: ["Metric", "Value", "Where dem show am"],
      rows: [
        ["Assets on platform", "$902.3M", "concrete.xyz homepage"],
        ["Assets processed", "$11.25B", "concrete.xyz homepage / Enterprise page (e dey update every month)"],
        ["Total deposits, all live vaults", "$1.296B", "app.concrete.xyz/earn"],
        ["Volume (deposits + transfers + withdrawals)", "$23.48B", "app.concrete.xyz/earn"],
        ["Depositors", "53.76K", "app.concrete.xyz/earn"],
      ],
    },
    { type: "heading", level: 2, text: "Who dey behind am?" },
    {
      type: "ul",
      items: [
        "**Company:** Blueprint Finance (Concrete na dia yield infrastructure product line).",
        "**Leadership wey dey show for Enterprise page:** Nic Roberts-Huntley (CEO), Dillon Liang (CSO), Luke Hajdukiewicz (CGO).",
        "**Backers wey dey show for concrete.xyz:** Polychain, VanEck, YZi Labs, Portal Ventures, Hashed, Tribe Capital, Hypersphere, Auros, Leadblock Partners, Presto, Halo Capital, Lightshift (check di site for di current list).",
        "**Security & monitoring partners:** audits from Halborn, Cantina, Zellic and Code4rena; Hypernative dey monitor am; ZeroShadow dey handle emergency pause. Check [Security](/docs/02-intermediate/05-security-and-audits).",
      ],
    },
    { type: "heading", level: 2, text: "Wetin Concrete *no be*" },
    {
      type: "ul",
      items: [
        "E **no dey guarantee** yield. APY dey change, and vaults fit lose money.",
        "E **no be** bank account and no deposit insurance dey.",
        "Dem **never announce any token or airdrop** as dem dey write dis. Anything wey claim otherwise na community what-if or na scam (check [FAQ → A](/docs/05-reference/01-faq-a-to-z)).",
      ],
    },
    { type: "heading", level: 2, text: "Where to go next" },
    {
      type: "ul",
      items: [
        "You new for DeFi? → [02 · DeFi primer](/docs/01-beginner/02-defi-primer)",
        "You don ready to try am? → [03 · Getting started](/docs/01-beginner/03-getting-started)",
      ],
    },
  ],

  zh: [
    { type: "quote", text: "**难度：** 入门 · **阅读时间：** 8 分钟" },
    { type: "heading", level: 2, text: "一段话讲清楚" },
    {
      type: "p",
      text: "**Concrete**（[concrete.xyz](https://concrete.xyz)）是一种*链上收益基础设施*。它让个人和机构可以把加密资产（BTC、ETH、稳定币等）存入**金库（vault）**。每个金库会把存款部署到经过筛选的收益策略中，并给存款人发放一枚**金库份额代币**（称为 `ctAsset`，例如 `ctWBTC`），其价值会随着金库的收益增长而上升。Concrete 由 **Blueprint Finance** 开发（concrete.xyz 页脚写着 \"© 2026 Blueprint Finance\"）。",
    },
    { type: "heading", level: 2, text: "心智模型：存入 → 获得 → 赚取 → 使用" },
    { type: "p", text: "官网用四个动词概括了整个产品：" },
    {
      type: "table",
      headers: ["步骤", "发生了什么"],
      rows: [
        ["**存入**", "你存入一种资产，例如 WBTC、USDe、USDT、weETH 或 EIGEN。"],
        ["**获得**", "你会收到一份**金库份额** —— 一枚 ERC-20 代币。"],
        ["**赚取**", "金库赚取收益（部分金库还会产生积分）。"],
        ["**使用**", "份额就是普通的 ERC-20 代币，因此官网展示它们还能在其他 DeFi 场景（Pendle、Morpho、Euler）中使用。"],
      ],
    },
    { type: "heading", level: 2, text: "三大产品支柱" },
    {
      type: "ol",
      items: [
        "**Earn** —— 面向散户的应用，[app.concrete.xyz/earn](https://app.concrete.xyz/earn)。自动化金库策略：存入一次，系统会持续分配、再平衡并复利。",
        "**Enterprise** —— 面向协议、发行方和基金的白标 / 机构金库平台（\"Vaults that scale with you\"）。合作伙伴自带策略和钱包。参见[Enterprise、AssetCX 与机构业务](/docs/02-intermediate/03-institutional-assetcx-enterprise)。",
        "**AssetCX** —— 让必须留在合规托管方处的资产（询价表单列出了 Anchorage、BitGo、Ceffu、Coinbase、Cobo、Copper、Fireblocks、Hex Trust、Zodia）在不离开托管的情况下获得链上收益。",
      ],
    },
    { type: "heading", level: 2, text: "规模（快照，2026 年 9 月 20 日）" },
    { type: "p", text: "以下数据是在上述日期从官网实时抓取的。这些数字会持续变化，且不同页面使用的口径也不同，因此**请始终以官方来源为准重新核实**。" },
    {
      type: "table",
      headers: ["指标", "数值", "数据来源页面"],
      rows: [
        ["平台资产", "$902.3M", "concrete.xyz 首页"],
        ["已处理资产", "$11.25B", "concrete.xyz 首页 / Enterprise 页面（每月更新）"],
        ["总存款（所有活跃金库）", "$1.296B", "app.concrete.xyz/earn"],
        ["交易量（存款+转账+提款）", "$23.48B", "app.concrete.xyz/earn"],
        ["存款用户数", "53.76K", "app.concrete.xyz/earn"],
      ],
    },
    { type: "heading", level: 2, text: "背后是谁？" },
    {
      type: "ul",
      items: [
        "**公司：** Blueprint Finance（Concrete 是其收益基础设施产品线）。",
        "**Enterprise 页面展示的管理团队：** Nic Roberts-Huntley（CEO）、Dillon Liang（CSO）、Luke Hajdukiewicz（CGO）。",
        "**concrete.xyz 展示的投资方：** Polychain、VanEck、YZi Labs、Portal Ventures、Hashed、Tribe Capital、Hypersphere、Auros、Leadblock Partners、Presto、Halo Capital、Lightshift（最新名单请见官网）。",
        "**安全与监控合作伙伴：** Halborn、Cantina、Zellic 和 Code4rena 提供审计；Hypernative 负责监控；ZeroShadow 负责紧急暂停。参见[安全](/docs/02-intermediate/05-security-and-audits)。",
      ],
    },
    { type: "heading", level: 2, text: "Concrete *不是*什么" },
    {
      type: "ul",
      items: [
        "它**不保证**收益。APY 会波动，金库也可能亏损。",
        "它**不是**银行账户，也没有存款保险。",
        "截至目前**尚未宣布任何代币或空投**。任何声称相反的说法，要么是社区的假设讨论，要么就是骗局（参见 [FAQ → A](/docs/05-reference/01-faq-a-to-z)）。",
      ],
    },
    { type: "heading", level: 2, text: "接下来去哪里" },
    {
      type: "ul",
      items: [
        "刚接触 DeFi？→ [02 · DeFi primer](/docs/01-beginner/02-defi-primer)",
        "准备好试一试了吗？→ [03 · Getting started](/docs/01-beginner/03-getting-started)",
      ],
    },
  ],

  id: [
    { type: "quote", text: "**Level:** Pemula · **Waktu baca:** 8 menit" },
    { type: "heading", level: 2, text: "Jawaban dalam satu paragraf" },
    {
      type: "p",
      text: "**Concrete** ([concrete.xyz](https://concrete.xyz)) adalah *infrastruktur yield on-chain*. Ini memungkinkan individu dan institusi menyetor aset kripto (BTC, ETH, stablecoin, dll.) ke dalam **vault**. Setiap vault menempatkan setoran ke strategi yield yang telah diverifikasi, dan memberi deposan sebuah **token share vault** (disebut `ctAsset`, misalnya `ctWBTC`) yang nilainya naik seiring vault menghasilkan yield. Concrete dibangun oleh **Blueprint Finance** (footer di concrete.xyz bertuliskan \"© 2026 Blueprint Finance\").",
    },
    { type: "heading", level: 2, text: "Model mental: setor → terima → hasilkan → gunakan" },
    { type: "p", text: "Halaman utama menjelaskan seluruh produk dalam empat kata kerja:" },
    {
      type: "table",
      headers: ["Langkah", "Yang terjadi"],
      rows: [
        ["**Setor**", "Kamu menyetor aset seperti WBTC, USDe, USDT, weETH, atau EIGEN."],
        ["**Terima**", "Kamu menerima **share vault** - sebuah token ERC-20."],
        ["**Hasilkan**", "Vault menghasilkan yield (dan di beberapa vault, juga poin)."],
        ["**Gunakan**", "Share adalah ERC-20 biasa, jadi situs menunjukkan share ini bisa dipakai di tempat lain dalam DeFi (Pendle, Morpho, dan Euler)."],
      ],
    },
    { type: "heading", level: 2, text: "Tiga pilar produk" },
    {
      type: "ol",
      items: [
        "**Earn** - aplikasi untuk pengguna ritel di [app.concrete.xyz/earn](https://app.concrete.xyz/earn). Strategi vault otomatis: setor sekali dan sistem akan mengalokasikan, menyeimbangkan ulang, dan menggabungkan hasil secara terus-menerus.",
        "**Enterprise** - platform vault white-label / institusional untuk protokol, penerbit, dan dana investasi (\"Vaults that scale with you\"). Mitra membawa strategi dan dompet mereka sendiri. Lihat [Enterprise, AssetCX, dan institusional](/docs/02-intermediate/03-institutional-assetcx-enterprise).",
        "**AssetCX** - memungkinkan aset yang harus tetap berada di kustodian resmi (Anchorage, BitGo, Ceffu, Coinbase, Cobo, Copper, Fireblocks, Hex Trust, Zodia tercantum di formulir permintaan) menghasilkan yield on-chain tanpa meninggalkan kustodi.",
      ],
    },
    { type: "heading", level: 2, text: "Skala (snapshot, 20 Sep 2026)" },
    { type: "p", text: "Angka-angka ini diambil dari situs langsung pada tanggal di atas. Angka ini terus berubah dan halaman berbeda memakai definisi berbeda, jadi **selalu periksa ulang sumbernya**." },
    {
      type: "table",
      headers: ["Metrik", "Nilai", "Sumber tampilan"],
      rows: [
        ["Assets on platform", "$902.3M", "Halaman utama concrete.xyz"],
        ["Assets processed", "$11.25B", "Halaman utama concrete.xyz / halaman Enterprise (diperbarui bulanan)"],
        ["Total deposits, all live vaults", "$1.296B", "app.concrete.xyz/earn"],
        ["Volume (deposits + transfers + withdrawals)", "$23.48B", "app.concrete.xyz/earn"],
        ["Depositors", "53.76K", "app.concrete.xyz/earn"],
      ],
    },
    { type: "heading", level: 2, text: "Siapa di baliknya?" },
    {
      type: "ul",
      items: [
        "**Perusahaan:** Blueprint Finance (Concrete adalah lini produk infrastruktur yield-nya).",
        "**Kepemimpinan yang tercantum di halaman Enterprise:** Nic Roberts-Huntley (CEO), Dillon Liang (CSO), Luke Hajdukiewicz (CGO).",
        "**Investor yang tercantum di concrete.xyz:** Polychain, VanEck, YZi Labs, Portal Ventures, Hashed, Tribe Capital, Hypersphere, Auros, Leadblock Partners, Presto, Halo Capital, Lightshift (lihat situs untuk daftar terkini).",
        "**Mitra keamanan & pemantauan:** audit oleh Halborn, Cantina, Zellic, dan Code4rena; Hypernative untuk pemantauan; ZeroShadow untuk penghentian darurat. Lihat [Keamanan](/docs/02-intermediate/05-security-and-audits).",
      ],
    },
    { type: "heading", level: 2, text: "Apa yang Concrete *bukan*" },
    {
      type: "ul",
      items: [
        "Tidak **menjamin** yield. APY bersifat variabel dan vault bisa mengalami kerugian.",
        "Bukan **rekening bank** dan tidak ada asuransi simpanan.",
        "**Belum mengumumkan token atau airdrop** hingga tulisan ini dibuat. Klaim yang menyatakan sebaliknya adalah spekulasi komunitas atau penipuan (lihat [FAQ → A](/docs/05-reference/01-faq-a-to-z)).",
      ],
    },
    { type: "heading", level: 2, text: "Langkah berikutnya" },
    {
      type: "ul",
      items: [
        "Baru di DeFi? → [02 · DeFi primer](/docs/01-beginner/02-defi-primer)",
        "Siap mencoba? → [03 · Getting started](/docs/01-beginner/03-getting-started)",
      ],
    },
  ],
};
