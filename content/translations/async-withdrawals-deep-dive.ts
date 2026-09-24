import type { DocBlock } from "../docs.generated";
import type { Locale } from "@/lib/i18n";

// Full translation of docs/03-advanced/03-async-withdrawals-deep-dive.md.
// Role/method/entity names and code blocks are left as in the English source.
export const asyncWithdrawalsDeepDive: Partial<Record<Locale, DocBlock[]>> = {
  ur: [
    {
      "type": "quote",
      "text": "**Level:** Advanced"
    },
    {
      "type": "heading",
      "level": 2,
      "text": "State machine (per epoch, simplified)"
    },
    {
      "type": "code",
      "lang": "",
      "code": "OPEN ── closeEpoch() (cutoff) ──► CLOSED ── processing ──► PROCESSED ── claim ──► CLAIMED\n  │                                  │\n  └ user may cancel                  └ user locked in; WITHDRAWAL_MANAGER may\n                                       moveRequestToNextEpoch(...)"
    },
    {
      "type": "ul",
      "items": [
        "**Request:** shares vault ki custody mein transfer ho jate hain; request record hoti hai (`QueuedWithdrawal`).",
        "**Cutoff:** `closeEpoch()` epoch ko freeze kar deta hai. Iske baad user cancel nahi kar sakta.",
        "**Processing:** share price lock hoti hai, shares burn hote hain, assets pehle **unallocated balance** se reserve hote hain, phir **Allocator** strategies se **deallocation order** ke mutabiq deallocate karta hai.",
        "**Claim:** user claim call karta hai; assets vault se nikal jate hain (`RequestClaimed`).",
        "**Rollover:** agar cap ya delay ki wajah se koi request unprocessed reh jaye, to wo agle epoch mein chali jati hai (`RequestMovedToNextEpoch`), FIFO order barqarar rehta hai."
      ]
    },
    {
      "type": "heading",
      "level": 2,
      "text": "Roles"
    },
    {
      "type": "table",
      "headers": [
        "Role",
        "Power"
      ],
      "rows": [
        [
          "`WITHDRAWAL_MANAGER`",
          "Epochs advance karta hai (close → process → claim); requests ko agle epoch mein move kar sakta hai; kisi closed-magar-unprocessed epoch (`epochID == latestEpochID − 1`) ke liye current exchange rate par **partial epoch request** process kar sakta hai."
        ],
        [
          "`PRIORITY_WITHDRAWAL_EXECUTOR`",
          "Fast-path: user ke queued shares ko turant **active** epoch ke against settle kar deta hai, `grossAssets − unwindCost` pay karke."
        ]
      ]
    },
    {
      "type": "heading",
      "level": 3,
      "text": "Priority withdrawal cost bound"
    },
    {
      "type": "p",
      "text": "`unwindCost` executor call ke waqt supply karta hai magar yeh admin cap `unwindCostCapBP` (**default 500 bps, ceiling 10,000 bps**, `setUnwindCostCap` se set hoti hai) se zyada nahi ho sakti; cap se upar call revert ho jati hai. `unwindCost` strategy ki reported allocation se debit hoti hai (async accounting ke zariye), aur agla accrual reconcile kar deta hai. Yeh aik **trusted operational role** hai, automatic nahi."
    },
    {
      "type": "heading",
      "level": 2,
      "text": "Allocation par enforce hone wale invariants"
    },
    {
      "type": "p",
      "text": "`allocate(...)` ke baad postconditions: idle balance ko **locked assets** aur, async vaults mein, **past-epoch unclaimed assets** cover karne chahiye. Yeh un claims ko protect karta hai jo pehle se reserve hain."
    },
    {
      "type": "heading",
      "level": 2,
      "text": "Caps (per epoch)"
    },
    {
      "type": "p",
      "text": "Cap = vault TVL ka % jo har epoch mein process hota hai. Agar requests ≤ cap hon: normal process ho jati hain. Agar > cap ho: cap tak FIFO mein process hota hai, baqi roll ho jati hain. Wait karne wale users kamana jari rakhte hain (unke shares processed hone tak burn nahi hotay) magar unki **final price processing ke waqt set hoti hai**."
    },
    {
      "type": "heading",
      "level": 2,
      "text": "Cooldown/lock ka interplay"
    },
    {
      "type": "p",
      "text": "`DepositLockHook` / `DepositLockWithFeeHook` locked shares ko unlock hone tak withdraw, redeem ya transfer hone se rokte hain. Early unlock par shares mein aik decaying fee lagti hai."
    },
    {
      "type": "heading",
      "level": 2,
      "text": "Samajhne wale failure modes"
    },
    {
      "type": "table",
      "headers": [
        "Scenario",
        "Effect"
      ],
      "rows": [
        [
          "Strategy accounting push late ho",
          "Vault ruk jata hai (epoch processing samet) jab tak theek na ho"
        ],
        [
          "Strategy deallocation order se missing ho",
          "Assets count hote hain magar withdrawals ke liye available nahi"
        ],
        [
          "Vault par run mein cap bind ho jaye",
          "Multi-epoch queue; FIFO"
        ],
        [
          "Vault paused ho",
          "Jab tak unpause na ho, upgrade nahi ho sakta"
        ]
      ]
    },
    {
      "type": "heading",
      "level": 2,
      "text": "Queue state ko programmatically parhna"
    },
    {
      "type": "p",
      "text": "Subgraph istemal karein: `Vault.isQueueActive`, `currentEpoch`, `latestProcessedEpoch`, `pastEpochUnclaimedAssets`, `currentEpochRequestedShares`, aur `WithdrawalQueue` / `PriorityWithdrawalClaimed` / `PartialEpochRequestProcessed` entities. Dekhein [Subgraph guide](/docs/03-advanced/05-subgraph-and-events)."
    }
  ],
  hi: [
    {
      "type": "quote",
      "text": "**स्तर:** Advanced"
    },
    {
      "type": "heading",
      "level": 2,
      "text": "State machine (per epoch, simplified)"
    },
    {
      "type": "code",
      "lang": "",
      "code": "OPEN ── closeEpoch() (cutoff) ──► CLOSED ── processing ──► PROCESSED ── claim ──► CLAIMED\n  │                                  │\n  └ user may cancel                  └ user locked in; WITHDRAWAL_MANAGER may\n                                       moveRequestToNextEpoch(...)"
    },
    {
      "type": "ul",
      "items": [
        "**Request:** shares vault की custody में transfer हो जाते हैं; request record होती है (`QueuedWithdrawal`)।",
        "**Cutoff:** `closeEpoch()` epoch को freeze कर देता है। इसके बाद user cancel नहीं कर सकता।",
        "**Processing:** share price lock होती है, shares burn होते हैं, assets पहले **unallocated balance** से reserve होते हैं, फिर **Allocator** strategies से **deallocation order** के मुताबिक deallocate करता है।",
        "**Claim:** user claim call करता है; assets vault से निकल जाते हैं (`RequestClaimed`)।",
        "**Rollover:** अगर cap या delay की वजह से कोई request unprocessed रह जाए, तो वह अगले epoch में चली जाती है (`RequestMovedToNextEpoch`), FIFO order बरक़रार रहता है।"
      ]
    },
    {
      "type": "heading",
      "level": 2,
      "text": "Roles"
    },
    {
      "type": "table",
      "headers": [
        "Role",
        "Power"
      ],
      "rows": [
        [
          "`WITHDRAWAL_MANAGER`",
          "Epochs advance करता है (close → process → claim); requests को अगले epoch में move कर सकता है; किसी closed-मगर-unprocessed epoch (`epochID == latestEpochID − 1`) के लिए current exchange rate पर **partial epoch request** process कर सकता है।"
        ],
        [
          "`PRIORITY_WITHDRAWAL_EXECUTOR`",
          "Fast-path: user के queued shares को तुरंत **active** epoch के against settle कर देता है, `grossAssets − unwindCost` pay करके।"
        ]
      ]
    },
    {
      "type": "heading",
      "level": 3,
      "text": "Priority withdrawal cost bound"
    },
    {
      "type": "p",
      "text": "`unwindCost` executor call के समय supply करता है मगर यह admin cap `unwindCostCapBP` (**default 500 bps, ceiling 10,000 bps**, `setUnwindCostCap` से set होती है) से ज़्यादा नहीं हो सकती; cap से ऊपर call revert हो जाती है। `unwindCost` strategy की reported allocation से debit होती है (async accounting के ज़रिए), और अगला accrual reconcile कर देता है। यह एक **trusted operational role** है, automatic नहीं।"
    },
    {
      "type": "heading",
      "level": 2,
      "text": "Allocation पर enforce होने वाले invariants"
    },
    {
      "type": "p",
      "text": "`allocate(...)` के बाद postconditions: idle balance को **locked assets** और, async vaults में, **past-epoch unclaimed assets** cover करने चाहिए। यह उन claims को protect करता है जो पहले से reserve हैं।"
    },
    {
      "type": "heading",
      "level": 2,
      "text": "Caps (per epoch)"
    },
    {
      "type": "p",
      "text": "Cap = vault TVL का % जो हर epoch में process होता है। अगर requests ≤ cap हों: normal process हो जाती हैं। अगर > cap हो: cap तक FIFO में process होता है, बाकी roll हो जाती हैं। Wait करने वाले users कमाना जारी रखते हैं (उनके shares processed होने तक burn नहीं होते) मगर उनकी **final price processing के समय set होती है**।"
    },
    {
      "type": "heading",
      "level": 2,
      "text": "Cooldown/lock का interplay"
    },
    {
      "type": "p",
      "text": "`DepositLockHook` / `DepositLockWithFeeHook` locked shares को unlock होने तक withdraw, redeem या transfer होने से रोकते हैं। Early unlock पर shares में एक decaying fee लगती है।"
    },
    {
      "type": "heading",
      "level": 2,
      "text": "समझने वाले failure modes"
    },
    {
      "type": "table",
      "headers": [
        "Scenario",
        "Effect"
      ],
      "rows": [
        [
          "Strategy accounting push late हो",
          "Vault रुक जाता है (epoch processing सहित) जब तक ठीक न हो"
        ],
        [
          "Strategy deallocation order से missing हो",
          "Assets count होते हैं मगर withdrawals के लिए available नहीं"
        ],
        [
          "Vault पर run में cap bind हो जाए",
          "Multi-epoch queue; FIFO"
        ],
        [
          "Vault paused हो",
          "जब तक unpause न हो, upgrade नहीं हो सकता"
        ]
      ]
    },
    {
      "type": "heading",
      "level": 2,
      "text": "Queue state को programmatically पढ़ना"
    },
    {
      "type": "p",
      "text": "Subgraph इस्तेमाल करें: `Vault.isQueueActive`, `currentEpoch`, `latestProcessedEpoch`, `pastEpochUnclaimedAssets`, `currentEpochRequestedShares`, और `WithdrawalQueue` / `PriorityWithdrawalClaimed` / `PartialEpochRequestProcessed` entities। देखें [Subgraph guide](/docs/03-advanced/05-subgraph-and-events)।"
    }
  ],
  pcm: [
    {
      "type": "quote",
      "text": "**Level:** Advanced"
    },
    {
      "type": "heading",
      "level": 2,
      "text": "State machine (per epoch, simplified)"
    },
    {
      "type": "code",
      "lang": "",
      "code": "OPEN ── closeEpoch() (cutoff) ──► CLOSED ── processing ──► PROCESSED ── claim ──► CLAIMED\n  │                                  │\n  └ user may cancel                  └ user locked in; WITHDRAWAL_MANAGER may\n                                       moveRequestToNextEpoch(...)"
    },
    {
      "type": "ul",
      "items": [
        "**Request:** dem transfer shares enter vault custody; dem record di request (`QueuedWithdrawal`).",
        "**Cutoff:** `closeEpoch()` dey freeze di epoch. After dis, user no fit cancel again.",
        "**Processing:** dem lock share price, burn shares, reserve assets from **unallocated balance first**, then **Allocator** deallocate from strategies following di **deallocation order**.",
        "**Claim:** user call claim; assets leave di vault (`RequestClaimed`).",
        "**Rollover:** if cap or delay leave one request unprocessed, e go move to di next epoch (`RequestMovedToNextEpoch`), FIFO order still dey preserve."
      ]
    },
    {
      "type": "heading",
      "level": 2,
      "text": "Roles"
    },
    {
      "type": "table",
      "headers": [
        "Role",
        "Power"
      ],
      "rows": [
        [
          "`WITHDRAWAL_MANAGER`",
          "E dey advance epochs (close → process → claim); e fit move requests to next epoch; e fit process **partial epoch request** for one closed-but-unprocessed epoch (`epochID == latestEpochID − 1`) at di current exchange rate."
        ],
        [
          "`PRIORITY_WITHDRAWAL_EXECUTOR`",
          "Fast-path: e go settle user queued shares against di **active** epoch immediately, e go pay `grossAssets − unwindCost`."
        ]
      ]
    },
    {
      "type": "heading",
      "level": 3,
      "text": "Priority withdrawal cost bound"
    },
    {
      "type": "p",
      "text": "Executor dey supply `unwindCost` for call time but e must ≤ di admin cap `unwindCostCapBP` (**default 500 bps, ceiling 10,000 bps**, dem set am via `setUnwindCostCap`); if e pass di cap, di call go revert. Dem dey debit `unwindCost` from di strategy reported allocation (via async accounting), and di next accrual go reconcile am. Dis na **trusted operational role**, e no be automatic."
    },
    {
      "type": "heading",
      "level": 2,
      "text": "Invariants wey dem enforce on allocation"
    },
    {
      "type": "p",
      "text": "Postconditions after `allocate(...)`: idle balance must cover **locked assets** and, for async vaults, **past-epoch unclaimed assets**. Dis dey protect claims wey dem don already reserve."
    },
    {
      "type": "heading",
      "level": 2,
      "text": "Caps (per epoch)"
    },
    {
      "type": "p",
      "text": "Cap = % of vault TVL wey dem process per epoch. If requests ≤ cap: e go process normally. If pass cap: e go process up to cap for FIFO, di rest go roll over. Users wey dey wait still dey earn (dem no burn dia shares until processed) but dia **final price dey set at processing**."
    },
    {
      "type": "heading",
      "level": 2,
      "text": "Cooldown/lock interplay"
    },
    {
      "type": "p",
      "text": "`DepositLockHook` / `DepositLockWithFeeHook` dey prevent locked shares from withdraw, redeem or transfer until unlock. Early unlock go cost decaying fee for shares."
    },
    {
      "type": "heading",
      "level": 2,
      "text": "Failure modes wey you need to understand"
    },
    {
      "type": "table",
      "headers": [
        "Scenario",
        "Effect"
      ],
      "rows": [
        [
          "Strategy accounting push late",
          "Vault go halt (including epoch processing) until dem fix am"
        ],
        [
          "Strategy dey missing from deallocation order",
          "Assets dem count but no dey available for withdrawals"
        ],
        [
          "Cap bind for one run on di vault",
          "Multi-epoch queue; FIFO"
        ],
        [
          "Vault paused",
          "No fit upgrade am until dem unpause"
        ]
      ]
    },
    {
      "type": "heading",
      "level": 2,
      "text": "How to read queue state programmatically"
    },
    {
      "type": "p",
      "text": "Use di subgraph: `Vault.isQueueActive`, `currentEpoch`, `latestProcessedEpoch`, `pastEpochUnclaimedAssets`, `currentEpochRequestedShares`, and di `WithdrawalQueue` / `PriorityWithdrawalClaimed` / `PartialEpochRequestProcessed` entities. Check [Subgraph guide](/docs/03-advanced/05-subgraph-and-events)."
    }
  ],
  zh: [
    {
      "type": "quote",
      "text": "**级别：** 高级"
    },
    {
      "type": "heading",
      "level": 2,
      "text": "状态机（按纪元，简化版）"
    },
    {
      "type": "code",
      "lang": "",
      "code": "OPEN ── closeEpoch() (cutoff) ──► CLOSED ── processing ──► PROCESSED ── claim ──► CLAIMED\n  │                                  │\n  └ user may cancel                  └ user locked in; WITHDRAWAL_MANAGER may\n                                       moveRequestToNextEpoch(...)"
    },
    {
      "type": "ul",
      "items": [
        "**请求：** 份额被转入 vault 托管；请求被记录（`QueuedWithdrawal`）。",
        "**截止：** `closeEpoch()` 会冻结该纪元。此后用户无法取消。",
        "**处理：** 份额价格被锁定，份额被销毁，资产**首先从未分配余额中**预留，然后 **Allocator** 按照**撤资顺序**从各策略中撤出资金。",
        "**领取：** 用户调用 claim；资产离开 vault（`RequestClaimed`）。",
        "**滚动：** 如果因额度上限或延迟导致某个请求未被处理，它会滚入下一个纪元（`RequestMovedToNextEpoch`），并保持先进先出（FIFO）顺序。"
      ]
    },
    {
      "type": "heading",
      "level": 2,
      "text": "角色"
    },
    {
      "type": "table",
      "headers": [
        "角色",
        "权限"
      ],
      "rows": [
        [
          "`WITHDRAWAL_MANAGER`",
          "推进纪元（关闭 → 处理 → 领取）；可以将请求移到下一纪元；可以按当前汇率处理一个已关闭但未处理纪元（`epochID == latestEpochID − 1`）的**部分纪元请求**。"
        ],
        [
          "`PRIORITY_WITHDRAWAL_EXECUTOR`",
          "快速通道：立即按**当前活跃**纪元结算用户排队中的份额，支付 `grossAssets − unwindCost`。"
        ]
      ]
    },
    {
      "type": "heading",
      "level": 3,
      "text": "优先提款成本上限"
    },
    {
      "type": "p",
      "text": "`unwindCost` 由执行者在调用时提供，但必须 ≤ 管理员设定的上限 `unwindCostCapBP`（**默认 500 个基点，上限 10,000 个基点**，通过 `setUnwindCostCap` 设置）；超过上限调用会被回滚。`unwindCost` 会从该策略上报的分配额中扣除（通过异步会计机制），并在下次计提时进行核对。这是一个**受信任的运营角色**，不是自动化流程。"
    },
    {
      "type": "heading",
      "level": 2,
      "text": "分配操作中强制执行的不变量"
    },
    {
      "type": "p",
      "text": "`allocate(...)` 之后的后置条件：闲置余额必须覆盖**已锁定资产**，对于异步 vault，还需覆盖**过往纪元未领取资产**。这是为了保护已经被预留的领取权益。"
    },
    {
      "type": "heading",
      "level": 2,
      "text": "额度上限（按纪元）"
    },
    {
      "type": "p",
      "text": "额度上限 = 每个纪元可处理的 vault TVL 百分比。若请求量 ≤ 上限：正常处理。若超过上限：按 FIFO 处理至上限，其余滚动到下一纪元。等待中的用户仍会继续计息（其份额在处理前不会被销毁），但他们的**最终价格在处理时才确定**。"
    },
    {
      "type": "heading",
      "level": 2,
      "text": "冷却期/锁定期的相互作用"
    },
    {
      "type": "p",
      "text": "`DepositLockHook` / `DepositLockWithFeeHook` 会阻止锁定中的份额在解锁前被提取、赎回或转让。提前解锁需支付一笔递减的份额费用。"
    },
    {
      "type": "heading",
      "level": 2,
      "text": "需要理解的失败场景"
    },
    {
      "type": "table",
      "headers": [
        "场景",
        "影响"
      ],
      "rows": [
        [
          "策略会计数据推送延迟",
          "vault 暂停（包括纪元处理），直到问题修复"
        ],
        [
          "策略未被列入撤资顺序",
          "资产会被计入总额，但无法用于提款"
        ],
        [
          "vault 遭遇挤兑导致额度触顶",
          "形成跨纪元队列；按 FIFO 处理"
        ],
        [
          "vault 被暂停",
          "在解除暂停前无法升级"
        ]
      ]
    },
    {
      "type": "heading",
      "level": 2,
      "text": "以编程方式读取队列状态"
    },
    {
      "type": "p",
      "text": "使用 subgraph：`Vault.isQueueActive`、`currentEpoch`、`latestProcessedEpoch`、`pastEpochUnclaimedAssets`、`currentEpochRequestedShares`，以及 `WithdrawalQueue` / `PriorityWithdrawalClaimed` / `PartialEpochRequestProcessed` 等实体。参见 [Subgraph guide](/docs/03-advanced/05-subgraph-and-events)。"
    }
  ],
  id: [
    {
      "type": "quote",
      "text": "**Level:** Lanjutan"
    },
    {
      "type": "heading",
      "level": 2,
      "text": "State machine (per epoch, disederhanakan)"
    },
    {
      "type": "code",
      "lang": "",
      "code": "OPEN ── closeEpoch() (cutoff) ──► CLOSED ── processing ──► PROCESSED ── claim ──► CLAIMED\n  │                                  │\n  └ user may cancel                  └ user locked in; WITHDRAWAL_MANAGER may\n                                       moveRequestToNextEpoch(...)"
    },
    {
      "type": "ul",
      "items": [
        "**Request:** share dipindahkan ke custody vault; request dicatat (`QueuedWithdrawal`).",
        "**Cutoff:** `closeEpoch()` membekukan epoch. Setelah ini user tidak bisa membatalkan.",
        "**Processing:** harga share dikunci, share dibakar, aset dicadangkan dari **unallocated balance terlebih dahulu**, lalu **Allocator** menarik dana dari strategi sesuai **urutan deallokasi**.",
        "**Claim:** user memanggil claim; aset keluar dari vault (`RequestClaimed`).",
        "**Rollover:** jika cap atau delay membuat suatu request belum diproses, request itu pindah ke epoch berikutnya (`RequestMovedToNextEpoch`), urutan FIFO tetap terjaga."
      ]
    },
    {
      "type": "heading",
      "level": 2,
      "text": "Peran"
    },
    {
      "type": "table",
      "headers": [
        "Peran",
        "Kewenangan"
      ],
      "rows": [
        [
          "`WITHDRAWAL_MANAGER`",
          "Memajukan epoch (close → process → claim); bisa memindahkan request ke epoch berikutnya; bisa memproses **partial epoch request** untuk epoch yang sudah ditutup namun belum diproses (`epochID == latestEpochID − 1`) pada nilai tukar saat ini."
        ],
        [
          "`PRIORITY_WITHDRAWAL_EXECUTOR`",
          "Jalur cepat: langsung menyelesaikan share antrean user terhadap epoch yang **aktif**, membayar `grossAssets − unwindCost`."
        ]
      ]
    },
    {
      "type": "heading",
      "level": 3,
      "text": "Batas biaya priority withdrawal"
    },
    {
      "type": "p",
      "text": "`unwindCost` disediakan oleh executor saat pemanggilan, tetapi harus ≤ batas admin `unwindCostCapBP` (**default 500 bps, batas maksimal 10.000 bps**, diatur lewat `setUnwindCostCap`); di atas batas tersebut panggilan akan revert. `unwindCost` dipotong dari alokasi yang dilaporkan strategi (melalui akuntansi async), dan akrual berikutnya akan merekonsiliasi. Ini adalah **peran operasional tepercaya**, bukan otomatis."
    },
    {
      "type": "heading",
      "level": 2,
      "text": "Invariant yang diberlakukan pada alokasi"
    },
    {
      "type": "p",
      "text": "Postcondition setelah `allocate(...)`: saldo idle harus mencakup **aset terkunci** dan, pada vault async, **aset epoch lalu yang belum diklaim**. Ini melindungi klaim yang sudah dicadangkan."
    },
    {
      "type": "heading",
      "level": 2,
      "text": "Cap (per epoch)"
    },
    {
      "type": "p",
      "text": "Cap = % dari TVL vault yang diproses per epoch. Jika request ≤ cap: diproses normal. Jika > cap: diproses hingga batas cap secara FIFO, sisanya digulirkan. User yang menunggu tetap mendapat hasil (share mereka tidak dibakar sampai diproses) tetapi **harga final ditetapkan saat diproses**."
    },
    {
      "type": "heading",
      "level": 2,
      "text": "Interaksi cooldown/lock"
    },
    {
      "type": "p",
      "text": "`DepositLockHook` / `DepositLockWithFeeHook` mencegah share yang terkunci ditarik, ditebus, atau dipindahkan sebelum unlock. Unlock lebih awal dikenai fee yang menurun (decaying) dalam bentuk share."
    },
    {
      "type": "heading",
      "level": 2,
      "text": "Mode kegagalan yang perlu dipahami"
    },
    {
      "type": "table",
      "headers": [
        "Skenario",
        "Efek"
      ],
      "rows": [
        [
          "Push akuntansi strategi terlambat",
          "Vault berhenti (termasuk pemrosesan epoch) sampai diperbaiki"
        ],
        [
          "Strategi hilang dari urutan deallokasi",
          "Aset terhitung tapi tidak tersedia untuk penarikan"
        ],
        [
          "Cap terikat saat terjadi run pada vault",
          "Antrean multi-epoch; FIFO"
        ],
        [
          "Vault dijeda (paused)",
          "Tidak bisa di-upgrade sampai dijeda-batal"
        ]
      ]
    },
    {
      "type": "heading",
      "level": 2,
      "text": "Membaca status antrean secara terprogram"
    },
    {
      "type": "p",
      "text": "Gunakan subgraph: `Vault.isQueueActive`, `currentEpoch`, `latestProcessedEpoch`, `pastEpochUnclaimedAssets`, `currentEpochRequestedShares`, serta entitas `WithdrawalQueue` / `PriorityWithdrawalClaimed` / `PartialEpochRequestProcessed`. Lihat [Subgraph guide](/docs/03-advanced/05-subgraph-and-events)."
    }
  ],
};
