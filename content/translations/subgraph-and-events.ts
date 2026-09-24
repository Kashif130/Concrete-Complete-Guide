import type { DocBlock } from "../docs.generated";
import type { Locale } from "@/lib/i18n";

// Full translation of docs/03-advanced/05-subgraph-and-events.md.
// Entity/event names, field names and code identifiers are left as in the English source.
export const subgraphAndEvents: Partial<Record<Locale, DocBlock[]>> = {
  ur: [
    {
      "type": "quote",
      "text": "**Level:** Advanced · Earn V2 subgraph docs par mabni."
    },
    {
      "type": "heading",
      "level": 2,
      "text": "Topology"
    },
    {
      "type": "ul",
      "items": [
        "**Har chain ke liye aik subgraph deployment** (docs Ethereum mainnet, Arbitrum One aur Stable list karte hain). Data chains ke darmiyan **aggregate nahi hota**.",
        "Root data source: **`ConcreteFactory`** (har chain par bilkul aik). Har vault aik **`ConcreteVault` template** instance ke taur par track hota hai jo factory ke `Deployed` ya `VaultRegistered` emit karne par banta hai.",
        "Kahin aur deploy hue vaults ko factory registry mein **register** kiya ja sakta hai; registration se pehle ki history dastyab nahi (zaroorat ho to temp subgraph deploy karke import karein)."
      ]
    },
    {
      "type": "heading",
      "level": 2,
      "text": "Entities"
    },
    {
      "type": "table",
      "headers": [
        "Entity",
        "Notes"
      ],
      "rows": [
        [
          "`Factory`",
          "`id`, `vaultCount`, derived `roleMembers`."
        ],
        [
          "`Vault`",
          "Name, symbol, decimals, `isAsync`, `underlyingAsset`, `totalSupply`, `cachedTotalAssets`, `sharePrice`, fee totals, historical deposits/withdrawals, created-at info, derived `strategies`; sirf async ke liye: `isQueueActive`, `currentEpoch`, `latestProcessedEpoch`, `pastEpochUnclaimedAssets`, `*EpochRequestedShares`, `withdrawalQueue`, `epochs`."
        ],
        [
          "`WithdrawalQueue`",
          "Har user ki har epoch ki pending requests; `QueuedWithdrawal` par banti hai, claim/move par update hoti hai, `RequestCancelled` par delete hoti hai."
        ],
        [
          "`PartialEpochRequestProcessed`",
          "Aisi request ka immutable record jo closed-lekin-unprocessed epoch se poori hui (`WITHDRAWAL_MANAGER` chahiye)."
        ],
        [
          "`PriorityWithdrawalClaimed`",
          "Immutable: `shares`, `grossAssets`, `unwindCost`, `netAssets`, `epochID`."
        ],
        [
          "`Account` / `SharesBalance`",
          "User positions. `lastActivityTimestamp` sirf Deposit/Withdraw par update hota hai - saadah `Transfer` par **nahi**."
        ],
        [
          "`Strategy`",
          "`vault` (nullable), `strategyType`, `allocatedValue`."
        ]
      ]
    },
    {
      "type": "heading",
      "level": 2,
      "text": "Aggregations (rozana)"
    },
    {
      "type": "p",
      "text": "`NewUserStats` (har vault ke liye), `NewUserGlobalStats` (poore protocol ke liye), `VaultStats` (har din ka aakhri `totalSupply`, `cachedTotalAssets`, `sharePrice`), `VaultFeesStats` (rozana + cumulative management/performance fees)."
    },
    {
      "type": "heading",
      "level": 2,
      "text": "Tracked events (ahem set)"
    },
    {
      "type": "p",
      "text": "`Deposit`, `Withdraw`, `YieldAccrued`, `ManagementFeeAccrued`, `PerformanceFeeAccrued`, `QueuedWithdrawal`, `RequestCancelled`, `RequestClaimed`, `RequestMovedToNextEpoch`, `EpochProcessed`, `PartialEpochRequestProcessed`, `PriorityWithdrawalClaimed`, `StrategyYieldAccrued`, `AllocateFunds`, `DeallocateFunds`, `StrategyWithdraw`, `AdjustTotalAssets`."
    },
    {
      "type": "heading",
      "level": 2,
      "text": "Query patterns"
    },
    {
      "type": "p",
      "text": "Adapt karne ke liye tayyar queries [`examples/graphql/subgraph-queries.graphql`](/docs/../examples/graphql/subgraph-queries.graphql) mein hain. Tips:"
    },
    {
      "type": "ul",
      "items": [
        "The Graph khud-ba-khud **plural lowercase** roots (`vaults`, `factories`, `withdrawalQueues`) aur **singular lowercase** aggregation roots (`vaultStats`) banata hai.",
        "`Factory` mein **koi derived `vaults`** field nahi - `vaults(where: { factory: … })` query karein.",
        "`VaultStats.vault` aik `Bytes` address hai, `Vault` reference nahi; naam hasil karne ke liye dusri query chalayein."
      ]
    },
    {
      "type": "heading",
      "level": 2,
      "text": "Use cases"
    },
    {
      "type": "table",
      "headers": [
        "Maqsad",
        "Query"
      ],
      "rows": [
        [
          "Vault dashboard (TVL, share price)",
          "`vaults` + `vaultStats`"
        ],
        [
          "APY estimate",
          "Waqt ke saath Δ `sharePrice`, salana (fees ke baad)"
        ],
        [
          "Fee analytics",
          "`vaultFeesStats`"
        ],
        [
          "Queue depth / withdrawal tracker",
          "`withdrawalQueues`, `Vault.currentEpochRequestedShares`"
        ],
        [
          "Strategy exposure",
          "`strategies` + `allocatedValue`"
        ],
        [
          "Growth metrics",
          "`NewUserStats`, `NewUserGlobalStats`"
        ]
      ]
    }
  ],
  hi: [
    {
      "type": "quote",
      "text": "**स्तर:** Advanced · Earn V2 subgraph docs पर आधारित।"
    },
    {
      "type": "heading",
      "level": 2,
      "text": "Topology"
    },
    {
      "type": "ul",
      "items": [
        "**हर chain के लिए एक subgraph deployment** (docs Ethereum mainnet, Arbitrum One और Stable list करते हैं)। Data chains के बीच **aggregate नहीं होता**।",
        "Root data source: **`ConcreteFactory`** (हर chain पर बिल्कुल एक)। हर vault एक **`ConcreteVault` template** instance के रूप में track होता है जो factory के `Deployed` या `VaultRegistered` emit करने पर बनता है।",
        "कहीं और deploy हुए vaults को factory registry में **register** किया जा सकता है; registration से पहले की history उपलब्ध नहीं (ज़रूरत हो तो temp subgraph deploy करके import करें)।"
      ]
    },
    {
      "type": "heading",
      "level": 2,
      "text": "Entities"
    },
    {
      "type": "table",
      "headers": [
        "Entity",
        "Notes"
      ],
      "rows": [
        [
          "`Factory`",
          "`id`, `vaultCount`, derived `roleMembers`।"
        ],
        [
          "`Vault`",
          "Name, symbol, decimals, `isAsync`, `underlyingAsset`, `totalSupply`, `cachedTotalAssets`, `sharePrice`, fee totals, historical deposits/withdrawals, created-at info, derived `strategies`; सिर्फ़ async के लिए: `isQueueActive`, `currentEpoch`, `latestProcessedEpoch`, `pastEpochUnclaimedAssets`, `*EpochRequestedShares`, `withdrawalQueue`, `epochs`।"
        ],
        [
          "`WithdrawalQueue`",
          "हर user की हर epoch की pending requests; `QueuedWithdrawal` पर बनती है, claim/move पर update होती है, `RequestCancelled` पर delete होती है।"
        ],
        [
          "`PartialEpochRequestProcessed`",
          "ऐसी request का immutable record जो closed-लेकिन-unprocessed epoch से पूरी हुई (`WITHDRAWAL_MANAGER` चाहिए)।"
        ],
        [
          "`PriorityWithdrawalClaimed`",
          "Immutable: `shares`, `grossAssets`, `unwindCost`, `netAssets`, `epochID`।"
        ],
        [
          "`Account` / `SharesBalance`",
          "User positions। `lastActivityTimestamp` सिर्फ़ Deposit/Withdraw पर update होता है - सादे `Transfer` पर **नहीं**।"
        ],
        [
          "`Strategy`",
          "`vault` (nullable), `strategyType`, `allocatedValue`।"
        ]
      ]
    },
    {
      "type": "heading",
      "level": 2,
      "text": "Aggregations (रोज़ाना)"
    },
    {
      "type": "p",
      "text": "`NewUserStats` (हर vault के लिए), `NewUserGlobalStats` (पूरे protocol के लिए), `VaultStats` (हर दिन का आख़िरी `totalSupply`, `cachedTotalAssets`, `sharePrice`), `VaultFeesStats` (रोज़ाना + cumulative management/performance fees)।"
    },
    {
      "type": "heading",
      "level": 2,
      "text": "Tracked events (मुख्य set)"
    },
    {
      "type": "p",
      "text": "`Deposit`, `Withdraw`, `YieldAccrued`, `ManagementFeeAccrued`, `PerformanceFeeAccrued`, `QueuedWithdrawal`, `RequestCancelled`, `RequestClaimed`, `RequestMovedToNextEpoch`, `EpochProcessed`, `PartialEpochRequestProcessed`, `PriorityWithdrawalClaimed`, `StrategyYieldAccrued`, `AllocateFunds`, `DeallocateFunds`, `StrategyWithdraw`, `AdjustTotalAssets`."
    },
    {
      "type": "heading",
      "level": 2,
      "text": "Query patterns"
    },
    {
      "type": "p",
      "text": "Adapt करने के लिए तैयार queries [`examples/graphql/subgraph-queries.graphql`](/docs/../examples/graphql/subgraph-queries.graphql) में हैं। Tips:"
    },
    {
      "type": "ul",
      "items": [
        "The Graph अपने-आप **plural lowercase** roots (`vaults`, `factories`, `withdrawalQueues`) और **singular lowercase** aggregation roots (`vaultStats`) बनाता है।",
        "`Factory` में **कोई derived `vaults`** field नहीं - `vaults(where: { factory: … })` query करें।",
        "`VaultStats.vault` एक `Bytes` address है, `Vault` reference नहीं; नाम पाने के लिए दूसरी query चलाएँ।"
      ]
    },
    {
      "type": "heading",
      "level": 2,
      "text": "Use cases"
    },
    {
      "type": "table",
      "headers": [
        "लक्ष्य",
        "Query"
      ],
      "rows": [
        [
          "Vault dashboard (TVL, share price)",
          "`vaults` + `vaultStats`"
        ],
        [
          "APY estimate",
          "समय के साथ Δ `sharePrice`, सालाना (fees के बाद)"
        ],
        [
          "Fee analytics",
          "`vaultFeesStats`"
        ],
        [
          "Queue depth / withdrawal tracker",
          "`withdrawalQueues`, `Vault.currentEpochRequestedShares`"
        ],
        [
          "Strategy exposure",
          "`strategies` + `allocatedValue`"
        ],
        [
          "Growth metrics",
          "`NewUserStats`, `NewUserGlobalStats`"
        ]
      ]
    }
  ],
  pcm: [
    {
      "type": "quote",
      "text": "**Level:** Advanced · E dey based on di Earn V2 subgraph docs."
    },
    {
      "type": "heading",
      "level": 2,
      "text": "Topology"
    },
    {
      "type": "ul",
      "items": [
        "**One subgraph deployment per chain** (di docs list Ethereum mainnet, Arbitrum One and Stable). Dem **no dey aggregate** data across chains.",
        "Root data source: **`ConcreteFactory`** (exactly one per chain). Dem dey track each vault as one **`ConcreteVault` template** instance wey dem create wen di factory emit `Deployed` or `VaultRegistered`.",
        "Vaults wey dem deploy elsewhere fit **register** enter di factory registry; history before registration no dey available (deploy temp subgraph and import if you need am)."
      ]
    },
    {
      "type": "heading",
      "level": 2,
      "text": "Entities"
    },
    {
      "type": "table",
      "headers": [
        "Entity",
        "Notes"
      ],
      "rows": [
        [
          "`Factory`",
          "`id`, `vaultCount`, derived `roleMembers`."
        ],
        [
          "`Vault`",
          "Name, symbol, decimals, `isAsync`, `underlyingAsset`, `totalSupply`, `cachedTotalAssets`, `sharePrice`, fee totals, historical deposits/withdrawals, created-at info, derived `strategies`; async-only: `isQueueActive`, `currentEpoch`, `latestProcessedEpoch`, `pastEpochUnclaimedAssets`, `*EpochRequestedShares`, `withdrawalQueue`, `epochs`."
        ],
        [
          "`WithdrawalQueue`",
          "Pending requests per user per epoch; dem dey create am on `QueuedWithdrawal`, update am on claim/move, delete am on `RequestCancelled`."
        ],
        [
          "`PartialEpochRequestProcessed`",
          "Immutable record of request wey dem fulfil from closed-but-unprocessed epoch (e need `WITHDRAWAL_MANAGER`)."
        ],
        [
          "`PriorityWithdrawalClaimed`",
          "Immutable: `shares`, `grossAssets`, `unwindCost`, `netAssets`, `epochID`."
        ],
        [
          "`Account` / `SharesBalance`",
          "User positions. `lastActivityTimestamp` dey update on Deposit/Withdraw only - **no** on plain `Transfer`."
        ],
        [
          "`Strategy`",
          "`vault` (nullable), `strategyType`, `allocatedValue`."
        ]
      ]
    },
    {
      "type": "heading",
      "level": 2,
      "text": "Aggregations (daily)"
    },
    {
      "type": "p",
      "text": "`NewUserStats` (per vault), `NewUserGlobalStats` (protocol-wide), `VaultStats` (last `totalSupply`, `cachedTotalAssets`, `sharePrice` per day), `VaultFeesStats` (daily + cumulative management/performance fees)."
    },
    {
      "type": "heading",
      "level": 2,
      "text": "Tracked events (headline set)"
    },
    {
      "type": "p",
      "text": "`Deposit`, `Withdraw`, `YieldAccrued`, `ManagementFeeAccrued`, `PerformanceFeeAccrued`, `QueuedWithdrawal`, `RequestCancelled`, `RequestClaimed`, `RequestMovedToNextEpoch`, `EpochProcessed`, `PartialEpochRequestProcessed`, `PriorityWithdrawalClaimed`, `StrategyYieldAccrued`, `AllocateFunds`, `DeallocateFunds`, `StrategyWithdraw`, `AdjustTotalAssets`."
    },
    {
      "type": "heading",
      "level": 2,
      "text": "Query patterns"
    },
    {
      "type": "p",
      "text": "Queries wey ready make you adapt dey inside [`examples/graphql/subgraph-queries.graphql`](/docs/../examples/graphql/subgraph-queries.graphql). Tips:"
    },
    {
      "type": "ul",
      "items": [
        "The Graph dey auto-generate **plural lowercase** roots (`vaults`, `factories`, `withdrawalQueues`) and **singular lowercase** aggregation roots (`vaultStats`).",
        "`Factory` get **no derived `vaults`** field - query `vaults(where: { factory: … })`.",
        "`VaultStats.vault` na `Bytes` address, no be `Vault` reference; use second query take get di names."
      ]
    },
    {
      "type": "heading",
      "level": 2,
      "text": "Use cases"
    },
    {
      "type": "table",
      "headers": [
        "Goal",
        "Query"
      ],
      "rows": [
        [
          "Vault dashboard (TVL, share price)",
          "`vaults` + `vaultStats`"
        ],
        [
          "APY estimate",
          "Δ `sharePrice` over time, annualised (after fees)"
        ],
        [
          "Fee analytics",
          "`vaultFeesStats`"
        ],
        [
          "Queue depth / withdrawal tracker",
          "`withdrawalQueues`, `Vault.currentEpochRequestedShares`"
        ],
        [
          "Strategy exposure",
          "`strategies` + `allocatedValue`"
        ],
        [
          "Growth metrics",
          "`NewUserStats`, `NewUserGlobalStats`"
        ]
      ]
    }
  ],
  zh: [
    {
      "type": "quote",
      "text": "**级别：** 高级 · 基于 Earn V2 subgraph 文档。"
    },
    {
      "type": "heading",
      "level": 2,
      "text": "拓扑"
    },
    {
      "type": "ul",
      "items": [
        "**每条链一个 subgraph 部署**（文档列出 Ethereum 主网、Arbitrum One 和 Stable）。数据**不会跨链聚合**。",
        "根数据源：**`ConcreteFactory`**（每条链恰好一个）。每个 vault 作为 **`ConcreteVault` 模板**实例被追踪，在 factory 触发 `Deployed` 或 `VaultRegistered` 时创建。",
        "部署在其他地方的 vault 可以**注册**到 factory 注册表；注册之前的历史不可用（如需要，请部署临时 subgraph 并导入）。"
      ]
    },
    {
      "type": "heading",
      "level": 2,
      "text": "实体"
    },
    {
      "type": "table",
      "headers": [
        "实体",
        "说明"
      ],
      "rows": [
        [
          "`Factory`",
          "`id`、`vaultCount`、派生的 `roleMembers`。"
        ],
        [
          "`Vault`",
          "名称、符号、精度、`isAsync`、`underlyingAsset`、`totalSupply`、`cachedTotalAssets`、`sharePrice`、费用合计、历史存取款、创建信息、派生的 `strategies`；仅 async：`isQueueActive`、`currentEpoch`、`latestProcessedEpoch`、`pastEpochUnclaimedAssets`、`*EpochRequestedShares`、`withdrawalQueue`、`epochs`。"
        ],
        [
          "`WithdrawalQueue`",
          "每个用户在每个 epoch 的待处理请求；在 `QueuedWithdrawal` 时创建，在领取/移动时更新，在 `RequestCancelled` 时删除。"
        ],
        [
          "`PartialEpochRequestProcessed`",
          "从已关闭但未处理的 epoch 中兑现的请求的不可变记录（需要 `WITHDRAWAL_MANAGER`）。"
        ],
        [
          "`PriorityWithdrawalClaimed`",
          "不可变：`shares`、`grossAssets`、`unwindCost`、`netAssets`、`epochID`。"
        ],
        [
          "`Account` / `SharesBalance`",
          "用户持仓。`lastActivityTimestamp` 仅在 Deposit/Withdraw 时更新——普通 `Transfer` **不会**更新。"
        ],
        [
          "`Strategy`",
          "`vault`（可为空）、`strategyType`、`allocatedValue`。"
        ]
      ]
    },
    {
      "type": "heading",
      "level": 2,
      "text": "聚合（按日）"
    },
    {
      "type": "p",
      "text": "`NewUserStats`（按 vault）、`NewUserGlobalStats`（全协议）、`VaultStats`（每天最后的 `totalSupply`、`cachedTotalAssets`、`sharePrice`）、`VaultFeesStats`（每日 + 累计的管理费/业绩费）。"
    },
    {
      "type": "heading",
      "level": 2,
      "text": "被追踪的事件（主要集合）"
    },
    {
      "type": "p",
      "text": "`Deposit`, `Withdraw`, `YieldAccrued`, `ManagementFeeAccrued`, `PerformanceFeeAccrued`, `QueuedWithdrawal`, `RequestCancelled`, `RequestClaimed`, `RequestMovedToNextEpoch`, `EpochProcessed`, `PartialEpochRequestProcessed`, `PriorityWithdrawalClaimed`, `StrategyYieldAccrued`, `AllocateFunds`, `DeallocateFunds`, `StrategyWithdraw`, `AdjustTotalAssets`."
    },
    {
      "type": "heading",
      "level": 2,
      "text": "查询模式"
    },
    {
      "type": "p",
      "text": "可直接改造的查询位于 [`examples/graphql/subgraph-queries.graphql`](/docs/../examples/graphql/subgraph-queries.graphql)。提示："
    },
    {
      "type": "ul",
      "items": [
        "The Graph 会自动生成**复数小写**的根字段（`vaults`、`factories`、`withdrawalQueues`）和**单数小写**的聚合根字段（`vaultStats`）。",
        "`Factory` **没有派生的 `vaults`** 字段——请查询 `vaults(where: { factory: … })`。",
        "`VaultStats.vault` 是 `Bytes` 地址，而不是 `Vault` 引用；请用第二次查询来解析名称。"
      ]
    },
    {
      "type": "heading",
      "level": 2,
      "text": "使用场景"
    },
    {
      "type": "table",
      "headers": [
        "目标",
        "查询"
      ],
      "rows": [
        [
          "Vault 仪表盘（TVL、份额价格）",
          "`vaults` + `vaultStats`"
        ],
        [
          "APY 估算",
          "`sharePrice` 随时间的变化 Δ，年化（扣除费用后）"
        ],
        [
          "费用分析",
          "`vaultFeesStats`"
        ],
        [
          "队列深度 / 提款追踪",
          "`withdrawalQueues`, `Vault.currentEpochRequestedShares`"
        ],
        [
          "策略敞口",
          "`strategies` + `allocatedValue`"
        ],
        [
          "增长指标",
          "`NewUserStats`, `NewUserGlobalStats`"
        ]
      ]
    }
  ],
  id: [
    {
      "type": "quote",
      "text": "**Level:** Lanjutan · Berdasarkan docs subgraph Earn V2."
    },
    {
      "type": "heading",
      "level": 2,
      "text": "Topologi"
    },
    {
      "type": "ul",
      "items": [
        "**Satu deployment subgraph per chain** (docs mencantumkan Ethereum mainnet, Arbitrum One, dan Stable). Data **tidak diagregasi antar chain**.",
        "Sumber data root: **`ConcreteFactory`** (tepat satu per chain). Setiap vault dilacak sebagai instance **template `ConcreteVault`** yang dibuat saat factory memancarkan `Deployed` atau `VaultRegistered`.",
        "Vault yang di-deploy di tempat lain bisa **didaftarkan** ke registry factory; riwayat sebelum pendaftaran tidak tersedia (deploy subgraph sementara lalu impor jika Anda membutuhkannya)."
      ]
    },
    {
      "type": "heading",
      "level": 2,
      "text": "Entitas"
    },
    {
      "type": "table",
      "headers": [
        "Entitas",
        "Catatan"
      ],
      "rows": [
        [
          "`Factory`",
          "`id`, `vaultCount`, `roleMembers` turunan."
        ],
        [
          "`Vault`",
          "Nama, simbol, desimal, `isAsync`, `underlyingAsset`, `totalSupply`, `cachedTotalAssets`, `sharePrice`, total fee, riwayat deposit/penarikan, info waktu pembuatan, `strategies` turunan; khusus async: `isQueueActive`, `currentEpoch`, `latestProcessedEpoch`, `pastEpochUnclaimedAssets`, `*EpochRequestedShares`, `withdrawalQueue`, `epochs`."
        ],
        [
          "`WithdrawalQueue`",
          "Permintaan tertunda per pengguna per epoch; dibuat saat `QueuedWithdrawal`, diperbarui saat claim/move, dihapus saat `RequestCancelled`."
        ],
        [
          "`PartialEpochRequestProcessed`",
          "Catatan immutable dari permintaan yang dipenuhi dari epoch yang sudah ditutup tetapi belum diproses (memerlukan `WITHDRAWAL_MANAGER`)."
        ],
        [
          "`PriorityWithdrawalClaimed`",
          "Immutable: `shares`, `grossAssets`, `unwindCost`, `netAssets`, `epochID`."
        ],
        [
          "`Account` / `SharesBalance`",
          "Posisi pengguna. `lastActivityTimestamp` hanya diperbarui pada Deposit/Withdraw - **bukan** pada `Transfer` biasa."
        ],
        [
          "`Strategy`",
          "`vault` (nullable), `strategyType`, `allocatedValue`."
        ]
      ]
    },
    {
      "type": "heading",
      "level": 2,
      "text": "Agregasi (harian)"
    },
    {
      "type": "p",
      "text": "`NewUserStats` (per vault), `NewUserGlobalStats` (seluruh protokol), `VaultStats` (`totalSupply`, `cachedTotalAssets`, `sharePrice` terakhir per hari), `VaultFeesStats` (fee management/performance harian + kumulatif)."
    },
    {
      "type": "heading",
      "level": 2,
      "text": "Event yang dilacak (kumpulan utama)"
    },
    {
      "type": "p",
      "text": "`Deposit`, `Withdraw`, `YieldAccrued`, `ManagementFeeAccrued`, `PerformanceFeeAccrued`, `QueuedWithdrawal`, `RequestCancelled`, `RequestClaimed`, `RequestMovedToNextEpoch`, `EpochProcessed`, `PartialEpochRequestProcessed`, `PriorityWithdrawalClaimed`, `StrategyYieldAccrued`, `AllocateFunds`, `DeallocateFunds`, `StrategyWithdraw`, `AdjustTotalAssets`."
    },
    {
      "type": "heading",
      "level": 2,
      "text": "Pola query"
    },
    {
      "type": "p",
      "text": "Query siap adaptasi tersedia di [`examples/graphql/subgraph-queries.graphql`](/docs/../examples/graphql/subgraph-queries.graphql). Tips:"
    },
    {
      "type": "ul",
      "items": [
        "The Graph otomatis membuat root **jamak huruf kecil** (`vaults`, `factories`, `withdrawalQueues`) dan root agregasi **tunggal huruf kecil** (`vaultStats`).",
        "`Factory` **tidak memiliki field turunan `vaults`** - query `vaults(where: { factory: … })`.",
        "`VaultStats.vault` adalah alamat `Bytes`, bukan referensi `Vault`; resolusikan nama dengan query kedua."
      ]
    },
    {
      "type": "heading",
      "level": 2,
      "text": "Kasus penggunaan"
    },
    {
      "type": "table",
      "headers": [
        "Tujuan",
        "Query"
      ],
      "rows": [
        [
          "Dashboard vault (TVL, harga share)",
          "`vaults` + `vaultStats`"
        ],
        [
          "Estimasi APY",
          "Δ `sharePrice` dari waktu ke waktu, diannualisasi (setelah fee)"
        ],
        [
          "Analitik fee",
          "`vaultFeesStats`"
        ],
        [
          "Kedalaman antrean / pelacak penarikan",
          "`withdrawalQueues`, `Vault.currentEpochRequestedShares`"
        ],
        [
          "Eksposur strategi",
          "`strategies` + `allocatedValue`"
        ],
        [
          "Metrik pertumbuhan",
          "`NewUserStats`, `NewUserGlobalStats`"
        ]
      ]
    }
  ],
};
