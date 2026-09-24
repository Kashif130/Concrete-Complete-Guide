import type { DocBlock } from "../docs.generated";
import type { Locale } from "@/lib/i18n";

// Full translation of docs/01-beginner/07-points-and-rewards.md.
// Internal links point at the same /docs/... routes as the English version.
export const pointsAndRewards: Partial<Record<Locale, DocBlock[]>> = {
  ur: [
    { type: "quote", text: "**Level:** Beginner · **Read time:** 5 min" },
    { type: "heading", level: 2, text: "Official docs kya kehtay hain" },
    { type: "p", text: "Docs **Concrete Points Program - Phase 1** ko aik *social campaign* ke tor par describe karte hain (uss waqt Absinthe se powered):" },
    {
      type: "ul",
      items: [
        "Users quests complete karte hain (X par **@ConcreteXYZ** follow karna, Discord join karna, Discord rubric use karke weekly blog article likhna) taake **\"bags\"** kama sakein.",
        "Bags baad mein **Concrete Points** mein convert ki jayen gi; conversion ratio publish nahi hui thi.",
        "Phase 1 rewards Earn app use karne se **related nahi** hain.",
        "Aik future **Earn App leaderboard** (usage-based) baad ke phase ke tor par planned tha, jiski conversion details aur distribution dates announce ki jayen gi.",
      ],
    },
    { type: "heading", level: 2, text: "Aaj aap kya dekhtay hain" },
    { type: "p", text: "20 Sep 2026 ko check karne par, **points.concrete.xyz** aik rewards interface load kar raha tha jis par *\"Powered by Fuul\"* likha tha, is liye ho sakta hai points site ke peeche wala platform docs page likhnay ke baad badal gaya ho. Docs page aur live site mein farq ho sakta hai - live site aur official announcements par bharosa karein." },
    { type: "p", text: "Alag se, Earn app kehta hai ke **eligible vaults par on-chain rewards accrue hotay hain jo automatically index hotay hain**." },
    { type: "heading", level: 2, text: "Jo *official* nahi hai" },
    {
      type: "ul",
      items: [
        "**Koi token announce nahi hua.** Community Academy ka \"Airdrop Allocation Checker\" aur is repo ka `examples/python/airdrop_whatif.py` **what-if models** hain jo user ke diye gaye guesses par based hain. Yeh kuch bhi predict nahi karte.",
        "Koi published total-points figure nahi hai, is liye koi bhi \"mera airdrop mein hissa\" wala number fiction hai.",
      ],
    },
    { type: "heading", level: 2, text: "Practical tips" },
    {
      type: "ol",
      items: [
        "Sirf `points.concrete.xyz` use karein jo `concrete.xyz` se linked ho.",
        "Points dekhne ke liye wallet connect karna normal hai; **\"claim\" karne ke liye token approvals sign karna normal nahi hai**.",
        "Concrete Tracker jaisay community trackers aapka points balance read-only parhte hain; phir bhi inhein third-party samjhein.",
      ],
    },
    { type: "p", text: "Agla stage → [Intermediate: vault catalog](/docs/02-intermediate/01-vault-catalog)." },
  ],
  hi: [
    { type: "quote", text: "**स्तर:** शुरुआती · **पढ़ने का समय:** 5 मिनट" },
    { type: "heading", level: 2, text: "Official docs क्या कहते हैं" },
    { type: "p", text: "Docs **Concrete Points Program - Phase 1** को एक *social campaign* के रूप में describe करते हैं (उस समय Absinthe से powered):" },
    {
      type: "ul",
      items: [
        "Users quests complete करते हैं (X पर **@ConcreteXYZ** follow करना, Discord join करना, Discord rubric इस्तेमाल करके weekly blog article लिखना) ताकि **\"bags\"** कमा सकें।",
        "Bags बाद में **Concrete Points** में convert की जाएँगी; conversion ratio publish नहीं हुआ था।",
        "Phase 1 rewards Earn app इस्तेमाल करने से **related नहीं** हैं।",
        "एक future **Earn App leaderboard** (usage-based) बाद के phase के रूप में planned था, जिसकी conversion details और distribution dates announce की जाएँगी।",
      ],
    },
    { type: "heading", level: 2, text: "आज आप क्या देखते हैं" },
    { type: "p", text: "20 Sep 2026 को check करने पर, **points.concrete.xyz** एक rewards interface load कर रहा था जिस पर *\"Powered by Fuul\"* लिखा था, इसलिए हो सकता है points site के पीछे वाला platform docs page लिखे जाने के बाद बदल गया हो। Docs page और live site में फर्क हो सकता है - live site और official announcements पर भरोसा करें।" },
    { type: "p", text: "अलग से, Earn app कहता है कि **eligible vaults पर on-chain rewards accrue होते हैं जो automatically index होते हैं**।" },
    { type: "heading", level: 2, text: "जो *official* नहीं है" },
    {
      type: "ul",
      items: [
        "**कोई token announce नहीं हुआ।** Community Academy का \"Airdrop Allocation Checker\" और इस repo का `examples/python/airdrop_whatif.py` **what-if models** हैं जो user के दिए गए guesses पर based हैं। ये कुछ भी predict नहीं करते।",
        "कोई published total-points figure नहीं है, इसलिए कोई भी \"मेरा airdrop में हिस्सा\" वाला number fiction है।",
      ],
    },
    { type: "heading", level: 2, text: "Practical tips" },
    {
      type: "ol",
      items: [
        "सिर्फ `points.concrete.xyz` इस्तेमाल करें जो `concrete.xyz` से linked हो।",
        "Points देखने के लिए wallet connect करना normal है; **\"claim\" करने के लिए token approvals sign करना normal नहीं है**।",
        "Concrete Tracker जैसे community trackers आपका points balance read-only पढ़ते हैं; फिर भी इन्हें third-party समझें।",
      ],
    },
    { type: "p", text: "अगला stage → [Intermediate: vault catalog](/docs/02-intermediate/01-vault-catalog)।" },
  ],
  pcm: [
    { type: "quote", text: "**Level:** Beginner · **Read time:** 5 min" },
    { type: "heading", level: 2, text: "Wetin di official docs talk" },
    { type: "p", text: "Di docs describe **Concrete Points Program - Phase 1** as one *social campaign* (wey Absinthe dey power am dat time):" },
    {
      type: "ul",
      items: [
        "Users go complete quests (follow **@ConcreteXYZ** for X, join di Discord, write weekly blog article using di Discord rubric) to earn **\"bags.\"**",
        "Later, dem go convert bags enter **Concrete Points**; dem never publish di conversion ratio.",
        "Phase 1 rewards **no relate** to using di Earn app.",
        "Dem plan one future **Earn App leaderboard** (usage-based) as later phase, wey dem go announce conversion details and distribution dates.",
      ],
    },
    { type: "heading", level: 2, text: "Wetin you dey see today" },
    { type: "p", text: "Wen dem check am on 20 Sep 2026, **points.concrete.xyz** load one rewards interface wey label *\"Powered by Fuul\"*, so di platform wey dey behind di points site fit don change since dem write di docs page. Di docs page and di live site fit disagree - trust di live site and official announcements." },
    { type: "p", text: "Separately, di Earn app talk say **eligible vaults dey accrue on-chain rewards wey dem dey index automatically**." },
    { type: "heading", level: 2, text: "Wetin no be official" },
    {
      type: "ul",
      items: [
        "**No token don announce.** Di community Academy \"Airdrop Allocation Checker\" and dis repo `examples/python/airdrop_whatif.py` na **what-if models** wey use user-supplied guesses. Dem no dey predict anytin.",
        "Dem no publish any total-points figure, so any \"my share of di airdrop\" number na fiction.",
      ],
    },
    { type: "heading", level: 2, text: "Practical tips" },
    {
      type: "ol",
      items: [
        "Only use `points.concrete.xyz` wey link from `concrete.xyz`.",
        "To connect wallet to see points na normal; **to sign token approvals to \"claim\" no be normal**.",
        "Community trackers like Concrete Tracker dey read your points balance read-only; still treat dem as third-party.",
      ],
    },
    { type: "p", text: "Next stage → [Intermediate: vault catalog](/docs/02-intermediate/01-vault-catalog)." },
  ],
  zh: [
    { type: "quote", text: "**级别：** 初级 · **阅读时间：** 5 分钟" },
    { type: "heading", level: 2, text: "官方文档怎么说" },
    { type: "p", text: "文档将**Concrete Points Program - Phase 1** 描述为一场*社交活动*（当时由 Absinthe 提供支持）：" },
    {
      type: "ul",
      items: [
        "用户通过完成任务（在 X 上关注 **@ConcreteXYZ**、加入 Discord、按照 Discord 的评分标准撰写每周博客文章）来赚取 **\"bags\"**。",
        "Bags 之后会被转换为**Concrete Points**；转换比例尚未公布。",
        "Phase 1 的奖励与使用 Earn 应用**无关**。",
        "计划在后续阶段推出未来的**Earn App 排行榜**（基于使用情况），转换细节和分发日期将另行公布。",
      ],
    },
    { type: "heading", level: 2, text: "如今你看到的情况" },
    { type: "p", text: "截至 2026 年 9 月 20 日查看时，**points.concrete.xyz** 加载的是一个标注 *\"Powered by Fuul\"* 的奖励界面，因此自文档撰写以来，积分网站背后所用的平台可能已经发生变化。文档页面和实际线上页面可能不一致——请以线上页面和官方公告为准。" },
    { type: "p", text: "另外，Earn 应用表示**符合条件的 vault 会自动计提并索引链上奖励**。" },
    { type: "heading", level: 2, text: "哪些内容*不是*官方的" },
    {
      type: "ul",
      items: [
        "**尚未宣布任何代币。** 社区 Academy 的「空投分配查询器（Airdrop Allocation Checker）」以及本仓库中的 `examples/python/airdrop_whatif.py` 都只是基于用户自行输入猜测的**假设模型**，并不能预测任何结果。",
        "目前没有公布总积分数字，因此任何「我在空投中的份额」之类的数字都是虚构的。",
      ],
    },
    { type: "heading", level: 2, text: "实用建议" },
    {
      type: "ol",
      items: [
        "只使用从 `concrete.xyz` 链接过去的 `points.concrete.xyz`。",
        "连接钱包查看积分是正常操作；**为了\"领取\"而签署代币授权则不正常**。",
        "像 Concrete Tracker 这样的社区追踪工具只是只读地读取你的积分余额；即便如此，仍应将其视为第三方工具对待。",
      ],
    },
    { type: "p", text: "下一阶段 → [Intermediate: vault catalog](/docs/02-intermediate/01-vault-catalog)。" },
  ],
  id: [
    { type: "quote", text: "**Level:** Pemula · **Waktu baca:** 5 menit" },
    { type: "heading", level: 2, text: "Kata dokumentasi resmi" },
    { type: "p", text: "Dokumentasi menggambarkan **Concrete Points Program - Phase 1** sebagai *kampanye sosial* (saat itu didukung oleh Absinthe):" },
    {
      type: "ul",
      items: [
        "Pengguna menyelesaikan quest (follow **@ConcreteXYZ** di X, join Discord, menulis artikel blog mingguan sesuai rubrik Discord) untuk mendapatkan **\"bags.\"**",
        "Bags nantinya akan dikonversi menjadi **Concrete Points**; rasio konversinya belum dipublikasikan.",
        "Reward Phase 1 **tidak berkaitan** dengan penggunaan app Earn.",
        "Sebuah **leaderboard Earn App** di masa depan (berbasis penggunaan) direncanakan sebagai fase berikutnya, dengan detail konversi dan tanggal distribusi yang akan diumumkan kemudian.",
      ],
    },
    { type: "heading", level: 2, text: "Apa yang Anda lihat hari ini" },
    { type: "p", text: "Saat diperiksa pada 20 Sep 2026, **points.concrete.xyz** menampilkan interface reward berlabel *\"Powered by Fuul\"*, jadi platform di balik situs points mungkin sudah berubah sejak halaman dokumentasi ini ditulis. Halaman dokumentasi dan situs yang sedang berjalan bisa berbeda - percayalah pada situs yang berjalan dan pengumuman resmi." },
    { type: "p", text: "Secara terpisah, app Earn menyatakan bahwa **vault yang memenuhi syarat mengakumulasi reward on-chain yang diindeks secara otomatis**." },
    { type: "heading", level: 2, text: "Apa yang *bukan* resmi" },
    {
      type: "ul",
      items: [
        "**Belum ada token yang diumumkan.** \"Airdrop Allocation Checker\" milik komunitas Academy dan `examples/python/airdrop_whatif.py` di repo ini adalah **model what-if** dengan tebakan yang diinput pengguna sendiri. Keduanya tidak memprediksi apa pun.",
        "Belum ada angka total-points yang dipublikasikan, jadi angka \"bagian airdrop saya\" apa pun hanyalah fiksi.",
      ],
    },
    { type: "heading", level: 2, text: "Tips praktis" },
    {
      type: "ol",
      items: [
        "Gunakan hanya `points.concrete.xyz` yang ditautkan dari `concrete.xyz`.",
        "Menghubungkan wallet untuk melihat points itu normal; **menandatangani token approval untuk \"claim\" itu tidak normal**.",
        "Community tracker seperti Concrete Tracker membaca saldo points Anda secara read-only; tetap perlakukan sebagai pihak ketiga.",
      ],
    },
    { type: "p", text: "Tahap selanjutnya → [Intermediate: vault catalog](/docs/02-intermediate/01-vault-catalog)." },
  ],
};
