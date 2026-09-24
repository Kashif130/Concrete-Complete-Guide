import type { DocBlock } from "../docs.generated";
import type { Locale } from "@/lib/i18n";

// Full translation of docs/02-intermediate/02-strategies-and-curators.md.
// Protocol/vendor names, strategy names and code identifiers are left as in the English source.
export const strategiesAndCurators: Partial<Record<Locale, DocBlock[]>> = {
  ur: [
    { type: "quote", text: "**Level:** Intermediate" },
    { type: "heading", level: 2, text: "Roles asaan alfaaz mein" },
    {
      type: "table",
      headers: ["Actor", "Kaam"],
      rows: [
        ["**Depositor**", "Aik asset deposit karta hai aur shares hold karta hai."],
        ["**Curator**", "Vault ko design/operate karta hai: strategies, fee terms aur hooks chunta hai. Curator Concrete khud ya koi partner (Royco, USDai…) ho sakta hai."],
        ["**Allocator**", "Automated role jo off-chain routing decisions ke mutabiq strategies ke darmiyan capital move karta hai."],
        ["**Withdrawal Manager**", "Automated role jo withdrawal epochs ko aage barhata hai."],
        ["**Vault Admin / managers**", "Kam-frequency wale governance roles (Vault, Strategy, Hook Manager)."],
        ["**Monitors / pausers**", "Hypernative vault addresses ko watch karta hai; ZeroShadow ke paas pehle se delegated pause mandate hota hai."],
      ],
    },
    { type: "heading", level: 2, text: "Strategy kya hoti hai" },
    { type: "p", text: "Aik **strategy** aik adapter hai jo aik vault aur aik underlying asset se bandha hota hai. Vault us se sirf teen cheezein poochta hai: *aapki current value kya hai?*, *yeh assets le lein*, *yeh assets wapas dein*. Venue se mutaliq har cheez strategy ke andar hoti hai." },
    { type: "p", text: "Developer docs mein bayan ki gayi strategy types:" },
    {
      type: "table",
      headers: ["Strategy", "Idea", "Accounting"],
      rows: [
        ["**Idle**", "Assets ko bina yield dhoondhe hold karti hai (liquidity buffer).", "On-chain"],
        ["**Lending**", "Assets ko lending markets mein supply karti hai (audit history mein Morpho integrations shamil hain).", "On-chain (position state se compute hota hai)"],
        ["**Looping**", "Flash-loan se chalne wale leveraged loops, jo badle ja saknay wale *lender*, *flash* aur *swap* modules se bantay hain.", "On-chain"],
        ["**MultisigStrategy**", "Assets ko custodied/off-chain execution ke liye multisig (Gnosis Safe) ya MPC wallet (Fordefi) ko forward karti hai; value operator on-chain report karta hai.", "**Asynchronous** (validity window ke andar signed value push hoti hai)"],
        ["**Curve / Pendle**", "LP / yield-token venues ke liye audited strategy family.", "Mukhtalif"],
      ],
    },
    { type: "p", text: "Aik vault aik saath kai strategies rakh sakta hai, mas. aik conservative lending strategy + aik looping strategy + aik custodied multisig strategy. User ko phir bhi aik share token aur aik yield curve nazar aati hai." },
    { type: "heading", level: 2, text: "\"Asynchronous accounting\" kyun important hai" },
    { type: "p", text: "Custodied positions ki asal value chain nahi dekh sakti. Operator ko configured `accountingValidityPeriod` ke andar **signed valuation push** karni hoti hai. On-chain rails yeh bound karte hain ke value aik baar mein kitni jump kar sakti hai (change threshold, cooldown, validity window). Agar push late ho jaye to strategy ka value function revert ho jata hai aur vault **deposits, withdrawals aur epoch processing rok deta hai**, jab tak admin unpause/adjust na kare ya strategy ko inactive toggle na kiya jaye. Yeh aik haqeeqi operational dependency hai - off-chain venues tak pahunchne ki yehi qeemat hai." },
    { type: "heading", level: 2, text: "Vault cards par nazar aane wale custody model ke examples" },
    {
      type: "ul",
      items: [
        "**Fireblocks** custody (WBTC, Frontier).",
        "**Fordefi** policy-controlled MPC wallet (Concrete DeFi USDT): approved signers aur har on-chain action ke liye enforced transaction rules.",
        "**Partner custody** (Royco vaults: \"see Royco\").",
      ],
    },
    { type: "heading", level: 2, text: "Curator ko evaluate karna (checklist)" },
    {
      type: "ol",
      items: [
        "Exact strategies aur venues kaunse hain? Kya transparency panel hai? (24 ghantay delayed data.)",
        "Accounting on-chain hai ya operator-pushed?",
        "Kaun se roles kis ke paas hain - kya woh alag alag hain?",
        "Audit reports code ke *is version* ko cover karti hain?",
        "Stress mein exit path kya hai (queue length, caps, cooldown)?",
      ],
    },
  ],

  hi: [
    { type: "quote", text: "**स्तर:** मध्यम" },
    { type: "heading", level: 2, text: "Roles आसान भाषा में" },
    {
      type: "table",
      headers: ["Actor", "काम"],
      rows: [
        ["**Depositor**", "एक asset जमा करता है और shares hold करता है।"],
        ["**Curator**", "Vault को design/operate करता है: strategies, fee terms और hooks चुनता है। Curator Concrete खुद या कोई partner (Royco, USDai…) हो सकता है।"],
        ["**Allocator**", "Automated role जो off-chain routing decisions के अनुसार strategies के बीच capital move करता है।"],
        ["**Withdrawal Manager**", "Automated role जो withdrawal epochs को आगे बढ़ाता है।"],
        ["**Vault Admin / managers**", "कम-frequency वाले governance roles (Vault, Strategy, Hook Manager)।"],
        ["**Monitors / pausers**", "Hypernative vault addresses पर नज़र रखता है; ZeroShadow के पास पहले से delegated pause mandate होता है।"],
      ],
    },
    { type: "heading", level: 2, text: "Strategy क्या होती है" },
    { type: "p", text: "एक **strategy** एक adapter है जो एक vault और एक underlying asset से बंधा होता है। Vault उससे सिर्फ़ तीन चीज़ें पूछता है: *तुम्हारी current value क्या है?*, *ये assets ले लो*, *ये assets वापस दो*। Venue से जुड़ी हर चीज़ strategy के अंदर रहती है।" },
    { type: "p", text: "Developer docs में बताई गई strategy types:" },
    {
      type: "table",
      headers: ["Strategy", "Idea", "Accounting"],
      rows: [
        ["**Idle**", "Assets को बिना yield ढूँढे hold करती है (liquidity buffer)।", "On-chain"],
        ["**Lending**", "Assets को lending markets में supply करती है (audit history में Morpho integrations शामिल हैं)।", "On-chain (position state से compute होता है)"],
        ["**Looping**", "Flash-loan से चलने वाले leveraged loops, जो बदले जा सकने वाले *lender*, *flash* और *swap* modules से बनते हैं।", "On-chain"],
        ["**MultisigStrategy**", "Assets को custodied/off-chain execution के लिए multisig (Gnosis Safe) या MPC wallet (Fordefi) को forward करती है; value operator द्वारा on-chain report की जाती है।", "**Asynchronous** (validity window के अंदर signed value push होती है)"],
        ["**Curve / Pendle**", "LP / yield-token venues के लिए audited strategy family।", "अलग-अलग"],
      ],
    },
    { type: "p", text: "एक vault एक साथ कई strategies रख सकता है, जैसे एक conservative lending strategy + एक looping strategy + एक custodied multisig strategy। User को फिर भी एक share token और एक yield curve दिखती है।" },
    { type: "heading", level: 2, text: "\"Asynchronous accounting\" क्यों मायने रखती है" },
    { type: "p", text: "Custodied positions की असली value chain नहीं देख सकती। Operator को configured `accountingValidityPeriod` के अंदर **signed valuation push** करनी होती है। On-chain rails यह सीमित करते हैं कि value एक बार में कितनी jump कर सकती है (change threshold, cooldown, validity window)। अगर push देर से हो तो strategy का value function revert हो जाता है और vault **deposits, withdrawals और epoch processing रोक देता है**, जब तक admin unpause/adjust न करे या strategy को inactive toggle न किया जाए। यह एक असली operational dependency है - off-chain venues तक पहुँचने की यही कीमत है।" },
    { type: "heading", level: 2, text: "Vault cards पर दिखने वाले custody model के उदाहरण" },
    {
      type: "ul",
      items: [
        "**Fireblocks** custody (WBTC, Frontier)।",
        "**Fordefi** policy-controlled MPC wallet (Concrete DeFi USDT): approved signers और हर on-chain action के लिए enforced transaction rules।",
        "**Partner custody** (Royco vaults: \"see Royco\")।",
      ],
    },
    { type: "heading", level: 2, text: "Curator को evaluate करना (checklist)" },
    {
      type: "ol",
      items: [
        "Exact strategies और venues कौन से हैं? क्या transparency panel है? (24 घंटे delayed data।)",
        "Accounting on-chain है या operator-pushed?",
        "कौन से roles किसके पास हैं - क्या वे अलग-अलग हैं?",
        "Audit reports code के *इस version* को cover करती हैं?",
        "Stress में exit path क्या है (queue length, caps, cooldown)?",
      ],
    },
  ],

  pcm: [
    { type: "quote", text: "**Level:** Intermediate" },
    { type: "heading", level: 2, text: "Roles for simple language" },
    {
      type: "table",
      headers: ["Actor", "Wetin e dey do"],
      rows: [
        ["**Depositor**", "E dey put one asset and hold shares."],
        ["**Curator**", "E dey design/run di vault: e dey pick strategies, fee terms, hooks. Curator fit be Concrete or partner (Royco, USDai…)."],
        ["**Allocator**", "Automated role wey dey move capital between strategies based on off-chain routing decisions."],
        ["**Withdrawal Manager**", "Automated role wey dey move withdrawal epochs go front."],
        ["**Vault Admin / managers**", "Governance roles wey dem no dey use plenty (Vault, Strategy, Hook Manager)."],
        ["**Monitors / pausers**", "Hypernative dey watch vault addresses; ZeroShadow get pause mandate wey dem don delegate before."],
      ],
    },
    { type: "heading", level: 2, text: "Wetin strategy be" },
    { type: "p", text: "**Strategy** na adapter wey tie to one vault and one underlying asset. Di vault only dey ask am three things: *wetin be your current value?*, *collect dis assets*, *give dis assets back*. Everything wey concern di venue dey inside di strategy." },
    { type: "p", text: "Strategy types wey developer docs describe:" },
    {
      type: "table",
      headers: ["Strategy", "Idea", "Accounting"],
      rows: [
        ["**Idle**", "E dey hold assets without wanting yield (liquidity buffer).", "On-chain"],
        ["**Lending**", "E dey supply assets to lending markets (audit history include Morpho integrations).", "On-chain (dem compute am from position state)"],
        ["**Looping**", "Leveraged loops wey flash-loan dey drive, dem build am from *lender*, *flash* and *swap* modules wey you fit swap.", "On-chain"],
        ["**MultisigStrategy**", "E dey forward assets go multisig (Gnosis Safe) or MPC wallet (Fordefi) for custodied/off-chain execution; operator dey report di value back on-chain.", "**Asynchronous** (dem dey push signed value inside validity window)"],
        ["**Curve / Pendle**", "Audited strategy family for LP / yield-token venues.", "E dey vary"],
      ],
    },
    { type: "p", text: "One vault fit hold plenty strategies at di same time, e.g. one conservative lending strategy + one looping strategy + one custodied multisig strategy. Di user still go see one share token wit one yield curve." },
    { type: "heading", level: 2, text: "Why \"asynchronous accounting\" matter" },
    { type: "p", text: "For custodied positions, di chain no fit see di real value. Operator must **push signed valuation** inside di `accountingValidityPeriod` wey dem configure. On-chain rails dey limit how far value fit jump (change threshold, cooldown, validity window). If di push late, di strategy value function go revert and di vault go **halt deposits, withdrawals and epoch processing** until admin unpause/adjust or dem toggle di strategy to inactive. Dis one na real operational dependency - na di price wey you pay to reach off-chain venues." },
    { type: "heading", level: 2, text: "Custody model examples wey dem show for vault cards" },
    {
      type: "ul",
      items: [
        "**Fireblocks** custody (WBTC, Frontier).",
        "**Fordefi** policy-controlled MPC wallet (Concrete DeFi USDT): approved signers plus transaction rules wey dem enforce for every on-chain action.",
        "**Partner custody** (Royco vaults: \"see Royco\").",
      ],
    },
    { type: "heading", level: 2, text: "How to check curator (checklist)" },
    {
      type: "ol",
      items: [
        "Which exact strategies and venues dem dey use? Transparency panel dey? (24 h delayed data.)",
        "Accounting dey on-chain or na operator dey push am?",
        "Who hold which roles - dem separate dem?",
        "Which audit reports cover *dis version* of di code?",
        "Wetin be di exit path when pressure dey (queue length, caps, cooldown)?",
      ],
    },
  ],

  zh: [
    { type: "quote", text: "**级别：** 中级" },
    { type: "heading", level: 2, text: "用通俗语言看各角色" },
    {
      type: "table",
      headers: ["角色", "职责"],
      rows: [
        ["**Depositor**", "存入一种资产，持有份额。"],
        ["**Curator**", "设计/运营 vault：选择策略、费用条款和 hooks。可以是 Concrete 自己，也可以是合作伙伴（Royco、USDai…）。"],
        ["**Allocator**", "自动化角色，按照链下路由决策在各策略之间调配资金。"],
        ["**Withdrawal Manager**", "自动化角色，负责推进提现 epoch。"],
        ["**Vault Admin / managers**", "低频治理角色（Vault、Strategy、Hook Manager）。"],
        ["**Monitors / pausers**", "Hypernative 监控 vault 地址；ZeroShadow 持有预先授权的暂停权限。"],
      ],
    },
    { type: "heading", level: 2, text: "什么是策略（strategy）" },
    { type: "p", text: "**策略**是绑定到某个 vault 和某种底层资产的适配器。Vault 只向它询问三件事：*你当前的价值是多少？*、*收下这些资产*、*退还这些资产*。所有与具体场所（venue）相关的逻辑都在策略内部。" },
    { type: "p", text: "开发者文档中描述的策略类型：" },
    {
      type: "table",
      headers: ["策略", "思路", "记账方式"],
      rows: [
        ["**Idle**", "持有资产但不追求收益（流动性缓冲）。", "链上"],
        ["**Lending**", "将资产供给借贷市场（审计历史中包含 Morpho 集成）。", "链上（根据仓位状态计算）"],
        ["**Looping**", "由闪电贷驱动的杠杆循环，由可互换的 *lender*、*flash* 和 *swap* 模块构成。", "链上"],
        ["**MultisigStrategy**", "将资产转给多签（Gnosis Safe）或 MPC 钱包（Fordefi），用于托管/链下执行；价值由运营方回报到链上。", "**异步**（在有效期窗口内推送签名后的价值）"],
        ["**Curve / Pendle**", "面向 LP / 收益代币场所的已审计策略系列。", "视情况而定"],
      ],
    },
    { type: "p", text: "一个 vault 可以同时持有多个策略，例如保守型借贷策略 + looping 策略 + 托管型 multisig 策略。用户看到的仍然是一种份额代币和一条收益曲线。" },
    { type: "heading", level: 2, text: "为什么“异步记账”很重要" },
    { type: "p", text: "对于托管仓位，链上无法看到真实价值。运营方必须在配置的 `accountingValidityPeriod` 内**推送签名后的估值**。链上护栏会限制价值单次可以跳动的幅度（变动阈值、冷却期、有效期窗口）。如果推送延迟，策略的价值函数会 revert，vault 将**暂停存款、提现和 epoch 处理**，直到管理员取消暂停/调整参数，或该策略被设为非活跃。这是真实存在的运营依赖——是接入链下场所所付出的代价。" },
    { type: "heading", level: 2, text: "vault 卡片上出现的托管模式示例" },
    {
      type: "ul",
      items: [
        "**Fireblocks** 托管（WBTC、Frontier）。",
        "**Fordefi** 受策略控制的 MPC 钱包（Concrete DeFi USDT）：经批准的签名人，加上对每一次链上操作强制执行的交易规则。",
        "**合作伙伴托管**（Royco vault：“见 Royco”）。",
      ],
    },
    { type: "heading", level: 2, text: "评估 curator 的清单" },
    {
      type: "ol",
      items: [
        "具体使用了哪些策略和场所？是否有透明度面板？（数据延迟 24 小时。）",
        "记账是在链上完成，还是由运营方推送？",
        "谁持有哪些角色——这些角色是否相互分离？",
        "审计报告覆盖的是代码的*这个版本*吗？",
        "压力情况下的退出路径是什么（队列长度、上限、冷静期）？",
      ],
    },
  ],

  id: [
    { type: "quote", text: "**Level:** Menengah" },
    { type: "heading", level: 2, text: "Peran dalam bahasa sederhana" },
    {
      type: "table",
      headers: ["Aktor", "Tugas"],
      rows: [
        ["**Depositor**", "Menyetor satu aset dan memegang shares."],
        ["**Curator**", "Merancang/menjalankan vault: memilih strategi, ketentuan fee, dan hooks. Bisa Concrete sendiri atau partner (Royco, USDai…)."],
        ["**Allocator**", "Peran otomatis yang memindahkan modal antar strategi sesuai keputusan routing off-chain."],
        ["**Withdrawal Manager**", "Peran otomatis yang memajukan epoch penarikan."],
        ["**Vault Admin / managers**", "Peran governance berfrekuensi rendah (Vault, Strategy, Hook Manager)."],
        ["**Monitors / pausers**", "Hypernative memantau alamat vault; ZeroShadow memegang mandat pause yang sudah didelegasikan sebelumnya."],
      ],
    },
    { type: "heading", level: 2, text: "Apa itu strategi" },
    { type: "p", text: "**Strategi** adalah adapter yang terikat pada satu vault dan satu aset dasar. Vault hanya menanyakan tiga hal kepadanya: *berapa nilai Anda saat ini?*, *terima aset ini*, *kembalikan aset ini*. Semua hal yang spesifik terhadap venue ada di dalam strategi." },
    { type: "p", text: "Jenis strategi yang dijelaskan di developer docs:" },
    {
      type: "table",
      headers: ["Strategi", "Ide", "Akuntansi"],
      rows: [
        ["**Idle**", "Menyimpan aset tanpa mengejar yield (buffer likuiditas).", "On-chain"],
        ["**Lending**", "Menyalurkan aset ke lending market (riwayat audit mencakup integrasi Morpho).", "On-chain (dihitung dari status posisi)"],
        ["**Looping**", "Loop berleverage berbasis flash-loan, dibangun dari modul *lender*, *flash*, dan *swap* yang dapat dipertukarkan.", "On-chain"],
        ["**MultisigStrategy**", "Meneruskan aset ke multisig (Gnosis Safe) atau wallet MPC (Fordefi) untuk eksekusi custodied/off-chain; nilainya dilaporkan kembali on-chain oleh operator.", "**Asinkron** (nilai bertanda tangan didorong dalam validity window)"],
        ["**Curve / Pendle**", "Keluarga strategi yang sudah diaudit untuk venue LP / yield-token.", "Bervariasi"],
      ],
    },
    { type: "p", text: "Satu vault dapat memegang beberapa strategi sekaligus, misalnya strategi lending konservatif + strategi looping + strategi multisig custodied. Pengguna tetap melihat satu share token dengan satu kurva yield." },
    { type: "heading", level: 2, text: "Mengapa \"akuntansi asinkron\" penting" },
    { type: "p", text: "Untuk posisi custodied, chain tidak bisa melihat nilai sebenarnya. Operator harus **mendorong valuasi bertanda tangan** dalam `accountingValidityPeriod` yang dikonfigurasi. Pengaman on-chain membatasi seberapa jauh nilai bisa melonjak (change threshold, cooldown, validity window). Jika push terlambat, fungsi nilai strategi akan revert dan vault **menghentikan deposit, penarikan, dan pemrosesan epoch** sampai admin melakukan unpause/penyesuaian atau strategi dinonaktifkan. Ini ketergantungan operasional yang nyata - harga yang harus dibayar untuk mengakses venue off-chain." },
    { type: "heading", level: 2, text: "Contoh model custody yang terlihat di kartu vault" },
    {
      type: "ul",
      items: [
        "Custody **Fireblocks** (WBTC, Frontier).",
        "Wallet MPC **Fordefi** yang dikendalikan kebijakan (Concrete DeFi USDT): signer yang disetujui plus aturan transaksi yang ditegakkan untuk setiap aksi on-chain.",
        "**Custody partner** (vault Royco: \"see Royco\").",
      ],
    },
    { type: "heading", level: 2, text: "Mengevaluasi curator (checklist)" },
    {
      type: "ol",
      items: [
        "Apa saja strategi dan venue-nya secara tepat? Apakah ada panel transparansi? (Data tertunda 24 jam.)",
        "Apakah akuntansinya on-chain atau didorong operator?",
        "Siapa memegang peran apa - apakah dipisahkan?",
        "Apakah laporan audit mencakup *versi kode ini*?",
        "Bagaimana jalur keluar saat kondisi tertekan (panjang antrean, cap, cooldown)?",
      ],
    },
  ],
};
