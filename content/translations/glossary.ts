import type { DocBlock } from "../docs.generated";
import type { Locale } from "@/lib/i18n";

// Full translation of docs/05-reference/02-glossary.md.
// Glossary terms (bold) are kept in English; meanings are translated.
export const glossary: Partial<Record<Locale, DocBlock[]>> = {
  ur: [
    {
      "type": "p",
      "text": "Terms official [Concrete glossary](https://docs.concrete.xyz/glossary/) ke mutabiq hain, saath mein kuch extras jo is repo mein istemal hue hain (⭐ se nishan zad)."
    },
    {
      "type": "table",
      "headers": [
        "Term",
        "Matlab"
      ],
      "rows": [
        [
          "**AMM**",
          "Automated market maker - swaps ki qeemat on-chain pools se tay hoti hai."
        ],
        [
          "**APR / APY**",
          "Salana rate, simple / compounded."
        ],
        [
          "**AssetCX**",
          "Qualified-custody assets ki 1:1 on-chain representation jo Concrete vaults mein deposit ki ja sakti hai."
        ],
        [
          "**AUM**",
          "Assets under management (management-fee ka base)."
        ],
        [
          "**Allocator** ⭐",
          "Automated role jo strategies ke darmiyan funds move karne ke liye `vault.allocate(...)` call karta hai."
        ],
        [
          "**Async vault / Queued Withdrawal vault**",
          "Epoch-based withdrawal queue wala vault."
        ],
        [
          "**Atomic vault**",
          "Aisa vault jis mein deposit/withdraw aik hi transaction mein hota hai."
        ],
        [
          "**Bags** ⭐",
          "Phase 1 social quests se hasil hone wala points-precursor."
        ],
        [
          "**BGT / BERA**",
          "Berachain ke governance / native tokens."
        ],
        [
          "**Bridged vault** ⭐",
          "Aisa vault variant jis mein migrations ke liye aik martaba `unbackedMint` hota hai."
        ],
        [
          "**Cooldown** ⭐",
          "Har deposit ki woh muddat jis se pehle shares withdraw/transfer nahi ho sakte."
        ],
        [
          "**`ctAsset`**",
          "Concrete vault share token (ERC-20), jaise `ctWBTC`."
        ],
        [
          "**Curator** ⭐",
          "Vault ki strategy aur shara'it ka operator."
        ],
        [
          "**Deallocation order** ⭐",
          "Woh tarteeb jis mein withdrawals ke liye strategies khali ki jati hain."
        ],
        [
          "**DeFi**",
          "Decentralised finance."
        ],
        [
          "**Donation / inflation attack** ⭐",
          "ERC-4626 attack jo direct donations se share price bigarta hai."
        ],
        [
          "**Epoch** ⭐",
          "Queued vaults mein withdrawal batching ki window."
        ],
        [
          "**EOA**",
          "Externally owned account (key se control hone wala wallet)."
        ],
        [
          "**ERC-20 / ERC-4626**",
          "Fungible-token standard / tokenized-vault standard."
        ],
        [
          "**Factory** ⭐",
          "Woh contract jo vaults deploy karta aur upgrade paths sambhalta hai."
        ],
        [
          "**FIFO**",
          "First in, first out."
        ],
        [
          "**Hook** ⭐",
          "Vault operations par optional pre/post module."
        ],
        [
          "**Hurdle rate** ⭐",
          "Woh return jo depositors ko performance fees lagne se pehle milta hai."
        ],
        [
          "**IL**",
          "Impermanent loss."
        ],
        [
          "**Looping** ⭐",
          "Leveraged borrow-and-resupply strategy, aksar flash loans ke zariye."
        ],
        [
          "**LP**",
          "Liquidity provider / LP position."
        ],
        [
          "**LTV**",
          "Loan-to-value ratio."
        ],
        [
          "**MPC**",
          "Multi-party computation (split-key signing)."
        ],
        [
          "**Multisig** ⭐",
          "Aisa wallet jise kai approvals chahiye."
        ],
        [
          "**NAV**",
          "Net asset value."
        ],
        [
          "**OFAC**",
          "US sanctions daftar."
        ],
        [
          "**OFT** ⭐",
          "Omnichain fungible token (LayerZero standard)."
        ],
        [
          "**Permissioned vault** ⭐",
          "Aisa vault jis mein deposits sirf approved participants tak mehdood hon."
        ],
        [
          "**Pre-deposit vault** ⭐",
          "Waqt-mehdood cross-chain seeding vault."
        ],
        [
          "**Priority withdrawal** ⭐",
          "`gross − unwindCost` par trusted fast-path withdrawal."
        ],
        [
          "**QC**",
          "Qualified custody."
        ],
        [
          "**RPC**",
          "Blockchain node ko parhne/likhne ka endpoint."
        ],
        [
          "**RWA**",
          "On-chain real-world asset."
        ],
        [
          "**SDK**",
          "Software development kit (`@concrete-xyz/sdk`)."
        ],
        [
          "**Share price** ⭐",
          "`totalAssets / totalSupply`."
        ],
        [
          "**Slippage** ⭐",
          "Executed aur expected swap price ka farq."
        ],
        [
          "**Strategy** ⭐",
          "Adapter jo vault ke assets ko kisi venue mein lagata hai."
        ],
        [
          "**Subgraph** ⭐",
          "Concrete vault data ka The Graph index."
        ],
        [
          "**TVL**",
          "Total value locked."
        ],
        [
          "**UUPS**",
          "Universal Upgradeable Proxy Standard (EIP-1822)."
        ],
        [
          "**Unwind cost** ⭐",
          "Priority withdrawal se kati jane wali laagat."
        ],
        [
          "**USD1 / USDC / USDT / frxUSD**",
          "Stablecoins (WLFI / Circle / Tether / Frax)."
        ],
        [
          "**WBTC / LBTC / WETH**",
          "Wrapped BTC / Lombard BTC / wrapped ETH."
        ],
        [
          "**Withdrawal cap** ⭐",
          "Har epoch ki redemption hadd, TVL ke % ke taur par."
        ]
      ]
    }
  ],
  hi: [
    {
      "type": "p",
      "text": "Terms official [Concrete glossary](https://docs.concrete.xyz/glossary/) के मुताबिक़ हैं, साथ में कुछ extras जो इस repo में इस्तेमाल हुए हैं (⭐ से चिह्नित)।"
    },
    {
      "type": "table",
      "headers": [
        "Term",
        "मतलब"
      ],
      "rows": [
        [
          "**AMM**",
          "Automated market maker - swaps की क़ीमत on-chain pools से तय होती है।"
        ],
        [
          "**APR / APY**",
          "सालाना rate, simple / compounded।"
        ],
        [
          "**AssetCX**",
          "Qualified-custody assets की 1:1 on-chain representation जो Concrete vaults में deposit की जा सकती है।"
        ],
        [
          "**AUM**",
          "Assets under management (management-fee का base)।"
        ],
        [
          "**Allocator** ⭐",
          "Automated role जो strategies के बीच funds move करने के लिए `vault.allocate(...)` call करता है।"
        ],
        [
          "**Async vault / Queued Withdrawal vault**",
          "Epoch-based withdrawal queue वाला vault।"
        ],
        [
          "**Atomic vault**",
          "ऐसा vault जिसमें deposit/withdraw एक ही transaction में होता है।"
        ],
        [
          "**Bags** ⭐",
          "Phase 1 social quests से मिलने वाला points-precursor।"
        ],
        [
          "**BGT / BERA**",
          "Berachain के governance / native tokens।"
        ],
        [
          "**Bridged vault** ⭐",
          "ऐसा vault variant जिसमें migrations के लिए एक बार `unbackedMint` होता है।"
        ],
        [
          "**Cooldown** ⭐",
          "हर deposit की वह अवधि जिससे पहले shares withdraw/transfer नहीं हो सकते।"
        ],
        [
          "**`ctAsset`**",
          "Concrete vault share token (ERC-20), जैसे `ctWBTC`।"
        ],
        [
          "**Curator** ⭐",
          "Vault की strategy और शर्तों का operator।"
        ],
        [
          "**Deallocation order** ⭐",
          "वह क्रम जिसमें withdrawals के लिए strategies ख़ाली की जाती हैं।"
        ],
        [
          "**DeFi**",
          "Decentralised finance।"
        ],
        [
          "**Donation / inflation attack** ⭐",
          "ERC-4626 attack जो direct donations से share price बिगाड़ता है।"
        ],
        [
          "**Epoch** ⭐",
          "Queued vaults में withdrawal batching की window।"
        ],
        [
          "**EOA**",
          "Externally owned account (key से control होने वाला wallet)।"
        ],
        [
          "**ERC-20 / ERC-4626**",
          "Fungible-token standard / tokenized-vault standard।"
        ],
        [
          "**Factory** ⭐",
          "वह contract जो vaults deploy करता और upgrade paths सँभालता है।"
        ],
        [
          "**FIFO**",
          "First in, first out।"
        ],
        [
          "**Hook** ⭐",
          "Vault operations पर optional pre/post module।"
        ],
        [
          "**Hurdle rate** ⭐",
          "वह return जो depositors को performance fees लगने से पहले मिलता है।"
        ],
        [
          "**IL**",
          "Impermanent loss।"
        ],
        [
          "**Looping** ⭐",
          "Leveraged borrow-and-resupply strategy, अक्सर flash loans के ज़रिए।"
        ],
        [
          "**LP**",
          "Liquidity provider / LP position।"
        ],
        [
          "**LTV**",
          "Loan-to-value ratio।"
        ],
        [
          "**MPC**",
          "Multi-party computation (split-key signing)।"
        ],
        [
          "**Multisig** ⭐",
          "ऐसा wallet जिसे कई approvals चाहिए।"
        ],
        [
          "**NAV**",
          "Net asset value।"
        ],
        [
          "**OFAC**",
          "US sanctions दफ़्तर।"
        ],
        [
          "**OFT** ⭐",
          "Omnichain fungible token (LayerZero standard)।"
        ],
        [
          "**Permissioned vault** ⭐",
          "ऐसा vault जिसमें deposits सिर्फ़ approved participants तक सीमित हों।"
        ],
        [
          "**Pre-deposit vault** ⭐",
          "समय-सीमित cross-chain seeding vault।"
        ],
        [
          "**Priority withdrawal** ⭐",
          "`gross − unwindCost` पर trusted fast-path withdrawal।"
        ],
        [
          "**QC**",
          "Qualified custody।"
        ],
        [
          "**RPC**",
          "Blockchain node को पढ़ने/लिखने का endpoint।"
        ],
        [
          "**RWA**",
          "On-chain real-world asset।"
        ],
        [
          "**SDK**",
          "Software development kit (`@concrete-xyz/sdk`)।"
        ],
        [
          "**Share price** ⭐",
          "`totalAssets / totalSupply`।"
        ],
        [
          "**Slippage** ⭐",
          "Executed और expected swap price का फ़र्क़।"
        ],
        [
          "**Strategy** ⭐",
          "Adapter जो vault के assets को किसी venue में लगाता है।"
        ],
        [
          "**Subgraph** ⭐",
          "Concrete vault data का The Graph index।"
        ],
        [
          "**TVL**",
          "Total value locked।"
        ],
        [
          "**UUPS**",
          "Universal Upgradeable Proxy Standard (EIP-1822)।"
        ],
        [
          "**Unwind cost** ⭐",
          "Priority withdrawal से काटी जाने वाली लागत।"
        ],
        [
          "**USD1 / USDC / USDT / frxUSD**",
          "Stablecoins (WLFI / Circle / Tether / Frax)।"
        ],
        [
          "**WBTC / LBTC / WETH**",
          "Wrapped BTC / Lombard BTC / wrapped ETH।"
        ],
        [
          "**Withdrawal cap** ⭐",
          "हर epoch की redemption सीमा, TVL के % के रूप में।"
        ]
      ]
    }
  ],
  pcm: [
    {
      "type": "p",
      "text": "Di terms dey follow di official [Concrete glossary](https://docs.concrete.xyz/glossary/) plus some extras wey dem use for dis repo (dem mark am ⭐)."
    },
    {
      "type": "table",
      "headers": [
        "Term",
        "Meaning"
      ],
      "rows": [
        [
          "**AMM**",
          "Automated market maker - swaps wey dem price from on-chain pools."
        ],
        [
          "**APR / APY**",
          "Yearly rate simple / compounded."
        ],
        [
          "**AssetCX**",
          "1:1 on-chain representation of qualified-custody assets wey dem fit deposit for Concrete vaults."
        ],
        [
          "**AUM**",
          "Assets under management (di base for management fee)."
        ],
        [
          "**Allocator** ⭐",
          "Automated role wey dey call `vault.allocate(...)` to move funds between strategies."
        ],
        [
          "**Async vault / Queued Withdrawal vault**",
          "Vault wey get epoch-based withdrawal queue."
        ],
        [
          "**Atomic vault**",
          "Vault wey dey deposit/withdraw for one transaction."
        ],
        [
          "**Bags** ⭐",
          "Points-precursor from Phase 1 social quests."
        ],
        [
          "**BGT / BERA**",
          "Berachain governance / native tokens."
        ],
        [
          "**Bridged vault** ⭐",
          "Vault variant wey get one-shot `unbackedMint` for migrations."
        ],
        [
          "**Cooldown** ⭐",
          "Period for each deposit before shares fit withdraw/transfer."
        ],
        [
          "**`ctAsset`**",
          "Concrete vault share token (ERC-20), like `ctWBTC`."
        ],
        [
          "**Curator** ⭐",
          "Operator of vault strategy and terms."
        ],
        [
          "**Deallocation order** ⭐",
          "Sequence wey dem dey drain strategies for withdrawals."
        ],
        [
          "**DeFi**",
          "Decentralised finance."
        ],
        [
          "**Donation / inflation attack** ⭐",
          "ERC-4626 attack wey dey use direct donations to distort share price."
        ],
        [
          "**Epoch** ⭐",
          "Withdrawal batching window for queued vaults."
        ],
        [
          "**EOA**",
          "Externally owned account (wallet wey key dey control)."
        ],
        [
          "**ERC-20 / ERC-4626**",
          "Fungible-token standard / tokenized-vault standard."
        ],
        [
          "**Factory** ⭐",
          "Contract wey dey deploy vaults and manage upgrade paths."
        ],
        [
          "**FIFO**",
          "First in, first out."
        ],
        [
          "**Hook** ⭐",
          "Optional pre/post module for vault operations."
        ],
        [
          "**Hurdle rate** ⭐",
          "Return wey depositors go get before performance fees start to apply."
        ],
        [
          "**IL**",
          "Impermanent loss."
        ],
        [
          "**Looping** ⭐",
          "Leveraged borrow-and-resupply strategy, most times through flash loans."
        ],
        [
          "**LP**",
          "Liquidity provider / LP position."
        ],
        [
          "**LTV**",
          "Loan-to-value ratio."
        ],
        [
          "**MPC**",
          "Multi-party computation (split-key signing)."
        ],
        [
          "**Multisig** ⭐",
          "Wallet wey need plenty approvals."
        ],
        [
          "**NAV**",
          "Net asset value."
        ],
        [
          "**OFAC**",
          "US sanctions office."
        ],
        [
          "**OFT** ⭐",
          "Omnichain fungible token (LayerZero standard)."
        ],
        [
          "**Permissioned vault** ⭐",
          "Deposits dey restricted to approved participants."
        ],
        [
          "**Pre-deposit vault** ⭐",
          "Time-limited cross-chain seeding vault."
        ],
        [
          "**Priority withdrawal** ⭐",
          "Trusted fast-path withdrawal for `gross − unwindCost`."
        ],
        [
          "**QC**",
          "Qualified custody."
        ],
        [
          "**RPC**",
          "Endpoint to read/write to blockchain node."
        ],
        [
          "**RWA**",
          "Real-world asset for on-chain."
        ],
        [
          "**SDK**",
          "Software development kit (`@concrete-xyz/sdk`)."
        ],
        [
          "**Share price** ⭐",
          "`totalAssets / totalSupply`."
        ],
        [
          "**Slippage** ⭐",
          "Gap between di swap price wey dem execute and di one wey dem expect."
        ],
        [
          "**Strategy** ⭐",
          "Adapter wey dey deploy vault assets enter one venue."
        ],
        [
          "**Subgraph** ⭐",
          "The Graph index of Concrete vault data."
        ],
        [
          "**TVL**",
          "Total value locked."
        ],
        [
          "**UUPS**",
          "Universal Upgradeable Proxy Standard (EIP-1822)."
        ],
        [
          "**Unwind cost** ⭐",
          "Cost wey dem deduct from priority withdrawal."
        ],
        [
          "**USD1 / USDC / USDT / frxUSD**",
          "Stablecoins (WLFI / Circle / Tether / Frax)."
        ],
        [
          "**WBTC / LBTC / WETH**",
          "Wrapped BTC / Lombard BTC / wrapped ETH."
        ],
        [
          "**Withdrawal cap** ⭐",
          "Per-epoch redemption limit as % of TVL."
        ]
      ]
    }
  ],
  zh: [
    {
      "type": "p",
      "text": "术语依据官方 [Concrete 术语表](https://docs.concrete.xyz/glossary/)，另加本仓库中使用的一些补充项（标有 ⭐）。"
    },
    {
      "type": "table",
      "headers": [
        "术语",
        "含义"
      ],
      "rows": [
        [
          "**AMM**",
          "自动做市商——兑换价格由链上资金池决定。"
        ],
        [
          "**APR / APY**",
          "年化利率，单利 / 复利。"
        ],
        [
          "**AssetCX**",
          "对合格托管资产的 1:1 链上映射，可存入 Concrete vault。"
        ],
        [
          "**AUM**",
          "管理资产规模（管理费的计算基数）。"
        ],
        [
          "**Allocator** ⭐",
          "自动化角色，调用 `vault.allocate(...)` 在策略之间调配资金。"
        ],
        [
          "**Async vault / Queued Withdrawal vault**",
          "采用基于 epoch 的提款队列的 vault。"
        ],
        [
          "**Atomic vault**",
          "存款/提款在一笔交易内完成的 vault。"
        ],
        [
          "**Bags** ⭐",
          "来自第 1 阶段社交任务的积分前身。"
        ],
        [
          "**BGT / BERA**",
          "Berachain 的治理代币 / 原生代币。"
        ],
        [
          "**Bridged vault** ⭐",
          "带有一次性 `unbackedMint`（用于迁移）的 vault 变体。"
        ],
        [
          "**Cooldown** ⭐",
          "每笔存款对应的一段期限，在此之前份额不能提取/转让。"
        ],
        [
          "**`ctAsset`**",
          "Concrete vault 份额代币（ERC-20），例如 `ctWBTC`。"
        ],
        [
          "**Curator** ⭐",
          "vault 策略及条款的运营方。"
        ],
        [
          "**Deallocation order** ⭐",
          "为满足提款而抽取各策略资金的顺序。"
        ],
        [
          "**DeFi**",
          "去中心化金融。"
        ],
        [
          "**Donation / inflation attack** ⭐",
          "利用直接捐赠扭曲份额价格的 ERC-4626 攻击。"
        ],
        [
          "**Epoch** ⭐",
          "队列型 vault 中的提款批处理窗口。"
        ],
        [
          "**EOA**",
          "外部拥有账户（由私钥控制的钱包）。"
        ],
        [
          "**ERC-20 / ERC-4626**",
          "同质化代币标准 / 代币化 vault 标准。"
        ],
        [
          "**Factory** ⭐",
          "负责部署 vault 并管理升级路径的合约。"
        ],
        [
          "**FIFO**",
          "先进先出。"
        ],
        [
          "**Hook** ⭐",
          "vault 操作前/后的可选模块。"
        ],
        [
          "**Hurdle rate** ⭐",
          "收取业绩费之前存款人先获得的回报。"
        ],
        [
          "**IL**",
          "无常损失。"
        ],
        [
          "**Looping** ⭐",
          "杠杆式借入再供应策略，通常借助闪电贷。"
        ],
        [
          "**LP**",
          "流动性提供者 / LP 仓位。"
        ],
        [
          "**LTV**",
          "贷款价值比。"
        ],
        [
          "**MPC**",
          "多方计算（分片密钥签名）。"
        ],
        [
          "**Multisig** ⭐",
          "需要多个批准的钱包。"
        ],
        [
          "**NAV**",
          "净资产价值。"
        ],
        [
          "**OFAC**",
          "美国制裁办公室。"
        ],
        [
          "**OFT** ⭐",
          "全链同质化代币（LayerZero 标准）。"
        ],
        [
          "**Permissioned vault** ⭐",
          "存款仅限已批准参与者。"
        ],
        [
          "**Pre-deposit vault** ⭐",
          "限时的跨链启动资金 vault。"
        ],
        [
          "**Priority withdrawal** ⭐",
          "以 `gross − unwindCost` 结算的受信任快速提款通道。"
        ],
        [
          "**QC**",
          "合格托管。"
        ],
        [
          "**RPC**",
          "读写区块链节点的端点。"
        ],
        [
          "**RWA**",
          "链上的现实世界资产。"
        ],
        [
          "**SDK**",
          "软件开发工具包（`@concrete-xyz/sdk`）。"
        ],
        [
          "**Share price** ⭐",
          "`totalAssets / totalSupply`。"
        ],
        [
          "**Slippage** ⭐",
          "实际成交价与预期兑换价格之间的差距。"
        ],
        [
          "**Strategy** ⭐",
          "把 vault 资产部署到某个场所的适配器。"
        ],
        [
          "**Subgraph** ⭐",
          "Concrete vault 数据的 The Graph 索引。"
        ],
        [
          "**TVL**",
          "总锁仓价值。"
        ],
        [
          "**UUPS**",
          "通用可升级代理标准（EIP-1822）。"
        ],
        [
          "**Unwind cost** ⭐",
          "从优先提款中扣除的成本。"
        ],
        [
          "**USD1 / USDC / USDT / frxUSD**",
          "稳定币（WLFI / Circle / Tether / Frax）。"
        ],
        [
          "**WBTC / LBTC / WETH**",
          "封装 BTC / Lombard BTC / 封装 ETH。"
        ],
        [
          "**Withdrawal cap** ⭐",
          "每个 epoch 的赎回上限，以 TVL 的百分比表示。"
        ]
      ]
    }
  ],
  id: [
    {
      "type": "p",
      "text": "Istilah mengikuti [glosarium Concrete](https://docs.concrete.xyz/glossary/) resmi, ditambah beberapa istilah ekstra yang dipakai di repo ini (ditandai ⭐)."
    },
    {
      "type": "table",
      "headers": [
        "Istilah",
        "Arti"
      ],
      "rows": [
        [
          "**AMM**",
          "Automated market maker - swap dihargai dari pool on-chain."
        ],
        [
          "**APR / APY**",
          "Suku bunga tahunan sederhana / compounded."
        ],
        [
          "**AssetCX**",
          "Representasi on-chain 1:1 dari aset kustodian berkualifikasi yang dapat didepositkan ke vault Concrete."
        ],
        [
          "**AUM**",
          "Assets under management (dasar perhitungan management fee)."
        ],
        [
          "**Allocator** ⭐",
          "Peran otomatis yang memanggil `vault.allocate(...)` untuk memindahkan dana antar strategi."
        ],
        [
          "**Async vault / Queued Withdrawal vault**",
          "Vault dengan antrean penarikan berbasis epoch."
        ],
        [
          "**Atomic vault**",
          "Vault yang deposit/withdraw-nya dalam satu transaksi."
        ],
        [
          "**Bags** ⭐",
          "Cikal bakal poin dari quest sosial Fase 1."
        ],
        [
          "**BGT / BERA**",
          "Token governance / native Berachain."
        ],
        [
          "**Bridged vault** ⭐",
          "Varian vault dengan `unbackedMint` sekali pakai untuk migrasi."
        ],
        [
          "**Cooldown** ⭐",
          "Periode per deposit sebelum share dapat ditarik/ditransfer."
        ],
        [
          "**`ctAsset`**",
          "Token share vault Concrete (ERC-20), mis. `ctWBTC`."
        ],
        [
          "**Curator** ⭐",
          "Operator strategi dan ketentuan vault."
        ],
        [
          "**Deallocation order** ⭐",
          "Urutan pengosongan strategi untuk penarikan."
        ],
        [
          "**DeFi**",
          "Decentralised finance."
        ],
        [
          "**Donation / inflation attack** ⭐",
          "Serangan ERC-4626 yang memakai donasi langsung untuk mendistorsi harga share."
        ],
        [
          "**Epoch** ⭐",
          "Jendela batching penarikan pada vault berantrean."
        ],
        [
          "**EOA**",
          "Externally owned account (wallet yang dikendalikan key)."
        ],
        [
          "**ERC-20 / ERC-4626**",
          "Standar token fungible / standar tokenized-vault."
        ],
        [
          "**Factory** ⭐",
          "Kontrak yang men-deploy vault dan mengelola jalur upgrade."
        ],
        [
          "**FIFO**",
          "First in, first out."
        ],
        [
          "**Hook** ⭐",
          "Modul opsional pre/post pada operasi vault."
        ],
        [
          "**Hurdle rate** ⭐",
          "Return yang diterima depositor sebelum fee performance berlaku."
        ],
        [
          "**IL**",
          "Impermanent loss."
        ],
        [
          "**Looping** ⭐",
          "Strategi borrow-and-resupply berleverage, sering lewat flash loan."
        ],
        [
          "**LP**",
          "Liquidity provider / posisi LP."
        ],
        [
          "**LTV**",
          "Rasio loan-to-value."
        ],
        [
          "**MPC**",
          "Multi-party computation (penandatanganan kunci terpisah)."
        ],
        [
          "**Multisig** ⭐",
          "Wallet yang membutuhkan beberapa persetujuan."
        ],
        [
          "**NAV**",
          "Net asset value."
        ],
        [
          "**OFAC**",
          "Kantor sanksi AS."
        ],
        [
          "**OFT** ⭐",
          "Omnichain fungible token (standar LayerZero)."
        ],
        [
          "**Permissioned vault** ⭐",
          "Deposit dibatasi untuk peserta yang disetujui."
        ],
        [
          "**Pre-deposit vault** ⭐",
          "Vault seeding lintas chain berbatas waktu."
        ],
        [
          "**Priority withdrawal** ⭐",
          "Penarikan jalur cepat tepercaya pada `gross − unwindCost`."
        ],
        [
          "**QC**",
          "Qualified custody."
        ],
        [
          "**RPC**",
          "Endpoint untuk membaca/menulis ke node blockchain."
        ],
        [
          "**RWA**",
          "Aset dunia nyata di on-chain."
        ],
        [
          "**SDK**",
          "Software development kit (`@concrete-xyz/sdk`)."
        ],
        [
          "**Share price** ⭐",
          "`totalAssets / totalSupply`."
        ],
        [
          "**Slippage** ⭐",
          "Selisih antara harga swap yang dieksekusi dan yang diharapkan."
        ],
        [
          "**Strategy** ⭐",
          "Adapter yang menempatkan aset vault ke suatu venue."
        ],
        [
          "**Subgraph** ⭐",
          "Indeks The Graph untuk data vault Concrete."
        ],
        [
          "**TVL**",
          "Total value locked."
        ],
        [
          "**UUPS**",
          "Universal Upgradeable Proxy Standard (EIP-1822)."
        ],
        [
          "**Unwind cost** ⭐",
          "Biaya yang dipotong dari penarikan prioritas."
        ],
        [
          "**USD1 / USDC / USDT / frxUSD**",
          "Stablecoin (WLFI / Circle / Tether / Frax)."
        ],
        [
          "**WBTC / LBTC / WETH**",
          "Wrapped BTC / Lombard BTC / wrapped ETH."
        ],
        [
          "**Withdrawal cap** ⭐",
          "Batas redemption per epoch sebagai % dari TVL."
        ]
      ]
    }
  ],
};
