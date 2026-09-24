import type { DocBlock } from "../docs.generated";
import type { Locale } from "@/lib/i18n";

// Full translation of docs/01-beginner/03-getting-started.md.
// Internal links point at the same /docs/... routes as the English version.
export const gettingStarted: Partial<Record<Locale, DocBlock[]>> = {
  ur: [
    { type: "quote", text: "**Level:** Beginner · **Read time:** 8 minute · *Educational hai, financial advice nahi.*" },
    { type: "heading", level: 2, text: "Shuru karne se pehle - checklist" },
    {
      type: "ul",
      items: [
        "[ ] Aap ne vault ka page [app.concrete.xyz/earn](https://app.concrete.xyz/earn) par parh liya hai: APY type, curator, withdrawal model, fees, auditors.",
        "[ ] Aap ne [Restricted Jurisdictions](https://docs.concrete.xyz/restricted-jurisdictions/) check kar liya hai. Restricted jagah walay visitors ko app par block message dikhta hai.",
        "[ ] Aapke paas Web3 wallet aur gas ke liye kaafi native token hai.",
        "[ ] Aap **asli** domain (`app.concrete.xyz`) par hain. Isay bookmark karein; DMs mein aaye Earn links par kabhi click na karein.",
        "[ ] Aap jo deposit kar rahe hain, usay khonay ki taab la saktay hain. Yield guaranteed nahi hai.",
      ],
    },
    { type: "heading", level: 2, text: "Deposit flow" },
    {
      type: "ol",
      items: [
        "**app.concrete.xyz/earn** kholein.",
        "**Wallet connect karein.** App Terms of Use aur Privacy Policy accept karwata hai, aur address ko high-risk / restricted-jurisdiction activity ke liye screen kiya jata hai (Chainalysis).",
        "**Vault chunein.** Har vault sirf aik specific asset accept karta hai (WBTC vault → WBTC, Concrete DeFi USDT → USDT). *Permission Required* / *Permissioned* nishan walay vaults institutional hain aur approval ke bagair deposit nahi ho sakta.",
        "Vault ki minimum/maximum aur kisi bhi deposit cap ke andar **amount enter karein**.",
        "Token **approve** karein (sirf pehli baar).",
        "**Deposit** karein aur apni wallet mein confirm karein.",
        "**Shares** (`ctAsset`) receive karein. Aapke shares ki *tadaad* wohi rehti hai; har share vault ki kamai ke saath ziada valuable hota jata hai.",
      ],
    },
    { type: "p", text: "Kuch vaults **Enso** routing support karte hain, jis se aap doosray tokens ya chains se aik hi flow mein swap aur/ya bridge karke vault mein dal saktay hain." },
    { type: "heading", level: 2, text: "Deposit karne ke baad" },
    {
      type: "ul",
      items: [
        "App par **Portfolio** mein apni position track karein, ya community [Concrete Tracker](/docs/04-ecosystem/01-tools-catalog) se read-only dekhein.",
        "**Andar aane se pehle apna exit samjhein.** Zyada tar vaults *queued withdrawal* epochs ke saath istemal karte hain; likhtay waqt WBTC vault card **21-din** ki withdrawal queue dikha raha tha. Dekhein [Withdrawals](/docs/01-beginner/05-withdrawals).",
        "Check karein ke aapke vault mein **withdrawal cooldown** to nahi (deposit ke waqt dikhaya jata hai).",
      ],
    },
    { type: "heading", level: 2, text: "Vault address verify karna" },
    { type: "p", text: "Har vault card apna contract address list karta hai (jaisay `0xf72b…a1c4`). Etherscan par click karke token ka naam/symbol match karein, aur official app par diye address se compare karein. Chat mein koi address bheje to us par kabhi bharosa na karein." },
    { type: "heading", level: 2, text: "Safety ke usool" },
    {
      type: "ol",
      items: [
        "Apni seed phrase ya private key kabhi share na karein - na \"support\" ke saath, na kisi \"airdrop checker\" ke saath.",
        "Concrete ne **abhi tak koi token announce nahi kiya**. Jo koi bhi aap se \"$CT claim karne ke liye connect karo\" kahay, wo scam kar raha hai.",
        "Agar experiment kar rahe hain to limited funds walay fresh wallet ka istemal karein.",
        "Read-only tools (jaisay community tracker) ko kabhi signature ya approval ki zaroorat nahi hoti. Agar koi tool aapka balance \"dekhne\" ke liye sign karwaye, usay band kar dein.",
        "URLs double-check karein: `concrete.xyz`, `app.concrete.xyz`, `points.concrete.xyz`, `docs.concrete.xyz`, official X: `@ConcreteXYZ`.",
      ],
    },
    { type: "p", text: "Agla: [04 · Vault shares & yield](/docs/01-beginner/04-vault-shares-and-yield)." },
  ],
  hi: [
    { type: "quote", text: "**स्तर:** शुरुआती · **पढ़ने का समय:** 8 मिनट · *यह शैक्षिक है, वित्तीय सलाह नहीं।*" },
    { type: "heading", level: 2, text: "शुरू करने से पहले - checklist" },
    {
      type: "ul",
      items: [
        "[ ] आपने vault का page [app.concrete.xyz/earn](https://app.concrete.xyz/earn) पर पढ़ लिया है: APY type, curator, withdrawal model, fees, auditors।",
        "[ ] आपने [Restricted Jurisdictions](https://docs.concrete.xyz/restricted-jurisdictions/) check कर लिया है। Restricted जगहों के visitors को app पर block message दिखता है।",
        "[ ] आपके पास Web3 wallet और gas के लिए पर्याप्त native token है।",
        "[ ] आप **असली** domain (`app.concrete.xyz`) पर हैं। इसे bookmark करें; DMs में आए Earn links पर कभी click न करें।",
        "[ ] आप जो deposit कर रहे हैं उसे खोने की स्थिति सह सकते हैं। Yield guaranteed नहीं है।",
      ],
    },
    { type: "heading", level: 2, text: "Deposit flow" },
    {
      type: "ol",
      items: [
        "**app.concrete.xyz/earn** खोलें।",
        "**Wallet connect करें।** App Terms of Use और Privacy Policy accept करवाता है, और address को high-risk / restricted-jurisdiction activity के लिए screen किया जाता है (Chainalysis)।",
        "**Vault चुनें।** हर vault सिर्फ एक specific asset accept करता है (WBTC vault → WBTC, Concrete DeFi USDT → USDT)। *Permission Required* / *Permissioned* चिह्न वाले vaults institutional हैं और बिना approval deposit नहीं हो सकता।",
        "Vault की minimum/maximum और किसी भी deposit cap के भीतर **amount दर्ज करें**।",
        "Token **approve** करें (सिर्फ पहली बार)।",
        "**Deposit** करें और अपने wallet में confirm करें।",
        "**Shares** (`ctAsset`) प्राप्त करें। आपके shares की *संख्या* वही रहती है; हर share vault की कमाई के साथ ज्यादा valuable होता जाता है।",
      ],
    },
    { type: "p", text: "कुछ vaults **Enso** routing support करते हैं, जिससे आप दूसरे tokens या chains से एक ही flow में swap और/या bridge करके vault में डाल सकते हैं।" },
    { type: "heading", level: 2, text: "Deposit करने के बाद" },
    {
      type: "ul",
      items: [
        "App पर **Portfolio** में अपनी position track करें, या community [Concrete Tracker](/docs/04-ecosystem/01-tools-catalog) से read-only देखें।",
        "**अंदर आने से पहले अपना exit समझें।** ज्यादातर vaults *queued withdrawal* epochs के साथ इस्तेमाल करते हैं; लिखते समय WBTC vault card **21-दिन** की withdrawal queue दिखा रहा था। देखें [Withdrawals](/docs/01-beginner/05-withdrawals)।",
        "जांचें कि आपके vault में **withdrawal cooldown** तो नहीं (deposit के समय दिखाया जाता है)।",
      ],
    },
    { type: "heading", level: 2, text: "Vault address verify करना" },
    { type: "p", text: "हर vault card अपना contract address list करता है (जैसे `0xf72b…a1c4`)। Etherscan पर क्लिक करके token का नाम/symbol मिलाएँ, और official app पर दिए address से तुलना करें। Chat में कोई address भेजे तो उस पर कभी भरोसा न करें।" },
    { type: "heading", level: 2, text: "Safety के नियम" },
    {
      type: "ol",
      items: [
        "अपनी seed phrase या private key कभी share न करें - न \"support\" के साथ, न किसी \"airdrop checker\" के साथ।",
        "Concrete ने **अभी तक कोई token announce नहीं किया है**। जो कोई भी आपसे \"$CT claim करने के लिए connect करो\" कहे, वह scam कर रहा है।",
        "अगर experiment कर रहे हैं तो limited funds वाले नए wallet का इस्तेमाल करें।",
        "Read-only tools (जैसे community tracker) को कभी signature या approval की जरूरत नहीं होती। अगर कोई tool आपका balance \"देखने\" के लिए sign करवाए, उसे बंद कर दें।",
        "URLs double-check करें: `concrete.xyz`, `app.concrete.xyz`, `points.concrete.xyz`, `docs.concrete.xyz`, official X: `@ConcreteXYZ`।",
      ],
    },
    { type: "p", text: "अगला: [04 · Vault shares & yield](/docs/01-beginner/04-vault-shares-and-yield)।" },
  ],
  pcm: [
    { type: "quote", text: "**Level:** Beginner · **Read time:** 8 min · *Na for learning, e no be financial advice.*" },
    { type: "heading", level: 2, text: "Before you start - checklist" },
    {
      type: "ul",
      items: [
        "[ ] You don read di vault page for [app.concrete.xyz/earn](https://app.concrete.xyz/earn): APY type, curator, withdrawal model, fees, auditors.",
        "[ ] You don check [Restricted Jurisdictions](https://docs.concrete.xyz/restricted-jurisdictions/). People wey dey restricted places go see block message for di app.",
        "[ ] You get Web3 wallet and enough native token for gas.",
        "[ ] You dey for di **real** domain (`app.concrete.xyz`). Bookmark am; no click Earn links from DM.",
        "[ ] You fit afford to lose wetin you deposit. Yield no dey guaranteed.",
      ],
    },
    { type: "heading", level: 2, text: "Di deposit flow" },
    {
      type: "ol",
      items: [
        "Open **app.concrete.xyz/earn**.",
        "**Connect wallet.** Di app go ask you accept Terms of Use and Privacy Policy, and dem go screen your address (Chainalysis) for high-risk / restricted-jurisdiction activity.",
        "**Pick vault.** Every vault dey accept one specific asset (WBTC vault → WBTC, Concrete DeFi USDT → USDT). Vaults wey mark *Permission Required* / *Permissioned* na institutional ones, you no fit deposit unless dem approve you.",
        "**Enter amount** wey dey within di vault minimum/maximum and any deposit cap.",
        "**Approve** di token (first time only).",
        "**Deposit** and confirm am for your wallet.",
        "**Receive shares** (`ctAsset`). Your share *count* go stay di same; every share dey worth more as di vault dey earn.",
      ],
    },
    { type: "p", text: "Some vaults support **Enso** routing, e go let you swap and/or bridge from oda tokens or chains enter di vault for one flow." },
    { type: "heading", level: 2, text: "After you deposit" },
    {
      type: "ul",
      items: [
        "Track your position for **Portfolio** for di app, or read-only with di community [Concrete Tracker](/docs/04-ecosystem/01-tools-catalog).",
        "**Understand your exit before you enter.** Most vaults dey use *queued withdrawal* with epochs; di WBTC vault card as we dey write dis, e show **21-day** withdrawal queue. See [Withdrawals](/docs/01-beginner/05-withdrawals).",
        "Check whether your vault get **withdrawal cooldown** (dem go show am during deposit).",
      ],
    },
    { type: "heading", level: 2, text: "Verifying vault address" },
    { type: "p", text: "Every vault card dey list im contract address (e.g. `0xf72b…a1c4`). Click enter Etherscan, confirm say di token name/symbol match, compare am with di address for di official app. No trust any address wey person send you for chat." },
    { type: "heading", level: 2, text: "Safety rules" },
    {
      type: "ol",
      items: [
        "Never share your seed phrase or private key - no give \"support\", no give \"airdrop checker\".",
        "Concrete **never announce token**. Anybody wey ask you \"connect to claim $CT\" na scam.",
        "Use fresh wallet with small funds if you dey experiment.",
        "Read-only tools (like community tracker) never need signature or approval. If any tool ask you to sign something to \"view\" your balance, close am.",
        "Double-check URLs: `concrete.xyz`, `app.concrete.xyz`, `points.concrete.xyz`, `docs.concrete.xyz`, official X: `@ConcreteXYZ`.",
      ],
    },
    { type: "p", text: "Next: [04 · Vault shares & yield](/docs/01-beginner/04-vault-shares-and-yield)." },
  ],
  zh: [
    { type: "quote", text: "**级别：** 初级 · **阅读时间：** 8 分钟 · *仅供学习，不构成投资建议。*" },
    { type: "heading", level: 2, text: "开始之前 - 检查清单" },
    {
      type: "ul",
      items: [
        "[ ] 已阅读 [app.concrete.xyz/earn](https://app.concrete.xyz/earn) 上该 vault 的页面：APY 类型、curator、提款模式、费用、审计方。",
        "[ ] 已查看 [受限司法辖区说明](https://docs.concrete.xyz/restricted-jurisdictions/)。来自受限地区的访问者会在应用上看到拦截提示。",
        "[ ] 已有 Web3 钱包，并有足够的原生代币用于支付 gas。",
        "[ ] 确认自己在**官方**域名（`app.concrete.xyz`）上。请收藏该网址；切勿点击私信里发来的 Earn 链接。",
        "[ ] 能够承受本金损失。收益并非保证。",
      ],
    },
    { type: "heading", level: 2, text: "存款流程" },
    {
      type: "ol",
      items: [
        "打开 **app.concrete.xyz/earn**。",
        "**连接钱包。** 应用要求接受服务条款与隐私政策，并会对地址进行高风险 / 受限司法辖区筛查（Chainalysis）。",
        "**选择一个 vault。** 每个 vault 只接受一种特定资产（WBTC vault → WBTC，Concrete DeFi USDT → USDT）。标记为 *Permission Required* / *Permissioned* 的 vault 属于机构专用，未获批准无法存入。",
        "在 vault 的最小/最大限额及存款上限内**输入金额**。",
        "**授权**该代币（仅首次需要）。",
        "**存款**并在钱包中确认。",
        "**获得份额**（`ctAsset`）。你的份额*数量*保持不变；随着 vault 盈利，每份份额的价值会上升。",
      ],
    },
    { type: "p", text: "部分 vault 支持 **Enso** 路由，可以让你在同一流程中从其他代币或链完成兑换和/或跨链桥接后存入 vault。" },
    { type: "heading", level: 2, text: "存款之后" },
    {
      type: "ul",
      items: [
        "在应用的 **Portfolio** 页面追踪你的头寸，或使用社区工具 [Concrete Tracker](/docs/04-ecosystem/01-tools-catalog) 只读查看。",
        "**进入之前先了解你的退出方式。** 大多数 vault 采用带 epoch 的*排队提款*机制；撰写本文时，WBTC vault 卡片显示的提款队列为 **21 天**。参见[提款](/docs/01-beginner/05-withdrawals)。",
        "确认你的 vault 是否有**提款冷却期**（存款时会显示）。",
      ],
    },
    { type: "heading", level: 2, text: "验证 vault 地址" },
    { type: "p", text: "每张 vault 卡片都会列出其合约地址（例如 `0xf72b…a1c4`）。点击进入 Etherscan，确认代币名称/符号是否匹配，并与官方应用上显示的地址进行比对。切勿相信别人在聊天中发给你的地址。" },
    { type: "heading", level: 2, text: "安全经验法则" },
    {
      type: "ol",
      items: [
        "永远不要分享你的助记词或私钥——无论是对「客服」还是对「空投检测工具」。",
        "Concrete **尚未宣布任何代币**。任何要求你\"连接钱包以领取 $CT\"的人都是在实施诈骗。",
        "如果只是想试用，请使用资金有限的新钱包。",
        "只读工具（如社区版 tracker）从不需要签名或授权。如果某个工具要求你签名才能「查看」余额，请立即关闭它。",
        "仔细核对网址：`concrete.xyz`、`app.concrete.xyz`、`points.concrete.xyz`、`docs.concrete.xyz`，官方 X 账号：`@ConcreteXYZ`。",
      ],
    },
    { type: "p", text: "下一篇：[04 · Vault 份额与收益](/docs/01-beginner/04-vault-shares-and-yield)。" },
  ],
  id: [
    { type: "quote", text: "**Level:** Pemula · **Waktu baca:** 8 menit · *Edukasi, bukan nasihat finansial.*" },
    { type: "heading", level: 2, text: "Sebelum mulai - checklist" },
    {
      type: "ul",
      items: [
        "[ ] Anda sudah membaca halaman vault di [app.concrete.xyz/earn](https://app.concrete.xyz/earn): jenis APY, curator, model withdrawal, fee, auditor.",
        "[ ] Anda sudah memeriksa [Restricted Jurisdictions](https://docs.concrete.xyz/restricted-jurisdictions/). Pengunjung dari wilayah terbatas akan melihat pesan blokir di aplikasi.",
        "[ ] Anda punya wallet Web3 dan cukup token native untuk gas.",
        "[ ] Anda berada di domain **asli** (`app.concrete.xyz`). Bookmark alamat ini; jangan pernah klik link Earn dari DM.",
        "[ ] Anda siap kehilangan apa yang Anda setorkan. Yield tidak dijamin.",
      ],
    },
    { type: "heading", level: 2, text: "Alur deposit" },
    {
      type: "ol",
      items: [
        "Buka **app.concrete.xyz/earn**.",
        "**Hubungkan wallet.** Aplikasi mengharuskan Anda menyetujui Terms of Use dan Privacy Policy, dan alamat Anda akan diperiksa (Chainalysis) untuk aktivitas berisiko tinggi / wilayah terbatas.",
        "**Pilih vault.** Setiap vault hanya menerima satu aset tertentu (WBTC vault → WBTC, Concrete DeFi USDT → USDT). Vault bertanda *Permission Required* / *Permissioned* bersifat institusional dan Anda tidak bisa deposit tanpa persetujuan.",
        "**Masukkan jumlah** sesuai minimum/maksimum vault dan batas deposit yang berlaku.",
        "**Approve** token (hanya sekali di awal).",
        "**Deposit** dan konfirmasi di wallet Anda.",
        "**Terima shares** (`ctAsset`). Jumlah share Anda tetap sama; nilai tiap share naik seiring vault menghasilkan keuntungan.",
      ],
    },
    { type: "p", text: "Beberapa vault mendukung routing **Enso**, yang memungkinkan Anda swap dan/atau bridge dari token atau chain lain langsung ke vault dalam satu alur." },
    { type: "heading", level: 2, text: "Setelah deposit" },
    {
      type: "ul",
      items: [
        "Lacak posisi Anda di **Portfolio** pada aplikasi, atau lihat secara read-only lewat [Concrete Tracker](/docs/04-ecosystem/01-tools-catalog) komunitas.",
        "**Pahami cara keluar sebelum masuk.** Sebagian besar vault memakai *queued withdrawal* dengan epoch; saat artikel ini ditulis, kartu vault WBTC menunjukkan antrean withdrawal **21 hari**. Lihat [Withdrawals](/docs/01-beginner/05-withdrawals).",
        "Periksa apakah vault Anda punya **withdrawal cooldown** (ditampilkan saat deposit).",
      ],
    },
    { type: "heading", level: 2, text: "Memverifikasi alamat vault" },
    { type: "p", text: "Setiap kartu vault mencantumkan alamat kontraknya (misalnya `0xf72b…a1c4`). Klik untuk membuka Etherscan, pastikan nama/simbol token cocok, dan bandingkan dengan alamat di aplikasi resmi. Jangan pernah percaya alamat yang dikirim orang lain lewat chat." },
    { type: "heading", level: 2, text: "Aturan keamanan dasar" },
    {
      type: "ol",
      items: [
        "Jangan pernah membagikan seed phrase atau private key - baik ke \"support\" maupun ke \"pengecek airdrop\".",
        "Concrete **belum mengumumkan token apa pun**. Siapa pun yang meminta Anda \"connect untuk klaim $CT\" sedang menipu Anda.",
        "Gunakan wallet baru dengan dana terbatas jika Anda sekadar mencoba-coba.",
        "Tool read-only (seperti tracker komunitas) tidak pernah butuh signature atau approval. Jika ada tool yang meminta Anda menandatangani sesuatu hanya untuk \"melihat\" saldo, tutup saja.",
        "Periksa ulang URL: `concrete.xyz`, `app.concrete.xyz`, `points.concrete.xyz`, `docs.concrete.xyz`, X resmi: `@ConcreteXYZ`.",
      ],
    },
    { type: "p", text: "Selanjutnya: [04 · Vault shares & yield](/docs/01-beginner/04-vault-shares-and-yield)." },
  ],
};
