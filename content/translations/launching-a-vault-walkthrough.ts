import type { DocBlock } from "../docs.generated";
import type { Locale } from "@/lib/i18n";

// Full translation of docs/03-advanced/06-launching-a-vault-walkthrough.md.
// Role/method/entity names and code identifiers are left as in the English source.
export const launchingAVaultWalkthrough: Partial<Record<Locale, DocBlock[]>> = {
  ur: [
    {
      "type": "quote",
      "text": "**Level:** Advanced · Official architecture docs ki worked example ko follow karta hai: aik USDC vault jo idle reserve aur aik looping strategy ke darmiyan allocate karta hai. Concrete ke contracts private hain; un par build karne ke liye partner access (NDA) chahiye. Yeh aik conceptual map hai, deployable code nahi."
    },
    {
      "type": "heading",
      "level": 2,
      "text": "Step 0 - faislay"
    },
    {
      "type": "table",
      "headers": [
        "Faisla",
        "Options"
      ],
      "rows": [
        [
          "Vault type",
          "Standard (atomic) · Async (queued) · Predeposit · Bridged"
        ],
        [
          "Strategies",
          "Idle · lending · looping · multisig (custodied)"
        ],
        [
          "Accounting",
          "On-chain vs asynchronous (operator par dependency aur `accountingValidityPeriod` tay karta hai)"
        ],
        [
          "Fees",
          "Management · performance · hurdle (APY/APR/dynamic) · splitter config"
        ],
        [
          "Hooks",
          "Deposit cap · whitelist · deposit lock (±early-exit fee) `HookContainer` ke zariye"
        ],
        [
          "Limits",
          "Max deposit, per-user cap, min/max amounts, withdrawal cap aur cadence"
        ],
        [
          "Roles",
          "Vault Manager, Strategy Manager, Allocator, Pauser, Withdrawal Manager kaun hoga"
        ]
      ]
    },
    {
      "type": "heading",
      "level": 2,
      "text": "Step 1 - create"
    },
    {
      "type": "p",
      "text": "`factory.create(version, ownerAddr, abi.encode(allocateModule, USDC, initialVaultManager, \"Concrete USDC\", \"ctUSDC\"), salt)` proxy deploy karta hai. Nateeja: `ROLE_ADMIN` aur `VAULT_MANAGER` → `initialVaultManager` ko milte hain; `ownerAddr` Ownable owner ban jata hai (`factory.upgrade` call karne ka ikhtiyar rakhta hai). **Abhi production-ready nahi hai.**"
    },
    {
      "type": "heading",
      "level": 2,
      "text": "Step 2 - roles grant karein"
    },
    {
      "type": "p",
      "text": "`ROLE_ADMIN` se: `STRATEGY_MANAGER`, `ALLOCATOR`, `PAUSER` grant karein, aur async vaults ke liye `WITHDRAWAL_MANAGER` aur `PRIORITY_WITHDRAWAL_EXECUTOR` bhi. Jab tak yeh na hon, koi strategy add nahi ho sakti."
    },
    {
      "type": "heading",
      "level": 2,
      "text": "Step 3 - strategies add karein"
    },
    {
      "type": "p",
      "text": "`STRATEGY_MANAGER` idle aur looping strategies ke liye `addStrategy` call karta hai."
    },
    {
      "type": "heading",
      "level": 2,
      "text": "Step 4 - deallocation order set karein, phir allocate karein"
    },
    {
      "type": "p",
      "text": "`ALLOCATOR` `setDeallocationOrder` call karta hai (**har** strategy ko cover karein warna kuch withdraw nahi ho sakengi), phir deposits aane par `vault.allocate(...)` call karta hai."
    },
    {
      "type": "heading",
      "level": 2,
      "text": "Step 5 - hooks aur limits lagayein (optional)"
    },
    {
      "type": "p",
      "text": "`HOOK_MANAGER` hooks attach karta hai; `VAULT_MANAGER` caps set karta hai. Fee recipients **factory owner** set karta hai."
    },
    {
      "type": "heading",
      "level": 2,
      "text": "Step 6 - go-live checks"
    },
    {
      "type": "ul",
      "items": [
        "[ ] Roles alag-alag independent keys/parties mein taqseem hon",
        "[ ] Pauser (jaise monitoring/emergency provider) mojood ho",
        "[ ] Deallocation order == active strategy set",
        "[ ] Accounting validity period vs operator SLA",
        "[ ] Hook combination test ho chuka ho (revert karne wala hook sab kuch rok deta hai)",
        "[ ] Audit report bilkul isi implementation version ko cover kare",
        "[ ] Monitoring aur alerts (NAV thresholds, queue depth, looping ke liye LTV)",
        "[ ] Withdrawal cadence aur caps users ke liye documented hon",
        "[ ] Upgrade plan (pull-based; paused vaults upgrade nahi kar sakte)"
      ]
    },
    {
      "type": "heading",
      "level": 2,
      "text": "Step 7 - operate karein"
    },
    {
      "type": "p",
      "text": "Rozana NAV/exchange-rate updates, epoch close/process/claim automation, strategy rebalancing, monitoring. Hosted route ke liye [Enterprise](/docs/02-intermediate/03-institutional-assetcx-enterprise) dekhein."
    }
  ],
  hi: [
    {
      "type": "quote",
      "text": "**स्तर:** Advanced · Official architecture docs की worked example को follow करता है: एक USDC vault जो idle reserve और एक looping strategy के बीच allocate करता है। Concrete के contracts private हैं; उन पर build करने के लिए partner access (NDA) चाहिए। यह एक conceptual map है, deployable code नहीं।"
    },
    {
      "type": "heading",
      "level": 2,
      "text": "Step 0 - फ़ैसले"
    },
    {
      "type": "table",
      "headers": [
        "फ़ैसला",
        "Options"
      ],
      "rows": [
        [
          "Vault type",
          "Standard (atomic) · Async (queued) · Predeposit · Bridged"
        ],
        [
          "Strategies",
          "Idle · lending · looping · multisig (custodied)"
        ],
        [
          "Accounting",
          "On-chain vs asynchronous (operator पर निर्भरता और `accountingValidityPeriod` तय करता है)"
        ],
        [
          "Fees",
          "Management · performance · hurdle (APY/APR/dynamic) · splitter config"
        ],
        [
          "Hooks",
          "Deposit cap · whitelist · deposit lock (±early-exit fee) `HookContainer` के ज़रिए"
        ],
        [
          "Limits",
          "Max deposit, per-user cap, min/max amounts, withdrawal cap और cadence"
        ],
        [
          "Roles",
          "Vault Manager, Strategy Manager, Allocator, Pauser, Withdrawal Manager कौन होगा"
        ]
      ]
    },
    {
      "type": "heading",
      "level": 2,
      "text": "Step 1 - create"
    },
    {
      "type": "p",
      "text": "`factory.create(version, ownerAddr, abi.encode(allocateModule, USDC, initialVaultManager, \"Concrete USDC\", \"ctUSDC\"), salt)` proxy deploy करता है। नतीजा: `ROLE_ADMIN` और `VAULT_MANAGER` → `initialVaultManager` को मिलते हैं; `ownerAddr` Ownable owner बन जाता है (`factory.upgrade` call करने का अधिकार रखता है)। **अभी production-ready नहीं है।**"
    },
    {
      "type": "heading",
      "level": 2,
      "text": "Step 2 - roles grant करें"
    },
    {
      "type": "p",
      "text": "`ROLE_ADMIN` से: `STRATEGY_MANAGER`, `ALLOCATOR`, `PAUSER` grant करें, और async vaults के लिए `WITHDRAWAL_MANAGER` और `PRIORITY_WITHDRAWAL_EXECUTOR` भी। जब तक ये न हों, कोई strategy add नहीं हो सकती।"
    },
    {
      "type": "heading",
      "level": 2,
      "text": "Step 3 - strategies add करें"
    },
    {
      "type": "p",
      "text": "`STRATEGY_MANAGER` idle और looping strategies के लिए `addStrategy` call करता है।"
    },
    {
      "type": "heading",
      "level": 2,
      "text": "Step 4 - deallocation order set करें, फिर allocate करें"
    },
    {
      "type": "p",
      "text": "`ALLOCATOR` `setDeallocationOrder` call करता है (**हर** strategy को cover करें वरना कुछ withdraw नहीं हो पाएँगी), फिर deposits आने पर `vault.allocate(...)` call करता है।"
    },
    {
      "type": "heading",
      "level": 2,
      "text": "Step 5 - hooks और limits लगाएँ (optional)"
    },
    {
      "type": "p",
      "text": "`HOOK_MANAGER` hooks attach करता है; `VAULT_MANAGER` caps set करता है। Fee recipients **factory owner** set करता है।"
    },
    {
      "type": "heading",
      "level": 2,
      "text": "Step 6 - go-live checks"
    },
    {
      "type": "ul",
      "items": [
        "[ ] Roles अलग-अलग independent keys/parties में बँटे हों",
        "[ ] Pauser (जैसे monitoring/emergency provider) मौजूद हो",
        "[ ] Deallocation order == active strategy set",
        "[ ] Accounting validity period vs operator SLA",
        "[ ] Hook combination test हो चुका हो (revert करने वाला hook सब कुछ रोक देता है)",
        "[ ] Audit report ठीक इसी implementation version को cover करे",
        "[ ] Monitoring और alerts (NAV thresholds, queue depth, looping के लिए LTV)",
        "[ ] Withdrawal cadence और caps users के लिए documented हों",
        "[ ] Upgrade plan (pull-based; paused vaults upgrade नहीं कर सकते)"
      ]
    },
    {
      "type": "heading",
      "level": 2,
      "text": "Step 7 - operate करें"
    },
    {
      "type": "p",
      "text": "रोज़ाना NAV/exchange-rate updates, epoch close/process/claim automation, strategy rebalancing, monitoring। Hosted route के लिए [Enterprise](/docs/02-intermediate/03-institutional-assetcx-enterprise) देखें।"
    }
  ],
  pcm: [
    {
      "type": "quote",
      "text": "**Level:** Advanced · E follow di worked example for di official architecture docs: one USDC vault wey dey allocate between one idle reserve and one looping strategy. Concrete contracts na private; you go need partner access (NDA) to build for dem. Dis one na conceptual map, no be deployable code."
    },
    {
      "type": "heading",
      "level": 2,
      "text": "Step 0 - decisions"
    },
    {
      "type": "table",
      "headers": [
        "Decision",
        "Options"
      ],
      "rows": [
        [
          "Vault type",
          "Standard (atomic) · Async (queued) · Predeposit · Bridged"
        ],
        [
          "Strategies",
          "Idle · lending · looping · multisig (custodied)"
        ],
        [
          "Accounting",
          "On-chain vs asynchronous (e dey set operator dependency + `accountingValidityPeriod`)"
        ],
        [
          "Fees",
          "Management · performance · hurdle (APY/APR/dynamic) · splitter config"
        ],
        [
          "Hooks",
          "Deposit cap · whitelist · deposit lock (±early-exit fee) through `HookContainer`"
        ],
        [
          "Limits",
          "Max deposit, per-user cap, min/max amounts, withdrawal cap & cadence"
        ],
        [
          "Roles",
          "Who go be Vault Manager, Strategy Manager, Allocator, Pauser, Withdrawal Manager"
        ]
      ]
    },
    {
      "type": "heading",
      "level": 2,
      "text": "Step 1 - create"
    },
    {
      "type": "p",
      "text": "`factory.create(version, ownerAddr, abi.encode(allocateModule, USDC, initialVaultManager, \"Concrete USDC\", \"ctUSDC\"), salt)` dey deploy di proxy. Result: `ROLE_ADMIN` and `VAULT_MANAGER` → `initialVaultManager`; `ownerAddr` go become di Ownable owner (e get power to call `factory.upgrade`). **E never ready for production yet.**"
    },
    {
      "type": "heading",
      "level": 2,
      "text": "Step 2 - grant roles"
    },
    {
      "type": "p",
      "text": "From `ROLE_ADMIN`: grant `STRATEGY_MANAGER`, `ALLOCATOR`, `PAUSER`, and for async vaults `WITHDRAWAL_MANAGER` and `PRIORITY_WITHDRAWAL_EXECUTOR`. Until dem dey place, you no fit add any strategy."
    },
    {
      "type": "heading",
      "level": 2,
      "text": "Step 3 - add strategies"
    },
    {
      "type": "p",
      "text": "`STRATEGY_MANAGER` dey call `addStrategy` for di idle and looping strategies."
    },
    {
      "type": "heading",
      "level": 2,
      "text": "Step 4 - set deallocation order, then allocate"
    },
    {
      "type": "p",
      "text": "`ALLOCATOR` dey call `setDeallocationOrder` (cover **every** strategy or some go no fit withdraw) then `vault.allocate(...)` as deposits dey enter."
    },
    {
      "type": "heading",
      "level": 2,
      "text": "Step 5 - attach hooks & limits (optional)"
    },
    {
      "type": "p",
      "text": "`HOOK_MANAGER` dey attach hooks; `VAULT_MANAGER` dey set caps. Na di **factory owner** dey set fee recipients."
    },
    {
      "type": "heading",
      "level": 2,
      "text": "Step 6 - go-live checks"
    },
    {
      "type": "ul",
      "items": [
        "[ ] Roles don split across independent keys/parties",
        "[ ] Pauser (like monitoring/emergency provider) dey place",
        "[ ] Deallocation order == active strategy set",
        "[ ] Accounting validity period vs operator SLA",
        "[ ] Hook combination don test (hook wey revert fit stop everything)",
        "[ ] Audit report cover di exact implementation version",
        "[ ] Monitoring & alerts (NAV thresholds, queue depth, LTV for looping)",
        "[ ] Withdrawal cadence and caps don document for users",
        "[ ] Upgrade plan (pull-based; paused vaults no fit upgrade)"
      ]
    },
    {
      "type": "heading",
      "level": 2,
      "text": "Step 7 - operate"
    },
    {
      "type": "p",
      "text": "Daily NAV/exchange-rate updates, epoch close/process/claim automation, strategy rebalancing, monitoring. For hosted route, see [Enterprise](/docs/02-intermediate/03-institutional-assetcx-enterprise)."
    }
  ],
  zh: [
    {
      "type": "quote",
      "text": "**级别：** 高级 · 对应官方架构文档中的示例：一个 USDC vault 在闲置储备和一个循环（looping）策略之间分配资金。Concrete 的合约是私有的；需要合作伙伴权限（NDA）才能基于它们开发。这是一张概念图，不是可部署的代码。"
    },
    {
      "type": "heading",
      "level": 2,
      "text": "步骤 0 - 决策"
    },
    {
      "type": "table",
      "headers": [
        "决策项",
        "选项"
      ],
      "rows": [
        [
          "Vault 类型",
          "Standard（原子）· Async（队列）· Predeposit · Bridged"
        ],
        [
          "策略",
          "Idle · 借贷 · looping · multisig（托管）"
        ],
        [
          "会计",
          "链上 vs 异步（决定对运营方的依赖以及 `accountingValidityPeriod`）"
        ],
        [
          "费用",
          "管理费 · 业绩费 · hurdle（APY/APR/动态）· splitter 配置"
        ],
        [
          "Hooks",
          "存款上限 · 白名单 · 存款锁定（±提前退出费）通过 `HookContainer`"
        ],
        [
          "限额",
          "最大存款、单用户上限、最小/最大金额、提款上限与频率"
        ],
        [
          "角色",
          "谁担任 Vault Manager、Strategy Manager、Allocator、Pauser、Withdrawal Manager"
        ]
      ]
    },
    {
      "type": "heading",
      "level": 2,
      "text": "步骤 1 - 创建"
    },
    {
      "type": "p",
      "text": "`factory.create(version, ownerAddr, abi.encode(allocateModule, USDC, initialVaultManager, \"Concrete USDC\", \"ctUSDC\"), salt)` 会部署代理合约。结果：`ROLE_ADMIN` 和 `VAULT_MANAGER` → `initialVaultManager`；`ownerAddr` 成为 Ownable 所有者（有权调用 `factory.upgrade`）。**此时尚未达到生产就绪状态。**"
    },
    {
      "type": "heading",
      "level": 2,
      "text": "步骤 2 - 授予角色"
    },
    {
      "type": "p",
      "text": "由 `ROLE_ADMIN` 授予 `STRATEGY_MANAGER`、`ALLOCATOR`、`PAUSER`；异步 vault 还需授予 `WITHDRAWAL_MANAGER` 和 `PRIORITY_WITHDRAWAL_EXECUTOR`。在此之前无法添加任何策略。"
    },
    {
      "type": "heading",
      "level": 2,
      "text": "步骤 3 - 添加策略"
    },
    {
      "type": "p",
      "text": "`STRATEGY_MANAGER` 为闲置策略和 looping 策略调用 `addStrategy`。"
    },
    {
      "type": "heading",
      "level": 2,
      "text": "步骤 4 - 设置 deallocation 顺序，然后分配"
    },
    {
      "type": "p",
      "text": "`ALLOCATOR` 调用 `setDeallocationOrder`（必须覆盖**每一个**策略，否则部分策略将无法提取），随后在存款到达时调用 `vault.allocate(...)`。"
    },
    {
      "type": "heading",
      "level": 2,
      "text": "步骤 5 - 挂载 hooks 与限额（可选）"
    },
    {
      "type": "p",
      "text": "`HOOK_MANAGER` 挂载 hooks；`VAULT_MANAGER` 设置上限。费用接收方由 **factory owner** 设置。"
    },
    {
      "type": "heading",
      "level": 2,
      "text": "步骤 6 - 上线检查"
    },
    {
      "type": "ul",
      "items": [
        "[ ] 角色分散在相互独立的密钥/各方手中",
        "[ ] 已配置 Pauser（例如监控/应急服务方）",
        "[ ] Deallocation 顺序 == 活跃策略集合",
        "[ ] 会计有效期 vs 运营方 SLA",
        "[ ] 已测试 hook 组合（一个 revert 的 hook 会让一切停摆）",
        "[ ] 审计报告覆盖的正是当前实现版本",
        "[ ] 监控与告警（NAV 阈值、队列深度、looping 的 LTV）",
        "[ ] 已向用户说明提款频率与上限",
        "[ ] 升级方案（pull 模式；暂停中的 vault 无法升级）"
      ]
    },
    {
      "type": "heading",
      "level": 2,
      "text": "步骤 7 - 运营"
    },
    {
      "type": "p",
      "text": "每日 NAV/汇率更新、epoch 关闭/处理/领取的自动化、策略再平衡、监控。托管方案请参见 [Enterprise](/docs/02-intermediate/03-institutional-assetcx-enterprise)。"
    }
  ],
  id: [
    {
      "type": "quote",
      "text": "**Level:** Lanjutan · Mengikuti contoh kerja di dokumentasi arsitektur resmi: vault USDC yang mengalokasikan dana antara cadangan idle dan satu strategi looping. Kontrak Concrete bersifat privat; Anda memerlukan akses partner (NDA) untuk membangun di atasnya. Ini adalah peta konseptual, bukan kode yang siap di-deploy."
    },
    {
      "type": "heading",
      "level": 2,
      "text": "Langkah 0 - keputusan"
    },
    {
      "type": "table",
      "headers": [
        "Keputusan",
        "Opsi"
      ],
      "rows": [
        [
          "Tipe vault",
          "Standard (atomic) · Async (queued) · Predeposit · Bridged"
        ],
        [
          "Strategi",
          "Idle · lending · looping · multisig (custodied)"
        ],
        [
          "Akuntansi",
          "On-chain vs asynchronous (menentukan ketergantungan pada operator + `accountingValidityPeriod`)"
        ],
        [
          "Fee",
          "Management · performance · hurdle (APY/APR/dinamis) · konfigurasi splitter"
        ],
        [
          "Hooks",
          "Deposit cap · whitelist · deposit lock (±biaya early-exit) melalui `HookContainer`"
        ],
        [
          "Batas",
          "Deposit maksimum, batas per pengguna, jumlah min/maks, batas dan kadensi penarikan"
        ],
        [
          "Peran",
          "Siapa yang menjadi Vault Manager, Strategy Manager, Allocator, Pauser, Withdrawal Manager"
        ]
      ]
    },
    {
      "type": "heading",
      "level": 2,
      "text": "Langkah 1 - buat"
    },
    {
      "type": "p",
      "text": "`factory.create(version, ownerAddr, abi.encode(allocateModule, USDC, initialVaultManager, \"Concrete USDC\", \"ctUSDC\"), salt)` men-deploy proxy. Hasilnya: `ROLE_ADMIN` dan `VAULT_MANAGER` → `initialVaultManager`; `ownerAddr` menjadi owner Ownable (berwenang memanggil `factory.upgrade`). **Belum siap produksi.**"
    },
    {
      "type": "heading",
      "level": 2,
      "text": "Langkah 2 - berikan peran"
    },
    {
      "type": "p",
      "text": "Dari `ROLE_ADMIN`: berikan `STRATEGY_MANAGER`, `ALLOCATOR`, `PAUSER`, dan untuk vault async juga `WITHDRAWAL_MANAGER` dan `PRIORITY_WITHDRAWAL_EXECUTOR`. Sebelum itu, tidak ada strategi yang bisa ditambahkan."
    },
    {
      "type": "heading",
      "level": 2,
      "text": "Langkah 3 - tambahkan strategi"
    },
    {
      "type": "p",
      "text": "`STRATEGY_MANAGER` memanggil `addStrategy` untuk strategi idle dan looping."
    },
    {
      "type": "heading",
      "level": 2,
      "text": "Langkah 4 - atur urutan deallocation, lalu alokasikan"
    },
    {
      "type": "p",
      "text": "`ALLOCATOR` memanggil `setDeallocationOrder` (cakup **setiap** strategi atau sebagian tidak akan bisa ditarik), lalu `vault.allocate(...)` saat deposit masuk."
    },
    {
      "type": "heading",
      "level": 2,
      "text": "Langkah 5 - pasang hooks & batas (opsional)"
    },
    {
      "type": "p",
      "text": "`HOOK_MANAGER` memasang hooks; `VAULT_MANAGER` menetapkan cap. Penerima fee ditetapkan oleh **factory owner**."
    },
    {
      "type": "heading",
      "level": 2,
      "text": "Langkah 6 - pemeriksaan go-live"
    },
    {
      "type": "ul",
      "items": [
        "[ ] Peran dibagi ke key/pihak yang independen",
        "[ ] Pauser (mis. penyedia monitoring/darurat) sudah ada",
        "[ ] Urutan deallocation == himpunan strategi aktif",
        "[ ] Masa validitas akuntansi vs SLA operator",
        "[ ] Kombinasi hook sudah diuji (hook yang revert menghentikan segalanya)",
        "[ ] Laporan audit mencakup versi implementasi yang persis sama",
        "[ ] Monitoring & alert (ambang NAV, kedalaman antrean, LTV untuk looping)",
        "[ ] Kadensi dan batas penarikan terdokumentasi untuk pengguna",
        "[ ] Rencana upgrade (berbasis pull; vault yang di-pause tidak bisa upgrade)"
      ]
    },
    {
      "type": "heading",
      "level": 2,
      "text": "Langkah 7 - operasikan"
    },
    {
      "type": "p",
      "text": "Update NAV/exchange rate harian, otomatisasi epoch close/process/claim, rebalancing strategi, monitoring. Untuk jalur hosted, lihat [Enterprise](/docs/02-intermediate/03-institutional-assetcx-enterprise)."
    }
  ],
};
