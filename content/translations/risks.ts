import type { DocBlock } from "../docs.generated";
import type { Locale } from "@/lib/i18n";

// Full translation of docs/02-intermediate/06-risks.md.
// Protocol/vendor names and code identifiers are left as in the English source.
export const risks: Partial<Record<Locale, DocBlock[]>> = {
  ur: [
    { type: "quote", text: "**Level:** Intermediate · Financial advice nahi hai. \"Yields guaranteed nahi hain… aap apne deposit kiye gaye assets ka kuch ya sab hissa kho sakte hain.\"" },
    {
      type: "table",
      headers: ["Risk", "Concrete depositor ke liye iska matlab", "Concrete ke bayan kiye gaye mitigations", "Aap *khud* kya kar sakte hain"],
      rows: [
        ["**Smart-contract**", "Vault/strategy/dependency code mein bug ya exploit", "Kai audits, bug bounty, role separation, monitoring, pause authority", "Audited versions ko tarjeeh dein; positions ka size mo'tadil rakhein"],
        ["**Strategy / protocol**", "Underlying venue hack ho, depeg ho ya paisa kho de → share price gir jati hai", "Strategy vetting, whitelisting, nayi strategies ke liye exposure caps, disclosures", "Vault ka strategy breakdown aur transparency panel parhein"],
        ["**Market / IL**", "LP positions sirf hold karne se peeche reh sakti hain; volatile pairs aur new-chain campaigns mein zyada", "Diversification, dynamic reallocation", "Agar IL bardasht nahi kar saktay to volatile-pair vaults se bachein"],
        ["**Slippage**", "Deposit/rebalance ke dauran swaps umeed se kharab execute hotay hain", "Aggregator routing (mas. 1inch), contracts mein slippage limits, UI warnings", "Munasib size rakhein; warnings par tawajjoh dein"],
        ["**Liquidity / exit**", "Queue delay, withdrawal caps, cooldowns; price processing ke waqt lock hoti hai", "Queue transparency, FIFO ordering", "Apni holding period ko exit model se match karein"],
        ["**Custody & operator**", "Off-chain valuations aur custodied assets operators/custodians par depend karte hain", "MPC/multisig, bounded accounting updates, independent verification", "Agar yeh pasand nahi to on-chain accounting wale vaults ko tarjeeh dein"],
        ["**Operational halt**", "Accounting push late hone par deposits/withdrawals theek hone tak ruk jatay hain", "Automation + monitoring", "Yaad rakhein ke pauses ho sakte hain"],
        ["**Regulatory / access**", "Restricted jurisdictions; address screening", "Terms, geo-blocking", "Pehle eligibility check karein"],
        ["**Smart-wallet / user**", "Phishing, fake sites, ghalat approvals", "-", "Domains bookmark karein; purani approvals revoke karein"],
      ],
    },
    { type: "heading", level: 2, text: "Loss mechanics" },
    { type: "p", text: "Strategy mein nuksan → operator/strategy kam value report karta hai → `totalAssets` girta hai → share price **tamam** holders ke liye barabar ke hisaab se girti hai. Async-accounting vaults mein operator reported total assets kam kar sakta hai. Docs mein koi alag insurance layer bayan nahi ki gayi." },
    { type: "heading", level: 2, text: "Position sizing ke sawal jo khud se poochein" },
    {
      type: "ol",
      items: [
        "Agar yeh vault kal 30% kho de, to kya meri finances toot jayengi?",
        "Kya main funds ki zaroorat ke baghair withdrawal ke liye haftay intezar kar sakta/sakti hoon?",
        "Kya main samajhta/samajhti hoon ke yield *khaas taur par* kis cheez se ban rahi hai?",
        "Kya main custodian/curator par bharosa karta/karti hoon, sirf brand par nahi?",
      ],
    },
  ],

  hi: [
    { type: "quote", text: "**स्तर:** मध्यम · Financial advice नहीं है। \"Yields guaranteed नहीं हैं… आप अपने deposit किए गए assets का कुछ या सब हिस्सा खो सकते हैं।\"" },
    {
      type: "table",
      headers: ["Risk", "Concrete depositor के लिए इसका मतलब", "Concrete द्वारा बताए गए mitigations", "आप *खुद* क्या कर सकते हैं"],
      rows: [
        ["**Smart-contract**", "Vault/strategy/dependency code में bug या exploit", "कई audits, bug bounty, role separation, monitoring, pause authority", "Audited versions को प्राथमिकता दें; positions का size मध्यम रखें"],
        ["**Strategy / protocol**", "Underlying venue hack हो, depeg हो या पैसा खो दे → share price गिर जाती है", "Strategy vetting, whitelisting, नई strategies के लिए exposure caps, disclosures", "Vault का strategy breakdown और transparency panel पढ़ें"],
        ["**Market / IL**", "LP positions सिर्फ़ hold करने से पीछे रह सकती हैं; volatile pairs और new-chain campaigns में ज़्यादा", "Diversification, dynamic reallocation", "अगर IL बर्दाश्त नहीं कर सकते तो volatile-pair vaults से बचें"],
        ["**Slippage**", "Deposit/rebalance के दौरान swaps उम्मीद से खराब execute होते हैं", "Aggregator routing (जैसे 1inch), contracts में slippage limits, UI warnings", "सही size रखें; warnings पर ध्यान दें"],
        ["**Liquidity / exit**", "Queue delay, withdrawal caps, cooldowns; price processing के समय lock होती है", "Queue transparency, FIFO ordering", "अपनी holding period को exit model से match करें"],
        ["**Custody & operator**", "Off-chain valuations और custodied assets operators/custodians पर निर्भर करते हैं", "MPC/multisig, bounded accounting updates, independent verification", "अगर यह पसंद नहीं तो on-chain accounting वाले vaults को प्राथमिकता दें"],
        ["**Operational halt**", "Accounting push देर से होने पर deposits/withdrawals ठीक होने तक रुक जाते हैं", "Automation + monitoring", "याद रखें कि pauses हो सकते हैं"],
        ["**Regulatory / access**", "Restricted jurisdictions; address screening", "Terms, geo-blocking", "पहले eligibility check करें"],
        ["**Smart-wallet / user**", "Phishing, fake sites, गलत approvals", "-", "Domains bookmark करें; पुरानी approvals revoke करें"],
      ],
    },
    { type: "heading", level: 2, text: "Loss mechanics" },
    { type: "p", text: "Strategy में नुकसान → operator/strategy कम value report करता है → `totalAssets` गिरता है → share price **सभी** holders के लिए अनुपात में गिरती है। Async-accounting vaults में operator reported total assets घटा सकता है। Docs में कोई अलग insurance layer नहीं बताई गई।" },
    { type: "heading", level: 2, text: "Position sizing के सवाल जो खुद से पूछें" },
    {
      type: "ol",
      items: [
        "अगर यह vault कल 30% खो दे, तो क्या मेरी finances टूट जाएँगी?",
        "क्या मैं funds की ज़रूरत के बिना withdrawal के लिए हफ़्तों इंतज़ार कर सकता/सकती हूँ?",
        "क्या मैं समझता/समझती हूँ कि yield *खास तौर पर* किस चीज़ से बन रही है?",
        "क्या मैं custodian/curator पर भरोसा करता/करती हूँ, सिर्फ़ brand पर नहीं?",
      ],
    },
  ],

  pcm: [
    { type: "quote", text: "**Level:** Intermediate · No be financial advice. \"Yields no dey guaranteed… you fit lose some or all of di assets wey you deposit.\"" },
    {
      type: "table",
      headers: ["Risk", "Wetin e mean for Concrete depositor", "Mitigations wey Concrete describe", "Wetin *you* fit do"],
      rows: [
        ["**Smart-contract**", "Bug or exploit for vault/strategy/dependency code", "Plenty audits, bug bounty, role separation, monitoring, pause authority", "Prefer audited versions; no put too much for one position"],
        ["**Strategy / protocol**", "Di underlying venue get hacked, depeg or lose money → share price go fall", "Strategy vetting, whitelisting, exposure caps for new strategies, disclosures", "Read di vault strategy breakdown & transparency panel"],
        ["**Market / IL**", "LP positions fit lag just holding; e higher for volatile pairs & new-chain campaigns", "Diversification, dynamic reallocation", "Avoid volatile-pair vaults if you no fit tolerate IL"],
        ["**Slippage**", "Swaps wey happen during deposit/rebalance fit execute worse pass wetin you expect", "Aggregator routing (e.g. 1inch), slippage limits for contracts, UI warnings", "Use reasonable size; take warnings serious"],
        ["**Liquidity / exit**", "Queue delay, withdrawal caps, cooldowns; price dey lock for processing time", "Queue transparency, FIFO ordering", "Match your holding period to di exit model"],
        ["**Custody & operator**", "Off-chain valuations and custodied assets dey depend on operators/custodians", "MPC/multisig, bounded accounting updates, independent verification", "Prefer vaults wey get on-chain accounting if you no like dis one"],
        ["**Operational halt**", "If accounting push late, deposits/withdrawals go halt until dem fix am", "Automation + monitoring", "Know say pauses fit happen"],
        ["**Regulatory / access**", "Restricted jurisdictions; address screening", "Terms, geo-blocking", "Check if you qualify first"],
        ["**Smart-wallet / user**", "Phishing, fake sites, bad approvals", "-", "Bookmark domains; revoke old approvals"],
      ],
    },
    { type: "heading", level: 2, text: "Loss mechanics" },
    { type: "p", text: "Strategy loss → operator/strategy go report lower value → `totalAssets` go fall → share price go fall for **all** holders proportionally. For async-accounting vaults, operator fit reduce di reported total assets. Di docs no describe any separate insurance layer." },
    { type: "heading", level: 2, text: "Position-sizing questions wey you suppose ask yourself" },
    {
      type: "ol",
      items: [
        "If dis vault lose 30% tomorrow, e go scatter my finances?",
        "I fit wait weeks for withdrawal without say I need di funds?",
        "I understand wetin *exactly* dey generate di yield?",
        "I trust di custodian/curator, no be just di brand?",
      ],
    },
  ],

  zh: [
    { type: "quote", text: "**级别：** 中级 · 不构成投资建议。“收益不受保证……你可能损失全部或部分存入的资产。”" },
    {
      type: "table",
      headers: ["风险", "对 Concrete 存款人意味着什么", "Concrete 所述的缓解措施", "*你*可以做什么"],
      rows: [
        ["**智能合约**", "vault/策略/依赖项代码中的漏洞或被利用", "多次审计、漏洞赏金、角色分离、监控、暂停权限", "优先选择已审计的版本；仓位大小适度"],
        ["**策略 / 协议**", "底层场所被黑、脱锚或亏损 → 份额价格下跌", "策略审查、白名单、新策略的敞口上限、信息披露", "阅读该 vault 的策略构成和透明度面板"],
        ["**市场 / IL**", "LP 仓位可能跑输单纯持有；波动性交易对和新链活动风险更高", "分散配置、动态再分配", "如果无法承受 IL，请避开波动性交易对的 vault"],
        ["**滑点**", "存款/再平衡期间的兑换成交价格差于预期", "聚合器路由（如 1inch）、合约中的滑点限制、界面警告", "控制合理规模；留意警告"],
        ["**流动性 / 退出**", "排队延迟、提现上限、冷静期；价格在处理时锁定", "队列透明、FIFO 顺序", "让持有期限与退出模式相匹配"],
        ["**托管与运营方**", "链下估值和托管资产依赖运营方/托管方", "MPC/多签、受限的记账更新、独立验证", "如果不喜欢这一点，优先选择链上记账的 vault"],
        ["**运营暂停**", "记账推送延迟会导致存款/提现暂停，直到修复", "自动化 + 监控", "了解暂停可能发生"],
        ["**监管 / 准入**", "受限司法辖区；地址筛查", "条款、地域屏蔽", "先确认自己是否符合资格"],
        ["**智能钱包 / 用户**", "钓鱼、虚假网站、错误授权", "-", "收藏官方域名；撤销过期授权"],
      ],
    },
    { type: "heading", level: 2, text: "亏损机制" },
    { type: "p", text: "策略亏损 → 运营方/策略上报更低的价值 → `totalAssets` 下降 → 份额价格对**所有**持有者按比例下跌。在异步记账的 vault 中，运营方可以下调所报告的总资产。文档中没有描述单独的保险层。" },
    { type: "heading", level: 2, text: "仓位规模：先问自己的几个问题" },
    {
      type: "ol",
      items: [
        "如果这个 vault 明天亏损 30%，会不会影响我的财务状况？",
        "我能否在不需要这笔资金的情况下等待数周才提现？",
        "我是否清楚收益*具体*来自什么？",
        "我信任的是托管方/curator 本身，而不只是品牌吗？",
      ],
    },
  ],

  id: [
    { type: "quote", text: "**Level:** Menengah · Bukan nasihat keuangan. \"Yield tidak dijamin… Anda dapat kehilangan sebagian atau seluruh aset yang Anda setorkan.\"" },
    {
      type: "table",
      headers: ["Risiko", "Artinya bagi depositor Concrete", "Mitigasi yang dijelaskan Concrete", "Yang bisa *Anda* lakukan"],
      rows: [
        ["**Smart-contract**", "Bug atau exploit pada kode vault/strategi/dependensi", "Beberapa audit, bug bounty, pemisahan peran, monitoring, otoritas pause", "Utamakan versi yang sudah diaudit; ukuran posisi secukupnya"],
        ["**Strategi / protokol**", "Venue dasar diretas, depeg, atau merugi → harga share turun", "Penyaringan strategi, whitelist, batas eksposur untuk strategi baru, pengungkapan", "Baca rincian strategi vault & panel transparansi"],
        ["**Pasar / IL**", "Posisi LP bisa tertinggal dibanding sekadar hold; lebih tinggi untuk pasangan volatil & kampanye chain baru", "Diversifikasi, realokasi dinamis", "Hindari vault pasangan volatil jika tidak sanggup menanggung IL"],
        ["**Slippage**", "Swap saat deposit/rebalance tereksekusi lebih buruk dari perkiraan", "Routing aggregator (mis. 1inch), batas slippage di kontrak, peringatan UI", "Gunakan ukuran yang wajar; perhatikan peringatan"],
        ["**Likuiditas / exit**", "Penundaan antrean, batas penarikan, cooldown; harga dikunci saat pemrosesan", "Transparansi antrean, urutan FIFO", "Sesuaikan jangka waktu holding dengan model exit"],
        ["**Custody & operator**", "Valuasi off-chain dan aset custodied bergantung pada operator/custodian", "MPC/multisig, pembaruan akuntansi yang dibatasi, verifikasi independen", "Utamakan vault dengan akuntansi on-chain jika Anda kurang nyaman dengan ini"],
        ["**Penghentian operasional**", "Push akuntansi yang terlambat menghentikan deposit/penarikan sampai diperbaiki", "Otomasi + monitoring", "Ketahuilah bahwa pause bisa terjadi"],
        ["**Regulasi / akses**", "Yurisdiksi terbatas; penyaringan alamat", "Ketentuan, geo-blocking", "Cek kelayakan terlebih dahulu"],
        ["**Smart-wallet / pengguna**", "Phishing, situs palsu, approval yang keliru", "-", "Bookmark domain; cabut approval lama"],
      ],
    },
    { type: "heading", level: 2, text: "Mekanisme kerugian" },
    { type: "p", text: "Kerugian strategi → operator/strategi melaporkan nilai lebih rendah → `totalAssets` turun → harga share turun secara proporsional untuk **semua** holder. Pada vault dengan akuntansi asinkron, operator dapat menurunkan total aset yang dilaporkan. Docs tidak menjelaskan adanya lapisan asuransi terpisah." },
    { type: "heading", level: 2, text: "Pertanyaan penentuan ukuran posisi untuk diri sendiri" },
    {
      type: "ol",
      items: [
        "Jika vault ini rugi 30% besok, apakah keuangan saya akan terganggu?",
        "Bisakah saya menunggu berminggu-minggu untuk penarikan tanpa membutuhkan dana itu?",
        "Apakah saya paham apa yang *secara spesifik* menghasilkan yield?",
        "Apakah saya percaya pada custodian/curator-nya, bukan hanya mereknya?",
      ],
    },
  ],
};
