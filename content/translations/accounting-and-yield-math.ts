import type { DocBlock } from "../docs.generated";
import type { Locale } from "@/lib/i18n";

// Full translation of docs/03-advanced/02-accounting-and-yield-math.md.
// Formulas, code identifiers and the diagrams are left as in the English source.
export const accountingAndYieldMath: Partial<Record<Locale, DocBlock[]>> = {
  ur: [
  {
    type: "quote",
    text: "**Level:** Advanced · Neeche diye gaye models samajhne ke liye hain. Exact contract math private hai; asal values ke liye on-chain `preview*`/`convert*` use karein."
  },
  {
    type: "heading",
    level: 2,
    text: "Core identities"
  },
  {
    type: "code",
    lang: "",
    code: "sharePrice   = totalAssets / totalSupply\nsharesOut    = assets × (totalSupply + 1) / (totalAssets + 1)      // deposit, floor\nassetsOut    = shares × (totalAssets + 1) / (totalSupply + 1)      // redeem, floor"
  },
  {
    type: "p",
    text: "Rounding hamesha vault ke favour mein floor hoti hai, is liye deposit→redeem round trip aapko kabhi bhi utne se *zyada* wapis nahi de sakta jitna aap ne dala tha (`examples/python` mein aik unit test se verify kiya gaya hai)."
  },
  {
    type: "heading",
    level: 2,
    text: "Accrual algorithm (documented order)"
  },
  {
    type: "p",
    text: "Har `deposit / mint / withdraw / redeem / allocate` par:"
  },
  {
    type: "ol",
    items: [
      "Har active strategy ke liye `totalAllocatedValue()` read ki jati hai aur last recorded value se diff nikala jata hai → yield (+) ya loss (−).",
      "**cachedTotalAssets** ko update kiya jata hai.",
      "Updated assets par **management fee** accrue hoti hai, guzre huye waqt ke hisab se pro-rata.",
      "**Net positive** yield (gains − losses) par **performance fee** accrue hoti hai, kisi bhi **hurdle** ke tabe.",
      "Reconciled price par user ki operation execute ki jati hai."
    ]
  },
  {
    type: "heading",
    level: 2,
    text: "Cached snapshot kyun? Donation/inflation attacks"
  },
  {
    type: "p",
    text: "Classic ERC-4626 attack: attacker chhota sa amount deposit karta hai, phir tokens seedha vault ko **donate** kar deta hai taake `totalAssets` inflate ho jaye, jis se agle depositor ki shares round ho kar zero ho jati hain. Concrete ki defences (documented ke mutabiq): (1) guarded operations ke andar conversions **cached** total use karti hain, jo controlled tareeqe se refresh hoti hai; (2) share formula mein **+1 virtual** terms; (3) conversion se pehle accrual."
  },
  {
    type: "heading",
    level: 2,
    text: "Dilution ke tor par Fees"
  },
  {
    type: "p",
    text: "`F` assets ki fee pay karne ke liye, vault recipient ko `s` naye shares mint karta hai taake unka claim `F` ke barabar ho:"
  },
  {
    type: "code",
    lang: "",
    code: "s / (supply + s) × totalAssets = F   ⇒   s = F × supply / (totalAssets − F)"
  },
  {
    type: "p",
    text: "Har doosra holder proportionally dilute hota hai. `examples/python/fee_dilution_model.py` dekhein."
  },
  {
    type: "heading",
    level: 3,
    text: "Hurdle rates"
  },
  {
    type: "p",
    text: "`perfFee = perfRate × max(0, yield − hurdle)`, jahan hurdle aik fixed **APY** (compound hoti hai), fixed **APR** (simple), ya kisi external benchmark ko track karne wali **dynamic** rate ho sakti hai. Hurdle tak ka yield mukammal tor par depositors ko jata hai."
  },
  {
    type: "heading",
    level: 2,
    text: "APR ↔ APY"
  },
  {
    type: "code",
    lang: "",
    code: "APY = (1 + APR/n)^n − 1        (n = compounding periods per year)"
  },
  {
    type: "p",
    text: "8% APR, daily compounding → 8.328% APY."
  },
  {
    type: "heading",
    level: 2,
    text: "Losses aur marks"
  },
  {
    type: "p",
    text: "Async accounting ke sath, aik operator loss ya unwind cost ke baad **reported total assets ko kam** kar sakta hai (`adjustTotalAssets`-style flow); agla accrual strategy ki tracked value ko reconcile karta hai. Sab holders exchange rate ke zariye pro rata loss uthate hain."
  },
  {
    type: "heading",
    level: 2,
    text: "Async accounting timeline"
  },
  {
    type: "code",
    lang: "",
    code: "t0  operator pushes signed valuation V0 (valid for accountingValidityPeriod)\nt1  users deposit/withdraw → vault reads V0 → OK\nt2  validity window expires with no new push → strategy value reverts → vault halts\nt3  admin unpauseAndAdjustTotalAssets OR strategy toggled inactive → resumes"
  },
  {
    type: "heading",
    level: 2,
    text: "Khud numbers reconcile karna"
  },
  {
    type: "table",
    headers: [
      "Question",
      "How"
    ],
    rows: [
      [
        "Current share price",
        "Vault par `convertToAssets(10**decimals)`, ya subgraph `Vault.sharePrice`"
      ],
      [
        "Historical price",
        "subgraph `vaultStats(interval: day)`"
      ],
      [
        "Ab tak paid fees",
        "subgraph `vaultFeesStats` cumulative fields"
      ],
      [
        "Strategy allocation",
        "subgraph `Strategy.allocatedValue` ya on-chain `totalAllocatedValue()`"
      ]
    ]
  }
],

  hi: [
  {
    type: "quote",
    text: "**स्तर:** Advanced · नीचे दिए गए models समझने के लिए हैं। Exact contract math private है; असल values के लिए on-chain `preview*`/`convert*` use करें।"
  },
  {
    type: "heading",
    level: 2,
    text: "Core identities"
  },
  {
    type: "code",
    lang: "",
    code: "sharePrice   = totalAssets / totalSupply\nsharesOut    = assets × (totalSupply + 1) / (totalAssets + 1)      // deposit, floor\nassetsOut    = shares × (totalAssets + 1) / (totalSupply + 1)      // redeem, floor"
  },
  {
    type: "p",
    text: "Rounding हमेशा vault के favour में floor होती है, इसलिए deposit→redeem round trip आपको कभी भी उतने से *ज़्यादा* वापस नहीं दे सकता जितना आपने डाला था (`examples/python` में एक unit test से verify किया गया है)।"
  },
  {
    type: "heading",
    level: 2,
    text: "Accrual algorithm (documented order)"
  },
  {
    type: "p",
    text: "हर `deposit / mint / withdraw / redeem / allocate` पर:"
  },
  {
    type: "ol",
    items: [
      "हर active strategy के लिए `totalAllocatedValue()` read की जाती है और last recorded value से diff निकाला जाता है → yield (+) या loss (−)।",
      "**cachedTotalAssets** को update किया जाता है।",
      "Updated assets पर **management fee** accrue होती है, गुज़रे हुए वक़्त के हिसाब से pro-rata।",
      "**Net positive** yield (gains − losses) पर **performance fee** accrue होती है, किसी भी **hurdle** के ताबे।",
      "Reconciled price पर user की operation execute की जाती है।"
    ]
  },
  {
    type: "heading",
    level: 2,
    text: "Cached snapshot क्यों? Donation/inflation attacks"
  },
  {
    type: "p",
    text: "Classic ERC-4626 attack: attacker छोटा सा amount deposit करता है, फिर tokens सीधा vault को **donate** कर देता है ताकि `totalAssets` inflate हो जाए, जिससे अगले depositor की shares round हो कर zero हो जाती हैं। Concrete की defences (documented के मुताबिक): (1) guarded operations के अंदर conversions **cached** total use करती हैं, जो controlled तरीक़े से refresh होती है; (2) share formula में **+1 virtual** terms; (3) conversion से पहले accrual।"
  },
  {
    type: "heading",
    level: 2,
    text: "Dilution के तौर पर Fees"
  },
  {
    type: "p",
    text: "`F` assets की fee pay करने के लिए, vault recipient को `s` नए shares mint करता है ताकि उनका claim `F` के बराबर हो:"
  },
  {
    type: "code",
    lang: "",
    code: "s / (supply + s) × totalAssets = F   ⇒   s = F × supply / (totalAssets − F)"
  },
  {
    type: "p",
    text: "हर दूसरा holder proportionally dilute होता है। `examples/python/fee_dilution_model.py` देखें।"
  },
  {
    type: "heading",
    level: 3,
    text: "Hurdle rates"
  },
  {
    type: "p",
    text: "`perfFee = perfRate × max(0, yield − hurdle)`, जहाँ hurdle एक fixed **APY** (compound होती है), fixed **APR** (simple), या किसी external benchmark को track करने वाली **dynamic** rate हो सकती है। Hurdle तक का yield मुकम्मल तौर पर depositors को जाता है।"
  },
  {
    type: "heading",
    level: 2,
    text: "APR ↔ APY"
  },
  {
    type: "code",
    lang: "",
    code: "APY = (1 + APR/n)^n − 1        (n = compounding periods per year)"
  },
  {
    type: "p",
    text: "8% APR, daily compounding → 8.328% APY।"
  },
  {
    type: "heading",
    level: 2,
    text: "Losses और marks"
  },
  {
    type: "p",
    text: "Async accounting के साथ, एक operator loss या unwind cost के बाद **reported total assets को कम** कर सकता है (`adjustTotalAssets`-style flow); अगला accrual strategy की tracked value को reconcile करता है। सब holders exchange rate के ज़रिए pro rata loss उठाते हैं।"
  },
  {
    type: "heading",
    level: 2,
    text: "Async accounting timeline"
  },
  {
    type: "code",
    lang: "",
    code: "t0  operator pushes signed valuation V0 (valid for accountingValidityPeriod)\nt1  users deposit/withdraw → vault reads V0 → OK\nt2  validity window expires with no new push → strategy value reverts → vault halts\nt3  admin unpauseAndAdjustTotalAssets OR strategy toggled inactive → resumes"
  },
  {
    type: "heading",
    level: 2,
    text: "ख़ुद numbers reconcile करना"
  },
  {
    type: "table",
    headers: [
      "Question",
      "How"
    ],
    rows: [
      [
        "Current share price",
        "Vault पर `convertToAssets(10**decimals)`, या subgraph `Vault.sharePrice`"
      ],
      [
        "Historical price",
        "subgraph `vaultStats(interval: day)`"
      ],
      [
        "अब तक paid fees",
        "subgraph `vaultFeesStats` cumulative fields"
      ],
      [
        "Strategy allocation",
        "subgraph `Strategy.allocatedValue` या on-chain `totalAllocatedValue()`"
      ]
    ]
  }
],

  pcm: [
  {
    type: "quote",
    text: "**Level:** Advanced · Di models wey dey below na for understanding. Di exact contract math dey private; use on-chain `preview*`/`convert*` for real values."
  },
  {
    type: "heading",
    level: 2,
    text: "Core identities"
  },
  {
    type: "code",
    lang: "",
    code: "sharePrice   = totalAssets / totalSupply\nsharesOut    = assets × (totalSupply + 1) / (totalAssets + 1)      // deposit, floor\nassetsOut    = shares × (totalAssets + 1) / (totalSupply + 1)      // redeem, floor"
  },
  {
    type: "p",
    text: "Rounding always dey floor for vault side, so deposit→redeem round trip no fit return *more* pass wetin you put inside (unit test dey `examples/python` confirm am)."
  },
  {
    type: "heading",
    level: 2,
    text: "Accrual algorithm (documented order)"
  },
  {
    type: "p",
    text: "For every `deposit / mint / withdraw / redeem / allocate`:"
  },
  {
    type: "ol",
    items: [
      "For each active strategy, read `totalAllocatedValue()` and diff am against last recorded value → yield (+) or loss (−).",
      "Update **cachedTotalAssets**.",
      "Dem accrue **management fee** on updated assets, pro-rata to di time wey don pass.",
      "Dem accrue **performance fee** on **net positive** yield (gains − losses), subject to any **hurdle**.",
      "Execute di user operation at di reconciled price."
    ]
  },
  {
    type: "heading",
    level: 2,
    text: "Why cached snapshot? Donation / inflation attacks"
  },
  {
    type: "p",
    text: "Classic ERC-4626 attack: attacker go deposit small amount, den e go **donate** tokens directly go di vault to inflate `totalAssets`, wey go make next depositor shares round go zero. Concrete defences (as dem document am): (1) conversions inside guarded operations dey use **cached** total, wey dem dey refresh in controlled way; (2) di **+1 virtual** terms for di share formula; (3) accrual before conversion."
  },
  {
    type: "heading",
    level: 2,
    text: "Fees as dilution"
  },
  {
    type: "p",
    text: "To pay fee wey worth `F` assets, di vault go mint `s` new shares give di recipient so dat dia claim go equal `F`:"
  },
  {
    type: "code",
    lang: "",
    code: "s / (supply + s) × totalAssets = F   ⇒   s = F × supply / (totalAssets − F)"
  },
  {
    type: "p",
    text: "Every other holder go dilute proportionally. Check `examples/python/fee_dilution_model.py`."
  },
  {
    type: "heading",
    level: 3,
    text: "Hurdle rates"
  },
  {
    type: "p",
    text: "`perfFee = perfRate × max(0, yield − hurdle)`, where di hurdle fit be fixed **APY** (e dey compound), fixed **APR** (simple), or **dynamic** rate wey dey track external benchmark. Yield wey reach hurdle dey go straight to depositors."
  },
  {
    type: "heading",
    level: 2,
    text: "APR ↔ APY"
  },
  {
    type: "code",
    lang: "",
    code: "APY = (1 + APR/n)^n − 1        (n = compounding periods per year)"
  },
  {
    type: "p",
    text: "8% APR, daily compounding → 8.328% APY."
  },
  {
    type: "heading",
    level: 2,
    text: "Losses & marks"
  },
  {
    type: "p",
    text: "With async accounting, operator fit **reduce di reported total assets** (`adjustTotalAssets`-style flow) after loss or unwind cost; di next accrual go reconcile di strategy tracked value. All holders go take di loss pro rata through di exchange rate."
  },
  {
    type: "heading",
    level: 2,
    text: "Async accounting timeline"
  },
  {
    type: "code",
    lang: "",
    code: "t0  operator pushes signed valuation V0 (valid for accountingValidityPeriod)\nt1  users deposit/withdraw → vault reads V0 → OK\nt2  validity window expires with no new push → strategy value reverts → vault halts\nt3  admin unpauseAndAdjustTotalAssets OR strategy toggled inactive → resumes"
  },
  {
    type: "heading",
    level: 2,
    text: "How to reconcile di numbers yourself"
  },
  {
    type: "table",
    headers: [
      "Question",
      "How"
    ],
    rows: [
      [
        "Current share price",
        "`convertToAssets(10**decimals)` for di vault, or subgraph `Vault.sharePrice`"
      ],
      [
        "Historical price",
        "subgraph `vaultStats(interval: day)`"
      ],
      [
        "Fees wey don pay so far",
        "subgraph `vaultFeesStats` cumulative fields"
      ],
      [
        "Strategy allocation",
        "subgraph `Strategy.allocatedValue` or on-chain `totalAllocatedValue()`"
      ]
    ]
  }
],

  zh: [
  {
    type: "quote",
    text: "**级别：** 高级 · 以下模型仅用于理解概念。精确的合约数学逻辑是私有的；请使用链上 `preview*`/`convert*` 方法获取真实数值。"
  },
  {
    type: "heading",
    level: 2,
    text: "核心公式"
  },
  {
    type: "code",
    lang: "",
    code: "sharePrice   = totalAssets / totalSupply\nsharesOut    = assets × (totalSupply + 1) / (totalAssets + 1)      // deposit, floor\nassetsOut    = shares × (totalAssets + 1) / (totalSupply + 1)      // redeem, floor"
  },
  {
    type: "p",
    text: "四舍五入始终向下取整，且偏向 vault 一方，因此一次存款→赎回的往返操作永远不会让你拿回比存入时*更多*的资产（`examples/python` 中的单元测试已验证这一点）。"
  },
  {
    type: "heading",
    level: 2,
    text: "计提算法（文档记录的执行顺序）"
  },
  {
    type: "p",
    text: "在每次 `deposit / mint / withdraw / redeem / allocate` 时："
  },
  {
    type: "ol",
    items: [
      "对每个活跃策略读取 `totalAllocatedValue()`，并与上次记录的值做差值 → 得出收益（+）或亏损（−）。",
      "更新 **cachedTotalAssets**。",
      "在更新后的资产上计提**管理费**，按已经过的时间比例分摊。",
      "在**净正收益**（收益 − 亏损）上计提**业绩费**，需受任何 **hurdle**（门槛收益率）限制。",
      "以对账后的价格执行用户的操作。"
    ]
  },
  {
    type: "heading",
    level: 2,
    text: "为什么要用缓存快照？捐赠/通胀攻击"
  },
  {
    type: "p",
    text: "经典 ERC-4626 攻击手法：攻击者先存入极少量资金，然后直接向 vault **捐赠**代币以抬高 `totalAssets`，导致下一位存款人的份额被四舍五入为零。Concrete 记录在案的防御措施：（1）受保护操作内的换算使用**缓存**总额，并以受控方式刷新；（2）份额公式中的 **+1 虚拟**项；（3）先计提再换算。"
  },
  {
    type: "heading",
    level: 2,
    text: "费用即稀释"
  },
  {
    type: "p",
    text: "为了支付价值 `F` 资产的费用，vault 会向接收方铸造 `s` 份新份额，使其索取权恰好等于 `F`："
  },
  {
    type: "code",
    lang: "",
    code: "s / (supply + s) × totalAssets = F   ⇒   s = F × supply / (totalAssets − F)"
  },
  {
    type: "p",
    text: "其他所有持有人都会按比例被稀释。参见 `examples/python/fee_dilution_model.py`。"
  },
  {
    type: "heading",
    level: 3,
    text: "Hurdle 门槛利率"
  },
  {
    type: "p",
    text: "`perfFee = perfRate × max(0, yield − hurdle)`，其中 hurdle 可以是固定的 **APY**（复利）、固定的 **APR**（单利），或追踪外部基准的**动态**利率。低于 hurdle 的收益全部归存款人所有。"
  },
  {
    type: "heading",
    level: 2,
    text: "APR ↔ APY 换算"
  },
  {
    type: "code",
    lang: "",
    code: "APY = (1 + APR/n)^n − 1        (n = compounding periods per year)"
  },
  {
    type: "p",
    text: "8% APR，按日复利 → 8.328% APY。"
  },
  {
    type: "heading",
    level: 2,
    text: "亏损与估值标记"
  },
  {
    type: "p",
    text: "在异步记账模式下，运营方可以在发生亏损或平仓成本后**下调上报的总资产**（类似 `adjustTotalAssets` 的流程）；下一次计提会对账策略的跟踪价值。所有持有人都会通过汇率按比例承担亏损。"
  },
  {
    type: "heading",
    level: 2,
    text: "异步记账时间线"
  },
  {
    type: "code",
    lang: "",
    code: "t0  operator pushes signed valuation V0 (valid for accountingValidityPeriod)\nt1  users deposit/withdraw → vault reads V0 → OK\nt2  validity window expires with no new push → strategy value reverts → vault halts\nt3  admin unpauseAndAdjustTotalAssets OR strategy toggled inactive → resumes"
  },
  {
    type: "heading",
    level: 2,
    text: "自行核对数字"
  },
  {
    type: "table",
    headers: [
      "Question",
      "How"
    ],
    rows: [
      [
        "当前份额价格",
        "vault 上的 `convertToAssets(10**decimals)`，或 subgraph 的 `Vault.sharePrice`"
      ],
      [
        "历史价格",
        "subgraph 的 `vaultStats(interval: day)`"
      ],
      [
        "累计已支付费用",
        "subgraph 的 `vaultFeesStats` 累计字段"
      ],
      [
        "策略分配情况",
        "subgraph 的 `Strategy.allocatedValue` 或链上的 `totalAllocatedValue()`"
      ]
    ]
  }
],

  id: [
  {
    type: "quote",
    text: "**Level:** Lanjutan · Model di bawah ini untuk pemahaman konsep. Matematika kontrak yang tepat bersifat privat; gunakan `preview*`/`convert*` on-chain untuk nilai sebenarnya."
  },
  {
    type: "heading",
    level: 2,
    text: "Identitas inti"
  },
  {
    type: "code",
    lang: "",
    code: "sharePrice   = totalAssets / totalSupply\nsharesOut    = assets × (totalSupply + 1) / (totalAssets + 1)      // deposit, floor\nassetsOut    = shares × (totalAssets + 1) / (totalSupply + 1)      // redeem, floor"
  },
  {
    type: "p",
    text: "Pembulatan selalu di-floor (dibulatkan ke bawah) demi keuntungan vault, sehingga siklus deposit→redeem tidak akan pernah mengembalikan *lebih* dari yang Anda masukkan (diverifikasi lewat unit test di `examples/python`)."
  },
  {
    type: "heading",
    level: 2,
    text: "Algoritma accrual (urutan yang terdokumentasi)"
  },
  {
    type: "p",
    text: "Setiap kali `deposit / mint / withdraw / redeem / allocate`:"
  },
  {
    type: "ol",
    items: [
      "Untuk tiap strategy aktif, baca `totalAllocatedValue()` lalu bandingkan dengan nilai terakhir yang tercatat → yield (+) atau loss (−).",
      "Update **cachedTotalAssets**.",
      "Meng-accrue **management fee** dari aset yang sudah diperbarui, pro-rata sesuai waktu yang berlalu.",
      "Meng-accrue **performance fee** dari yield **net positif** (gain − loss), tunduk pada **hurdle** jika ada.",
      "Menjalankan operasi user pada harga yang sudah direkonsiliasi."
    ]
  },
  {
    type: "heading",
    level: 2,
    text: "Kenapa pakai snapshot ter-cache? Serangan donation/inflation"
  },
  {
    type: "p",
    text: "Serangan klasik ERC-4626: attacker deposit dalam jumlah sangat kecil, lalu **mendonasikan** token langsung ke vault untuk menggelembungkan `totalAssets`, sehingga shares depositor berikutnya dibulatkan menjadi nol. Pertahanan Concrete (sesuai dokumentasi): (1) konversi di dalam operasi yang dijaga memakai total **ter-cache**, yang di-refresh secara terkontrol; (2) istilah **+1 virtual** dalam rumus shares; (3) accrual dilakukan sebelum konversi."
  },
  {
    type: "heading",
    level: 2,
    text: "Fee sebagai dilusi"
  },
  {
    type: "p",
    text: "Untuk membayar fee senilai `F` aset, vault mint `s` shares baru ke penerima sehingga klaimnya setara dengan `F`:"
  },
  {
    type: "code",
    lang: "",
    code: "s / (supply + s) × totalAssets = F   ⇒   s = F × supply / (totalAssets − F)"
  },
  {
    type: "p",
    text: "Semua pemegang shares lain terdilusi secara proporsional. Lihat `examples/python/fee_dilution_model.py`."
  },
  {
    type: "heading",
    level: 3,
    text: "Hurdle rate"
  },
  {
    type: "p",
    text: "`perfFee = perfRate × max(0, yield − hurdle)`, di mana hurdle bisa berupa **APY** tetap (compound), **APR** tetap (simple), atau rate **dinamis** yang mengikuti benchmark eksternal. Yield sampai batas hurdle sepenuhnya menjadi milik depositor."
  },
  {
    type: "heading",
    level: 2,
    text: "APR ↔ APY"
  },
  {
    type: "code",
    lang: "",
    code: "APY = (1 + APR/n)^n − 1        (n = compounding periods per year)"
  },
  {
    type: "p",
    text: "8% APR, compounding harian → 8.328% APY."
  },
  {
    type: "heading",
    level: 2,
    text: "Loss & mark"
  },
  {
    type: "p",
    text: "Dengan accounting asynchronous, operator bisa **menurunkan total aset yang dilaporkan** (alur bergaya `adjustTotalAssets`) setelah terjadi loss atau biaya unwind; accrual berikutnya akan merekonsiliasi nilai yang dilacak strategy. Semua pemegang shares menanggung loss secara pro rata lewat exchange rate."
  },
  {
    type: "heading",
    level: 2,
    text: "Timeline accounting async"
  },
  {
    type: "code",
    lang: "",
    code: "t0  operator pushes signed valuation V0 (valid for accountingValidityPeriod)\nt1  users deposit/withdraw → vault reads V0 → OK\nt2  validity window expires with no new push → strategy value reverts → vault halts\nt3  admin unpauseAndAdjustTotalAssets OR strategy toggled inactive → resumes"
  },
  {
    type: "heading",
    level: 2,
    text: "Merekonsiliasi angka sendiri"
  },
  {
    type: "table",
    headers: [
      "Question",
      "How"
    ],
    rows: [
      [
        "Harga share saat ini",
        "`convertToAssets(10**decimals)` pada vault, atau subgraph `Vault.sharePrice`"
      ],
      [
        "Harga historis",
        "subgraph `vaultStats(interval: day)`"
      ],
      [
        "Fee yang sudah dibayar sejauh ini",
        "field kumulatif subgraph `vaultFeesStats`"
      ],
      [
        "Alokasi strategy",
        "subgraph `Strategy.allocatedValue` atau on-chain `totalAllocatedValue()`"
      ]
    ]
  }
],

};
