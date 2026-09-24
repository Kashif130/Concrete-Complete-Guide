import type { DocBlock } from "../docs.generated";
import type { Locale } from "@/lib/i18n";

// Full translation of docs/02-intermediate/04-campaigns-and-predeposits.md.
// Chain/vault names, code identifiers and the lifecycle diagram are left as in the English source.
export const campaignsAndPredeposits: Partial<Record<Locale, DocBlock[]>> = {
  ur: [
    { type: "quote", text: "**Level:** Intermediate" },
    { type: "heading", level: 2, text: "Pre-deposit vaults" },
    { type: "p", text: "Waqt ki hadd wale vaults jahan users **kisi nayi chain ya tokenized strategy ki initial funding** ke liye deposit karte hain. Nateeja: users ko naya issue kiya gaya token milta hai, ya woh apna deposit nayi chain par redeem kar sakte hain." },
    { type: "p", text: "**Technical shape (Predeposit implementation):**" },
    {
      type: "ol",
      items: [
        "Users **source chain** par deposit karte hain.",
        "Vault **lock** ho jata hai; assets **target chain** par bridge hotay hain.",
        "Users target chain par **LayerZero** messaging ke zariye shares **claim** karte hain (wohi wallet address).",
        "Launch ke baad, vault type ki jagah aam taur par target chain par aik *Queued Withdrawal* vault le leta hai.",
      ],
    },
    { type: "p", text: "Integrators ke liye khabardar: cross-chain claim path **hook lifecycle ko bypass karta hai**, is liye whitelist hook use gate nahi karta - curators ko alag gating chahiye." },
    { type: "p", text: "Related implementations: *Bridged Standard / Bridged Async* migrations ke liye aik one-shot `unbackedMint` add karte hain; iske liye `totalSupply() == 0` aur `maxDepositLimit == 0` zaroori hai, yani sirf seed-time par." },
    { type: "p", text: "Docs/app mein nazar aane wali mukammal examples: TAC-chain campaigns (TAC Stone, TAC LevelUSD, TAC Renzo), Stable network vaults (`ctStableUSDT`, `ctStablefrxUSD`), USDai DEX & MM (Arbitrum)." },
    { type: "heading", level: 2, text: "Campaign lifecycle" },
    {
      type: "code",
      lang: "",
      code: "Campaign live ──► end date reached ──► controlled wind-down ──► withdraw-only",
    },
    { type: "p", text: "Mukammal campaigns app mein *Completed Campaigns* ke neeche list hoti hain. Campaign khatam hone par deposits band ho jatay hain aur sirf withdraw kar saktay hain." },
    { type: "heading", level: 2, text: "Campaigns ke khaas risks" },
    {
      type: "ul",
      items: [
        "Non-stable pairs aur nayi chains impermanent-loss aur liquidity risk barhati hain.",
        "Bridging cross-chain messaging risk shamil karti hai.",
        "Reward tokens volatile ya illiquid ho saktay hain.",
      ],
    },
    { type: "p", text: "Khud launch karna chahte hain? Docs Concrete ke enterprise contact route ki taraf ishara karte hain; dekhein [Enterprise](/docs/02-intermediate/03-institutional-assetcx-enterprise)." },
  ],

  hi: [
    { type: "quote", text: "**स्तर:** मध्यम" },
    { type: "heading", level: 2, text: "Pre-deposit vaults" },
    { type: "p", text: "समय-सीमा वाले vaults जहाँ users **किसी नई chain या tokenized strategy की initial funding** के लिए deposit करते हैं। नतीजा: users को नया issue किया गया token मिलता है, या वे अपना deposit नई chain पर redeem कर सकते हैं।" },
    { type: "p", text: "**Technical shape (Predeposit implementation):**" },
    {
      type: "ol",
      items: [
        "Users **source chain** पर deposit करते हैं।",
        "Vault **lock** हो जाता है; assets **target chain** पर bridge होते हैं।",
        "Users target chain पर **LayerZero** messaging के ज़रिए shares **claim** करते हैं (वही wallet address)।",
        "Launch के बाद, इस vault type की जगह आम तौर पर target chain पर एक *Queued Withdrawal* vault ले लेता है।",
      ],
    },
    { type: "p", text: "Integrators के लिए ध्यान रहे: cross-chain claim path **hook lifecycle को bypass करता है**, इसलिए whitelist hook उसे gate नहीं करता - curators को अलग gating चाहिए।" },
    { type: "p", text: "Related implementations: *Bridged Standard / Bridged Async* migrations के लिए एक one-shot `unbackedMint` जोड़ते हैं; इसके लिए `totalSupply() == 0` और `maxDepositLimit == 0` ज़रूरी है, यानी सिर्फ़ seed-time पर।" },
    { type: "p", text: "Docs/app में दिखने वाले पूरे हो चुके उदाहरण: TAC-chain campaigns (TAC Stone, TAC LevelUSD, TAC Renzo), Stable network vaults (`ctStableUSDT`, `ctStablefrxUSD`), USDai DEX & MM (Arbitrum)।" },
    { type: "heading", level: 2, text: "Campaign lifecycle" },
    {
      type: "code",
      lang: "",
      code: "Campaign live ──► end date reached ──► controlled wind-down ──► withdraw-only",
    },
    { type: "p", text: "पूरे हो चुके campaigns app में *Completed Campaigns* के नीचे list होते हैं। Campaign खत्म होने पर deposits बंद हो जाते हैं और आप सिर्फ़ withdraw कर सकते हैं।" },
    { type: "heading", level: 2, text: "Campaigns के खास risks" },
    {
      type: "ul",
      items: [
        "Non-stable pairs और नई chains impermanent-loss और liquidity risk बढ़ाती हैं।",
        "Bridging cross-chain messaging risk जोड़ती है।",
        "Reward tokens volatile या illiquid हो सकते हैं।",
      ],
    },
    { type: "p", text: "खुद launch करना चाहते हैं? Docs Concrete के enterprise contact route की ओर इशारा करते हैं; देखें [Enterprise](/docs/02-intermediate/03-institutional-assetcx-enterprise)।" },
  ],

  pcm: [
    { type: "quote", text: "**Level:** Intermediate" },
    { type: "heading", level: 2, text: "Pre-deposit vaults" },
    { type: "p", text: "Vaults wey get time limit, where users dey deposit to provide **initial funding for new chain or tokenized strategy**. Wetin fit happen: users go receive new token wey dem issue, or dem fit redeem dia deposit for new chain." },
    { type: "p", text: "**Technical shape (Predeposit implementation):**" },
    {
      type: "ol",
      items: [
        "Users dey deposit for **source chain**.",
        "Di vault go **lock**; assets go bridge go **target chain**.",
        "Users go **claim** shares for di target chain through **LayerZero** messaging (di same wallet address).",
        "After launch, na *Queued Withdrawal* vault for di target chain dey usually take over from dis vault type.",
      ],
    },
    { type: "p", text: "Integrator gotcha: di cross-chain claim path **dey skip di hook lifecycle**, so whitelist hook no dey gate am - curators go need separate gating." },
    { type: "p", text: "Related implementations: *Bridged Standard / Bridged Async* dey add one-shot `unbackedMint` for migrations; e require `totalSupply() == 0` and `maxDepositLimit == 0`, meaning na seed-time only." },
    { type: "p", text: "Completed examples wey dem show for docs/app: TAC-chain campaigns (TAC Stone, TAC LevelUSD, TAC Renzo), Stable network vaults (`ctStableUSDT`, `ctStablefrxUSD`), USDai DEX & MM (Arbitrum)." },
    { type: "heading", level: 2, text: "Campaign lifecycle" },
    {
      type: "code",
      lang: "",
      code: "Campaign live ──► end date reached ──► controlled wind-down ──► withdraw-only",
    },
    { type: "p", text: "Dem dey list completed campaigns under *Completed Campaigns* for di app. When campaign end, deposits go stop and na only withdraw you fit do." },
    { type: "heading", level: 2, text: "Risks wey special to campaigns" },
    {
      type: "ul",
      items: [
        "Non-stable pairs and new chains dey raise impermanent-loss and liquidity risk.",
        "Bridging dey add cross-chain messaging risk.",
        "Reward tokens fit dey volatile or illiquid.",
      ],
    },
    { type: "p", text: "You wan launch one? Di docs dey point go Concrete enterprise contact route; check [Enterprise](/docs/02-intermediate/03-institutional-assetcx-enterprise)." },
  ],

  zh: [
    { type: "quote", text: "**级别：** 中级" },
    { type: "heading", level: 2, text: "预存款 vault（Pre-deposit）" },
    { type: "p", text: "限时开放的 vault，用户存入资金，为**新链或代币化策略提供初始资金**。结果有两种：用户获得新发行的代币，或可在新链上赎回其存款。" },
    { type: "p", text: "**技术形态（Predeposit 实现）：**" },
    {
      type: "ol",
      items: [
        "用户在**源链**上存款。",
        "Vault **锁定**；资产桥接到**目标链**。",
        "用户通过 **LayerZero** 消息在目标链上**领取**份额（使用同一个钱包地址）。",
        "上线后，该 vault 类型通常会被目标链上的 *Queued Withdrawal* vault 取代。",
      ],
    },
    { type: "p", text: "集成方注意：跨链领取路径**会绕过 hook 生命周期**，因此白名单 hook 无法对其设限——curator 需要另行设置准入控制。" },
    { type: "p", text: "相关实现：*Bridged Standard / Bridged Async* 为迁移场景增加了一次性的 `unbackedMint`；它要求 `totalSupply() == 0` 且 `maxDepositLimit == 0`，即仅限初始化（seed）阶段。" },
    { type: "p", text: "文档/应用中可见的已完成案例：TAC 链活动（TAC Stone、TAC LevelUSD、TAC Renzo）、Stable 网络 vault（`ctStableUSDT`、`ctStablefrxUSD`）、USDai DEX & MM（Arbitrum）。" },
    { type: "heading", level: 2, text: "活动生命周期" },
    {
      type: "code",
      lang: "",
      code: "Campaign live ──► end date reached ──► controlled wind-down ──► withdraw-only",
    },
    { type: "p", text: "已完成的活动会列在应用的 *Completed Campaigns* 下。活动结束后，存款停止，只能提现。" },
    { type: "heading", level: 2, text: "活动特有的风险" },
    {
      type: "ul",
      items: [
        "非稳定币交易对和新链会增加无常损失和流动性风险。",
        "跨链桥接会带来跨链消息传递风险。",
        "奖励代币可能波动剧烈或流动性不足。",
      ],
    },
    { type: "p", text: "想自己发起一个？文档指向 Concrete 的企业联系渠道；参见 [Enterprise](/docs/02-intermediate/03-institutional-assetcx-enterprise)。" },
  ],

  id: [
    { type: "quote", text: "**Level:** Menengah" },
    { type: "heading", level: 2, text: "Pre-deposit vaults" },
    { type: "p", text: "Vault dengan batas waktu di mana pengguna menyetor untuk memberikan **pendanaan awal bagi chain baru atau strategi yang ditokenisasi**. Hasilnya: pengguna menerima token yang baru diterbitkan, atau dapat menebus (redeem) setoran mereka di chain baru." },
    { type: "p", text: "**Bentuk teknis (implementasi Predeposit):**" },
    {
      type: "ol",
      items: [
        "Pengguna menyetor di **source chain**.",
        "Vault **terkunci**; aset di-bridge ke **target chain**.",
        "Pengguna **mengklaim** shares di target chain lewat pesan **LayerZero** (alamat wallet yang sama).",
        "Setelah peluncuran, tipe vault ini biasanya digantikan oleh vault *Queued Withdrawal* di target chain.",
      ],
    },
    { type: "p", text: "Perhatian untuk integrator: jalur klaim lintas chain **melewati siklus hook**, sehingga whitelist hook tidak membatasinya - curator perlu gating terpisah." },
    { type: "p", text: "Implementasi terkait: *Bridged Standard / Bridged Async* menambahkan `unbackedMint` sekali pakai untuk migrasi; ini mensyaratkan `totalSupply() == 0` dan `maxDepositLimit == 0`, yaitu hanya pada saat seed." },
    { type: "p", text: "Contoh yang sudah selesai di docs/app: kampanye TAC-chain (TAC Stone, TAC LevelUSD, TAC Renzo), vault jaringan Stable (`ctStableUSDT`, `ctStablefrxUSD`), USDai DEX & MM (Arbitrum)." },
    { type: "heading", level: 2, text: "Siklus kampanye" },
    {
      type: "code",
      lang: "",
      code: "Campaign live ──► end date reached ──► controlled wind-down ──► withdraw-only",
    },
    { type: "p", text: "Kampanye yang sudah selesai tercantum di bawah *Completed Campaigns* di app. Saat kampanye berakhir, deposit dihentikan dan Anda hanya bisa menarik dana." },
    { type: "heading", level: 2, text: "Risiko khusus kampanye" },
    {
      type: "ul",
      items: [
        "Pasangan non-stable dan chain baru meningkatkan risiko impermanent loss dan likuiditas.",
        "Bridging menambah risiko pesan lintas chain.",
        "Token reward bisa volatil atau tidak likuid.",
      ],
    },
    { type: "p", text: "Ingin meluncurkannya? Docs mengarahkan ke jalur kontak enterprise Concrete; lihat [Enterprise](/docs/02-intermediate/03-institutional-assetcx-enterprise)." },
  ],
};
