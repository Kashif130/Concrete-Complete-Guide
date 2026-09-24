import type { DocBlock } from "../docs.generated";
import type { Locale } from "@/lib/i18n";

// Full translation of docs/03-advanced/01-architecture-deep-dive.md.
// Contract/function names, role identifiers and the architecture diagram are left as in the English source.
export const architectureDeepDive: Partial<Record<Locale, DocBlock[]>> = {
  ur: [
  {
    type: "quote",
    text: "**Level:** Advanced · Source: official developer docs. **Concrete ka contract source private repository mein hai** (partners NDA sign karne ke baad access request kar sakte hain), is liye yeh page sirf documented behaviour describe karta hai."
  },
  {
    type: "heading",
    level: 2,
    text: "1. Chaar layers"
  },
  {
    type: "code",
    lang: "",
    code: "                 ┌─────────────────────────────┐\n                 │ Factory (UUPS, CREATE2)     │  deploys vaults, curates implementations,\n                 └──────────────┬──────────────┘  owns upgrade paths, sets fee recipients\n                                │ create()\n                 ┌──────────────▼──────────────┐\n   users ───────►│ Vault (ERC-4626, ERC-1967)  │  custody, shares, accounting, access control\n                 └───┬─────────────────────┬───┘\n     pre/post hooks  │                     │ allocate / deallocate / report value\n       ┌─────────────▼────┐       ┌────────▼────────────────────────────┐\n       │ Hook (≤1 target) │       │ Strategies (IStrategyTemplate)      │\n       │ HookContainer ×6 │       │ idle · lending · looping · multisig │\n       └──────────────────┘       └─────────────────────────────────────┘\n                                   Periphery Factory deploys strategies & helpers"
  },
  {
    type: "p",
    text: "Vault khud yield seek **nahi** karta. Product variants un modules mein hoti hain jinhe vault reference karta hai, is liye vault launch karna *modules compose karna* hai, contract fork karna nahi."
  },
  {
    type: "heading",
    level: 2,
    text: "2. Factory"
  },
  {
    type: "ul",
    items: [
      "**UUPS-upgradeable** hai; vaults ko **ERC-1967 proxies** ke tor par **CREATE2** se deploy karta hai.",
      "**Approved implementations ki registry** aur **migration paths** (`setMigratable`) maintain karta hai.",
      "**Vault deployment permissionless hai** (`create()`), lekin sirf approved, unblocked implementations se.",
      "Factory har vault proxy ka **immutable admin** hai; upgrade authority isse tab tak nahi hat sakti jab tak khud factory upgrade na ho. Vault ka `Ownable` owner transferable *hai* (`transferOwnership`) aur `factory.upgrade(...)` ko gate karta hai.",
      "**Periphery Factory** strategies/position helpers deploy karta hai aur `deregisterStrategy` support karta hai (kisi strategy ka proxy-admin naye owner ko de deta hai) - is se strategy custody kisi partner ko mil sakti hai jabke vault custody Concrete ke paas rehti hai."
    ]
  },
  {
    type: "heading",
    level: 2,
    text: "3. Vault implementations"
  },
  {
    type: "table",
    headers: [
      "Implementation",
      "Behaviour"
    ],
    rows: [
      [
        "**Standard** (Atomic)",
        "Baseline ERC-4626 + strategy allocation; single-tx withdraw hoti hai."
      ],
      [
        "**Async** (Queued Withdrawal)",
        "Epoch-based withdrawal queue; Vault Manager isse toggle karta hai."
      ],
      [
        "**Predeposit**",
        "Pre-staked assets ke liye LayerZero cross-chain claim flow. Claim path hooks ko bypass karta hai."
      ],
      [
        "**Bridged Standard / Bridged Async**",
        "Migrations ke liye one-shot `unbackedMint` add karta hai (`totalSupply()==0` aur `maxDepositLimit==0` chahiye)."
      ]
    ]
  },
  {
    type: "p",
    text: "Looping strategies aur fee splitting vault implementations **nahi** hain: looping aik strategy hai jo Standard vault mein plug hoti hai; fee splitting un downstream contracts mein hoti hai jinhe vault mint karta hai."
  },
  {
    type: "p",
    text: "Vault-level limits: max total deposit cap, min/max per deposit aur withdrawal, optional per-user cap."
  },
  {
    type: "heading",
    level: 2,
    text: "4. Vault internals: custody, shares, accounting"
  },
  {
    type: "ul",
    items: [
      "Deposit karne se ERC-20 shares mint hoti hain; redeem karne se woh burn ho jati hain.",
      "Vault total assets ka aik **cached snapshot** rakhta hai, jo kisi bhi economic op (`deposit`, `mint`, `withdraw`, `redeem`, `allocate`, configure, fee-recipient setters) se pehle `withYieldAccrual` modifier se refresh hota hai.",
      "Guarded ops ke andar conversions **cached snapshot** use karti hain, live `balanceOf` nahi → is se **donation/inflation attacks** se bachao hota hai.",
      "**`totalAssets()` cache ke barabar nahi hai:** yeh `_previewAccrueYieldAndFees()` call karta hai aur har active strategy ki `totalAllocatedValue()` live re-read karta hai. Cache `cachedTotalAssets()` ke tor par expose hoti hai.",
      "Sirf book-keeping ops (strategy registry, hooks, deallocation order, pause) modifier ko skip karte hain."
    ]
  },
  {
    type: "heading",
    level: 2,
    text: "5. Strategies"
  },
  {
    type: "ul",
    items: [
      "Aik vault ↔ aik strategy instance, wahi underlying asset, jo `IStrategyTemplate` implement karta hai.",
      "**Allocator** (`ALLOCATOR`) `vault.allocate(...)` ko per-strategy instructions ke sath call karta hai. Routing/sizing decisions off-chain hoti hain; vault sirf **postconditions** enforce karta hai (idle balance locked assets ko cover kare aur, async vaults par, past-epoch unclaimed assets). Koi policy on-chain decide nahi hoti.",
      "**Looping** strategy lender + flash + swap modules compose karti hai (teen interfaces mein taqreeban do dozen functions), is liye naye venues strategy contract change kiye bagair integrate ho sakte hain.",
      "**Reported values par trust:** vault jo kuch strategy report karti hai use sach mante hue leta hai - **on-vault delta threshold, oracle cross-check ya safety flag koi nahi hota**. Rails strategy-side par hoti hain:",
      "*On-chain accounting* → value chain state se calculate hoti hai.",
      "*Asynchronous accounting* → operator `accountingValidityPeriod` ke andar aik signed value push karta hai; agar push der se aaye ⇒ value function revert ho jata hai ⇒ `totalAssets()` revert ho jata hai ⇒ deposits, withdrawals, epoch processing rukk jati hain jab tak strategy admin `unpauseAndAdjustTotalAssets` call na kare ya Strategy Manager strategy ko inactive toggle na kare."
    ]
  },
  {
    type: "heading",
    level: 2,
    text: "5b. Hooks"
  },
  {
    type: "p",
    text: "Fixed lifecycle points par optional modules: `deposit`, `mint`, `withdraw`, `redeem`, `transfer` se pehle/baad mein. Vault **aik hook target + aik flag bitmap** store karta hai."
  },
  {
    type: "table",
    headers: [
      "Hook",
      "Purpose"
    ],
    rows: [
      [
        "`UserDepositCapHook`",
        "Per-user deposit cap (har vault mein aik)."
      ],
      [
        "`WhitelistUserDepositHook`",
        "Sirf approved addresses deposit kar sakte hain."
      ],
      [
        "`DepositLockHook`",
        "Minted shares ko time-lock karta hai; locked shares transfer/withdraw/redeem nahi ho sakti jab tak har lock expire na ho."
      ],
      [
        "`DepositLockWithFeeHook`",
        "**Shares mein time-decaying fee** ke sath early unlock add karta hai."
      ],
      [
        "`HookContainer`",
        "Aik vault call ko **chhe tak** hooks mein fan out karta hai."
      ]
    ]
  },
  {
    type: "p",
    text: "Gotchas: **kisi bhi hook mein revert pori operation ko revert kar deta hai** (aik buggy hook vault ko tab tak freeze kar sakta hai jab tak theek na ho; sirf `HOOK_MANAGER` hooks change kar sakta hai); hooks cross-chain claim paths ya `unbackedMint` ko gate nahi karte."
  },
  {
    type: "heading",
    level: 2,
    text: "6. Authority model"
  },
  {
    type: "p",
    text: "Authority teen axes mein taqseem hoti hai:"
  },
  {
    type: "table",
    headers: [
      "Axis",
      "Holder",
      "Powers"
    ],
    rows: [
      [
        "**Vault Owner**",
        "Ownable owner",
        "`factory.upgrade(...)` ko gate karta hai (role system se bahar)"
      ],
      [
        "**Roles**",
        "`ROLE_ADMIN` grant karta hai: `VAULT_MANAGER` (state), `STRATEGY_MANAGER` (strategies add/remove), `HOOK_MANAGER`, `ALLOCATOR`, `PAUSER`, `WITHDRAWAL_MANAGER`, `PRIORITY_WITHDRAWAL_EXECUTOR`",
        "Day-to-day ops; `DEFAULT_ADMIN_ROLE` jaan boojh kar unassigned rakha gaya hai"
      ],
      [
        "**Factory Owner**",
        "Protocol",
        "Har vault par fee-recipient config (vault roles ko bypass karta hai)"
      ]
    ]
  },
  {
    type: "p",
    text: "Operational keys alag parties mein taqseem ho sakti hain (curator ≠ allocator ≠ pauser). Concrete docs governance roles ko low-frequency/high-impact (Vault Admin ke paas) aur Allocator/Withdrawal Manager ko high-frequency/low-impact automated services label karti hain."
  },
  {
    type: "heading",
    level: 2,
    text: "7. Fee distribution"
  },
  {
    type: "p",
    text: "Fees `managementFeeRecipient` aur `performanceFeeRecipient` ko shares ke tor par mint hoti hain (factory owner set karta hai). Har aik generally aik **`TwoWayFeeSplitter`** (periphery) ki taraf point karta hai jo `mainRecipient` aur `secondaryRecipient` ke darmiyan `feeFractionOfSecondaryRecipient` (10,000 mein se bps) use kar ke split karta hai (`0` → sab main, `10000` → sab secondary). Koi bhi `distributeFees(vault)` call kar sakta hai."
  },
  {
    type: "heading",
    level: 2,
    text: "8. Operational pitfalls (curators aur integrators ke liye checklist)"
  },
  {
    type: "ul",
    items: [
      "[ ] Aik fresh vault **production-ready nahi** hota: sirf `ROLE_ADMIN` aur `VAULT_MANAGER` grant hote hain (`initialVaultManager` ko). Baqi explicitly grant karein.",
      "[ ] **Paused vaults upgrade complete nahi kar sakte** (`_upgrade` `whenNotPaused` hai) - emergency response plan karein.",
      "[ ] **Deallocation order load-bearing hota hai.** Order se missing strategy phir bhi `totalAssets()` mein count hoti hai lekin user withdrawals ke liye drain nahi ki ja sakti.",
      "[ ] `accountingValidityPeriod` ko operator availability ke hisab se size karein.",
      "[ ] Whitelist hook + predeposit/bridged flows ko alag gating chahiye.",
      "[ ] Hook misconfiguration = vault-wide DoS risk.",
      "[ ] Withdrawal caps/cooldowns aapas mein interact karte hain - combined behaviour test karein."
    ]
  }
],

  hi: [
  {
    type: "quote",
    text: "**स्तर:** Advanced · Source: official developer docs। **Concrete का contract source private repository में है** (partners NDA sign करने के बाद access request कर सकते हैं), इसलिए यह page सिर्फ़ documented behaviour describe करता है।"
  },
  {
    type: "heading",
    level: 2,
    text: "1. चार layers"
  },
  {
    type: "code",
    lang: "",
    code: "                 ┌─────────────────────────────┐\n                 │ Factory (UUPS, CREATE2)     │  deploys vaults, curates implementations,\n                 └──────────────┬──────────────┘  owns upgrade paths, sets fee recipients\n                                │ create()\n                 ┌──────────────▼──────────────┐\n   users ───────►│ Vault (ERC-4626, ERC-1967)  │  custody, shares, accounting, access control\n                 └───┬─────────────────────┬───┘\n     pre/post hooks  │                     │ allocate / deallocate / report value\n       ┌─────────────▼────┐       ┌────────▼────────────────────────────┐\n       │ Hook (≤1 target) │       │ Strategies (IStrategyTemplate)      │\n       │ HookContainer ×6 │       │ idle · lending · looping · multisig │\n       └──────────────────┘       └─────────────────────────────────────┘\n                                   Periphery Factory deploys strategies & helpers"
  },
  {
    type: "p",
    text: "Vault खुद yield seek **नहीं** करता। Product variants उन modules में होती हैं जिन्हें vault reference करता है, इसलिए vault launch करना *modules compose करना* है, contract fork करना नहीं।"
  },
  {
    type: "heading",
    level: 2,
    text: "2. Factory"
  },
  {
    type: "ul",
    items: [
      "**UUPS-upgradeable** है; vaults को **ERC-1967 proxies** के तौर पर **CREATE2** से deploy करता है।",
      "**Approved implementations की registry** और **migration paths** (`setMigratable`) maintain करता है।",
      "**Vault deployment permissionless है** (`create()`), लेकिन सिर्फ़ approved, unblocked implementations से।",
      "Factory हर vault proxy का **immutable admin** है; upgrade authority इससे तब तक नहीं हट सकती जब तक खुद factory upgrade न हो। Vault का `Ownable` owner transferable *है* (`transferOwnership`) और `factory.upgrade(...)` को gate करता है।",
      "**Periphery Factory** strategies/position helpers deploy करता है और `deregisterStrategy` support करता है (किसी strategy का proxy-admin नए owner को दे देता है) - इससे strategy custody किसी partner को मिल सकती है जबकि vault custody Concrete के पास रहती है।"
    ]
  },
  {
    type: "heading",
    level: 2,
    text: "3. Vault implementations"
  },
  {
    type: "table",
    headers: [
      "Implementation",
      "Behaviour"
    ],
    rows: [
      [
        "**Standard** (Atomic)",
        "Baseline ERC-4626 + strategy allocation; single-tx withdraw होती है।"
      ],
      [
        "**Async** (Queued Withdrawal)",
        "Epoch-based withdrawal queue; Vault Manager इसे toggle करता है।"
      ],
      [
        "**Predeposit**",
        "Pre-staked assets के लिए LayerZero cross-chain claim flow। Claim path hooks को bypass करता है।"
      ],
      [
        "**Bridged Standard / Bridged Async**",
        "Migrations के लिए one-shot `unbackedMint` add करता है (`totalSupply()==0` और `maxDepositLimit==0` चाहिए)।"
      ]
    ]
  },
  {
    type: "p",
    text: "Looping strategies और fee splitting vault implementations **नहीं** हैं: looping एक strategy है जो Standard vault में plug होती है; fee splitting उन downstream contracts में होती है जिन्हें vault mint करता है।"
  },
  {
    type: "p",
    text: "Vault-level limits: max total deposit cap, min/max per deposit और withdrawal, optional per-user cap।"
  },
  {
    type: "heading",
    level: 2,
    text: "4. Vault internals: custody, shares, accounting"
  },
  {
    type: "ul",
    items: [
      "Deposit करने से ERC-20 shares mint होती हैं; redeem करने से वे burn हो जाती हैं।",
      "Vault total assets का एक **cached snapshot** रखता है, जो किसी भी economic op (`deposit`, `mint`, `withdraw`, `redeem`, `allocate`, configure, fee-recipient setters) से पहले `withYieldAccrual` modifier से refresh होता है।",
      "Guarded ops के अंदर conversions **cached snapshot** use करती हैं, live `balanceOf` नहीं → इससे **donation/inflation attacks** से बचाव होता है।",
      "**`totalAssets()` cache के बराबर नहीं है:** यह `_previewAccrueYieldAndFees()` call करता है और हर active strategy की `totalAllocatedValue()` live re-read करता है। Cache `cachedTotalAssets()` के तौर पर expose होती है।",
      "सिर्फ़ book-keeping ops (strategy registry, hooks, deallocation order, pause) modifier को skip करते हैं।"
    ]
  },
  {
    type: "heading",
    level: 2,
    text: "5. Strategies"
  },
  {
    type: "ul",
    items: [
      "एक vault ↔ एक strategy instance, वही underlying asset, जो `IStrategyTemplate` implement करता है।",
      "**Allocator** (`ALLOCATOR`) `vault.allocate(...)` को per-strategy instructions के साथ call करता है। Routing/sizing decisions off-chain होती हैं; vault सिर्फ़ **postconditions** enforce करता है (idle balance locked assets को cover करे और, async vaults पर, past-epoch unclaimed assets)। कोई policy on-chain decide नहीं होती।",
      "**Looping** strategy lender + flash + swap modules compose करती है (तीन interfaces में तक़रीबन दो दर्जन functions), इसलिए नए venues strategy contract change किए बिना integrate हो सकते हैं।",
      "**Reported values पर trust:** vault जो कुछ strategy report करती है उसे सच मानते हुए लेता है - **on-vault delta threshold, oracle cross-check या safety flag कोई नहीं होता**। Rails strategy-side पर होती हैं:",
      "*On-chain accounting* → value chain state से calculate होती है।",
      "*Asynchronous accounting* → operator `accountingValidityPeriod` के अंदर एक signed value push करता है; अगर push देर से आए ⇒ value function revert हो जाता है ⇒ `totalAssets()` revert हो जाता है ⇒ deposits, withdrawals, epoch processing रुक जाती हैं जब तक strategy admin `unpauseAndAdjustTotalAssets` call न करे या Strategy Manager strategy को inactive toggle न करे।"
    ]
  },
  {
    type: "heading",
    level: 2,
    text: "5b. Hooks"
  },
  {
    type: "p",
    text: "Fixed lifecycle points पर optional modules: `deposit`, `mint`, `withdraw`, `redeem`, `transfer` से पहले/बाद में। Vault **एक hook target + एक flag bitmap** store करता है।"
  },
  {
    type: "table",
    headers: [
      "Hook",
      "Purpose"
    ],
    rows: [
      [
        "`UserDepositCapHook`",
        "Per-user deposit cap (हर vault में एक)।"
      ],
      [
        "`WhitelistUserDepositHook`",
        "सिर्फ़ approved addresses deposit कर सकते हैं।"
      ],
      [
        "`DepositLockHook`",
        "Minted shares को time-lock करता है; locked shares transfer/withdraw/redeem नहीं हो सकतीं जब तक हर lock expire न हो।"
      ],
      [
        "`DepositLockWithFeeHook`",
        "**Shares में time-decaying fee** के साथ early unlock add करता है।"
      ],
      [
        "`HookContainer`",
        "एक vault call को **छह तक** hooks में fan out करता है।"
      ]
    ]
  },
  {
    type: "p",
    text: "Gotchas: **किसी भी hook में revert पूरी operation को revert कर देता है** (एक buggy hook vault को तब तक freeze कर सकता है जब तक ठीक न हो; सिर्फ़ `HOOK_MANAGER` hooks change कर सकता है); hooks cross-chain claim paths या `unbackedMint` को gate नहीं करते।"
  },
  {
    type: "heading",
    level: 2,
    text: "6. Authority model"
  },
  {
    type: "p",
    text: "Authority तीन axes में तक़सीम होती है:"
  },
  {
    type: "table",
    headers: [
      "Axis",
      "Holder",
      "Powers"
    ],
    rows: [
      [
        "**Vault Owner**",
        "Ownable owner",
        "`factory.upgrade(...)` को gate करता है (role system से बाहर)"
      ],
      [
        "**Roles**",
        "`ROLE_ADMIN` grant करता है: `VAULT_MANAGER` (state), `STRATEGY_MANAGER` (strategies add/remove), `HOOK_MANAGER`, `ALLOCATOR`, `PAUSER`, `WITHDRAWAL_MANAGER`, `PRIORITY_WITHDRAWAL_EXECUTOR`",
        "Day-to-day ops; `DEFAULT_ADMIN_ROLE` जान-बूझकर unassigned रखा गया है"
      ],
      [
        "**Factory Owner**",
        "Protocol",
        "हर vault पर fee-recipient config (vault roles को bypass करता है)"
      ]
    ]
  },
  {
    type: "p",
    text: "Operational keys अलग parties में तक़सीम हो सकती हैं (curator ≠ allocator ≠ pauser)। Concrete docs governance roles को low-frequency/high-impact (Vault Admin के पास) और Allocator/Withdrawal Manager को high-frequency/low-impact automated services label करती हैं।"
  },
  {
    type: "heading",
    level: 2,
    text: "7. Fee distribution"
  },
  {
    type: "p",
    text: "Fees `managementFeeRecipient` और `performanceFeeRecipient` को shares के तौर पर mint होती हैं (factory owner set करता है)। हर एक आमतौर पर एक **`TwoWayFeeSplitter`** (periphery) की ओर point करता है जो `mainRecipient` और `secondaryRecipient` के दरमियान `feeFractionOfSecondaryRecipient` (10,000 में से bps) यूज़ करके split करता है (`0` → सब main, `10000` → सब secondary)। कोई भी `distributeFees(vault)` call कर सकता है।"
  },
  {
    type: "heading",
    level: 2,
    text: "8. Operational pitfalls (curators और integrators के लिए checklist)"
  },
  {
    type: "ul",
    items: [
      "[ ] एक fresh vault **production-ready नहीं** होता: सिर्फ़ `ROLE_ADMIN` और `VAULT_MANAGER` grant होते हैं (`initialVaultManager` को)। बाक़ी explicitly grant करें।",
      "[ ] **Paused vaults upgrade complete नहीं कर सकते** (`_upgrade` `whenNotPaused` है) - emergency response plan करें।",
      "[ ] **Deallocation order load-bearing होता है।** Order से missing strategy फिर भी `totalAssets()` में count होती है लेकिन user withdrawals के लिए drain नहीं की जा सकती।",
      "[ ] `accountingValidityPeriod` को operator availability के हिसाब से size करें।",
      "[ ] Whitelist hook + predeposit/bridged flows को अलग gating चाहिए।",
      "[ ] Hook misconfiguration = vault-wide DoS risk।",
      "[ ] Withdrawal caps/cooldowns आपस में interact करते हैं - combined behaviour test करें।"
    ]
  }
],

  pcm: [
  {
    type: "quote",
    text: "**Level:** Advanced · Source: official developer docs. **Concrete contract source dey inside private repository** (partners fit request access afta dem sign NDA), so dis page dey describe only documented behaviour."
  },
  {
    type: "heading",
    level: 2,
    text: "1. Four layers"
  },
  {
    type: "code",
    lang: "",
    code: "                 ┌─────────────────────────────┐\n                 │ Factory (UUPS, CREATE2)     │  deploys vaults, curates implementations,\n                 └──────────────┬──────────────┘  owns upgrade paths, sets fee recipients\n                                │ create()\n                 ┌──────────────▼──────────────┐\n   users ───────►│ Vault (ERC-4626, ERC-1967)  │  custody, shares, accounting, access control\n                 └───┬─────────────────────┬───┘\n     pre/post hooks  │                     │ allocate / deallocate / report value\n       ┌─────────────▼────┐       ┌────────▼────────────────────────────┐\n       │ Hook (≤1 target) │       │ Strategies (IStrategyTemplate)      │\n       │ HookContainer ×6 │       │ idle · lending · looping · multisig │\n       └──────────────────┘       └─────────────────────────────────────┘\n                                   Periphery Factory deploys strategies & helpers"
  },
  {
    type: "p",
    text: "Di vault no dey seek yield by imself. Product variants dey live inside di modules wey di vault dey reference, so launching a vault na *composing modules*, e no be forking a contract."
  },
  {
    type: "heading",
    level: 2,
    text: "2. Factory"
  },
  {
    type: "ul",
    items: [
      "E dey **UUPS-upgradeable**; e dey use **CREATE2** deploy vaults as **ERC-1967 proxies**.",
      "E dey keep **registry of approved implementations** and **migration paths** (`setMigratable`).",
      "**Vault deployment no need permission** (`create()`), but na only from approved, unblocked implementations.",
      "Di factory na di **immutable admin** for every vault proxy; upgrade authority no fit comot from am unless dem upgrade di factory. Di vault `Ownable` owner *fit* transfer (`transferOwnership`) and e dey gate `factory.upgrade(...)`.",
      "**Periphery Factory** dey deploy strategies/position helpers and e support `deregisterStrategy` (e dey hand proxy-admin of a strategy give new owner) - so strategy custody fit go to a partner while vault custody remain with Concrete."
    ]
  },
  {
    type: "heading",
    level: 2,
    text: "3. Vault implementations"
  },
  {
    type: "table",
    headers: [
      "Implementation",
      "Behaviour"
    ],
    rows: [
      [
        "**Standard** (Atomic)",
        "Baseline ERC-4626 + strategy allocation; e get single-tx withdraw."
      ],
      [
        "**Async** (Queued Withdrawal)",
        "Epoch-based withdrawal queue; Vault Manager dey toggle am."
      ],
      [
        "**Predeposit**",
        "LayerZero cross-chain claim flow for pre-staked assets. Claim path dey bypass hooks."
      ],
      [
        "**Bridged Standard / Bridged Async**",
        "E dey add one-shot `unbackedMint` (need `totalSupply()==0` and `maxDepositLimit==0`) for migrations."
      ]
    ]
  },
  {
    type: "p",
    text: "Looping strategies and fee splitting no be vault implementations: looping na strategy wey dem plug into Standard vault; fee splitting dey live for downstream contracts wey di vault dey mint go."
  },
  {
    type: "p",
    text: "Vault-level limits: max total deposit cap, min/max per deposit and withdrawal, optional per-user cap."
  },
  {
    type: "heading",
    level: 2,
    text: "4. Vault internals: custody, shares, accounting"
  },
  {
    type: "ul",
    items: [
      "When you deposit, e dey mint ERC-20 shares; when you redeem, e dey burn dem.",
      "Di vault dey keep **cached snapshot** of total assets, wey `withYieldAccrual` modifier dey refresh before any economic op (`deposit`, `mint`, `withdraw`, `redeem`, `allocate`, configure, fee-recipient setters).",
      "Conversions inside guarded ops dey use **cached snapshot**, no be live `balanceOf` → e dey defend against **donation / inflation attacks**.",
      "**`totalAssets()` no be same as di cache:** e dey call `_previewAccrueYieldAndFees()` and e dey re-read each active strategy `totalAllocatedValue()` live. Dem expose di cache as `cachedTotalAssets()`.",
      "Pure book-keeping ops (strategy registry, hooks, deallocation order, pause) dey skip di modifier."
    ]
  },
  {
    type: "heading",
    level: 2,
    text: "5. Strategies"
  },
  {
    type: "ul",
    items: [
      "One vault ↔ one strategy instance, same underlying asset, wey dey implement `IStrategyTemplate`.",
      "Di **Allocator** (`ALLOCATOR`) dey call `vault.allocate(...)` with per-strategy instructions. Routing/sizing decisions dey off-chain; di vault only dey enforce **postconditions** (idle balance must cover locked assets and, for async vaults, past-epoch unclaimed assets). No policy dey decided on-chain.",
      "**Looping** strategy dey compose lender + flash + swap modules (around two dozen functions across three interfaces), so new venues fit integrate without changing di strategy contract.",
      "**Trust for reported values:** di vault dey treat wetin strategy report as truth - **no on-vault delta threshold, oracle cross-check or safety flag**. Di rails dey live for strategy-side:",
      "*On-chain accounting* → dem dey compute value from chain state.",
      "*Asynchronous accounting* → operator dey push signed value within `accountingValidityPeriod`; if di push late ⇒ value function go revert ⇒ `totalAssets()` go revert ⇒ deposits, withdrawals, epoch processing go halt until strategy admin call `unpauseAndAdjustTotalAssets` or Strategy Manager toggle di strategy make e inactive."
    ]
  },
  {
    type: "heading",
    level: 2,
    text: "5b. Hooks"
  },
  {
    type: "p",
    text: "Optional modules for fixed lifecycle points: before/after `deposit`, `mint`, `withdraw`, `redeem`, `transfer`. Di vault dey store **one hook target + one flag bitmap**."
  },
  {
    type: "table",
    headers: [
      "Hook",
      "Purpose"
    ],
    rows: [
      [
        "`UserDepositCapHook`",
        "Per-user deposit cap (one per vault)."
      ],
      [
        "`WhitelistUserDepositHook`",
        "Na only approved addresses fit deposit."
      ],
      [
        "`DepositLockHook`",
        "E dey time-lock minted shares; locked shares no fit transfer/withdraw/redeem until each lock expire."
      ],
      [
        "`DepositLockWithFeeHook`",
        "E dey add early unlock for **time-decaying fee in shares**."
      ],
      [
        "`HookContainer`",
        "E dey fan one vault call out to **up to six** hooks."
      ]
    ]
  },
  {
    type: "p",
    text: "Gotchas: **if any hook revert, e go revert di whole operation** (buggy hook fit freeze di vault until dem fix am; na only `HOOK_MANAGER` fit change hooks); hooks no dey gate cross-chain claim paths or `unbackedMint`."
  },
  {
    type: "heading",
    level: 2,
    text: "6. Authority model"
  },
  {
    type: "p",
    text: "Dem split authority across three axes:"
  },
  {
    type: "table",
    headers: [
      "Axis",
      "Holder",
      "Powers"
    ],
    rows: [
      [
        "**Vault Owner**",
        "Ownable owner",
        "E dey gate `factory.upgrade(...)` (outside role system)"
      ],
      [
        "**Roles**",
        "`ROLE_ADMIN` dey grant: `VAULT_MANAGER` (state), `STRATEGY_MANAGER` (add/remove strategies), `HOOK_MANAGER`, `ALLOCATOR`, `PAUSER`, `WITHDRAWAL_MANAGER`, `PRIORITY_WITHDRAWAL_EXECUTOR`",
        "Day-to-day ops; dem leave `DEFAULT_ADMIN_ROLE` unassigned on purpose"
      ],
      [
        "**Factory Owner**",
        "Protocol",
        "Fee-recipient config for every vault (e dey bypass vault roles)"
      ]
    ]
  },
  {
    type: "p",
    text: "Dem fit split operational keys between different parties (curator ≠ allocator ≠ pauser). Concrete docs dey label governance roles as low-frequency/high-impact (Vault Admin dey hold am) and Allocator/Withdrawal Manager as high-frequency/low-impact automated services."
  },
  {
    type: "heading",
    level: 2,
    text: "7. Fee distribution"
  },
  {
    type: "p",
    text: "Dem dey mint fees as shares go `managementFeeRecipient` and `performanceFeeRecipient` (factory owner dey set am). Each one dey usually point to **`TwoWayFeeSplitter`** (periphery) wey dey split between `mainRecipient` and `secondaryRecipient` using `feeFractionOfSecondaryRecipient` in bps out of 10,000 (`0` → everything go main, `10000` → everything go secondary). Anybody fit call `distributeFees(vault)`."
  },
  {
    type: "heading",
    level: 2,
    text: "8. Operational pitfalls (checklist for curators & integrators)"
  },
  {
    type: "ul",
    items: [
      "[ ] Fresh vault **no dey production-ready**: na only `ROLE_ADMIN` and `VAULT_MANAGER` dem grant (go `initialVaultManager`). Grant di rest explicitly.",
      "[ ] **Paused vaults no fit complete upgrade** (`_upgrade` na `whenNotPaused`) - plan emergency response.",
      "[ ] **Deallocation order na load-bearing.** If strategy dey missing from di order, e still dey count for `totalAssets()` but dem no fit drain am for user withdrawals.",
      "[ ] Size `accountingValidityPeriod` based on operator availability.",
      "[ ] Whitelist hook + predeposit/bridged flows need separate gating.",
      "[ ] Hook misconfiguration = vault-wide DoS risk.",
      "[ ] Withdrawal caps/cooldowns dey interact - test di combined behaviour."
    ]
  }
],

  zh: [
  {
    type: "quote",
    text: "**级别：** 高级 · 来源：官方开发者文档。**Concrete 的合约源代码位于私有仓库**（合作伙伴签署 NDA 后可申请访问），因此本页仅描述已记录的行为。"
  },
  {
    type: "heading",
    level: 2,
    text: "1. 四层架构"
  },
  {
    type: "code",
    lang: "",
    code: "                 ┌─────────────────────────────┐\n                 │ Factory (UUPS, CREATE2)     │  deploys vaults, curates implementations,\n                 └──────────────┬──────────────┘  owns upgrade paths, sets fee recipients\n                                │ create()\n                 ┌──────────────▼──────────────┐\n   users ───────►│ Vault (ERC-4626, ERC-1967)  │  custody, shares, accounting, access control\n                 └───┬─────────────────────┬───┘\n     pre/post hooks  │                     │ allocate / deallocate / report value\n       ┌─────────────▼────┐       ┌────────▼────────────────────────────┐\n       │ Hook (≤1 target) │       │ Strategies (IStrategyTemplate)      │\n       │ HookContainer ×6 │       │ idle · lending · looping · multisig │\n       └──────────────────┘       └─────────────────────────────────────┘\n                                   Periphery Factory deploys strategies & helpers"
  },
  {
    type: "p",
    text: "vault 本身**不**寻求收益。产品的差异化体现在 vault 所引用的模块中，因此发布一个 vault 是在*组合模块*，而不是 fork 一份合约。"
  },
  {
    type: "heading",
    level: 2,
    text: "2. Factory（工厂合约）"
  },
  {
    type: "ul",
    items: [
      "**支持 UUPS 升级**；通过 **CREATE2** 将 vault 部署为 **ERC-1967 代理**。",
      "维护**已批准实现的注册表**以及**迁移路径**（`setMigratable`）。",
      "**Vault 部署无需许可**（`create()`），但仅限已批准且未被封锁的实现。",
      "Factory 是每个 vault 代理的**不可变管理员**；除非升级 factory 本身，否则升级权限无法转移。Vault 的 `Ownable` owner *可以*转让（`transferOwnership`），并对 `factory.upgrade(...)` 进行把关。",
      "**Periphery Factory** 负责部署策略/仓位辅助合约，并支持 `deregisterStrategy`（将某个策略的 proxy-admin 移交给新的所有者）——因此策略托管权可以交给合作伙伴，而 vault 托管权仍留在 Concrete 手中。"
    ]
  },
  {
    type: "heading",
    level: 2,
    text: "3. Vault 实现类型"
  },
  {
    type: "table",
    headers: [
      "Implementation",
      "Behaviour"
    ],
    rows: [
      [
        "**Standard**（原子式）",
        "基础 ERC-4626 + 策略分配；单笔交易即可提现。"
      ],
      [
        "**Async**（排队提现）",
        "基于 epoch 的提现队列；由 Vault Manager 切换。"
      ],
      [
        "**Predeposit**（预存款）",
        "面向预质押资产的 LayerZero 跨链领取流程。领取路径会绕过 hooks。"
      ],
      [
        "**Bridged Standard / Bridged Async**",
        "为迁移场景新增一次性 `unbackedMint`（需要 `totalSupply()==0` 且 `maxDepositLimit==0`）。"
      ]
    ]
  },
  {
    type: "p",
    text: "Looping 策略和费用拆分**并不是** vault 实现方式：looping 是接入 Standard vault 的一种策略；费用拆分发生在 vault 铸造代币指向的下游合约中。"
  },
  {
    type: "p",
    text: "Vault 级别限制：最高总存款上限、单次存取款的最小/最大额度、可选的单用户上限。"
  },
  {
    type: "heading",
    level: 2,
    text: "4. Vault 内部机制：托管、份额与记账"
  },
  {
    type: "ul",
    items: [
      "存款会铸造 ERC-20 份额；赎回则会销毁它们。",
      "Vault 保留总资产的**缓存快照**，在任何经济操作（`deposit`、`mint`、`withdraw`、`redeem`、`allocate`、配置、fee-recipient 设置）之前由 `withYieldAccrual` 修饰符刷新。",
      "受保护操作中的换算使用**缓存快照**，而非实时的 `balanceOf` → 用于防御**捐赠/通胀攻击**。",
      "**`totalAssets()` 不等于缓存：** 它会调用 `_previewAccrueYieldAndFees()` 并实时重新读取每个活跃策略的 `totalAllocatedValue()`。缓存则通过 `cachedTotalAssets()` 暴露出来。",
      "纯记账类操作（策略注册表、hooks、deallocation 顺序、暂停）会跳过该修饰符。"
    ]
  },
  {
    type: "heading",
    level: 2,
    text: "5. 策略（Strategies）"
  },
  {
    type: "ul",
    items: [
      "一个 vault 对应一个策略实例，使用相同的底层资产，并实现 `IStrategyTemplate`。",
      "**Allocator**（`ALLOCATOR`）通过 `vault.allocate(...)` 传入针对各策略的指令。路由/规模决策发生在链下；vault 只强制执行**事后条件**（闲置余额需覆盖已锁定资产，异步 vault 还需覆盖过去 epoch 中未领取的资产）。链上不做任何策略决策。",
      "**Looping** 策略由借贷+闪电贷+兑换模块组合而成（约三个接口、二十多个函数），因此接入新场所无需改动策略合约。",
      "**对上报数值的信任：** vault 将策略上报的数值视为真实值——**vault 端不设差值阈值、预言机交叉验证或安全标志**。相关护栏在策略端：",
      "*链上记账* → 数值根据链上状态计算得出。",
      "*异步记账* → 运营方需在 `accountingValidityPeriod` 内推送已签名的数值；若推送延迟 ⇒ value 函数回滚 ⇒ `totalAssets()` 回滚 ⇒ 存款、取款、epoch 处理都会暂停，直到策略管理员调用 `unpauseAndAdjustTotalAssets`，或 Strategy Manager 将该策略切换为不活跃。"
    ]
  },
  {
    type: "heading",
    level: 2,
    text: "5b. Hooks（钩子）"
  },
  {
    type: "p",
    text: "在固定生命周期节点上的可选模块：`deposit`、`mint`、`withdraw`、`redeem`、`transfer` 前后。Vault 存储**一个 hook 目标 + 一个标志位图**。"
  },
  {
    type: "table",
    headers: [
      "Hook",
      "Purpose"
    ],
    rows: [
      [
        "`UserDepositCapHook`",
        "单用户存款上限（每个 vault 一个）。"
      ],
      [
        "`WhitelistUserDepositHook`",
        "仅允许已批准地址存款。"
      ],
      [
        "`DepositLockHook`",
        "对已铸造份额进行时间锁定；在锁定到期前，被锁定份额无法转账/提现/赎回。"
      ],
      [
        "`DepositLockWithFeeHook`",
        "支持提前解锁，需支付**按时间递减的份额费用**。"
      ],
      [
        "`HookContainer`",
        "将一次 vault 调用分发给**最多六个** hooks。"
      ]
    ]
  },
  {
    type: "p",
    text: "注意事项：**任何 hook 中的 revert 都会导致整个操作回滚**（有 bug 的 hook 可能冻结 vault，直到被修复；只有 `HOOK_MANAGER` 能修改 hooks）；hooks 无法对跨链领取路径或 `unbackedMint` 进行限制。"
  },
  {
    type: "heading",
    level: 2,
    text: "6. 权限模型"
  },
  {
    type: "p",
    text: "权限分布在三个维度上："
  },
  {
    type: "table",
    headers: [
      "Axis",
      "Holder",
      "Powers"
    ],
    rows: [
      [
        "**Vault Owner**",
        "Ownable owner",
        "把关 `factory.upgrade(...)`（在角色体系之外）"
      ],
      [
        "**Roles**",
        "`ROLE_ADMIN` 可授予：`VAULT_MANAGER`（状态）、`STRATEGY_MANAGER`（增删策略）、`HOOK_MANAGER`、`ALLOCATOR`、`PAUSER`、`WITHDRAWAL_MANAGER`、`PRIORITY_WITHDRAWAL_EXECUTOR`",
        "日常运营；`DEFAULT_ADMIN_ROLE` 刻意不分配"
      ],
      [
        "**Factory Owner**",
        "协议方",
        "为每个 vault 配置 fee-recipient（绕过 vault 角色体系）"
      ]
    ]
  },
  {
    type: "p",
    text: "运营密钥可以在不同方之间拆分（curator ≠ allocator ≠ pauser）。Concrete 文档将治理角色标记为低频/高影响力（由 Vault Admin 持有），而将 Allocator/Withdrawal Manager 标记为高频/低影响力的自动化服务。"
  },
  {
    type: "heading",
    level: 2,
    text: "7. 费用分配"
  },
  {
    type: "p",
    text: "费用会以份额形式铸造给 `managementFeeRecipient` 和 `performanceFeeRecipient`（由 factory owner 设置）。两者通常都指向一个 **`TwoWayFeeSplitter`**（periphery 合约），该合约用 `feeFractionOfSecondaryRecipient`（以万分之一为单位）在 `mainRecipient` 和 `secondaryRecipient` 之间分配（`0` → 全部给 main，`10000` → 全部给 secondary）。任何人都可以调用 `distributeFees(vault)`。"
  },
  {
    type: "heading",
    level: 2,
    text: "8. 常见运营陷阱（面向 curator 与 integrator 的检查清单）"
  },
  {
    type: "ul",
    items: [
      "[ ] 全新 vault **尚不具备生产就绪状态**：只授予了 `ROLE_ADMIN` 和 `VAULT_MANAGER`（授予 `initialVaultManager`）。其余角色需显式授予。",
      "[ ] **已暂停的 vault 无法完成升级**（`_upgrade` 依赖 `whenNotPaused`）——需提前规划应急方案。",
      "[ ] **Deallocation 顺序至关重要。** 未列入顺序的策略仍会计入 `totalAssets()`，但无法为用户提现而被抽走。",
      "[ ] 根据运营方的可用性来设定 `accountingValidityPeriod` 大小。",
      "[ ] 白名单 hook + predeposit/bridged 流程需要单独设置准入控制。",
      "[ ] Hook 配置错误 = 整个 vault 面临 DoS 风险。",
      "[ ] 提现上限与冷却期会相互影响——需测试它们的组合行为。"
    ]
  }
],

  id: [
  {
    type: "quote",
    text: "**Level:** Lanjutan · Sumber: dokumentasi developer resmi. **Kode sumber kontrak Concrete berada di repository privat** (partner bisa meminta akses setelah menandatangani NDA), jadi halaman ini hanya menjelaskan perilaku yang terdokumentasi."
  },
  {
    type: "heading",
    level: 2,
    text: "1. Empat lapisan"
  },
  {
    type: "code",
    lang: "",
    code: "                 ┌─────────────────────────────┐\n                 │ Factory (UUPS, CREATE2)     │  deploys vaults, curates implementations,\n                 └──────────────┬──────────────┘  owns upgrade paths, sets fee recipients\n                                │ create()\n                 ┌──────────────▼──────────────┐\n   users ───────►│ Vault (ERC-4626, ERC-1967)  │  custody, shares, accounting, access control\n                 └───┬─────────────────────┬───┘\n     pre/post hooks  │                     │ allocate / deallocate / report value\n       ┌─────────────▼────┐       ┌────────▼────────────────────────────┐\n       │ Hook (≤1 target) │       │ Strategies (IStrategyTemplate)      │\n       │ HookContainer ×6 │       │ idle · lending · looping · multisig │\n       └──────────────────┘       └─────────────────────────────────────┘\n                                   Periphery Factory deploys strategies & helpers"
  },
  {
    type: "p",
    text: "Vault itu sendiri **tidak** mencari yield. Varian produk ada di modul-modul yang direferensikan vault, jadi meluncurkan vault adalah *menyusun modul*, bukan fork kontrak."
  },
  {
    type: "heading",
    level: 2,
    text: "2. Factory"
  },
  {
    type: "ul",
    items: [
      "**Bisa di-upgrade lewat UUPS**; men-deploy vault sebagai **ERC-1967 proxy** memakai **CREATE2**.",
      "Menyimpan **registry implementasi yang disetujui** dan **jalur migrasi** (`setMigratable`).",
      "**Deployment vault bersifat permissionless** (`create()`), tapi hanya dari implementasi yang disetujui dan tidak diblokir.",
      "Factory adalah **admin permanen (immutable)** untuk setiap vault proxy; otoritas upgrade tidak bisa dipindah kecuali factory itu sendiri di-upgrade. `Ownable` owner milik vault *bisa* dipindahkan (`transferOwnership`) dan menjadi gerbang untuk `factory.upgrade(...)`.",
      "**Periphery Factory** men-deploy strategy/position helper dan mendukung `deregisterStrategy` (menyerahkan proxy-admin suatu strategy ke owner baru) - jadi custody strategy bisa berpindah ke partner sementara custody vault tetap di Concrete."
    ]
  },
  {
    type: "heading",
    level: 2,
    text: "3. Implementasi vault"
  },
  {
    type: "table",
    headers: [
      "Implementation",
      "Behaviour"
    ],
    rows: [
      [
        "**Standard** (Atomic)",
        "ERC-4626 dasar + alokasi strategy; withdraw dalam satu transaksi."
      ],
      [
        "**Async** (Queued Withdrawal)",
        "Antrean withdrawal berbasis epoch; di-toggle oleh Vault Manager."
      ],
      [
        "**Predeposit**",
        "Alur klaim lintas chain LayerZero untuk aset yang sudah di-stake lebih dulu. Jalur klaim melewati hooks."
      ],
      [
        "**Bridged Standard / Bridged Async**",
        "Menambahkan `unbackedMint` sekali pakai (butuh `totalSupply()==0` dan `maxDepositLimit==0`) untuk migrasi."
      ]
    ]
  },
  {
    type: "p",
    text: "Strategy looping dan pembagian fee **bukan** implementasi vault: looping adalah strategy yang dicolokkan ke vault Standard; pembagian fee berada di kontrak downstream tempat vault melakukan mint."
  },
  {
    type: "p",
    text: "Batas di level vault: cap total deposit maksimum, min/max per deposit dan withdrawal, cap per-user opsional."
  },
  {
    type: "heading",
    level: 2,
    text: "4. Internal vault: custody, shares, accounting"
  },
  {
    type: "ul",
    items: [
      "Deposit akan mint shares ERC-20; redeem akan membakarnya (burn).",
      "Vault menyimpan **snapshot ter-cache** dari total aset, yang di-refresh oleh modifier `withYieldAccrual` sebelum operasi ekonomi apa pun (`deposit`, `mint`, `withdraw`, `redeem`, `allocate`, konfigurasi, fee-recipient setter).",
      "Konversi di dalam operasi yang dijaga (guarded ops) memakai **snapshot ter-cache**, bukan `balanceOf` real-time → melindungi dari **serangan donation/inflation**.",
      "**`totalAssets()` ≠ cache:** fungsi ini memanggil `_previewAccrueYieldAndFees()` dan membaca ulang `totalAllocatedValue()` tiap strategy aktif secara live. Cache-nya sendiri diekspos sebagai `cachedTotalAssets()`.",
      "Operasi murni pembukuan (strategy registry, hooks, urutan deallocation, pause) melewati modifier ini."
    ]
  },
  {
    type: "heading",
    level: 2,
    text: "5. Strategy"
  },
  {
    type: "ul",
    items: [
      "Satu vault ↔ satu instance strategy, aset dasar yang sama, mengimplementasikan `IStrategyTemplate`.",
      "**Allocator** (`ALLOCATOR`) memanggil `vault.allocate(...)` dengan instruksi per-strategy. Keputusan routing/sizing dilakukan off-chain; vault hanya menegakkan **postcondition** (saldo idle mencakup aset yang terkunci, dan pada vault async, aset epoch lalu yang belum diklaim). Tidak ada kebijakan yang diputuskan on-chain.",
      "Strategy **Looping** menggabungkan modul lender + flash + swap (sekitar dua lusin fungsi di tiga interface), sehingga venue baru bisa terintegrasi tanpa mengubah kontrak strategy.",
      "**Kepercayaan pada nilai yang dilaporkan:** vault menganggap apa yang dilaporkan strategy sebagai kebenaran - **tidak ada ambang delta, cross-check oracle, atau safety flag di sisi vault**. Rel pengamannya ada di sisi strategy:",
      "*On-chain accounting* → nilai dihitung dari state chain.",
      "*Asynchronous accounting* → operator mengirim nilai bertanda tangan (signed) dalam `accountingValidityPeriod`; jika terlambat ⇒ fungsi value revert ⇒ `totalAssets()` revert ⇒ deposit, withdrawal, dan pemrosesan epoch berhenti sampai admin strategy memanggil `unpauseAndAdjustTotalAssets` atau Strategy Manager men-toggle strategy jadi inactive."
    ]
  },
  {
    type: "heading",
    level: 2,
    text: "5b. Hooks"
  },
  {
    type: "p",
    text: "Modul opsional pada titik-titik siklus hidup tertentu: sebelum/sesudah `deposit`, `mint`, `withdraw`, `redeem`, `transfer`. Vault menyimpan **satu target hook + satu flag bitmap**."
  },
  {
    type: "table",
    headers: [
      "Hook",
      "Purpose"
    ],
    rows: [
      [
        "`UserDepositCapHook`",
        "Cap deposit per-user (satu per vault)."
      ],
      [
        "`WhitelistUserDepositHook`",
        "Hanya alamat yang disetujui yang boleh deposit."
      ],
      [
        "`DepositLockHook`",
        "Mengunci shares yang di-mint berdasarkan waktu; shares yang terkunci tidak bisa transfer/withdraw/redeem sampai masing-masing lock berakhir."
      ],
      [
        "`DepositLockWithFeeHook`",
        "Menambahkan opsi unlock lebih awal dengan **fee dalam shares yang menurun seiring waktu**."
      ],
      [
        "`HookContainer`",
        "Meneruskan satu panggilan vault ke **hingga enam** hooks."
      ]
    ]
  },
  {
    type: "p",
    text: "Perhatian: **revert di hook mana pun akan me-revert seluruh operasi** (hook yang buggy bisa membekukan vault sampai diperbaiki; hanya `HOOK_MANAGER` yang bisa mengubah hooks); hooks tidak membatasi jalur klaim lintas chain atau `unbackedMint`."
  },
  {
    type: "heading",
    level: 2,
    text: "6. Model otoritas"
  },
  {
    type: "p",
    text: "Otoritas dibagi ke dalam tiga sumbu (axis):"
  },
  {
    type: "table",
    headers: [
      "Axis",
      "Holder",
      "Powers"
    ],
    rows: [
      [
        "**Vault Owner**",
        "Ownable owner",
        "Menjadi gerbang untuk `factory.upgrade(...)` (di luar sistem role)"
      ],
      [
        "**Roles**",
        "`ROLE_ADMIN` memberikan: `VAULT_MANAGER` (state), `STRATEGY_MANAGER` (tambah/hapus strategy), `HOOK_MANAGER`, `ALLOCATOR`, `PAUSER`, `WITHDRAWAL_MANAGER`, `PRIORITY_WITHDRAWAL_EXECUTOR`",
        "Operasional sehari-hari; `DEFAULT_ADMIN_ROLE` sengaja tidak diberikan"
      ],
      [
        "**Factory Owner**",
        "Protokol",
        "Konfigurasi fee-recipient di setiap vault (melewati role vault)"
      ]
    ]
  },
  {
    type: "p",
    text: "Kunci operasional bisa dibagi antar pihak (curator ≠ allocator ≠ pauser). Dokumentasi Concrete melabeli peran governance sebagai low-frequency/high-impact (dipegang Vault Admin), dan Allocator/Withdrawal Manager sebagai layanan otomatis high-frequency/low-impact."
  },
  {
    type: "heading",
    level: 2,
    text: "7. Distribusi fee"
  },
  {
    type: "p",
    text: "Fee di-mint sebagai shares ke `managementFeeRecipient` dan `performanceFeeRecipient` (diatur oleh factory owner). Masing-masing biasanya mengarah ke **`TwoWayFeeSplitter`** (periphery) yang membagi antara `mainRecipient` dan `secondaryRecipient` memakai `feeFractionOfSecondaryRecipient` dalam bps dari 10.000 (`0` → semua ke main, `10000` → semua ke secondary). Siapa pun bisa memanggil `distributeFees(vault)`."
  },
  {
    type: "heading",
    level: 2,
    text: "8. Jebakan operasional (checklist untuk curator & integrator)"
  },
  {
    type: "ul",
    items: [
      "[ ] Vault baru **belum siap produksi**: hanya `ROLE_ADMIN` dan `VAULT_MANAGER` yang diberikan (ke `initialVaultManager`). Berikan sisanya secara eksplisit.",
      "[ ] **Vault yang di-pause tidak bisa menyelesaikan upgrade** (`_upgrade` bersifat `whenNotPaused`) - rencanakan respons darurat.",
      "[ ] **Urutan deallocation itu krusial.** Strategy yang tidak ada di urutan tetap terhitung di `totalAssets()` tapi tidak bisa dikuras untuk withdrawal user.",
      "[ ] Sesuaikan besaran `accountingValidityPeriod` dengan ketersediaan operator.",
      "[ ] Whitelist hook + alur predeposit/bridged butuh gating terpisah.",
      "[ ] Kesalahan konfigurasi hook = risiko DoS pada seluruh vault.",
      "[ ] Cap withdrawal/cooldown saling berinteraksi - uji perilaku gabungannya."
    ]
  }
],

};
