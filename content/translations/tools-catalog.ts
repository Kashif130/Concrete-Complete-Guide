import type { DocBlock } from "../docs.generated";
import type { Locale } from "@/lib/i18n";

// Full translation of docs/04-ecosystem/01-tools-catalog.md.
// Tool names, URLs, repo paths and the 10 numbered section headings (kept in English so the
// #anchor links in the quick index keep working) are left as in the English source.
export const toolsCatalog: Partial<Record<Locale, DocBlock[]>> = {
  ur: [
    {
      "type": "quote",
      "text": "Legend: 🟢 **Official** (Concrete / Blueprint Finance ka bana hua) · 🟡 **Community** (independent, unofficial - sab kuch khud verify karein) · 🔵 **Third-party infra** (data, partners). Links 20 Sep 2026 ko verify kiye gaye."
    },
    {
      "type": "heading",
      "level": 2,
      "text": "Fori index"
    },
    {
      "type": "table",
      "headers": [
        "#",
        "Tool",
        "Type",
        "Kis kaam ke liye behtar"
      ],
      "rows": [
        [
          "1",
          "[Concrete Tracker](#1-concrete-tracker-community)",
          "🟡",
          "Read-only wallet/vault position + points view"
        ],
        [
          "2",
          "[Builder Suite](#2-concrete-builder-suite-community)",
          "🟡",
          "AI assistant, optimizer, guide, game, portal"
        ],
        [
          "3",
          "[Concrete Academy](#3-concrete-academy-community)",
          "🟡",
          "Learning course + calculators + live data"
        ],
        [
          "4",
          "[Earn app](#4-official-earn-app)",
          "🟢",
          "Deposit/withdraw/portfolio"
        ],
        [
          "5",
          "[Enterprise app & AssetCX](#5-official-enterprise-app--assetcx)",
          "🟢",
          "Institutions/issuers"
        ],
        [
          "6",
          "[Points](#6-official-points)",
          "🟢",
          "Quests aur rewards"
        ],
        [
          "7",
          "[Docs & SDK & Subgraph](#7-official-docs-sdk-subgraph)",
          "🟢",
          "Builders"
        ],
        [
          "8",
          "[Info aur community channels](#8-official-info--community-channels)",
          "🟢",
          "News, support"
        ],
        [
          "9",
          "[Partner aur data infrastructure](#9-third-party-infrastructure)",
          "🔵",
          "Data, routing, security"
        ],
        [
          "10",
          "[Is repo ke example scripts](#10-this-repos-example-scripts)",
          "🛠",
          "Math seekhne ke liye"
        ]
      ]
    },
    {
      "type": "hr"
    },
    {
      "type": "heading",
      "level": 2,
      "text": "1. Concrete Tracker (community)"
    },
    {
      "type": "p",
      "text": "**URL:** <https://concrete-tracker-seven.vercel.app> · **Repo:** [Kashif130/concrete-community-tools](https://github.com/Kashif130/concrete-community-tools) · Ise *Position Ledger* bhi kehte hain."
    },
    {
      "type": "p",
      "text": "Aik wallet-first, **read-only** dashboard. Na wallet-connect, na signature, na approval - har read har vault ke ERC-4626 interface (`name`, `symbol`, `totalAssets`, `totalSupply`, `balanceOf`, `convertToAssets`) par live RPC call hai."
    },
    {
      "type": "table",
      "headers": [
        "Feature",
        "Notes"
      ],
      "rows": [
        [
          "Live vault positions",
          "README ke mutabiq Ethereum + Arbitrum (live UI Base bhi dikhati hai); koi indexer nahi, koi cache nahi"
        ],
        [
          "Points balance + leaderboard",
          "Points system se parha jata hai"
        ],
        [
          "Multi-wallet comparison",
          "Side by side; wallets ki CSV upload supported"
        ],
        [
          "Vault-address input aur known-vault scan",
          "Vault addresses paste karein ya multi-chain known vaults scan karein"
        ],
        [
          "Shareable public profiles",
          "`/w/0xYourAddress`"
        ],
        [
          "Exports",
          "CSV / JSON / PDF + auto-generated share cards"
        ],
        [
          "Share-price alerts",
          "Browser + webhook"
        ],
        [
          "**Live Vaults dashboard**",
          "`/vaults` - har known vault live TVL, share price, APY ke saath"
        ],
        [
          "**Vault Optimizer + Earning Prediction**",
          "Mutawaqqe earnings ka chart"
        ],
        [
          "Hypothetical airdrop estimator",
          "Aap ke asal points par mabni - mehz aik what-if"
        ]
      ]
    },
    {
      "type": "p",
      "text": "**Kis ke liye acha hai:** individuals, multi-wallet users, DAO/team treasuries jinhein audit-ready read-only view chahiye. **Trust model:** Vercel par static/serverless; wallet/points/personal data ka koi server-side storage nahi (README ke mutabiq)."
    },
    {
      "type": "heading",
      "level": 2,
      "text": "2. Concrete Builder Suite (community)"
    },
    {
      "type": "p",
      "text": "**URL:** <https://concrete-builder-suite.vercel.app>"
    },
    {
      "type": "table",
      "headers": [
        "Sub-tool",
        "URL",
        "Yeh kya hai"
      ],
      "rows": [
        [
          "🤖 **Concrete Assistant**",
          "<https://concrete-assistant.streamlit.app/>",
          "Protocol Q&A ke liye AI chatbot: APYs, liquidation protection, borrowing, onboarding"
        ],
        [
          "📊 **Vault Optimizer**",
          "<https://concrete-vault.streamlit.app/>",
          "Multi-asset vaults (USDC, USDT, WBTC, weETH…) par risk-adjusted yield dashboard"
        ],
        [
          "📖 **System Guide**",
          "<https://concrete-guide.streamlit.app/>",
          "Interactive knowledge base: earn vaults, borrowing, liquidation protection, points"
        ],
        [
          "🎮 **Moai Saves: DeFi Rescue**",
          "<https://moai-defi-rescue.vercel.app/>",
          "Browser arcade game: depositors ko pakrein, liquidators ko rokein, Stone Shield ability, \"Degen mode\", Hall of Stone leaderboard"
        ],
        [
          "🧭 **Concrete Run**",
          "<https://concrete-run.vercel.app>",
          "`app.concrete.xyz` aur `points.concrete.xyz` ka navigation hub"
        ]
      ]
    },
    {
      "type": "p",
      "text": "Suite ka landing page live TVL, top-vault APY, networks (ETH · ARB · BERA · KATANA) aur live vault list bhi dikhata hai, aur official pages ke links deta hai jin mein `wbtc.concrete.xyz` (dedicated WBTC vault page) shamil hai. Note: is ki kuch copy purani product generations ke borrowing/liquidation features ka zikr karti hai - aaj kya live hai, yeh official docs mein check karein."
    },
    {
      "type": "heading",
      "level": 2,
      "text": "3. Concrete Academy (community)"
    },
    {
      "type": "p",
      "text": "**URL:** <https://concrete-academy.vercel.app> - \"Site Plan: a community field guide\". 10 drawings (lessons), 30 checks, *Apprentice → Architect* tak ratings jo **aap ke browser mein locally** store hoti hain."
    },
    {
      "type": "table",
      "headers": [
        "Tool",
        "Yeh kya karta hai"
      ],
      "rows": [
        [
          "📚 Drawings & Inspection",
          "Vaults, stack, custody aur roles, risk engine, points, institutional pivot, funding trail par asaan zabaan mein lessons + har sheet par 3 quiz checks"
        ],
        [
          "💰 **Vault Yield Calculator**",
          "Asal vault + live APY (DefiLlama yields API) + aap ka hypothetical deposit aur hold period, daily compounding"
        ],
        [
          "🏆 **Vault Optimizer**",
          "Ek jaisay deposit/period ke liye har live Concrete pool ko current APY se rank karta hai (risk ko *nahi* tolta)"
        ],
        [
          "🔍 **Vault Explorer**",
          "Custody aur withdrawal ka side-by-side muqabla"
        ],
        [
          "💸 **Funding Trail**",
          "Blueprint Finance ki 2022 ki buniyad se ab tak har disclosed funding round"
        ],
        [
          "🎲 **Airdrop Allocation Checker**",
          "**Sirf hypothetical** - fixed 1B max supply placeholder, adjustable pool size, total points ka aap ka apna andaza"
        ],
        [
          "📡 Live data",
          "DefiLlama se TVL aur chain data; embedded official X timelines (@ConcreteXYZ, @Blueprint_DeFi); live blog feed; milestone history"
        ],
        [
          "📖 Glossary",
          "Expandable entries wali term list"
        ]
      ]
    },
    {
      "type": "p",
      "text": "Concrete ke official points se independent - rating system ka official taur par koi matlab nahi."
    },
    {
      "type": "heading",
      "level": 2,
      "text": "4. Official Earn app"
    },
    {
      "type": "p",
      "text": "**URL:** <https://app.concrete.xyz/earn> - tabs: **Earn**, **Institutional**, **Portfolio**."
    },
    {
      "type": "p",
      "text": "Features: live/completed vault cards (TVL, APY, live aur 7-day APY, withdrawal queue, curator, wallet setup, auditors, Etherscan links ke saath addresses), deposit/withdraw/claim flows, har vault ka **transparency panel** (asset/protocol/network ke hisab se 24 ghante late breakdown), supported vaults par Enso routing, geo-restriction notice."
    },
    {
      "type": "heading",
      "level": 2,
      "text": "5. Official Enterprise app & AssetCX"
    },
    {
      "type": "p",
      "text": "**Enterprise app:** <https://enterprise.concrete.xyz/> · **Overview:** <https://concrete.xyz/enterprise> · **AssetCX enquiry:** concrete.xyz par form. Operations portal (NAV, queues, alerts, history), hosted UI ya SDK, daily NAV automation. Dekhein [Enterprise](/docs/02-intermediate/03-institutional-assetcx-enterprise)."
    },
    {
      "type": "heading",
      "level": 2,
      "text": "6. Official Points"
    },
    {
      "type": "p",
      "text": "**URL:** <https://points.concrete.xyz> (20 Sep 2026 ko Fuul ke zariye powered dikhaya gaya). Pehla phase Absinthe se powered tha. Dekhein [Points](/docs/01-beginner/07-points-and-rewards)."
    },
    {
      "type": "heading",
      "level": 2,
      "text": "7. Official Docs, SDK, Subgraph"
    },
    {
      "type": "table",
      "headers": [
        "Tool",
        "Link"
      ],
      "rows": [
        [
          "Docs",
          "<https://docs.concrete.xyz> (Docusaurus; source `Blueprint-Finance/concrete-docs` par)"
        ],
        [
          "SDK",
          "`@concrete-xyz/sdk` - [guide](/docs/03-advanced/04-sdk-guide)"
        ],
        [
          "Subgraph (har chain ke liye)",
          "[guide](/docs/03-advanced/05-subgraph-and-events)"
        ],
        [
          "Vault transparency API",
          "`GET /v1/vault:transparency/stats`"
        ],
        [
          "Audit reports",
          "<https://docs.concrete.xyz/Audits/>"
        ],
        [
          "Glossary / Risks / Restricted jurisdictions / Support",
          "docs sidebar mein"
        ]
      ]
    },
    {
      "type": "heading",
      "level": 2,
      "text": "8. Official info & community channels"
    },
    {
      "type": "p",
      "text": "Website <https://concrete.xyz> · Ecosystem page · Blog · News · X **@ConcreteXYZ** (aur Blueprint Finance ka **@Blueprint_DeFi**) · Discord <https://discord.gg/concretexyz> · Mirror `mirror.xyz/concretexyz.eth` · Brand kit `live.standards.site/concrete` · Terms/Privacy/Disclaimers site par."
    },
    {
      "type": "heading",
      "level": 2,
      "text": "9. Third-party infrastructure"
    },
    {
      "type": "table",
      "headers": [
        "Provider",
        "Concrete ke stack mein role"
      ],
      "rows": [
        [
          "**Halborn, Cantina, Zellic, Code4rena**",
          "Audits (Cantina bug bounty bhi)"
        ],
        [
          "**Hypernative**",
          "24/7 threat monitoring"
        ],
        [
          "**ZeroShadow**",
          "Pehle se delegate ki hui pause authority"
        ],
        [
          "**Fireblocks / Fordefi / Gnosis Safe**",
          "Strategies ke liye custody aur wallet infrastructure"
        ],
        [
          "**LayerZero**",
          "Pre-deposit claims ke liye cross-chain messaging (AssetCX ka aik \"OFT\" audit bhi hai; OFT LayerZero ka omnichain token standard hai)"
        ],
        [
          "**Enso**",
          "Swap/bridge-and-deposit routing"
        ],
        [
          "**1inch (and similar aggregators)**",
          "Slippage kam rakhne ke liye swap routing"
        ],
        [
          "**Chainalysis**",
          "Connect karte waqt wallet screening"
        ],
        [
          "**The Graph**",
          "Subgraph indexing"
        ],
        [
          "**DefiLlama**",
          "Public TVL/yield data (community tools istemal karte hain)"
        ],
        [
          "**Royco, USDai**",
          "Partner curators / campaign partners"
        ],
        [
          "**Fuul / Absinthe**",
          "Points/quest platforms"
        ]
      ]
    },
    {
      "type": "heading",
      "level": 2,
      "text": "10. This repo's example scripts"
    },
    {
      "type": "table",
      "headers": [
        "Script",
        "Maqsad"
      ],
      "rows": [
        [
          "`examples/python/share_math.py`",
          "Share ↔ asset conversion"
        ],
        [
          "`examples/python/yield_calculator.py`",
          "APY/APR projections"
        ],
        [
          "Fee-as-shares dilution model",
          "Fee-as-shares dilution model"
        ],
        [
          "`examples/python/airdrop_whatif.py`",
          "Hypothetical points→tokens model"
        ],
        [
          "`examples/typescript/*.ts`",
          "viem + SDK read-only samples"
        ],
        [
          "`examples/graphql/subgraph-queries.graphql`",
          "Adapt karne ke liye tayyar subgraph queries"
        ]
      ]
    },
    {
      "type": "heading",
      "level": 2,
      "text": "Tool kaise chunein"
    },
    {
      "type": "table",
      "headers": [
        "Mujhe chahiye…",
        "Istemal karein"
      ],
      "rows": [
        [
          "Deposit / withdraw",
          "Earn app (sirf official)"
        ],
        [
          "Connect kiye baghair apna balance dekhna",
          "Concrete Tracker"
        ],
        [
          "Vault APYs jaldi compare karna",
          "Tracker Live Vaults / Academy Optimizer / DefiLlama"
        ],
        [
          "Yeh kaise kaam karta hai seekhna",
          "Yeh repo → Academy → docs"
        ],
        [
          "Koi fori sawal poochna",
          "Builder Suite Assistant (jawab verify karein)"
        ],
        [
          "Integration banana",
          "Docs → SDK → subgraph"
        ],
        [
          "Institutional vault launch karna",
          "Enterprise / AssetCX"
        ]
      ]
    }
  ],
  hi: [
    {
      "type": "quote",
      "text": "Legend: 🟢 **Official** (Concrete / Blueprint Finance द्वारा बनाया गया) · 🟡 **Community** (independent, unofficial - सब कुछ खुद verify करें) · 🔵 **Third-party infra** (data, partners)। Links 20 Sep 2026 को verify किए गए।"
    },
    {
      "type": "heading",
      "level": 2,
      "text": "जल्दी index"
    },
    {
      "type": "table",
      "headers": [
        "#",
        "Tool",
        "Type",
        "किस काम के लिए बेहतर"
      ],
      "rows": [
        [
          "1",
          "[Concrete Tracker](#1-concrete-tracker-community)",
          "🟡",
          "Read-only wallet/vault position + points view"
        ],
        [
          "2",
          "[Builder Suite](#2-concrete-builder-suite-community)",
          "🟡",
          "AI assistant, optimizer, guide, game, portal"
        ],
        [
          "3",
          "[Concrete Academy](#3-concrete-academy-community)",
          "🟡",
          "Learning course + calculators + live data"
        ],
        [
          "4",
          "[Earn app](#4-official-earn-app)",
          "🟢",
          "Deposit/withdraw/portfolio"
        ],
        [
          "5",
          "[Enterprise app & AssetCX](#5-official-enterprise-app--assetcx)",
          "🟢",
          "Institutions/issuers"
        ],
        [
          "6",
          "[Points](#6-official-points)",
          "🟢",
          "Quests और rewards"
        ],
        [
          "7",
          "[Docs & SDK & Subgraph](#7-official-docs-sdk-subgraph)",
          "🟢",
          "Builders"
        ],
        [
          "8",
          "[Info और community channels](#8-official-info--community-channels)",
          "🟢",
          "News, support"
        ],
        [
          "9",
          "[Partner और data infrastructure](#9-third-party-infrastructure)",
          "🔵",
          "Data, routing, security"
        ],
        [
          "10",
          "[इस repo की example scripts](#10-this-repos-example-scripts)",
          "🛠",
          "Math सीखने के लिए"
        ]
      ]
    },
    {
      "type": "hr"
    },
    {
      "type": "heading",
      "level": 2,
      "text": "1. Concrete Tracker (community)"
    },
    {
      "type": "p",
      "text": "**URL:** <https://concrete-tracker-seven.vercel.app> · **Repo:** [Kashif130/concrete-community-tools](https://github.com/Kashif130/concrete-community-tools) · इसे *Position Ledger* भी कहते हैं।"
    },
    {
      "type": "p",
      "text": "एक wallet-first, **read-only** dashboard। न wallet-connect, न signature, न approval - हर read हर vault के ERC-4626 interface (`name`, `symbol`, `totalAssets`, `totalSupply`, `balanceOf`, `convertToAssets`) पर live RPC call है।"
    },
    {
      "type": "table",
      "headers": [
        "Feature",
        "Notes"
      ],
      "rows": [
        [
          "Live vault positions",
          "README के मुताबिक Ethereum + Arbitrum (live UI Base भी दिखाती है); कोई indexer नहीं, कोई cache नहीं"
        ],
        [
          "Points balance + leaderboard",
          "Points system से पढ़ा जाता है"
        ],
        [
          "Multi-wallet comparison",
          "Side by side; wallets की CSV upload supported"
        ],
        [
          "Vault-address input और known-vault scan",
          "Vault addresses paste करें या multi-chain known vaults scan करें"
        ],
        [
          "Shareable public profiles",
          "`/w/0xYourAddress`"
        ],
        [
          "Exports",
          "CSV / JSON / PDF + auto-generated share cards"
        ],
        [
          "Share-price alerts",
          "Browser + webhook"
        ],
        [
          "**Live Vaults dashboard**",
          "`/vaults` - हर known vault live TVL, share price, APY के साथ"
        ],
        [
          "**Vault Optimizer + Earning Prediction**",
          "अनुमानित earnings का chart"
        ],
        [
          "Hypothetical airdrop estimator",
          "आपके असली points पर आधारित - सिर्फ़ एक what-if"
        ]
      ]
    },
    {
      "type": "p",
      "text": "**किसके लिए अच्छा है:** individuals, multi-wallet users, DAO/team treasuries जिन्हें audit-ready read-only view चाहिए। **Trust model:** Vercel पर static/serverless; wallet/points/personal data का कोई server-side storage नहीं (README के अनुसार)।"
    },
    {
      "type": "heading",
      "level": 2,
      "text": "2. Concrete Builder Suite (community)"
    },
    {
      "type": "p",
      "text": "**URL:** <https://concrete-builder-suite.vercel.app>"
    },
    {
      "type": "table",
      "headers": [
        "Sub-tool",
        "URL",
        "यह क्या है"
      ],
      "rows": [
        [
          "🤖 **Concrete Assistant**",
          "<https://concrete-assistant.streamlit.app/>",
          "Protocol Q&A के लिए AI chatbot: APYs, liquidation protection, borrowing, onboarding"
        ],
        [
          "📊 **Vault Optimizer**",
          "<https://concrete-vault.streamlit.app/>",
          "Multi-asset vaults (USDC, USDT, WBTC, weETH…) पर risk-adjusted yield dashboard"
        ],
        [
          "📖 **System Guide**",
          "<https://concrete-guide.streamlit.app/>",
          "Interactive knowledge base: earn vaults, borrowing, liquidation protection, points"
        ],
        [
          "🎮 **Moai Saves: DeFi Rescue**",
          "<https://moai-defi-rescue.vercel.app/>",
          "Browser arcade game: depositors को पकड़ें, liquidators को रोकें, Stone Shield ability, \"Degen mode\", Hall of Stone leaderboard"
        ],
        [
          "🧭 **Concrete Run**",
          "<https://concrete-run.vercel.app>",
          "`app.concrete.xyz` और `points.concrete.xyz` का navigation hub"
        ]
      ]
    },
    {
      "type": "p",
      "text": "Suite का landing page live TVL, top-vault APY, networks (ETH · ARB · BERA · KATANA) और live vault list भी दिखाता है, और official pages के links देता है जिनमें `wbtc.concrete.xyz` (dedicated WBTC vault page) शामिल है। Note: इसकी कुछ copy पुरानी product generations के borrowing/liquidation features का ज़िक्र करती है - आज क्या live है, यह official docs में check करें।"
    },
    {
      "type": "heading",
      "level": 2,
      "text": "3. Concrete Academy (community)"
    },
    {
      "type": "p",
      "text": "**URL:** <https://concrete-academy.vercel.app> - \"Site Plan: a community field guide\"। 10 drawings (lessons), 30 checks, *Apprentice → Architect* तक ratings जो **आपके browser में locally** store होती हैं।"
    },
    {
      "type": "table",
      "headers": [
        "Tool",
        "यह क्या करता है"
      ],
      "rows": [
        [
          "📚 Drawings & Inspection",
          "Vaults, stack, custody और roles, risk engine, points, institutional pivot, funding trail पर आसान भाषा में lessons + हर sheet पर 3 quiz checks"
        ],
        [
          "💰 **Vault Yield Calculator**",
          "असली vault + live APY (DefiLlama yields API) + आपका hypothetical deposit और hold period, daily compounding"
        ],
        [
          "🏆 **Vault Optimizer**",
          "एक जैसे deposit/period के लिए हर live Concrete pool को current APY से rank करता है (risk को *नहीं* तौलता)"
        ],
        [
          "🔍 **Vault Explorer**",
          "Custody और withdrawal की side-by-side तुलना"
        ],
        [
          "💸 **Funding Trail**",
          "Blueprint Finance की 2022 की स्थापना से अब तक हर disclosed funding round"
        ],
        [
          "🎲 **Airdrop Allocation Checker**",
          "**सिर्फ़ hypothetical** - fixed 1B max supply placeholder, adjustable pool size, total points का आपका अपना अंदाज़ा"
        ],
        [
          "📡 Live data",
          "DefiLlama से TVL और chain data; embedded official X timelines (@ConcreteXYZ, @Blueprint_DeFi); live blog feed; milestone history"
        ],
        [
          "📖 Glossary",
          "Expandable entries वाली term list"
        ]
      ]
    },
    {
      "type": "p",
      "text": "Concrete के official points से independent - rating system का official तौर पर कोई मतलब नहीं।"
    },
    {
      "type": "heading",
      "level": 2,
      "text": "4. Official Earn app"
    },
    {
      "type": "p",
      "text": "**URL:** <https://app.concrete.xyz/earn> - tabs: **Earn**, **Institutional**, **Portfolio**।"
    },
    {
      "type": "p",
      "text": "Features: live/completed vault cards (TVL, APY, live और 7-day APY, withdrawal queue, curator, wallet setup, auditors, Etherscan links के साथ addresses), deposit/withdraw/claim flows, हर vault का **transparency panel** (asset/protocol/network के हिसाब से 24 घंटे देर से breakdown), supported vaults पर Enso routing, geo-restriction notice।"
    },
    {
      "type": "heading",
      "level": 2,
      "text": "5. Official Enterprise app & AssetCX"
    },
    {
      "type": "p",
      "text": "**Enterprise app:** <https://enterprise.concrete.xyz/> · **Overview:** <https://concrete.xyz/enterprise> · **AssetCX enquiry:** concrete.xyz पर form। Operations portal (NAV, queues, alerts, history), hosted UI या SDK, daily NAV automation। देखें [Enterprise](/docs/02-intermediate/03-institutional-assetcx-enterprise)।"
    },
    {
      "type": "heading",
      "level": 2,
      "text": "6. Official Points"
    },
    {
      "type": "p",
      "text": "**URL:** <https://points.concrete.xyz> (20 Sep 2026 को Fuul द्वारा powered दिखाया गया)। पहला phase Absinthe से powered था। देखें [Points](/docs/01-beginner/07-points-and-rewards)।"
    },
    {
      "type": "heading",
      "level": 2,
      "text": "7. Official Docs, SDK, Subgraph"
    },
    {
      "type": "table",
      "headers": [
        "Tool",
        "Link"
      ],
      "rows": [
        [
          "Docs",
          "<https://docs.concrete.xyz> (Docusaurus; source `Blueprint-Finance/concrete-docs` पर)"
        ],
        [
          "SDK",
          "`@concrete-xyz/sdk` - [guide](/docs/03-advanced/04-sdk-guide)"
        ],
        [
          "Subgraph (हर chain के लिए)",
          "[guide](/docs/03-advanced/05-subgraph-and-events)"
        ],
        [
          "Vault transparency API",
          "`GET /v1/vault:transparency/stats`"
        ],
        [
          "Audit reports",
          "<https://docs.concrete.xyz/Audits/>"
        ],
        [
          "Glossary / Risks / Restricted jurisdictions / Support",
          "docs sidebar में"
        ]
      ]
    },
    {
      "type": "heading",
      "level": 2,
      "text": "8. Official info & community channels"
    },
    {
      "type": "p",
      "text": "Website <https://concrete.xyz> · Ecosystem page · Blog · News · X **@ConcreteXYZ** (और Blueprint Finance का **@Blueprint_DeFi**) · Discord <https://discord.gg/concretexyz> · Mirror `mirror.xyz/concretexyz.eth` · Brand kit `live.standards.site/concrete` · Terms/Privacy/Disclaimers site पर।"
    },
    {
      "type": "heading",
      "level": 2,
      "text": "9. Third-party infrastructure"
    },
    {
      "type": "table",
      "headers": [
        "Provider",
        "Concrete के stack में role"
      ],
      "rows": [
        [
          "**Halborn, Cantina, Zellic, Code4rena**",
          "Audits (Cantina bug bounty भी)"
        ],
        [
          "**Hypernative**",
          "24/7 threat monitoring"
        ],
        [
          "**ZeroShadow**",
          "पहले से delegate की हुई pause authority"
        ],
        [
          "**Fireblocks / Fordefi / Gnosis Safe**",
          "Strategies के लिए custody और wallet infrastructure"
        ],
        [
          "**LayerZero**",
          "Pre-deposit claims के लिए cross-chain messaging (AssetCX का एक \"OFT\" audit भी है; OFT LayerZero का omnichain token standard है)"
        ],
        [
          "**Enso**",
          "Swap/bridge-and-deposit routing"
        ],
        [
          "**1inch (and similar aggregators)**",
          "Slippage कम रखने के लिए swap routing"
        ],
        [
          "**Chainalysis**",
          "Connect करते समय wallet screening"
        ],
        [
          "**The Graph**",
          "Subgraph indexing"
        ],
        [
          "**DefiLlama**",
          "Public TVL/yield data (community tools इस्तेमाल करते हैं)"
        ],
        [
          "**Royco, USDai**",
          "Partner curators / campaign partners"
        ],
        [
          "**Fuul / Absinthe**",
          "Points/quest platforms"
        ]
      ]
    },
    {
      "type": "heading",
      "level": 2,
      "text": "10. This repo's example scripts"
    },
    {
      "type": "table",
      "headers": [
        "Script",
        "मक़सद"
      ],
      "rows": [
        [
          "`examples/python/share_math.py`",
          "Share ↔ asset conversion"
        ],
        [
          "`examples/python/yield_calculator.py`",
          "APY/APR projections"
        ],
        [
          "Fee-as-shares dilution model",
          "Fee-as-shares dilution model"
        ],
        [
          "`examples/python/airdrop_whatif.py`",
          "Hypothetical points→tokens model"
        ],
        [
          "`examples/typescript/*.ts`",
          "viem + SDK read-only samples"
        ],
        [
          "`examples/graphql/subgraph-queries.graphql`",
          "Adapt करने के लिए तैयार subgraph queries"
        ]
      ]
    },
    {
      "type": "heading",
      "level": 2,
      "text": "Tool कैसे चुनें"
    },
    {
      "type": "table",
      "headers": [
        "मुझे चाहिए…",
        "इस्तेमाल करें"
      ],
      "rows": [
        [
          "Deposit / withdraw",
          "Earn app (सिर्फ़ official)"
        ],
        [
          "Connect किए बिना अपना balance देखना",
          "Concrete Tracker"
        ],
        [
          "Vault APYs जल्दी compare करना",
          "Tracker Live Vaults / Academy Optimizer / DefiLlama"
        ],
        [
          "यह कैसे काम करता है सीखना",
          "यह repo → Academy → docs"
        ],
        [
          "कोई जल्दी सवाल पूछना",
          "Builder Suite Assistant (जवाब verify करें)"
        ],
        [
          "Integration बनाना",
          "Docs → SDK → subgraph"
        ],
        [
          "Institutional vault launch करना",
          "Enterprise / AssetCX"
        ]
      ]
    }
  ],
  pcm: [
    {
      "type": "quote",
      "text": "Legend: 🟢 **Official** (Concrete / Blueprint Finance make am) · 🟡 **Community** (independent, unofficial - verify everything yourself) · 🔵 **Third-party infra** (data, partners). Dem verify di links on 20 Sep 2026."
    },
    {
      "type": "heading",
      "level": 2,
      "text": "Quick index"
    },
    {
      "type": "table",
      "headers": [
        "#",
        "Tool",
        "Type",
        "Best for"
      ],
      "rows": [
        [
          "1",
          "[Concrete Tracker](#1-concrete-tracker-community)",
          "🟡",
          "Read-only wallet/vault position + points view"
        ],
        [
          "2",
          "[Builder Suite](#2-concrete-builder-suite-community)",
          "🟡",
          "AI assistant, optimizer, guide, game, portal"
        ],
        [
          "3",
          "[Concrete Academy](#3-concrete-academy-community)",
          "🟡",
          "Learning course + calculators + live data"
        ],
        [
          "4",
          "[Earn app](#4-official-earn-app)",
          "🟢",
          "Deposit/withdraw/portfolio"
        ],
        [
          "5",
          "[Enterprise app & AssetCX](#5-official-enterprise-app--assetcx)",
          "🟢",
          "Institutions/issuers"
        ],
        [
          "6",
          "[Points](#6-official-points)",
          "🟢",
          "Quests & rewards"
        ],
        [
          "7",
          "[Docs & SDK & Subgraph](#7-official-docs-sdk-subgraph)",
          "🟢",
          "Builders"
        ],
        [
          "8",
          "[Info & community channels](#8-official-info--community-channels)",
          "🟢",
          "News, support"
        ],
        [
          "9",
          "[Partner & data infrastructure](#9-third-party-infrastructure)",
          "🔵",
          "Data, routing, security"
        ],
        [
          "10",
          "[Example scripts for dis repo](#10-this-repos-example-scripts)",
          "🛠",
          "Learn di math"
        ]
      ]
    },
    {
      "type": "hr"
    },
    {
      "type": "heading",
      "level": 2,
      "text": "1. Concrete Tracker (community)"
    },
    {
      "type": "p",
      "text": "**URL:** <https://concrete-tracker-seven.vercel.app> · **Repo:** [Kashif130/concrete-community-tools](https://github.com/Kashif130/concrete-community-tools) · Dem dey call am *Position Ledger* too."
    },
    {
      "type": "p",
      "text": "Na wallet-first, **read-only** dashboard. No wallet-connect, no signature, no approval - every read na live RPC call to each vault ERC-4626 interface (`name`, `symbol`, `totalAssets`, `totalSupply`, `balanceOf`, `convertToAssets`)."
    },
    {
      "type": "table",
      "headers": [
        "Feature",
        "Notes"
      ],
      "rows": [
        [
          "Live vault positions",
          "Ethereum + Arbitrum according to di README (di live UI list Base too); no indexer, no cache"
        ],
        [
          "Points balance + leaderboard",
          "Dem dey read am from di points system"
        ],
        [
          "Multi-wallet comparison",
          "Side by side; CSV upload of wallets dey supported"
        ],
        [
          "Vault-address input & known-vault scan",
          "Paste vault addresses or scan known vaults across chains"
        ],
        [
          "Shareable public profiles",
          "`/w/0xYourAddress`"
        ],
        [
          "Exports",
          "CSV / JSON / PDF + auto-generated share cards"
        ],
        [
          "Share-price alerts",
          "Browser + webhook"
        ],
        [
          "**Live Vaults dashboard**",
          "`/vaults` - every known vault with live TVL, share price, APY"
        ],
        [
          "**Vault Optimizer + Earning Prediction**",
          "Chart of di earnings wey dem project"
        ],
        [
          "Hypothetical airdrop estimator",
          "E dey use your real points - na just what-if"
        ]
      ]
    },
    {
      "type": "p",
      "text": "**Good for:** individuals, multi-wallet users, DAO/team treasuries wey want audit-ready read-only view. **Trust model:** static/serverless for Vercel; no server-side storage of wallet/points/personal data (according to di README)."
    },
    {
      "type": "heading",
      "level": 2,
      "text": "2. Concrete Builder Suite (community)"
    },
    {
      "type": "p",
      "text": "**URL:** <https://concrete-builder-suite.vercel.app>"
    },
    {
      "type": "table",
      "headers": [
        "Sub-tool",
        "URL",
        "Wetin e be"
      ],
      "rows": [
        [
          "🤖 **Concrete Assistant**",
          "<https://concrete-assistant.streamlit.app/>",
          "AI chatbot for protocol Q&A: APYs, liquidation protection, borrowing, onboarding"
        ],
        [
          "📊 **Vault Optimizer**",
          "<https://concrete-vault.streamlit.app/>",
          "Risk-adjusted yield dashboard across multi-asset vaults (USDC, USDT, WBTC, weETH…)"
        ],
        [
          "📖 **System Guide**",
          "<https://concrete-guide.streamlit.app/>",
          "Interactive knowledge base: earn vaults, borrowing, liquidation protection, points"
        ],
        [
          "🎮 **Moai Saves: DeFi Rescue**",
          "<https://moai-defi-rescue.vercel.app/>",
          "Browser arcade game: catch depositors, block liquidators, Stone Shield ability, \"Degen mode\", Hall of Stone leaderboard"
        ],
        [
          "🧭 **Concrete Run**",
          "<https://concrete-run.vercel.app>",
          "Navigation hub to `app.concrete.xyz` and `points.concrete.xyz`"
        ]
      ]
    },
    {
      "type": "p",
      "text": "Di Suite landing page dey show live TVL, top-vault APY, networks (ETH · ARB · BERA · KATANA) and live vault list too, and e dey link to official pages including `wbtc.concrete.xyz` (dedicated WBTC vault page). Note: some of im copy dey mention borrowing/liquidation features from earlier product generations - check di official docs to see wetin dey live today."
    },
    {
      "type": "heading",
      "level": 2,
      "text": "3. Concrete Academy (community)"
    },
    {
      "type": "p",
      "text": "**URL:** <https://concrete-academy.vercel.app> - \"Site Plan: a community field guide\". 10 drawings (lessons), 30 checks, ratings from *Apprentice → Architect* wey dem store **locally for your browser**."
    },
    {
      "type": "table",
      "headers": [
        "Tool",
        "Wetin e dey do"
      ],
      "rows": [
        [
          "📚 Drawings & Inspection",
          "Plain-language lessons on vaults, stack, custody & roles, risk engine, points, institutional pivot, funding trail + 3 quiz checks for each sheet"
        ],
        [
          "💰 **Vault Yield Calculator**",
          "Real vault + live APY (DefiLlama yields API) + your hypothetical deposit & hold period, daily compounding"
        ],
        [
          "🏆 **Vault Optimizer**",
          "E dey rank every live Concrete pool by current APY for di same deposit/period (e *no* dey weigh risk)"
        ],
        [
          "🔍 **Vault Explorer**",
          "Side-by-side custody & withdrawal comparison"
        ],
        [
          "💸 **Funding Trail**",
          "Every disclosed funding round since Blueprint Finance start for 2022"
        ],
        [
          "🎲 **Airdrop Allocation Checker**",
          "**Hypothetical only** - fixed 1B max supply placeholder, adjustable pool size, your own guess of total points"
        ],
        [
          "📡 Live data",
          "TVL & chain data from DefiLlama; embedded official X timelines (@ConcreteXYZ, @Blueprint_DeFi); live blog feed; milestone history"
        ],
        [
          "📖 Glossary",
          "Term list with entries wey you fit expand"
        ]
      ]
    },
    {
      "type": "p",
      "text": "E no dey depend on Concrete official points - di rating system no mean anything officially."
    },
    {
      "type": "heading",
      "level": 2,
      "text": "4. Official Earn app"
    },
    {
      "type": "p",
      "text": "**URL:** <https://app.concrete.xyz/earn> - tabs: **Earn**, **Institutional**, **Portfolio**."
    },
    {
      "type": "p",
      "text": "Features: live/completed vault cards (TVL, APY, live & 7-day APY, withdrawal queue, curator, wallet setup, auditors, addresses with Etherscan links), deposit/withdraw/claim flows, per-vault **transparency panel** (breakdown wey dey 24 h late by asset/protocol/network), Enso routing for supported vaults, geo-restriction notice."
    },
    {
      "type": "heading",
      "level": 2,
      "text": "5. Official Enterprise app & AssetCX"
    },
    {
      "type": "p",
      "text": "**Enterprise app:** <https://enterprise.concrete.xyz/> · **Overview:** <https://concrete.xyz/enterprise> · **AssetCX enquiry:** form for concrete.xyz. Operations portal (NAV, queues, alerts, history), hosted UI or SDK, daily NAV automation. See [Enterprise](/docs/02-intermediate/03-institutional-assetcx-enterprise)."
    },
    {
      "type": "heading",
      "level": 2,
      "text": "6. Official Points"
    },
    {
      "type": "p",
      "text": "**URL:** <https://points.concrete.xyz> (dem show am as powered by Fuul on 20 Sep 2026). Di earlier phase na Absinthe power am. See [Points](/docs/01-beginner/07-points-and-rewards)."
    },
    {
      "type": "heading",
      "level": 2,
      "text": "7. Official Docs, SDK, Subgraph"
    },
    {
      "type": "table",
      "headers": [
        "Tool",
        "Link"
      ],
      "rows": [
        [
          "Docs",
          "<https://docs.concrete.xyz> (Docusaurus; source dey `Blueprint-Finance/concrete-docs`)"
        ],
        [
          "SDK",
          "`@concrete-xyz/sdk` - [guide](/docs/03-advanced/04-sdk-guide)"
        ],
        [
          "Subgraph (per chain)",
          "[guide](/docs/03-advanced/05-subgraph-and-events)"
        ],
        [
          "Vault transparency API",
          "`GET /v1/vault:transparency/stats`"
        ],
        [
          "Audit reports",
          "<https://docs.concrete.xyz/Audits/>"
        ],
        [
          "Glossary / Risks / Restricted jurisdictions / Support",
          "for docs sidebar"
        ]
      ]
    },
    {
      "type": "heading",
      "level": 2,
      "text": "8. Official info & community channels"
    },
    {
      "type": "p",
      "text": "Website <https://concrete.xyz> · Ecosystem page · Blog · News · X **@ConcreteXYZ** (and Blueprint Finance **@Blueprint_DeFi**) · Discord <https://discord.gg/concretexyz> · Mirror `mirror.xyz/concretexyz.eth` · Brand kit `live.standards.site/concrete` · Terms/Privacy/Disclaimers for di site."
    },
    {
      "type": "heading",
      "level": 2,
      "text": "9. Third-party infrastructure"
    },
    {
      "type": "table",
      "headers": [
        "Provider",
        "Role for Concrete stack"
      ],
      "rows": [
        [
          "**Halborn, Cantina, Zellic, Code4rena**",
          "Audits (Cantina dey do bug bounty too)"
        ],
        [
          "**Hypernative**",
          "24/7 threat monitoring"
        ],
        [
          "**ZeroShadow**",
          "Pause authority wey dem don delegate before"
        ],
        [
          "**Fireblocks / Fordefi / Gnosis Safe**",
          "Custody & wallet infrastructure for strategies"
        ],
        [
          "**LayerZero**",
          "Cross-chain messaging for pre-deposit claims (AssetCX get \"OFT\" audit too; OFT na LayerZero omnichain token standard)"
        ],
        [
          "**Enso**",
          "Swap/bridge-and-deposit routing"
        ],
        [
          "**1inch (and similar aggregators)**",
          "Swap routing to reduce slippage"
        ],
        [
          "**Chainalysis**",
          "Wallet screening when you connect"
        ],
        [
          "**The Graph**",
          "Subgraph indexing"
        ],
        [
          "**DefiLlama**",
          "Public TVL/yield data (community tools dey use am)"
        ],
        [
          "**Royco, USDai**",
          "Partner curators / campaign partners"
        ],
        [
          "**Fuul / Absinthe**",
          "Points/quest platforms"
        ]
      ]
    },
    {
      "type": "heading",
      "level": 2,
      "text": "10. This repo's example scripts"
    },
    {
      "type": "table",
      "headers": [
        "Script",
        "Purpose"
      ],
      "rows": [
        [
          "`examples/python/share_math.py`",
          "Share ↔ asset conversion"
        ],
        [
          "`examples/python/yield_calculator.py`",
          "APY/APR projections"
        ],
        [
          "Fee-as-shares dilution model",
          "Fee-as-shares dilution model"
        ],
        [
          "`examples/python/airdrop_whatif.py`",
          "Hypothetical points→tokens model"
        ],
        [
          "`examples/typescript/*.ts`",
          "viem + SDK read-only samples"
        ],
        [
          "`examples/graphql/subgraph-queries.graphql`",
          "Subgraph queries wey ready make you adapt"
        ]
      ]
    },
    {
      "type": "heading",
      "level": 2,
      "text": "How to choose tool"
    },
    {
      "type": "table",
      "headers": [
        "I want to…",
        "Use"
      ],
      "rows": [
        [
          "Deposit / withdraw",
          "Earn app (official only)"
        ],
        [
          "Watch my balance without to connect",
          "Concrete Tracker"
        ],
        [
          "Compare vault APYs quick-quick",
          "Tracker Live Vaults / Academy Optimizer / DefiLlama"
        ],
        [
          "Learn how e dey work",
          "Dis repo → Academy → docs"
        ],
        [
          "Ask quick question",
          "Builder Suite Assistant (verify di answers)"
        ],
        [
          "Build integration",
          "Docs → SDK → subgraph"
        ],
        [
          "Launch institutional vault",
          "Enterprise / AssetCX"
        ]
      ]
    }
  ],
  zh: [
    {
      "type": "quote",
      "text": "图例：🟢 **官方**（由 Concrete / Blueprint Finance 制作）· 🟡 **社区**（独立、非官方——请自行核实一切）· 🔵 **第三方基础设施**（数据、合作伙伴）。链接已于 2026 年 9 月 20 日核实。"
    },
    {
      "type": "heading",
      "level": 2,
      "text": "快速索引"
    },
    {
      "type": "table",
      "headers": [
        "#",
        "工具",
        "类型",
        "最适合"
      ],
      "rows": [
        [
          "1",
          "[Concrete Tracker](#1-concrete-tracker-community)",
          "🟡",
          "只读的钱包/vault 持仓 + 积分查看"
        ],
        [
          "2",
          "[Builder Suite](#2-concrete-builder-suite-community)",
          "🟡",
          "AI 助手、优化器、指南、游戏、门户"
        ],
        [
          "3",
          "[Concrete Academy](#3-concrete-academy-community)",
          "🟡",
          "学习课程 + 计算器 + 实时数据"
        ],
        [
          "4",
          "[Earn app](#4-official-earn-app)",
          "🟢",
          "存款/提款/投资组合"
        ],
        [
          "5",
          "[Enterprise app 与 AssetCX](#5-official-enterprise-app--assetcx)",
          "🟢",
          "机构/发行方"
        ],
        [
          "6",
          "[积分](#6-official-points)",
          "🟢",
          "任务与奖励"
        ],
        [
          "7",
          "[Docs、SDK 与 Subgraph](#7-official-docs-sdk-subgraph)",
          "🟢",
          "开发者"
        ],
        [
          "8",
          "[信息与社区渠道](#8-official-info--community-channels)",
          "🟢",
          "新闻、支持"
        ],
        [
          "9",
          "[合作伙伴与数据基础设施](#9-third-party-infrastructure)",
          "🔵",
          "数据、路由、安全"
        ],
        [
          "10",
          "[本仓库的示例脚本](#10-this-repos-example-scripts)",
          "🛠",
          "学习数学原理"
        ]
      ]
    },
    {
      "type": "hr"
    },
    {
      "type": "heading",
      "level": 2,
      "text": "1. Concrete Tracker (community)"
    },
    {
      "type": "p",
      "text": "**URL：** <https://concrete-tracker-seven.vercel.app> · **仓库：** [Kashif130/concrete-community-tools](https://github.com/Kashif130/concrete-community-tools) · 也称为 *Position Ledger*。"
    },
    {
      "type": "p",
      "text": "一个以钱包为核心的**只读**仪表盘。无需连接钱包、无需签名、无需授权——每次读取都是对各 vault 的 ERC-4626 接口（`name`、`symbol`、`totalAssets`、`totalSupply`、`balanceOf`、`convertToAssets`）发起的实时 RPC 调用。"
    },
    {
      "type": "table",
      "headers": [
        "功能",
        "说明"
      ],
      "rows": [
        [
          "实时 vault 持仓",
          "按 README 支持 Ethereum + Arbitrum（线上 UI 还列出了 Base）；无索引器，无缓存"
        ],
        [
          "积分余额 + 排行榜",
          "从积分系统读取"
        ],
        [
          "多钱包对比",
          "并排显示；支持通过 CSV 上传钱包"
        ],
        [
          "vault 地址输入与已知 vault 扫描",
          "粘贴 vault 地址，或跨链扫描已知 vault"
        ],
        [
          "可分享的公开主页",
          "`/w/0xYourAddress`"
        ],
        [
          "导出",
          "CSV / JSON / PDF + 自动生成的分享卡片"
        ],
        [
          "份额价格提醒",
          "浏览器 + webhook"
        ],
        [
          "**实时 Vaults 仪表盘**",
          "`/vaults` - 所有已知 vault 的实时 TVL、份额价格、APY"
        ],
        [
          "**Vault 优化器 + 收益预测**",
          "预计收益图表"
        ],
        [
          "假设性空投估算器",
          "基于你的真实积分——纯属假设推演"
        ]
      ]
    },
    {
      "type": "p",
      "text": "**适合：** 个人、多钱包用户、需要可审计只读视图的 DAO/团队金库。**信任模型：** 部署在 Vercel 上的静态/无服务器架构；不在服务器端存储钱包/积分/个人数据（据 README）。"
    },
    {
      "type": "heading",
      "level": 2,
      "text": "2. Concrete Builder Suite (community)"
    },
    {
      "type": "p",
      "text": "**URL:** <https://concrete-builder-suite.vercel.app>"
    },
    {
      "type": "table",
      "headers": [
        "子工具",
        "URL",
        "简介"
      ],
      "rows": [
        [
          "🤖 **Concrete Assistant**",
          "<https://concrete-assistant.streamlit.app/>",
          "协议问答 AI 聊天机器人：APY、清算保护、借贷、新手引导"
        ],
        [
          "📊 **Vault Optimizer**",
          "<https://concrete-vault.streamlit.app/>",
          "跨多资产 vault（USDC、USDT、WBTC、weETH…）的风险调整后收益仪表盘"
        ],
        [
          "📖 **System Guide**",
          "<https://concrete-guide.streamlit.app/>",
          "交互式知识库：earn vault、借贷、清算保护、积分"
        ],
        [
          "🎮 **Moai Saves: DeFi Rescue**",
          "<https://moai-defi-rescue.vercel.app/>",
          "浏览器街机游戏：接住存款人、拦截清算人、Stone Shield 技能、“Degen mode”、Hall of Stone 排行榜"
        ],
        [
          "🧭 **Concrete Run**",
          "<https://concrete-run.vercel.app>",
          "通往 `app.concrete.xyz` 和 `points.concrete.xyz` 的导航中心"
        ]
      ]
    },
    {
      "type": "p",
      "text": "Suite 的落地页还显示实时 TVL、顶级 vault APY、网络（ETH · ARB · BERA · KATANA）以及实时 vault 列表，并链接到官方页面，包括 `wbtc.concrete.xyz`（专门的 WBTC vault 页面）。注意：其部分文案提到了早期产品世代中的借贷/清算功能——请以官方文档为准，确认当前实际上线的功能。"
    },
    {
      "type": "heading",
      "level": 2,
      "text": "3. Concrete Academy (community)"
    },
    {
      "type": "p",
      "text": "**URL：** <https://concrete-academy.vercel.app> - “Site Plan: a community field guide”。10 张图纸（课程）、30 项检查、从 *Apprentice → Architect* 的评级，**仅存储在你的浏览器本地**。"
    },
    {
      "type": "table",
      "headers": [
        "工具",
        "功能"
      ],
      "rows": [
        [
          "📚 图纸与检查",
          "用通俗语言讲解 vault、技术栈、托管与角色、风险引擎、积分、机构化转型、融资历程 + 每张图纸 3 道测验"
        ],
        [
          "💰 **Vault 收益计算器**",
          "真实 vault + 实时 APY（DefiLlama yields API）+ 你假设的存款与持有期，按日复利"
        ],
        [
          "🏆 **Vault 优化器**",
          "在相同存款/期限下，按当前 APY 对所有在线 Concrete 池排名（*不*考虑风险）"
        ],
        [
          "🔍 **Vault 浏览器**",
          "托管与提款并排对比"
        ],
        [
          "💸 **融资历程**",
          "自 2022 年 Blueprint Finance 成立以来所有已披露的融资轮次"
        ],
        [
          "🎲 **空投分配检查器**",
          "**仅为假设** - 固定 10 亿最大供应量占位值、可调节的池大小、你自己估计的总积分"
        ],
        [
          "📡 实时数据",
          "来自 DefiLlama 的 TVL 与链数据；嵌入的官方 X 时间线（@ConcreteXYZ、@Blueprint_DeFi）；实时博客动态；里程碑历史"
        ],
        [
          "📖 术语表",
          "可展开词条的术语列表"
        ]
      ]
    },
    {
      "type": "p",
      "text": "与 Concrete 官方积分无关——该评级体系没有任何官方意义。"
    },
    {
      "type": "heading",
      "level": 2,
      "text": "4. Official Earn app"
    },
    {
      "type": "p",
      "text": "**URL：** <https://app.concrete.xyz/earn> - 标签页：**Earn**、**Institutional**、**Portfolio**。"
    },
    {
      "type": "p",
      "text": "功能：进行中/已结束的 vault 卡片（TVL、APY、实时与 7 日 APY、提款队列、curator、钱包设置、审计方、带 Etherscan 链接的地址）、存款/提款/领取流程、每个 vault 的**透明度面板**（按资产/协议/网络拆分，延迟 24 小时）、受支持 vault 上的 Enso 路由、地域限制提示。"
    },
    {
      "type": "heading",
      "level": 2,
      "text": "5. Official Enterprise app & AssetCX"
    },
    {
      "type": "p",
      "text": "**Enterprise app：** <https://enterprise.concrete.xyz/> · **概览：** <https://concrete.xyz/enterprise> · **AssetCX 咨询：** concrete.xyz 上的表单。运营门户（NAV、队列、告警、历史）、托管 UI 或 SDK、每日 NAV 自动化。参见 [Enterprise](/docs/02-intermediate/03-institutional-assetcx-enterprise)。"
    },
    {
      "type": "heading",
      "level": 2,
      "text": "6. Official Points"
    },
    {
      "type": "p",
      "text": "**URL：** <https://points.concrete.xyz>（2026 年 9 月 20 日显示由 Fuul 提供支持）。早期阶段由 Absinthe 提供支持。参见 [积分](/docs/01-beginner/07-points-and-rewards)。"
    },
    {
      "type": "heading",
      "level": 2,
      "text": "7. Official Docs, SDK, Subgraph"
    },
    {
      "type": "table",
      "headers": [
        "工具",
        "链接"
      ],
      "rows": [
        [
          "文档",
          "<https://docs.concrete.xyz>（Docusaurus；源码位于 `Blueprint-Finance/concrete-docs`）"
        ],
        [
          "SDK",
          "`@concrete-xyz/sdk` - [指南](/docs/03-advanced/04-sdk-guide)"
        ],
        [
          "Subgraph（按链）",
          "[指南](/docs/03-advanced/05-subgraph-and-events)"
        ],
        [
          "Vault 透明度 API",
          "`GET /v1/vault:transparency/stats`"
        ],
        [
          "审计报告",
          "<https://docs.concrete.xyz/Audits/>"
        ],
        [
          "术语表 / 风险 / 受限司法辖区 / 支持",
          "在文档侧边栏中"
        ]
      ]
    },
    {
      "type": "heading",
      "level": 2,
      "text": "8. Official info & community channels"
    },
    {
      "type": "p",
      "text": "网站 <https://concrete.xyz> · 生态页面 · 博客 · 新闻 · X **@ConcreteXYZ**（以及 Blueprint Finance 的 **@Blueprint_DeFi**）· Discord <https://discord.gg/concretexyz> · Mirror `mirror.xyz/concretexyz.eth` · 品牌素材包 `live.standards.site/concrete` · 条款/隐私/免责声明见网站。"
    },
    {
      "type": "heading",
      "level": 2,
      "text": "9. Third-party infrastructure"
    },
    {
      "type": "table",
      "headers": [
        "提供方",
        "在 Concrete 技术栈中的角色"
      ],
      "rows": [
        [
          "**Halborn, Cantina, Zellic, Code4rena**",
          "审计（Cantina 同时负责 bug bounty）"
        ],
        [
          "**Hypernative**",
          "7×24 威胁监控"
        ],
        [
          "**ZeroShadow**",
          "预先委托的暂停权限"
        ],
        [
          "**Fireblocks / Fordefi / Gnosis Safe**",
          "策略的托管与钱包基础设施"
        ],
        [
          "**LayerZero**",
          "用于预存款领取的跨链消息（AssetCX 也有一份“OFT”审计；OFT 是 LayerZero 的全链代币标准）"
        ],
        [
          "**Enso**",
          "Swap/跨链桥并存款的路由"
        ],
        [
          "**1inch (and similar aggregators)**",
          "通过 swap 路由降低滑点"
        ],
        [
          "**Chainalysis**",
          "连接时的钱包筛查"
        ],
        [
          "**The Graph**",
          "Subgraph 索引"
        ],
        [
          "**DefiLlama**",
          "公开的 TVL/收益数据（社区工具使用）"
        ],
        [
          "**Royco, USDai**",
          "合作 curator / 活动合作伙伴"
        ],
        [
          "**Fuul / Absinthe**",
          "积分/任务平台"
        ]
      ]
    },
    {
      "type": "heading",
      "level": 2,
      "text": "10. This repo's example scripts"
    },
    {
      "type": "table",
      "headers": [
        "脚本",
        "用途"
      ],
      "rows": [
        [
          "`examples/python/share_math.py`",
          "份额 ↔ 资产换算"
        ],
        [
          "`examples/python/yield_calculator.py`",
          "APY/APR 预测"
        ],
        [
          "以份额形式收费的稀释模型",
          "Fee-as-shares dilution model"
        ],
        [
          "`examples/python/airdrop_whatif.py`",
          "假设性的 积分→代币 模型"
        ],
        [
          "`examples/typescript/*.ts`",
          "viem + SDK 只读示例"
        ],
        [
          "`examples/graphql/subgraph-queries.graphql`",
          "可直接改造的 subgraph 查询"
        ]
      ]
    },
    {
      "type": "heading",
      "level": 2,
      "text": "如何选择工具"
    },
    {
      "type": "table",
      "headers": [
        "我想要……",
        "使用"
      ],
      "rows": [
        [
          "存款 / 提款",
          "Earn app（仅限官方）"
        ],
        [
          "不连接钱包查看我的余额",
          "Concrete Tracker"
        ],
        [
          "快速对比 vault APY",
          "Tracker Live Vaults / Academy Optimizer / DefiLlama"
        ],
        [
          "了解其运作方式",
          "本仓库 → Academy → 文档"
        ],
        [
          "快速提问",
          "Builder Suite Assistant（请核实答案）"
        ],
        [
          "构建集成",
          "文档 → SDK → subgraph"
        ],
        [
          "发起机构级 vault",
          "Enterprise / AssetCX"
        ]
      ]
    }
  ],
  id: [
    {
      "type": "quote",
      "text": "Legenda: 🟢 **Resmi** (dibuat oleh Concrete / Blueprint Finance) · 🟡 **Komunitas** (independen, tidak resmi - verifikasi semuanya sendiri) · 🔵 **Infra pihak ketiga** (data, mitra). Tautan diverifikasi pada 20 Sep 2026."
    },
    {
      "type": "heading",
      "level": 2,
      "text": "Indeks cepat"
    },
    {
      "type": "table",
      "headers": [
        "#",
        "Tool",
        "Tipe",
        "Terbaik untuk"
      ],
      "rows": [
        [
          "1",
          "[Concrete Tracker](#1-concrete-tracker-community)",
          "🟡",
          "Tampilan posisi wallet/vault + poin, read-only"
        ],
        [
          "2",
          "[Builder Suite](#2-concrete-builder-suite-community)",
          "🟡",
          "Asisten AI, optimizer, panduan, game, portal"
        ],
        [
          "3",
          "[Concrete Academy](#3-concrete-academy-community)",
          "🟡",
          "Kursus belajar + kalkulator + data langsung"
        ],
        [
          "4",
          "[Earn app](#4-official-earn-app)",
          "🟢",
          "Deposit/withdraw/portofolio"
        ],
        [
          "5",
          "[Enterprise app & AssetCX](#5-official-enterprise-app--assetcx)",
          "🟢",
          "Institusi/penerbit"
        ],
        [
          "6",
          "[Poin](#6-official-points)",
          "🟢",
          "Quest & reward"
        ],
        [
          "7",
          "[Docs, SDK & Subgraph](#7-official-docs-sdk-subgraph)",
          "🟢",
          "Builder"
        ],
        [
          "8",
          "[Kanal info & komunitas](#8-official-info--community-channels)",
          "🟢",
          "Berita, dukungan"
        ],
        [
          "9",
          "[Infrastruktur mitra & data](#9-third-party-infrastructure)",
          "🔵",
          "Data, routing, keamanan"
        ],
        [
          "10",
          "[Skrip contoh repo ini](#10-this-repos-example-scripts)",
          "🛠",
          "Mempelajari matematikanya"
        ]
      ]
    },
    {
      "type": "hr"
    },
    {
      "type": "heading",
      "level": 2,
      "text": "1. Concrete Tracker (community)"
    },
    {
      "type": "p",
      "text": "**URL:** <https://concrete-tracker-seven.vercel.app> · **Repo:** [Kashif130/concrete-community-tools](https://github.com/Kashif130/concrete-community-tools) · Juga disebut *Position Ledger*."
    },
    {
      "type": "p",
      "text": "Dashboard **read-only** yang berpusat pada wallet. Tanpa wallet-connect, tanpa tanda tangan, tanpa approval - setiap pembacaan adalah panggilan RPC langsung ke antarmuka ERC-4626 setiap vault (`name`, `symbol`, `totalAssets`, `totalSupply`, `balanceOf`, `convertToAssets`)."
    },
    {
      "type": "table",
      "headers": [
        "Fitur",
        "Catatan"
      ],
      "rows": [
        [
          "Posisi vault langsung",
          "Ethereum + Arbitrum menurut README (UI live juga mencantumkan Base); tanpa indexer, tanpa cache"
        ],
        [
          "Saldo poin + leaderboard",
          "Dibaca dari sistem poin"
        ],
        [
          "Perbandingan multi-wallet",
          "Berdampingan; mendukung unggah CSV berisi wallet"
        ],
        [
          "Input alamat vault & pemindaian vault yang dikenal",
          "Tempel alamat vault atau pindai vault yang dikenal secara multi-chain"
        ],
        [
          "Profil publik yang bisa dibagikan",
          "`/w/0xYourAddress`"
        ],
        [
          "Ekspor",
          "CSV / JSON / PDF + kartu berbagi yang dibuat otomatis"
        ],
        [
          "Alert harga share",
          "Browser + webhook"
        ],
        [
          "**Dashboard Live Vaults**",
          "`/vaults` - setiap vault yang dikenal dengan TVL, harga share, dan APY langsung"
        ],
        [
          "**Vault Optimizer + Prediksi Pendapatan**",
          "Grafik proyeksi pendapatan"
        ],
        [
          "Estimator airdrop hipotetis",
          "Berdasarkan poin asli Anda - murni skenario what-if"
        ]
      ]
    },
    {
      "type": "p",
      "text": "**Cocok untuk:** individu, pengguna multi-wallet, treasury DAO/tim yang menginginkan tampilan read-only siap audit. **Model kepercayaan:** statis/serverless di Vercel; tidak ada penyimpanan sisi server untuk data wallet/poin/pribadi (menurut README)."
    },
    {
      "type": "heading",
      "level": 2,
      "text": "2. Concrete Builder Suite (community)"
    },
    {
      "type": "p",
      "text": "**URL:** <https://concrete-builder-suite.vercel.app>"
    },
    {
      "type": "table",
      "headers": [
        "Sub-tool",
        "URL",
        "Apa itu"
      ],
      "rows": [
        [
          "🤖 **Concrete Assistant**",
          "<https://concrete-assistant.streamlit.app/>",
          "Chatbot AI untuk tanya-jawab protokol: APY, perlindungan likuidasi, borrowing, onboarding"
        ],
        [
          "📊 **Vault Optimizer**",
          "<https://concrete-vault.streamlit.app/>",
          "Dashboard yield yang disesuaikan risiko untuk vault multi-aset (USDC, USDT, WBTC, weETH…)"
        ],
        [
          "📖 **System Guide**",
          "<https://concrete-guide.streamlit.app/>",
          "Basis pengetahuan interaktif: earn vault, borrowing, perlindungan likuidasi, poin"
        ],
        [
          "🎮 **Moai Saves: DeFi Rescue**",
          "<https://moai-defi-rescue.vercel.app/>",
          "Game arcade browser: tangkap depositor, blokir likuidator, kemampuan Stone Shield, \"Degen mode\", leaderboard Hall of Stone"
        ],
        [
          "🧭 **Concrete Run**",
          "<https://concrete-run.vercel.app>",
          "Hub navigasi ke `app.concrete.xyz` dan `points.concrete.xyz`"
        ]
      ]
    },
    {
      "type": "p",
      "text": "Halaman landing Suite juga menampilkan TVL langsung, APY vault teratas, jaringan (ETH · ARB · BERA · KATANA) dan daftar vault langsung, serta menautkan ke halaman resmi termasuk `wbtc.concrete.xyz` (halaman vault WBTC khusus). Catatan: sebagian teksnya menyebut fitur borrowing/likuidasi dari generasi produk sebelumnya - periksa dokumentasi resmi untuk mengetahui apa yang aktif saat ini."
    },
    {
      "type": "heading",
      "level": 2,
      "text": "3. Concrete Academy (community)"
    },
    {
      "type": "p",
      "text": "**URL:** <https://concrete-academy.vercel.app> - \"Site Plan: a community field guide\". 10 gambar (pelajaran), 30 pemeriksaan, peringkat dari *Apprentice → Architect* yang disimpan **secara lokal di browser Anda**."
    },
    {
      "type": "table",
      "headers": [
        "Tool",
        "Fungsinya"
      ],
      "rows": [
        [
          "📚 Drawings & Inspection",
          "Pelajaran berbahasa sederhana tentang vault, stack, kustodian & peran, risk engine, poin, pivot institusional, funding trail + 3 kuis per lembar"
        ],
        [
          "💰 **Vault Yield Calculator**",
          "Vault nyata + APY langsung (DefiLlama yields API) + deposit & masa penahanan hipotetis Anda, compounding harian"
        ],
        [
          "🏆 **Vault Optimizer**",
          "Meranking setiap pool Concrete yang aktif berdasarkan APY saat ini untuk deposit/periode yang sama (*tidak* mempertimbangkan risiko)"
        ],
        [
          "🔍 **Vault Explorer**",
          "Perbandingan kustodian & penarikan berdampingan"
        ],
        [
          "💸 **Funding Trail**",
          "Setiap putaran pendanaan yang diungkapkan sejak Blueprint Finance berdiri pada 2022"
        ],
        [
          "🎲 **Airdrop Allocation Checker**",
          "**Hanya hipotetis** - placeholder max supply tetap 1B, ukuran pool yang bisa diatur, tebakan Anda sendiri untuk total poin"
        ],
        [
          "📡 Data langsung",
          "TVL & data chain dari DefiLlama; timeline X resmi yang di-embed (@ConcreteXYZ, @Blueprint_DeFi); feed blog langsung; riwayat milestone"
        ],
        [
          "📖 Glosarium",
          "Daftar istilah dengan entri yang bisa diperluas"
        ]
      ]
    },
    {
      "type": "p",
      "text": "Independen dari poin resmi Concrete - sistem peringkatnya tidak berarti apa-apa secara resmi."
    },
    {
      "type": "heading",
      "level": 2,
      "text": "4. Official Earn app"
    },
    {
      "type": "p",
      "text": "**URL:** <https://app.concrete.xyz/earn> - tab: **Earn**, **Institutional**, **Portfolio**."
    },
    {
      "type": "p",
      "text": "Fitur: kartu vault live/selesai (TVL, APY, APY live & 7 hari, antrean penarikan, curator, setup wallet, auditor, alamat dengan tautan Etherscan), alur deposit/withdraw/claim, **panel transparansi** per vault (rincian tertunda 24 jam per aset/protokol/jaringan), routing Enso pada vault yang didukung, pemberitahuan pembatasan geografis."
    },
    {
      "type": "heading",
      "level": 2,
      "text": "5. Official Enterprise app & AssetCX"
    },
    {
      "type": "p",
      "text": "**Enterprise app:** <https://enterprise.concrete.xyz/> · **Ikhtisar:** <https://concrete.xyz/enterprise> · **Pertanyaan AssetCX:** formulir di concrete.xyz. Portal operasi (NAV, antrean, alert, riwayat), UI hosted atau SDK, otomatisasi NAV harian. Lihat [Enterprise](/docs/02-intermediate/03-institutional-assetcx-enterprise)."
    },
    {
      "type": "heading",
      "level": 2,
      "text": "6. Official Points"
    },
    {
      "type": "p",
      "text": "**URL:** <https://points.concrete.xyz> (tampil didukung oleh Fuul pada 20 Sep 2026). Fase sebelumnya didukung oleh Absinthe. Lihat [Poin](/docs/01-beginner/07-points-and-rewards)."
    },
    {
      "type": "heading",
      "level": 2,
      "text": "7. Official Docs, SDK, Subgraph"
    },
    {
      "type": "table",
      "headers": [
        "Tool",
        "Tautan"
      ],
      "rows": [
        [
          "Docs",
          "<https://docs.concrete.xyz> (Docusaurus; sumber di `Blueprint-Finance/concrete-docs`)"
        ],
        [
          "SDK",
          "`@concrete-xyz/sdk` - [panduan](/docs/03-advanced/04-sdk-guide)"
        ],
        [
          "Subgraph (per chain)",
          "[panduan](/docs/03-advanced/05-subgraph-and-events)"
        ],
        [
          "API transparansi vault",
          "`GET /v1/vault:transparency/stats`"
        ],
        [
          "Laporan audit",
          "<https://docs.concrete.xyz/Audits/>"
        ],
        [
          "Glosarium / Risiko / Yurisdiksi terlarang / Dukungan",
          "di sidebar docs"
        ]
      ]
    },
    {
      "type": "heading",
      "level": 2,
      "text": "8. Official info & community channels"
    },
    {
      "type": "p",
      "text": "Website <https://concrete.xyz> · Halaman Ecosystem · Blog · News · X **@ConcreteXYZ** (dan **@Blueprint_DeFi** milik Blueprint Finance) · Discord <https://discord.gg/concretexyz> · Mirror `mirror.xyz/concretexyz.eth` · Brand kit `live.standards.site/concrete` · Terms/Privacy/Disclaimers ada di situs."
    },
    {
      "type": "heading",
      "level": 2,
      "text": "9. Third-party infrastructure"
    },
    {
      "type": "table",
      "headers": [
        "Penyedia",
        "Peran dalam stack Concrete"
      ],
      "rows": [
        [
          "**Halborn, Cantina, Zellic, Code4rena**",
          "Audit (Cantina juga menjalankan bug bounty)"
        ],
        [
          "**Hypernative**",
          "Pemantauan ancaman 24/7"
        ],
        [
          "**ZeroShadow**",
          "Otoritas pause yang didelegasikan sebelumnya"
        ],
        [
          "**Fireblocks / Fordefi / Gnosis Safe**",
          "Infrastruktur kustodian & wallet untuk strategi"
        ],
        [
          "**LayerZero**",
          "Pesan lintas chain untuk klaim pre-deposit (AssetCX juga memiliki audit \"OFT\"; OFT adalah standar token omnichain milik LayerZero)"
        ],
        [
          "**Enso**",
          "Routing swap/bridge-and-deposit"
        ],
        [
          "**1inch (and similar aggregators)**",
          "Routing swap untuk membatasi slippage"
        ],
        [
          "**Chainalysis**",
          "Screening wallet saat connect"
        ],
        [
          "**The Graph**",
          "Indexing subgraph"
        ],
        [
          "**DefiLlama**",
          "Data TVL/yield publik (dipakai oleh tool komunitas)"
        ],
        [
          "**Royco, USDai**",
          "Curator mitra / mitra kampanye"
        ],
        [
          "**Fuul / Absinthe**",
          "Platform poin/quest"
        ]
      ]
    },
    {
      "type": "heading",
      "level": 2,
      "text": "10. This repo's example scripts"
    },
    {
      "type": "table",
      "headers": [
        "Skrip",
        "Tujuan"
      ],
      "rows": [
        [
          "`examples/python/share_math.py`",
          "Konversi share ↔ aset"
        ],
        [
          "`examples/python/yield_calculator.py`",
          "Proyeksi APY/APR"
        ],
        [
          "Model dilusi fee-as-shares",
          "Fee-as-shares dilution model"
        ],
        [
          "`examples/python/airdrop_whatif.py`",
          "Model hipotetis poin→token"
        ],
        [
          "`examples/typescript/*.ts`",
          "Contoh read-only viem + SDK"
        ],
        [
          "`examples/graphql/subgraph-queries.graphql`",
          "Query subgraph siap adaptasi"
        ]
      ]
    },
    {
      "type": "heading",
      "level": 2,
      "text": "Memilih tool"
    },
    {
      "type": "table",
      "headers": [
        "Saya ingin…",
        "Gunakan"
      ],
      "rows": [
        [
          "Deposit / withdraw",
          "Earn app (hanya resmi)"
        ],
        [
          "Memantau saldo tanpa connect",
          "Concrete Tracker"
        ],
        [
          "Membandingkan APY vault dengan cepat",
          "Tracker Live Vaults / Academy Optimizer / DefiLlama"
        ],
        [
          "Mempelajari cara kerjanya",
          "Repo ini → Academy → docs"
        ],
        [
          "Mengajukan pertanyaan singkat",
          "Builder Suite Assistant (verifikasi jawabannya)"
        ],
        [
          "Membangun integrasi",
          "Docs → SDK → subgraph"
        ],
        [
          "Meluncurkan vault institusional",
          "Enterprise / AssetCX"
        ]
      ]
    }
  ],
};
