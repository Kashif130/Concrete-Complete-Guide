import type { DocBlock } from "../docs.generated";
import type { Locale } from "@/lib/i18n";

// Full translation of docs/03-advanced/04-sdk-guide.md.
// Method names, code blocks and identifiers are left as in the English source.
export const sdkGuide: Partial<Record<Locale, DocBlock[]>> = {
  ur: [
    {
      "type": "quote",
      "text": "**Level:** Advanced · Official Earn V2 SDK docs par mabni. Method names/versions badal sakte hain - [docs.concrete.xyz/Developers/SDK](https://docs.concrete.xyz/Developers/SDK/overview/) par confirm karein."
    },
    {
      "type": "heading",
      "level": 2,
      "text": "Yeh kya deta hai"
    },
    {
      "type": "ul",
      "items": [
        "Vault details query karna: decimals, symbols, total assets, balances.",
        "Underlying ERC-20 ke liye approvals.",
        "Deposits aur redemptions (shares mint/redeem karna).",
        "Tx bhejne se pehle output estimate karne ke liye preview conversions.",
        "Multi-chain support: **Ethereum, Arbitrum, Berachain, Katana, Corn, Morph**.",
        "**viem** par bana hai; vanilla JS/TS (ethers), React hooks aur Wagmi ke saath kaam karta hai."
      ]
    },
    {
      "type": "heading",
      "level": 2,
      "text": "Install"
    },
    {
      "type": "code",
      "lang": "bash",
      "code": "npm install @concrete-xyz/sdk\n# vanilla usage also needs: npm install ethers\n# React:  import { useVault } from \"@concrete-xyz/sdk/react\"\n# Wagmi:  import { useVault, useVaultQuery } from \"@concrete-xyz/sdk/wagmi\""
    },
    {
      "type": "heading",
      "level": 2,
      "text": "Prerequisites"
    },
    {
      "type": "table",
      "headers": [
        "Need",
        "Why"
      ],
      "rows": [
        [
          "**Vault address**",
          "Har call kisi khaas vault contract ko target karti hai."
        ],
        [
          "**Supported chain**",
          "Vault upar diye gaye chains mein se kisi aik par hona chahiye."
        ],
        [
          "**Signer (sirf writes ke liye)**",
          "Approve/deposit/redeem. Reads ke liye sirf provider chahiye."
        ]
      ]
    },
    {
      "type": "heading",
      "level": 2,
      "text": "Vanilla (ethers)"
    },
    {
      "type": "code",
      "lang": "ts",
      "code": "import { getVault } from \"@concrete-xyz/sdk\";\nimport { ethers } from \"ethers\";\n\nconst provider = new ethers.JsonRpcProvider(\"https://ethereum-rpc.publicnode.com\");\nconst vault = getVault(\"v1\", \"0xVaultAddress\", 1, provider);   // read-only\nconst details = await vault.getVaultDetails();\nconsole.log(details.vaultAsset.symbol);"
    },
    {
      "type": "p",
      "text": "Writes ke liye 5ve argument ke taur par `signer` add karein."
    },
    {
      "type": "heading",
      "level": 2,
      "text": "React & Wagmi"
    },
    {
      "type": "ul",
      "items": [
        "**React:** `useVault(version, address, chainId, provider, signer)` - `chainId` **number** hona chahiye.",
        "**Wagmi:** koi provider config nahi chahiye (auto-detect hota hai). `useVaultQuery({ vault, queryKey, queryFn })` ko tarjeeh dein, jo loading/error states khud handle karta hai; connectors load hone tak `useVault` thoray waqt ke liye `undefined` bhi return kar sakta hai."
      ]
    },
    {
      "type": "heading",
      "level": 2,
      "text": "Official docs mein sections"
    },
    {
      "type": "p",
      "text": "Setup Configuration · **Migrating from 1.x** · Read Methods (jaisay `balanceOf`) · Write Methods (jaisay `approve`) · Decimals & Conversion Helpers · Examples · Troubleshooting & Error Handling. Vault transparency ke liye aik documented REST read bhi hai: `GET /v1/vault:transparency/stats` (params: vault address + chain ID) jo `totalPortfolioAssetsOffchainUsd`, `byAsset`, `byProtocol`, `byPlatform`, `timestamp` return karta hai (data ~24 ghante delayed)."
    },
    {
      "type": "heading",
      "level": 2,
      "text": "Integration best practices"
    },
    {
      "type": "ol",
      "items": [
        "**Bhejne se pehle preview karein:** preview/convert helpers use karein aur slippage/expected shares dikhayein.",
        "**Decimals explicitly handle karein** - vault share decimals asset decimals se different ho saktay hain.",
        "**Vault type parhein** (atomic vs queued vs pre-deposit) aur sahi UX render karein: queued vault par instant withdraw button fail ho jayega ya mislead karega.",
        "**Limits ka khayal rakhein:** max deposit cap, per-user cap, min/max amounts, cooldown/locks.",
        "Front-end code mein **kabhi private keys embed na karein**; user ke wallet se sign karwayein.",
        "**Fallback RPCs** aur retry/backoff rakhein; reads sasti hoti hain, rate limits nahi.",
        "Historical data ke liye logs scan karne ki bajaye **subgraph se cross-check karein**."
      ]
    },
    {
      "type": "p",
      "text": "Runnable-shape samples ke liye `examples/typescript/` dekhein (is repo ke author ne inhein live chain par execute nahi kiya)."
    }
  ],
  hi: [
    {
      "type": "quote",
      "text": "**स्तर:** Advanced · Official Earn V2 SDK docs पर आधारित। Method names/versions बदल सकते हैं - [docs.concrete.xyz/Developers/SDK](https://docs.concrete.xyz/Developers/SDK/overview/) पर confirm करें।"
    },
    {
      "type": "heading",
      "level": 2,
      "text": "यह क्या देता है"
    },
    {
      "type": "ul",
      "items": [
        "Vault details query करना: decimals, symbols, total assets, balances।",
        "Underlying ERC-20 के लिए approvals।",
        "Deposits और redemptions (shares mint/redeem करना)।",
        "Tx भेजने से पहले output estimate करने के लिए preview conversions।",
        "Multi-chain support: **Ethereum, Arbitrum, Berachain, Katana, Corn, Morph**।",
        "**viem** पर बना है; vanilla JS/TS (ethers), React hooks और Wagmi के साथ काम करता है।"
      ]
    },
    {
      "type": "heading",
      "level": 2,
      "text": "Install"
    },
    {
      "type": "code",
      "lang": "bash",
      "code": "npm install @concrete-xyz/sdk\n# vanilla usage also needs: npm install ethers\n# React:  import { useVault } from \"@concrete-xyz/sdk/react\"\n# Wagmi:  import { useVault, useVaultQuery } from \"@concrete-xyz/sdk/wagmi\""
    },
    {
      "type": "heading",
      "level": 2,
      "text": "Prerequisites"
    },
    {
      "type": "table",
      "headers": [
        "Need",
        "Why"
      ],
      "rows": [
        [
          "**Vault address**",
          "हर call किसी ख़ास vault contract को target करती है।"
        ],
        [
          "**Supported chain**",
          "Vault ऊपर दिए गए chains में से किसी एक पर होना चाहिए।"
        ],
        [
          "**Signer (सिर्फ़ writes के लिए)**",
          "Approve/deposit/redeem। Reads के लिए सिर्फ़ provider चाहिए।"
        ]
      ]
    },
    {
      "type": "heading",
      "level": 2,
      "text": "Vanilla (ethers)"
    },
    {
      "type": "code",
      "lang": "ts",
      "code": "import { getVault } from \"@concrete-xyz/sdk\";\nimport { ethers } from \"ethers\";\n\nconst provider = new ethers.JsonRpcProvider(\"https://ethereum-rpc.publicnode.com\");\nconst vault = getVault(\"v1\", \"0xVaultAddress\", 1, provider);   // read-only\nconst details = await vault.getVaultDetails();\nconsole.log(details.vaultAsset.symbol);"
    },
    {
      "type": "p",
      "text": "Writes के लिए 5वें argument के तौर पर `signer` add करें।"
    },
    {
      "type": "heading",
      "level": 2,
      "text": "React & Wagmi"
    },
    {
      "type": "ul",
      "items": [
        "**React:** `useVault(version, address, chainId, provider, signer)` - `chainId` **number** होना चाहिए।",
        "**Wagmi:** कोई provider config नहीं चाहिए (auto-detect होता है)। `useVaultQuery({ vault, queryKey, queryFn })` को प्राथमिकता दें, जो loading/error states ख़ुद handle करता है; connectors load होने तक `useVault` थोड़ी देर के लिए `undefined` भी return कर सकता है।"
      ]
    },
    {
      "type": "heading",
      "level": 2,
      "text": "Official docs में sections"
    },
    {
      "type": "p",
      "text": "Setup Configuration · **Migrating from 1.x** · Read Methods (जैसे `balanceOf`) · Write Methods (जैसे `approve`) · Decimals & Conversion Helpers · Examples · Troubleshooting & Error Handling। Vault transparency के लिए एक documented REST read भी है: `GET /v1/vault:transparency/stats` (params: vault address + chain ID) जो `totalPortfolioAssetsOffchainUsd`, `byAsset`, `byProtocol`, `byPlatform`, `timestamp` return करता है (data ~24 घंटे delayed)।"
    },
    {
      "type": "heading",
      "level": 2,
      "text": "Integration best practices"
    },
    {
      "type": "ol",
      "items": [
        "**भेजने से पहले preview करें:** preview/convert helpers use करें और slippage/expected shares दिखाएं।",
        "**Decimals explicitly handle करें** - vault share decimals asset decimals से different हो सकते हैं।",
        "**Vault type पढ़ें** (atomic vs queued vs pre-deposit) और सही UX render करें: queued vault पर instant withdraw button fail हो जाएगा या mislead करेगा।",
        "**Limits का ख़याल रखें:** max deposit cap, per-user cap, min/max amounts, cooldown/locks।",
        "Front-end code में **कभी private keys embed न करें**; user के wallet से sign करवाएं।",
        "**Fallback RPCs** और retry/backoff रखें; reads सस्ती होती हैं, rate limits नहीं।",
        "Historical data के लिए logs scan करने की बजाय **subgraph से cross-check करें**।"
      ]
    },
    {
      "type": "p",
      "text": "Runnable-shape samples के लिए `examples/typescript/` देखें (इस repo के author ने इन्हें live chain पर execute नहीं किया)।"
    }
  ],
  pcm: [
    {
      "type": "quote",
      "text": "**Level:** Advanced · E dey based on di official Earn V2 SDK docs. Method names/versions fit change - confirm am for [docs.concrete.xyz/Developers/SDK](https://docs.concrete.xyz/Developers/SDK/overview/)."
    },
    {
      "type": "heading",
      "level": 2,
      "text": "Wetin e dey provide"
    },
    {
      "type": "ul",
      "items": [
        "Query vault details: decimals, symbols, total assets, balances.",
        "Approvals for di underlying ERC-20.",
        "Deposits and redemptions (mint/redeem shares).",
        "Preview conversions to estimate output before you send tx.",
        "Multi-chain support: **Ethereum, Arbitrum, Berachain, Katana, Corn, Morph**.",
        "E dey built on **viem**; e dey work with vanilla JS/TS (ethers), React hooks and Wagmi."
      ]
    },
    {
      "type": "heading",
      "level": 2,
      "text": "Install"
    },
    {
      "type": "code",
      "lang": "bash",
      "code": "npm install @concrete-xyz/sdk\n# vanilla usage also needs: npm install ethers\n# React:  import { useVault } from \"@concrete-xyz/sdk/react\"\n# Wagmi:  import { useVault, useVaultQuery } from \"@concrete-xyz/sdk/wagmi\""
    },
    {
      "type": "heading",
      "level": 2,
      "text": "Prerequisites"
    },
    {
      "type": "table",
      "headers": [
        "Need",
        "Why"
      ],
      "rows": [
        [
          "**Vault address**",
          "Every call dey target one specific vault contract."
        ],
        [
          "**Supported chain**",
          "Di vault must dey live on one of di chains wey dey above."
        ],
        [
          "**Signer (writes only)**",
          "Approve/deposit/redeem. Reads need only provider."
        ]
      ]
    },
    {
      "type": "heading",
      "level": 2,
      "text": "Vanilla (ethers)"
    },
    {
      "type": "code",
      "lang": "ts",
      "code": "import { getVault } from \"@concrete-xyz/sdk\";\nimport { ethers } from \"ethers\";\n\nconst provider = new ethers.JsonRpcProvider(\"https://ethereum-rpc.publicnode.com\");\nconst vault = getVault(\"v1\", \"0xVaultAddress\", 1, provider);   // read-only\nconst details = await vault.getVaultDetails();\nconsole.log(details.vaultAsset.symbol);"
    },
    {
      "type": "p",
      "text": "Add `signer` as di 5th argument for writes."
    },
    {
      "type": "heading",
      "level": 2,
      "text": "React & Wagmi"
    },
    {
      "type": "ul",
      "items": [
        "**React:** `useVault(version, address, chainId, provider, signer)` - `chainId` must be **number**.",
        "**Wagmi:** no need any provider config (auto-detected). Prefer `useVaultQuery({ vault, queryKey, queryFn })`, wey dey handle loading/error states; `useVault` fit briefly return `undefined` while connectors dey load."
      ]
    },
    {
      "type": "heading",
      "level": 2,
      "text": "Sections for di official docs"
    },
    {
      "type": "p",
      "text": "Setup Configuration · **Migrating from 1.x** · Read Methods (e.g. `balanceOf`) · Write Methods (e.g. `approve`) · Decimals & Conversion Helpers · Examples · Troubleshooting & Error Handling. Dem also document one REST read for vault transparency: `GET /v1/vault:transparency/stats` (params: vault address + chain ID) wey dey return `totalPortfolioAssetsOffchainUsd`, `byAsset`, `byProtocol`, `byPlatform`, `timestamp` (data ~24 hours delayed)."
    },
    {
      "type": "heading",
      "level": 2,
      "text": "Integration best practices"
    },
    {
      "type": "ol",
      "items": [
        "**Preview before you send:** use preview/convert helpers and show slippage/expected shares.",
        "**Handle decimals explicitly** - vault share decimals fit differ from asset decimals.",
        "**Read di vault type** (atomic vs queued vs pre-deposit) and render di correct UX: instant withdraw button for queued vault go fail or mislead.",
        "**Respect limits:** max deposit cap, per-user cap, min/max amounts, cooldown/locks.",
        "**Never embed private keys** for front-end code; sign via di user wallet.",
        "**Fallback RPCs** and retry/backoff; reads dey cheap, but rate limits no dey.",
        "**Cross-check with di subgraph** for historical data instead of scanning logs."
      ]
    },
    {
      "type": "p",
      "text": "Check `examples/typescript/` for runnable-shape samples (dis repo author no execute dem against live chain)."
    }
  ],
  zh: [
    {
      "type": "quote",
      "text": "**级别：** 高级 · 基于官方 Earn V2 SDK 文档。方法名/版本可能变化——请到 [docs.concrete.xyz/Developers/SDK](https://docs.concrete.xyz/Developers/SDK/overview/) 确认。"
    },
    {
      "type": "heading",
      "level": 2,
      "text": "它提供什么"
    },
    {
      "type": "ul",
      "items": [
        "查询 vault 详情：精度、符号、总资产、余额。",
        "对底层 ERC-20 的授权。",
        "存款与赎回（铸造/赎回份额）。",
        "在发送交易前用预览转换来估算输出。",
        "多链支持：**Ethereum、Arbitrum、Berachain、Katana、Corn、Morph**。",
        "基于 **viem** 构建；可配合原生 JS/TS（ethers）、React hooks 和 Wagmi 使用。"
      ]
    },
    {
      "type": "heading",
      "level": 2,
      "text": "安装"
    },
    {
      "type": "code",
      "lang": "bash",
      "code": "npm install @concrete-xyz/sdk\n# vanilla usage also needs: npm install ethers\n# React:  import { useVault } from \"@concrete-xyz/sdk/react\"\n# Wagmi:  import { useVault, useVaultQuery } from \"@concrete-xyz/sdk/wagmi\""
    },
    {
      "type": "heading",
      "level": 2,
      "text": "前置条件"
    },
    {
      "type": "table",
      "headers": [
        "需要",
        "原因"
      ],
      "rows": [
        [
          "**Vault 地址**",
          "每次调用都针对特定的 vault 合约。"
        ],
        [
          "**受支持的链**",
          "该 vault 必须部署在上述某条链上。"
        ],
        [
          "**签名者（仅写操作需要）**",
          "Approve/deposit/redeem 需要签名者。只读操作只需要 provider。"
        ]
      ]
    },
    {
      "type": "heading",
      "level": 2,
      "text": "原生用法（ethers）"
    },
    {
      "type": "code",
      "lang": "ts",
      "code": "import { getVault } from \"@concrete-xyz/sdk\";\nimport { ethers } from \"ethers\";\n\nconst provider = new ethers.JsonRpcProvider(\"https://ethereum-rpc.publicnode.com\");\nconst vault = getVault(\"v1\", \"0xVaultAddress\", 1, provider);   // read-only\nconst details = await vault.getVaultDetails();\nconsole.log(details.vaultAsset.symbol);"
    },
    {
      "type": "p",
      "text": "写操作需要在第 5 个参数位置加入 `signer`。"
    },
    {
      "type": "heading",
      "level": 2,
      "text": "React 与 Wagmi"
    },
    {
      "type": "ul",
      "items": [
        "**React：** `useVault(version, address, chainId, provider, signer)` —— `chainId` 必须是**数字**。",
        "**Wagmi：** 无需配置 provider（自动检测）。建议优先使用 `useVaultQuery({ vault, queryKey, queryFn })`，它会自动处理加载/错误状态；`useVault` 在连接器加载期间可能短暂返回 `undefined`。"
      ]
    },
    {
      "type": "heading",
      "level": 2,
      "text": "官方文档中的章节"
    },
    {
      "type": "p",
      "text": "Setup Configuration · **从 1.x 迁移** · Read Methods（例如 `balanceOf`）· Write Methods（例如 `approve`）· Decimals & Conversion Helpers · Examples · Troubleshooting & Error Handling。另外还有一个已记录的 vault 透明度 REST 读取接口：`GET /v1/vault:transparency/stats`（参数：vault 地址 + chain ID），返回 `totalPortfolioAssetsOffchainUsd`、`byAsset`、`byProtocol`、`byPlatform`、`timestamp`（数据大约延迟 24 小时）。"
    },
    {
      "type": "heading",
      "level": 2,
      "text": "集成最佳实践"
    },
    {
      "type": "ol",
      "items": [
        "**发送前先预览：** 使用 preview/convert 辅助函数，展示滑点和预期份额。",
        "**显式处理精度** —— vault 份额精度可能与资产精度不同。",
        "**读取 vault 类型**（atomic / queued / pre-deposit）并渲染正确的 UX：在 queued vault 上放一个即时提款按钮会失败或误导用户。",
        "**遵守限额：** 最大存款上限、单用户上限、最小/最大金额、冷却期/锁定期。",
        "**切勿在前端代码中嵌入私钥**；通过用户钱包签名。",
        "**准备备用 RPC** 及重试/退避策略；读取成本低，但速率限制不是没有。",
        "**优先用 subgraph 交叉核对**历史数据，而不是扫描日志。"
      ]
    },
    {
      "type": "p",
      "text": "可运行结构的示例见 `examples/typescript/`（本仓库作者未在真实链上执行过这些示例）。"
    }
  ],
  id: [
    {
      "type": "quote",
      "text": "**Level:** Lanjutan · Berdasarkan dokumentasi SDK Earn V2 resmi. Nama/versi method bisa berubah - konfirmasi di [docs.concrete.xyz/Developers/SDK](https://docs.concrete.xyz/Developers/SDK/overview/)."
    },
    {
      "type": "heading",
      "level": 2,
      "text": "Apa yang disediakan"
    },
    {
      "type": "ul",
      "items": [
        "Query detail vault: desimal, simbol, total aset, saldo.",
        "Approval untuk ERC-20 yang mendasarinya.",
        "Deposit dan redemption (mint/redeem share).",
        "Preview konversi untuk memperkirakan output sebelum mengirim tx.",
        "Dukungan multi-chain: **Ethereum, Arbitrum, Berachain, Katana, Corn, Morph**.",
        "Dibangun di atas **viem**; bekerja dengan vanilla JS/TS (ethers), React hooks, dan Wagmi."
      ]
    },
    {
      "type": "heading",
      "level": 2,
      "text": "Instalasi"
    },
    {
      "type": "code",
      "lang": "bash",
      "code": "npm install @concrete-xyz/sdk\n# vanilla usage also needs: npm install ethers\n# React:  import { useVault } from \"@concrete-xyz/sdk/react\"\n# Wagmi:  import { useVault, useVaultQuery } from \"@concrete-xyz/sdk/wagmi\""
    },
    {
      "type": "heading",
      "level": 2,
      "text": "Prasyarat"
    },
    {
      "type": "table",
      "headers": [
        "Butuh",
        "Kenapa"
      ],
      "rows": [
        [
          "**Alamat vault**",
          "Setiap panggilan menargetkan kontrak vault tertentu."
        ],
        [
          "**Chain yang didukung**",
          "Vault harus berada di salah satu chain di atas."
        ],
        [
          "**Signer (hanya untuk write)**",
          "Approve/deposit/redeem. Read hanya butuh provider."
        ]
      ]
    },
    {
      "type": "heading",
      "level": 2,
      "text": "Vanilla (ethers)"
    },
    {
      "type": "code",
      "lang": "ts",
      "code": "import { getVault } from \"@concrete-xyz/sdk\";\nimport { ethers } from \"ethers\";\n\nconst provider = new ethers.JsonRpcProvider(\"https://ethereum-rpc.publicnode.com\");\nconst vault = getVault(\"v1\", \"0xVaultAddress\", 1, provider);   // read-only\nconst details = await vault.getVaultDetails();\nconsole.log(details.vaultAsset.symbol);"
    },
    {
      "type": "p",
      "text": "Tambahkan `signer` sebagai argumen ke-5 untuk operasi write."
    },
    {
      "type": "heading",
      "level": 2,
      "text": "React & Wagmi"
    },
    {
      "type": "ul",
      "items": [
        "**React:** `useVault(version, address, chainId, provider, signer)` - `chainId` harus berupa **number**.",
        "**Wagmi:** tidak perlu konfigurasi provider (terdeteksi otomatis). Utamakan `useVaultQuery({ vault, queryKey, queryFn })`, yang menangani status loading/error; `useVault` bisa sesaat mengembalikan `undefined` saat connector masih dimuat."
      ]
    },
    {
      "type": "heading",
      "level": 2,
      "text": "Bagian-bagian di dokumentasi resmi"
    },
    {
      "type": "p",
      "text": "Setup Configuration · **Migrasi dari 1.x** · Read Methods (mis. `balanceOf`) · Write Methods (mis. `approve`) · Decimals & Conversion Helpers · Examples · Troubleshooting & Error Handling. Ada juga REST read terdokumentasi untuk transparansi vault: `GET /v1/vault:transparency/stats` (parameter: alamat vault + chain ID) yang mengembalikan `totalPortfolioAssetsOffchainUsd`, `byAsset`, `byProtocol`, `byPlatform`, `timestamp` (data tertunda ~24 jam)."
    },
    {
      "type": "heading",
      "level": 2,
      "text": "Praktik terbaik integrasi"
    },
    {
      "type": "ol",
      "items": [
        "**Preview sebelum mengirim:** gunakan helper preview/convert dan tampilkan slippage/perkiraan share.",
        "**Tangani desimal secara eksplisit** - desimal share vault bisa berbeda dari desimal aset.",
        "**Baca tipe vault** (atomic vs queued vs pre-deposit) dan tampilkan UX yang tepat: tombol withdraw instan pada vault queued akan gagal atau menyesatkan.",
        "**Patuhi batas:** cap deposit maksimum, cap per user, jumlah min/maks, cooldown/lock.",
        "**Jangan pernah menyematkan private key** di kode front-end; tanda tangani lewat wallet user.",
        "**Sediakan fallback RPC** dan retry/backoff; read itu murah, tapi rate limit tetap ada.",
        "**Cross-check dengan subgraph** untuk data historis, alih-alih memindai log."
      ]
    },
    {
      "type": "p",
      "text": "Lihat `examples/typescript/` untuk contoh berbentuk runnable (tidak dijalankan terhadap chain live oleh penulis repo ini)."
    }
  ],
};
