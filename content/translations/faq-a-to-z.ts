import type { DocBlock } from "../docs.generated";
import type { Locale } from "@/lib/i18n";

// Full translation of docs/05-reference/01-faq-a-to-z.md.
// The A-Z letter headings and the "Jump to" anchors are left as in the English source so
// the #a...#z links keep working; product/role/method names stay in English.
export const faqAToZ: Partial<Record<Locale, DocBlock[]>> = {
  ur: [
    {
      "type": "quote",
      "text": "Jawabat official docs, live sites (20 Sep 2026 ko check ki gayi) aur community tools ke READMEs par mabni hain. Kisi bhi maali maslay ke liye [app.concrete.xyz](https://app.concrete.xyz) aur [docs.concrete.xyz](https://docs.concrete.xyz) par confirm karein. Yeh financial advice nahi hai."
    },
    {
      "type": "p",
      "text": "**Seedha jayein:** [A](#a) · [B](#b) · [C](#c) · [D](#d) · [E](#e) · [F](#f) · [G](#g) · [H](#h) · [I](#i) · [J](#j) · [K](#k) · [L](#l) · [M](#m) · [N](#n) · [O](#o) · [P](#p) · [Q](#q) · [R](#r) · [S](#s) · [T](#t) · [U](#u) · [V](#v) · [W](#w) · [X](#x) · [Y](#y) · [Z](#z)"
    },
    {
      "type": "hr"
    },
    {
      "type": "heading",
      "level": 2,
      "text": "A"
    },
    {
      "type": "p",
      "text": "**Kya Concrete ka koi airdrop ya token hai?** Likhte waqt tak announce nahi hua. Jo community tools \"$CT\" airdrop ka model banate hain woh wazeh taur par what-ifs hain jin mein user ke apne andaze hote hain. Har \"claim your token\" link ko scam samjhein."
    },
    {
      "type": "p",
      "text": "**Kya Concrete audited hai?** Ji haan - Halborn, Cantina, Zellic aur Code4rena ne mukhtalif components aur versions audit kiye hain; Cantina bug bounty bhi chalata hai. Dekhein [Security](/docs/02-intermediate/05-security-and-audits). Audits risk kam karte hain, khatam nahi."
    },
    {
      "type": "p",
      "text": "**AssetCX kya hai?** Aisa mechanism jo qualified custody mein rakhe assets ki 1:1 on-chain representation mint karta hai taake woh custody chhode baghair vault yield kama saken. Dekhein [AssetCX](/docs/02-intermediate/03-institutional-assetcx-enterprise)."
    },
    {
      "type": "p",
      "text": "**Vault cards par \"APY\" ka kya matlab hai?** Compounding ke saath salana yield. *Target* APY aik hadaf hai; *live* APY reported APYs ka position-weighted average hai; *7-day live* pichhle hafte ka version hai. Inmein se koi guarantee nahi."
    },
    {
      "type": "p",
      "text": "**\"Approval\" transaction kya hai?** Token ki pehli baar di jane wali ijazat jis se vault contract deposit ke liye aap ke tokens kheench sakta hai. Sirf official app par bilkul wohi vault approve karein; istemal na hone wale approvals baad mein revoke kar dein."
    },
    {
      "type": "p",
      "text": "**Allocator kaun hai?** Aik automated role jo off-chain routing ki hidayat par strategies ke darmiyan capital move karta hai."
    },
    {
      "type": "heading",
      "level": 2,
      "text": "B"
    },
    {
      "type": "p",
      "text": "**\"Bags\" kya hain?** Points ke precursors jo Points program ke Phase 1 mein social quests se kamaye jate hain; inhein Concrete Points mein us ratio se convert kiya jana hai jo docs mein publish nahi hua."
    },
    {
      "type": "p",
      "text": "**Kya main vault mein bridge kar sakta hoon?** Kuch vaults Enso integration support karte hain jo aik hi flow mein bridge aur/ya swap karke deposit karwa deta hai."
    },
    {
      "type": "p",
      "text": "**Kya Concrete ka Bitcoin vault hai?** Ji haan - WBTC Vault (Ethereum) app par listed tha, snapshot date par 21-din ki withdrawal queue aur Fireblocks custody ke saath. Dusre BTC-related share tokens (ctLBTC, ctBeraLBTC) docs glossary mein nazar aate hain."
    },
    {
      "type": "p",
      "text": "**Kya vault code open source hai?** Contract source private repository mein hai; partners NDA sign karne ke baad access maang sakte hain. Audit reports public hain. Docs aur SDK public hain."
    },
    {
      "type": "heading",
      "level": 2,
      "text": "C"
    },
    {
      "type": "p",
      "text": "**Curator kya hota hai?** Woh operator jo vault ki strategies design karta aur chalata hai (Concrete ya Royco/USDai jaisa partner)."
    },
    {
      "type": "p",
      "text": "**Kaun se chains supported hain?** SDK Ethereum, Arbitrum, Berachain, Katana, Corn aur Morph list karta hai. Subgraph docs Ethereum, Arbitrum One aur Stable list karte hain. Har vault kisi khaas chain par hota hai - us ka card check karein."
    },
    {
      "type": "p",
      "text": "**Cooldown kya hai?** Kuch vaults par har deposit ke shares us deposit ka cooldown khatam hone tak withdraw/transfer nahi ho sakte. Early exit par fee (0-1%, ghatti hui) lag sakti hai jo shares mein ada hoti hai."
    },
    {
      "type": "p",
      "text": "**Kya mere funds vault contract mein hote hain?** Docs ke mutabiq deposits strategies ko forward kar diye jate hain; custodied strategies ke liye woh Gnosis Safe ya Fordefi MPC wallet mein hote hain - \"assets custody mein rehte hain, vault mein nahi\"."
    },
    {
      "type": "p",
      "text": "**`ctAsset` kya hai?** ERC-20 vault share (jaise `ctWBTC`). Dekhein [Vault shares](/docs/01-beginner/04-vault-shares-and-yield)."
    },
    {
      "type": "heading",
      "level": 2,
      "text": "D"
    },
    {
      "type": "p",
      "text": "**Community dashboards par Concrete ka data kahan se aata hai?** Community tools public RPCs (ERC-4626 calls) ke zariye on-chain parhte hain aur TVL/APY ke liye DefiLlama ki public APIs istemal karte hain."
    },
    {
      "type": "p",
      "text": "**Kya deposit karne par fee lagti hai?** Deposit fee nahi (aur withdrawal fee bhi nahi). Gas lagta hai. Management/performance fees vault ke andar share dilution ki soorat mein kati jati hain."
    },
    {
      "type": "p",
      "text": "**App kyun kehti hai ke main restricted jurisdiction mein hoon?** Kuch jurisdictions (sanctions aur dusre ineligible regions) mein access blocked hai. Terms aur Restricted Jurisdictions page parhein; agar aap ko lagta hai ghalti hai to refresh karein ya support ticket kholein. Aise workarounds istemal na karein jo Terms ki khilaf-warzi hon."
    },
    {
      "type": "heading",
      "level": 2,
      "text": "E"
    },
    {
      "type": "p",
      "text": "**Epoch kya hai?** Queued vaults mein withdrawal batching ki window. Requests open epoch mein shamil hoti hain; cutoff par woh band ho jata hai; phir process hota hai aur claim ke qabil banta hai."
    },
    {
      "type": "p",
      "text": "**Concrete Enterprise kya hai?** Apna institutional-grade vault launch/chalane ka platform (apni strategy aur wallets layein, hosted UI ya SDK, daily NAV, monitoring portal)."
    },
    {
      "type": "p",
      "text": "**ERC-4626 kya hai?** Ethereum ka tokenized-vault standard jo Concrete vaults implement karte hain."
    },
    {
      "type": "heading",
      "level": 2,
      "text": "F"
    },
    {
      "type": "p",
      "text": "**Fees kya hain?** Deposit/withdrawal: koi nahi. Management: 0-10%/saal (aksar vaults par standard 1.5%). Performance: net positive yield ka 0-30%, optionally hurdle se upar. Cooldown exit: 0-1%. Har vault ke hisab se configure hoti hain. Dekhein [Fees](/docs/01-beginner/06-fees)."
    },
    {
      "type": "p",
      "text": "**Yahan FIFO ka kya matlab hai?** Jab caps withdrawals ko kai epochs mein phaila dein to queued withdrawals ka first-in-first-out order."
    },
    {
      "type": "p",
      "text": "**Funding Trail kya hai?** Community ka banaya Academy page jo 2022 se Blueprint Finance ke disclosed funding rounds ka chart dikhata hai. Official sources se verify karein."
    },
    {
      "type": "heading",
      "level": 2,
      "text": "G"
    },
    {
      "type": "p",
      "text": "**Kya mujhe gas chahiye?** Ji haan - approval, deposit, withdrawal request aur claim transactions ke liye chain ka native token (Ethereum par ETH)."
    },
    {
      "type": "p",
      "text": "**Vaults ki governance kaun karta hai?** Roles taqseem hain: Vault Owner, `ROLE_ADMIN` aur operational roles, aur Factory Owner. Dekhein [Architecture](/docs/03-advanced/01-architecture-deep-dive). Concrete ne koi token announce nahi kiya, is liye aaj token-based governance ka koi wujood nahi."
    },
    {
      "type": "heading",
      "level": 2,
      "text": "H"
    },
    {
      "type": "p",
      "text": "**Hurdle rate kya hai?** Depositors ke liye aik target return; performance fees sirf us se upar ke yield par lagti hain (fixed APY, fixed APR ya dynamic)."
    },
    {
      "type": "p",
      "text": "**Hooks kya hain?** Optional modules jo deposit, mint, withdraw, redeem aur transfer se pehle/baad chalte hain (jaise whitelist, deposit cap, deposit lock). Revert karne wala hook operation rok deta hai."
    },
    {
      "type": "p",
      "text": "**Vaults ki monitoring kaun karta hai?** Hypernative (24/7 detection), jab ke ZeroShadow ke paas pehle se delegate kiya hua pause mandate hai."
    },
    {
      "type": "heading",
      "level": 2,
      "text": "I"
    },
    {
      "type": "p",
      "text": "**Kya koi bhi kisi bhi vault mein deposit kar sakta hai?** Nahi. *Permissioned / Permission Required* vaults (institutional, AssetCX, kuch private vaults) mein approval chahiye hoti hai."
    },
    {
      "type": "p",
      "text": "**Impermanent loss kya hai?** Jab qeematein alag hon to LP position ka holding ke muqable mein kam perform karna. Yeh AMM/LP-based vaults aur volatile pairs ke liye ahem hai."
    },
    {
      "type": "p",
      "text": "**Kya yeh insured hai?** Docs kisi insurance layer ka zikr nahi karte. Farz karein ke insurance nahi hai."
    },
    {
      "type": "heading",
      "level": 2,
      "text": "J"
    },
    {
      "type": "p",
      "text": "**Kaun se jurisdictions restricted hain?** Official [Restricted Jurisdictions](https://docs.concrete.xyz/restricted-jurisdictions/) page dekhein - wohi authority hai aur badal sakta hai."
    },
    {
      "type": "heading",
      "level": 2,
      "text": "K"
    },
    {
      "type": "p",
      "text": "**Kya Concrete ka koi tool kabhi meri seed phrase ya private key mangta hai?** Kabhi nahi. Read-only community tracker bhi kabhi signatures/approvals nahi mangta. Jo bhi seed phrase maange woh scam hai."
    },
    {
      "type": "p",
      "text": "**Kya mujhe KYC chahiye?** Standard Earn vaults ke liye docs Terms/Privacy Policy qubool karne aur high-risk ya restricted-jurisdiction activity ke liye address screening (Chainalysis) ka zikr karte hain; alag KYC step ka zikr nahi karte. Institutional/AssetCX/permissioned vaults ke apne eligibility processes hain - team se poochein."
    },
    {
      "type": "heading",
      "level": 2,
      "text": "L"
    },
    {
      "type": "p",
      "text": "**Liquidation protection / borrowing kya hai?** Kuch community content borrow aur liquidation-protection features ka zikr karta hai. Maujooda official docs Earn vaults, institutional vaults, AssetCX aur Enterprise par focus karte hain; koi feature live maanne se pehle docs check karein."
    },
    {
      "type": "p",
      "text": "**Looping kaise kaam karti hai?** Aisi strategy jo flash loans se baar baar borrow aur re-supply karke exposure barhati hai - zyada mumkin yield, zyada liquidation/LTV risk."
    },
    {
      "type": "p",
      "text": "**Kya lock-up hai?** Vault par mabni hai: withdrawal queue (kuch mein hafte), cooldown, ya deposit-lock hooks."
    },
    {
      "type": "heading",
      "level": 2,
      "text": "M"
    },
    {
      "type": "p",
      "text": "**Management fee ka base kya hai?** Vault AUM par salana, guzre hue waqt ke hisab se musalsal accrue hoti hai."
    },
    {
      "type": "p",
      "text": "**Multisig / MPC wallet kya hai?** Aise wallets jin mein kai approvals (Safe) ya split-key signing (Fordefi) chahiye hoti hai taake koi aik shakhs funds move na kar sake."
    },
    {
      "type": "heading",
      "level": 2,
      "text": "N"
    },
    {
      "type": "p",
      "text": "**NAV kya hai aur kitni baar update hota hai?** Net asset value share price chalata hai. Enterprise vaults NAV, epoch close aur withdrawal processing ke liye rozana teen-fareeqi automation cycle chalate hain."
    },
    {
      "type": "p",
      "text": "**Kitne users hain?** Earn app ne 20 Sep 2026 ko ~53.76K depositors aur $1.296B deposits dikhaye."
    },
    {
      "type": "heading",
      "level": 2,
      "text": "O"
    },
    {
      "type": "p",
      "text": "**Off-chain accounting kya hai?** Custodied strategies ke liye aik operator position ki value validity window ke andar on-chain report karta hai; agar woh guzar jaye to masla theek hone tak vault ruk jata hai."
    },
    {
      "type": "p",
      "text": "**OFAC kaun hai?** US Treasury ka sanctions daftar; sanction lists restricted jurisdictions ki rehnumai karti hain."
    },
    {
      "type": "heading",
      "level": 2,
      "text": "P"
    },
    {
      "type": "p",
      "text": "**Points kaise milte hain?** Official points site ke quests (X, Discord, content) se aur aage ke phases mein app ke istemal se. Tafseelat badalti rehti hain - points.concrete.xyz dekhein."
    },
    {
      "type": "p",
      "text": "**Pre-deposit vault kya hai?** Waqt-mehdood vault jo nayi chain/strategy ko seed karta hai: source chain par deposit karein, LayerZero ke zariye target chain par shares claim karein."
    },
    {
      "type": "p",
      "text": "**Priority withdrawal executor kya hai?** Aik trusted role jo `grossAssets − unwindCost` par payout fast-track kar sakta hai, jis ki hadd `unwindCostCapBP` (default 500 bps) hai."
    },
    {
      "type": "heading",
      "level": 2,
      "text": "Q"
    },
    {
      "type": "p",
      "text": "**Qualified custody kya hai?** Kisi regulated custodian ka client ki taraf se rakhe hue assets. AssetCX unhein move kiye baghair on-chain represent karta hai."
    },
    {
      "type": "p",
      "text": "**Meri withdrawal \"Queued\" kyun hai?** Aap ki request open epoch mein hai. Cutoff ke baad yeh *Processing* aur claim ke waqt *Available* ho jati hai."
    },
    {
      "type": "heading",
      "level": 2,
      "text": "R"
    },
    {
      "type": "p",
      "text": "**Kya main paisa kho sakta hoon?** Ji haan. Strategy ke nuqsanat share price kam kar dete hain; aap apna kuch ya poora deposit kho sakte hain. Pichhli karkardagi aainda ki alamat nahi."
    },
    {
      "type": "p",
      "text": "**App par Royco kya hai?** Partner-curated vaults (Royco ETH, Senior Royco USDC) jin ka deposit flow Royco ki app se link hota hai."
    },
    {
      "type": "p",
      "text": "**Redeem kaise karoon?** Atomic vault → aik tx mein redeem. Queued vault → request karein, epoch ka intezar karein, phir claim karein. Pre-deposit → target chain par claim karein."
    },
    {
      "type": "heading",
      "level": 2,
      "text": "S"
    },
    {
      "type": "p",
      "text": "**SDK kya hai?** `@concrete-xyz/sdk`, viem par mabni library jis mein vanilla, React aur Wagmi bindings hain. Dekhein [SDK guide](/docs/03-advanced/04-sdk-guide)."
    },
    {
      "type": "p",
      "text": "**Subgraph kya hai?** Har chain ke liye The Graph deployment jo factories, vaults, strategies, queues aur daily stats index karta hai. Dekhein [Subgraph guide](/docs/03-advanced/05-subgraph-and-events)."
    },
    {
      "type": "p",
      "text": "**Slippage kya hai?** Mutawaqqe aur amal mein aane wali swap price ka farq; swap-in deposits aur rebalancing mein ahem hai."
    },
    {
      "type": "heading",
      "level": 2,
      "text": "T"
    },
    {
      "type": "p",
      "text": "**TVL kya hai aur pages par numbers kyun alag hote hain?** Total value locked. Homepage (\"assets on platform\"), app (\"deposits\") aur DefiLlama mukhtalif scope/timing istemal karte hain, is liye figures alag hote hain."
    },
    {
      "type": "p",
      "text": "**Main kaun se tokens deposit kar sakta hoon?** Har vault aik asset leta hai (WBTC, USDT, USDC, ETH/weETH, USD1, waghera). Enso swap-in ki ijazat de sakta hai."
    },
    {
      "type": "heading",
      "level": 2,
      "text": "U"
    },
    {
      "type": "p",
      "text": "**Kya Concrete mere vault ka code badal sakta hai?** Upgrades **pull-based** hain: vault owners factory se pull karte hain, Concrete deployed vaults par upgrades push nahi kar sakta; upgrades sirf un migration paths par hote hain jo factory owner ne enable kiye hon."
    },
    {
      "type": "p",
      "text": "**USD1 kya hai?** World Liberty Financial ka jari kiya hua USD-pegged stablecoin (docs glossary ke mutabiq); aik RWA USD1 vault permissioned product ke taur par mojood hai."
    },
    {
      "type": "heading",
      "level": 2,
      "text": "V"
    },
    {
      "type": "p",
      "text": "**Vault transparency kya hai?** App ka panel jo asset, protocol aur network ke hisab se off-chain portfolio breakdown dikhata hai - ~24 ghante late, sirf tab jab vault ke liye enable ho."
    },
    {
      "type": "p",
      "text": "**Vault address kaise verify karoon?** Vault card ka address Etherscan (token name/symbol) se milayein aur DMs mein aaye addresses par kabhi bharosa na karein."
    },
    {
      "type": "heading",
      "level": 2,
      "text": "W"
    },
    {
      "type": "p",
      "text": "**Meri akhri withdrawal amount estimate se kyun mukhtalif thi?** Share price epoch **process** hone par lock hoti hai, request karne par nahi."
    },
    {
      "type": "p",
      "text": "**WBTC vault ka exit time kya hai?** Snapshot date par card 21-din ki withdrawal queue dikha raha tha; live card check karein."
    },
    {
      "type": "p",
      "text": "**Whitelist hook kya hai?** Aisa hook jo deposits ko approved addresses tak mehdood karta hai."
    },
    {
      "type": "heading",
      "level": 2,
      "text": "X"
    },
    {
      "type": "p",
      "text": "**Official social accounts kaun se hain?** X: **@ConcreteXYZ** (Concrete) aur **@Blueprint_DeFi** (Blueprint Finance); Discord: discord.gg/concretexyz. Milte-julte handles aur `.xyz` phishing domains se hoshiyar rahein - `concrete.xyz` khud type karein."
    },
    {
      "type": "heading",
      "level": 2,
      "text": "Y"
    },
    {
      "type": "p",
      "text": "**Yield kahan se aata hai?** Jo bhi vault ki strategies karti hain (lending, looping, LP, custodied/off-chain, RWA…). Protocol koi source tay nahi karta; curator karta hai."
    },
    {
      "type": "p",
      "text": "**Kya yield khud-ba-khud compound hota hai?** Yield share price mein nazar aata hai, is liye holdings implicitly compound hoti hain."
    },
    {
      "type": "heading",
      "level": 2,
      "text": "Z"
    },
    {
      "type": "p",
      "text": "**ZeroShadow kaun hai?** Security partner jis ke paas aik tay shuda mandate ke tahat vaults pause karne ka pehle se delegate kiya hua ikhtiyar hai."
    },
    {
      "type": "p",
      "text": "**Kahin bhi zero fees?** Nahi - deposits/withdrawals free hain lekin vaults management/performance fees le sakte hain, aur gas aap hamesha dete hain."
    }
  ],
  hi: [
    {
      "type": "quote",
      "text": "जवाब official docs, live sites (20 Sep 2026 को check की गईं) और community tools के READMEs पर आधारित हैं। किसी भी वित्तीय मामले के लिए [app.concrete.xyz](https://app.concrete.xyz) और [docs.concrete.xyz](https://docs.concrete.xyz) पर confirm करें। यह financial advice नहीं है।"
    },
    {
      "type": "p",
      "text": "**सीधे जाएँ:** [A](#a) · [B](#b) · [C](#c) · [D](#d) · [E](#e) · [F](#f) · [G](#g) · [H](#h) · [I](#i) · [J](#j) · [K](#k) · [L](#l) · [M](#m) · [N](#n) · [O](#o) · [P](#p) · [Q](#q) · [R](#r) · [S](#s) · [T](#t) · [U](#u) · [V](#v) · [W](#w) · [X](#x) · [Y](#y) · [Z](#z)"
    },
    {
      "type": "hr"
    },
    {
      "type": "heading",
      "level": 2,
      "text": "A"
    },
    {
      "type": "p",
      "text": "**क्या Concrete का कोई airdrop या token है?** लिखते समय तक announce नहीं हुआ। जो community tools \"$CT\" airdrop का model बनाते हैं वे साफ़ तौर पर what-ifs हैं जिनमें user के अपने अंदाज़े होते हैं। हर \"claim your token\" link को scam समझें।"
    },
    {
      "type": "p",
      "text": "**क्या Concrete audited है?** जी हाँ - Halborn, Cantina, Zellic और Code4rena ने अलग-अलग components और versions audit किए हैं; Cantina bug bounty भी चलाता है। देखें [Security](/docs/02-intermediate/05-security-and-audits)। Audits risk कम करते हैं, ख़त्म नहीं।"
    },
    {
      "type": "p",
      "text": "**AssetCX क्या है?** ऐसा mechanism जो qualified custody में रखे assets का 1:1 on-chain representation mint करता है ताकि वे custody छोड़े बिना vault yield कमा सकें। देखें [AssetCX](/docs/02-intermediate/03-institutional-assetcx-enterprise)।"
    },
    {
      "type": "p",
      "text": "**Vault cards पर \"APY\" का क्या मतलब है?** Compounding के साथ सालाना yield। *Target* APY एक लक्ष्य है; *live* APY reported APYs का position-weighted average है; *7-day live* पिछले हफ़्ते का version है। इनमें से कोई guarantee नहीं।"
    },
    {
      "type": "p",
      "text": "**\"Approval\" transaction क्या है?** Token की पहली बार दी जाने वाली अनुमति जिससे vault contract deposit के लिए आपके tokens खींच सकता है। सिर्फ़ official app पर बिल्कुल वही vault approve करें; इस्तेमाल न होने वाले approvals बाद में revoke कर दें।"
    },
    {
      "type": "p",
      "text": "**Allocator कौन है?** एक automated role जो off-chain routing के निर्देश पर strategies के बीच capital move करता है।"
    },
    {
      "type": "heading",
      "level": 2,
      "text": "B"
    },
    {
      "type": "p",
      "text": "**\"Bags\" क्या हैं?** Points के precursors जो Points program के Phase 1 में social quests से कमाए जाते हैं; इन्हें Concrete Points में उस ratio से convert किया जाना है जो docs में publish नहीं हुआ।"
    },
    {
      "type": "p",
      "text": "**क्या मैं vault में bridge कर सकता हूँ?** कुछ vaults Enso integration support करते हैं जो एक ही flow में bridge और/या swap करके deposit करा देता है।"
    },
    {
      "type": "p",
      "text": "**क्या Concrete का Bitcoin vault है?** जी हाँ - WBTC Vault (Ethereum) app पर listed था, snapshot date पर 21-दिन की withdrawal queue और Fireblocks custody के साथ। दूसरे BTC-related share tokens (ctLBTC, ctBeraLBTC) docs glossary में दिखते हैं।"
    },
    {
      "type": "p",
      "text": "**क्या vault code open source है?** Contract source private repository में है; partners NDA sign करने के बाद access माँग सकते हैं। Audit reports public हैं। Docs और SDK public हैं।"
    },
    {
      "type": "heading",
      "level": 2,
      "text": "C"
    },
    {
      "type": "p",
      "text": "**Curator क्या होता है?** वह operator जो vault की strategies design करता और चलाता है (Concrete या Royco/USDai जैसा partner)।"
    },
    {
      "type": "p",
      "text": "**कौन-से chains supported हैं?** SDK Ethereum, Arbitrum, Berachain, Katana, Corn और Morph list करता है। Subgraph docs Ethereum, Arbitrum One और Stable list करते हैं। हर vault किसी ख़ास chain पर होता है - उसका card check करें।"
    },
    {
      "type": "p",
      "text": "**Cooldown क्या है?** कुछ vaults पर हर deposit के shares उस deposit का cooldown ख़त्म होने तक withdraw/transfer नहीं हो सकते। Early exit पर fee (0-1%, घटती हुई) लग सकती है जो shares में दी जाती है।"
    },
    {
      "type": "p",
      "text": "**क्या मेरे funds vault contract में होते हैं?** Docs के अनुसार deposits strategies को forward कर दिए जाते हैं; custodied strategies के लिए वे Gnosis Safe या Fordefi MPC wallet में होते हैं - \"assets custody में रहते हैं, vault में नहीं\"।"
    },
    {
      "type": "p",
      "text": "**`ctAsset` क्या है?** ERC-20 vault share (जैसे `ctWBTC`)। देखें [Vault shares](/docs/01-beginner/04-vault-shares-and-yield)।"
    },
    {
      "type": "heading",
      "level": 2,
      "text": "D"
    },
    {
      "type": "p",
      "text": "**Community dashboards पर Concrete का data कहाँ से आता है?** Community tools public RPCs (ERC-4626 calls) के ज़रिए on-chain पढ़ते हैं और TVL/APY के लिए DefiLlama की public APIs इस्तेमाल करते हैं।"
    },
    {
      "type": "p",
      "text": "**क्या deposit करने पर fee लगती है?** Deposit fee नहीं (और withdrawal fee भी नहीं)। Gas लगता है। Management/performance fees vault के अंदर share dilution के रूप में कटती हैं।"
    },
    {
      "type": "p",
      "text": "**App क्यों कहती है कि मैं restricted jurisdiction में हूँ?** कुछ jurisdictions (sanctions और दूसरे ineligible regions) में access blocked है। Terms और Restricted Jurisdictions page पढ़ें; अगर आपको लगता है कि यह ग़लती है तो refresh करें या support ticket खोलें। ऐसे workarounds इस्तेमाल न करें जो Terms का उल्लंघन हों।"
    },
    {
      "type": "heading",
      "level": 2,
      "text": "E"
    },
    {
      "type": "p",
      "text": "**Epoch क्या है?** Queued vaults में withdrawal batching की window। Requests open epoch में शामिल होती हैं; cutoff पर वह बंद हो जाता है; फिर process होता है और claim के लायक बनता है।"
    },
    {
      "type": "p",
      "text": "**Concrete Enterprise क्या है?** अपना institutional-grade vault launch/चलाने का platform (अपनी strategy और wallets लाएँ, hosted UI या SDK, daily NAV, monitoring portal)।"
    },
    {
      "type": "p",
      "text": "**ERC-4626 क्या है?** Ethereum का tokenized-vault standard जो Concrete vaults implement करते हैं।"
    },
    {
      "type": "heading",
      "level": 2,
      "text": "F"
    },
    {
      "type": "p",
      "text": "**Fees क्या हैं?** Deposit/withdrawal: कोई नहीं। Management: 0-10%/साल (ज़्यादातर vaults पर standard 1.5%)। Performance: net positive yield का 0-30%, optionally hurdle से ऊपर। Cooldown exit: 0-1%। हर vault के हिसाब से configure होती हैं। देखें [Fees](/docs/01-beginner/06-fees)।"
    },
    {
      "type": "p",
      "text": "**यहाँ FIFO का क्या मतलब है?** जब caps withdrawals को कई epochs में फैला दें तो queued withdrawals का first-in-first-out order।"
    },
    {
      "type": "p",
      "text": "**Funding Trail क्या है?** Community का बनाया Academy page जो 2022 से Blueprint Finance के disclosed funding rounds का chart दिखाता है। Official sources से verify करें।"
    },
    {
      "type": "heading",
      "level": 2,
      "text": "G"
    },
    {
      "type": "p",
      "text": "**क्या मुझे gas चाहिए?** जी हाँ - approval, deposit, withdrawal request और claim transactions के लिए chain का native token (Ethereum पर ETH)।"
    },
    {
      "type": "p",
      "text": "**Vaults की governance कौन करता है?** Roles बँटे हुए हैं: Vault Owner, `ROLE_ADMIN` और operational roles, और Factory Owner। देखें [Architecture](/docs/03-advanced/01-architecture-deep-dive)। Concrete ने कोई token announce नहीं किया, इसलिए आज token-based governance जैसी कोई चीज़ नहीं है।"
    },
    {
      "type": "heading",
      "level": 2,
      "text": "H"
    },
    {
      "type": "p",
      "text": "**Hurdle rate क्या है?** Depositors के लिए एक target return; performance fees सिर्फ़ उससे ऊपर के yield पर लगती हैं (fixed APY, fixed APR या dynamic)।"
    },
    {
      "type": "p",
      "text": "**Hooks क्या हैं?** Optional modules जो deposit, mint, withdraw, redeem और transfer से पहले/बाद चलते हैं (जैसे whitelist, deposit cap, deposit lock)। Revert करने वाला hook operation रोक देता है।"
    },
    {
      "type": "p",
      "text": "**Vaults की monitoring कौन करता है?** Hypernative (24/7 detection), जबकि ZeroShadow के पास पहले से delegate किया हुआ pause mandate है।"
    },
    {
      "type": "heading",
      "level": 2,
      "text": "I"
    },
    {
      "type": "p",
      "text": "**क्या कोई भी किसी भी vault में deposit कर सकता है?** नहीं। *Permissioned / Permission Required* vaults (institutional, AssetCX, कुछ private vaults) में approval चाहिए होती है।"
    },
    {
      "type": "p",
      "text": "**Impermanent loss क्या है?** जब क़ीमतें अलग हों तो LP position का holding के मुक़ाबले कम perform करना। यह AMM/LP-based vaults और volatile pairs के लिए मायने रखता है।"
    },
    {
      "type": "p",
      "text": "**क्या यह insured है?** Docs किसी insurance layer का ज़िक्र नहीं करते। मान लें कि insurance नहीं है।"
    },
    {
      "type": "heading",
      "level": 2,
      "text": "J"
    },
    {
      "type": "p",
      "text": "**कौन-से jurisdictions restricted हैं?** Official [Restricted Jurisdictions](https://docs.concrete.xyz/restricted-jurisdictions/) page देखें - वही authority है और बदल सकता है।"
    },
    {
      "type": "heading",
      "level": 2,
      "text": "K"
    },
    {
      "type": "p",
      "text": "**क्या Concrete का कोई tool कभी मेरी seed phrase या private key माँगता है?** कभी नहीं। Read-only community tracker भी कभी signatures/approvals नहीं माँगता। जो भी seed phrase माँगे वह scam है।"
    },
    {
      "type": "p",
      "text": "**क्या मुझे KYC चाहिए?** Standard Earn vaults के लिए docs Terms/Privacy Policy स्वीकार करने और high-risk या restricted-jurisdiction activity के लिए address screening (Chainalysis) का ज़िक्र करते हैं; अलग KYC step का ज़िक्र नहीं करते। Institutional/AssetCX/permissioned vaults के अपने eligibility processes हैं - team से पूछें।"
    },
    {
      "type": "heading",
      "level": 2,
      "text": "L"
    },
    {
      "type": "p",
      "text": "**Liquidation protection / borrowing क्या है?** कुछ community content borrow और liquidation-protection features का ज़िक्र करता है। मौजूदा official docs Earn vaults, institutional vaults, AssetCX और Enterprise पर focus करते हैं; कोई feature live मानने से पहले docs check करें।"
    },
    {
      "type": "p",
      "text": "**Looping कैसे काम करती है?** ऐसी strategy जो flash loans से बार-बार borrow और re-supply करके exposure बढ़ाती है - ज़्यादा संभावित yield, ज़्यादा liquidation/LTV risk।"
    },
    {
      "type": "p",
      "text": "**क्या lock-up है?** Vault पर निर्भर है: withdrawal queue (कुछ में हफ़्ते), cooldown, या deposit-lock hooks।"
    },
    {
      "type": "heading",
      "level": 2,
      "text": "M"
    },
    {
      "type": "p",
      "text": "**Management fee का base क्या है?** Vault AUM पर सालाना, बीते समय के हिसाब से लगातार accrue होती है।"
    },
    {
      "type": "p",
      "text": "**Multisig / MPC wallet क्या है?** ऐसे wallets जिनमें कई approvals (Safe) या split-key signing (Fordefi) चाहिए होती है ताकि कोई एक व्यक्ति funds move न कर सके।"
    },
    {
      "type": "heading",
      "level": 2,
      "text": "N"
    },
    {
      "type": "p",
      "text": "**NAV क्या है और कितनी बार update होता है?** Net asset value share price चलाता है। Enterprise vaults NAV, epoch close और withdrawal processing के लिए रोज़ाना तीन-पक्षीय automation cycle चलाते हैं।"
    },
    {
      "type": "p",
      "text": "**कितने users हैं?** Earn app ने 20 Sep 2026 को ~53.76K depositors और $1.296B deposits दिखाए।"
    },
    {
      "type": "heading",
      "level": 2,
      "text": "O"
    },
    {
      "type": "p",
      "text": "**Off-chain accounting क्या है?** Custodied strategies के लिए एक operator position की value validity window के अंदर on-chain report करता है; अगर वह निकल जाए तो समस्या ठीक होने तक vault रुक जाता है।"
    },
    {
      "type": "p",
      "text": "**OFAC कौन है?** US Treasury का sanctions दफ़्तर; sanction lists restricted jurisdictions की राह दिखाती हैं।"
    },
    {
      "type": "heading",
      "level": 2,
      "text": "P"
    },
    {
      "type": "p",
      "text": "**Points कैसे मिलते हैं?** Official points site के quests (X, Discord, content) से और आगे के phases में app के इस्तेमाल से। Details बदलती रहती हैं - points.concrete.xyz देखें।"
    },
    {
      "type": "p",
      "text": "**Pre-deposit vault क्या है?** समय-सीमित vault जो नई chain/strategy को seed करता है: source chain पर deposit करें, LayerZero के ज़रिए target chain पर shares claim करें।"
    },
    {
      "type": "p",
      "text": "**Priority withdrawal executor क्या है?** एक trusted role जो `grossAssets − unwindCost` पर payout fast-track कर सकता है, जिसकी सीमा `unwindCostCapBP` (default 500 bps) है।"
    },
    {
      "type": "heading",
      "level": 2,
      "text": "Q"
    },
    {
      "type": "p",
      "text": "**Qualified custody क्या है?** किसी regulated custodian द्वारा client की ओर से रखे गए assets। AssetCX उन्हें move किए बिना on-chain represent करता है।"
    },
    {
      "type": "p",
      "text": "**मेरी withdrawal \"Queued\" क्यों है?** आपकी request open epoch में है। Cutoff के बाद यह *Processing* और claim के समय *Available* हो जाती है।"
    },
    {
      "type": "heading",
      "level": 2,
      "text": "R"
    },
    {
      "type": "p",
      "text": "**क्या मैं पैसा खो सकता हूँ?** जी हाँ। Strategy के नुक़सान share price घटा देते हैं; आप अपना कुछ या पूरा deposit खो सकते हैं। पिछला प्रदर्शन आगे का संकेत नहीं है।"
    },
    {
      "type": "p",
      "text": "**App पर Royco क्या है?** Partner-curated vaults (Royco ETH, Senior Royco USDC) जिनका deposit flow Royco की app से link होता है।"
    },
    {
      "type": "p",
      "text": "**Redeem कैसे करूँ?** Atomic vault → एक tx में redeem। Queued vault → request करें, epoch का इंतज़ार करें, फिर claim करें। Pre-deposit → target chain पर claim करें।"
    },
    {
      "type": "heading",
      "level": 2,
      "text": "S"
    },
    {
      "type": "p",
      "text": "**SDK क्या है?** `@concrete-xyz/sdk`, viem पर आधारित library जिसमें vanilla, React और Wagmi bindings हैं। देखें [SDK guide](/docs/03-advanced/04-sdk-guide)।"
    },
    {
      "type": "p",
      "text": "**Subgraph क्या है?** हर chain के लिए The Graph deployment जो factories, vaults, strategies, queues और daily stats index करता है। देखें [Subgraph guide](/docs/03-advanced/05-subgraph-and-events)।"
    },
    {
      "type": "p",
      "text": "**Slippage क्या है?** अपेक्षित और असल में execute हुई swap price का फ़र्क़; swap-in deposits और rebalancing में मायने रखता है।"
    },
    {
      "type": "heading",
      "level": 2,
      "text": "T"
    },
    {
      "type": "p",
      "text": "**TVL क्या है और pages पर numbers अलग क्यों होते हैं?** Total value locked। Homepage (\"assets on platform\"), app (\"deposits\") और DefiLlama अलग scope/timing इस्तेमाल करते हैं, इसलिए figures अलग होते हैं।"
    },
    {
      "type": "p",
      "text": "**मैं कौन-से tokens deposit कर सकता हूँ?** हर vault एक asset लेता है (WBTC, USDT, USDC, ETH/weETH, USD1, आदि)। Enso swap-in की अनुमति दे सकता है।"
    },
    {
      "type": "heading",
      "level": 2,
      "text": "U"
    },
    {
      "type": "p",
      "text": "**क्या Concrete मेरे vault का code बदल सकता है?** Upgrades **pull-based** हैं: vault owners factory से pull करते हैं, Concrete deployed vaults पर upgrades push नहीं कर सकता; upgrades सिर्फ़ उन migration paths पर होते हैं जो factory owner ने enable किए हों।"
    },
    {
      "type": "p",
      "text": "**USD1 क्या है?** World Liberty Financial द्वारा जारी USD-pegged stablecoin (docs glossary के अनुसार); एक RWA USD1 vault permissioned product के तौर पर मौजूद है।"
    },
    {
      "type": "heading",
      "level": 2,
      "text": "V"
    },
    {
      "type": "p",
      "text": "**Vault transparency क्या है?** App का panel जो asset, protocol और network के हिसाब से off-chain portfolio breakdown दिखाता है - ~24 घंटे देरी से, सिर्फ़ तब जब vault के लिए enable हो।"
    },
    {
      "type": "p",
      "text": "**Vault address कैसे verify करूँ?** Vault card का address Etherscan (token name/symbol) से मिलाएँ और DMs में आए addresses पर कभी भरोसा न करें।"
    },
    {
      "type": "heading",
      "level": 2,
      "text": "W"
    },
    {
      "type": "p",
      "text": "**मेरी आख़िरी withdrawal amount estimate से अलग क्यों थी?** Share price epoch **process** होने पर lock होती है, request करने पर नहीं।"
    },
    {
      "type": "p",
      "text": "**WBTC vault का exit time क्या है?** Snapshot date पर card 21-दिन की withdrawal queue दिखा रहा था; live card check करें।"
    },
    {
      "type": "p",
      "text": "**Whitelist hook क्या है?** ऐसा hook जो deposits को approved addresses तक सीमित करता है।"
    },
    {
      "type": "heading",
      "level": 2,
      "text": "X"
    },
    {
      "type": "p",
      "text": "**Official social accounts कौन-से हैं?** X: **@ConcreteXYZ** (Concrete) और **@Blueprint_DeFi** (Blueprint Finance); Discord: discord.gg/concretexyz। मिलते-जुलते handles और `.xyz` phishing domains से सावधान रहें - `concrete.xyz` ख़ुद type करें।"
    },
    {
      "type": "heading",
      "level": 2,
      "text": "Y"
    },
    {
      "type": "p",
      "text": "**Yield कहाँ से आता है?** जो भी vault की strategies करती हैं (lending, looping, LP, custodied/off-chain, RWA…)। Protocol कोई source तय नहीं करता; curator करता है।"
    },
    {
      "type": "p",
      "text": "**क्या yield अपने-आप compound होता है?** Yield share price में दिखता है, इसलिए holdings implicitly compound होती हैं।"
    },
    {
      "type": "heading",
      "level": 2,
      "text": "Z"
    },
    {
      "type": "p",
      "text": "**ZeroShadow कौन है?** Security partner जिसके पास एक तय mandate के तहत vaults pause करने का पहले से delegate किया हुआ अधिकार है।"
    },
    {
      "type": "p",
      "text": "**कहीं भी zero fees?** नहीं - deposits/withdrawals free हैं लेकिन vaults management/performance fees ले सकते हैं, और gas आप हमेशा देते हैं।"
    }
  ],
  pcm: [
    {
      "type": "quote",
      "text": "Di answers dey based on official docs, di live sites (dem check am 20 Sep 2026) and di community tools READMEs. For anything wey concern money, confirm for [app.concrete.xyz](https://app.concrete.xyz) and [docs.concrete.xyz](https://docs.concrete.xyz). Dis no be financial advice."
    },
    {
      "type": "p",
      "text": "**Jump go:** [A](#a) · [B](#b) · [C](#c) · [D](#d) · [E](#e) · [F](#f) · [G](#g) · [H](#h) · [I](#i) · [J](#j) · [K](#k) · [L](#l) · [M](#m) · [N](#n) · [O](#o) · [P](#p) · [Q](#q) · [R](#r) · [S](#s) · [T](#t) · [U](#u) · [V](#v) · [W](#w) · [X](#x) · [Y](#y) · [Z](#z)"
    },
    {
      "type": "hr"
    },
    {
      "type": "heading",
      "level": 2,
      "text": "A"
    },
    {
      "type": "p",
      "text": "**Concrete get airdrop or token?** Dem never announce any as at di time wey dem write dis. Community tools wey dey model \"$CT\" airdrop na clear what-ifs wey use guesses wey user put. Treat any \"claim your token\" link as scam."
    },
    {
      "type": "p",
      "text": "**Dem don audit Concrete?** Yes - Halborn, Cantina, Zellic and Code4rena don audit different components and versions; Cantina dey run bug bounty too. See [Security](/docs/02-intermediate/05-security-and-audits). Audits dey reduce risk but dem no dey remove am."
    },
    {
      "type": "p",
      "text": "**Wetin be AssetCX?** Mechanism wey dey mint 1:1 on-chain representation of assets wey dey qualified custody so dem fit earn vault yield without to comot from custody. See [AssetCX](/docs/02-intermediate/03-institutional-assetcx-enterprise)."
    },
    {
      "type": "p",
      "text": "**Wetin \"APY\" mean for vault cards?** Yearly yield with compounding. *Target* APY na goal; *live* APY na position-weighted average of di APYs wey dem report; *7-day live* na di last-week version. None of dem na guarantee."
    },
    {
      "type": "p",
      "text": "**Wetin be \"approval\" transaction?** Di first-time token permission wey allow di vault contract pull your tokens for deposit. Only approve di exact vault for di official app; revoke approvals wey you no dey use later."
    },
    {
      "type": "p",
      "text": "**Who be di Allocator?** Automated role wey dey move capital between strategies as off-chain routing instruct am."
    },
    {
      "type": "heading",
      "level": 2,
      "text": "B"
    },
    {
      "type": "p",
      "text": "**Wetin be \"bags\"?** Points-precursors wey people dey earn from social quests for Phase 1 of di Points program; dem go convert dem to Concrete Points for ratio wey dem no publish for di docs."
    },
    {
      "type": "p",
      "text": "**I fit bridge enter vault?** Some vaults support Enso integration to bridge and/or swap and deposit for one flow."
    },
    {
      "type": "p",
      "text": "**Concrete get Bitcoin vault?** Yes - WBTC Vault (Ethereum) dey listed for di app, with 21-day withdrawal queue and Fireblocks custody as at di snapshot date. Other BTC-related share tokens (ctLBTC, ctBeraLBTC) dey for di docs glossary."
    },
    {
      "type": "p",
      "text": "**Di vault code dey open source?** Di contract source dey inside private repository; partners fit request access after dem sign NDA. Audit reports dey public. Di docs and SDK dey public."
    },
    {
      "type": "heading",
      "level": 2,
      "text": "C"
    },
    {
      "type": "p",
      "text": "**Wetin be curator?** Di operator wey dey design and run vault strategies (Concrete or partner like Royco or USDai)."
    },
    {
      "type": "p",
      "text": "**Which chains dem support?** Di SDK list Ethereum, Arbitrum, Berachain, Katana, Corn and Morph. Di subgraph docs list Ethereum, Arbitrum One and Stable. Each vault dey one specific chain - check im card."
    },
    {
      "type": "p",
      "text": "**Wetin be cooldown?** For some vaults, shares from each deposit no fit withdraw/transfer until di cooldown for dat deposit finish. Early exit fit cost fee (0-1%, wey dey reduce) wey you go pay for shares."
    },
    {
      "type": "p",
      "text": "**My funds dey inside di vault contract?** According to di docs, dem dey forward deposits to strategies; for custodied strategies dem dey inside Gnosis Safe or Fordefi MPC wallet - \"assets dey live for custody, no be vault\"."
    },
    {
      "type": "p",
      "text": "**Wetin be `ctAsset`?** Di ERC-20 vault share (like `ctWBTC`). See [Vault shares](/docs/01-beginner/04-vault-shares-and-yield)."
    },
    {
      "type": "heading",
      "level": 2,
      "text": "D"
    },
    {
      "type": "p",
      "text": "**Where Concrete data for community dashboards dey come from?** Community tools dey read on-chain through public RPCs (ERC-4626 calls) and DefiLlama public APIs for TVL/APY."
    },
    {
      "type": "p",
      "text": "**I go pay to deposit?** No deposit fee (and no withdrawal fee). Gas dey apply. Dem dey charge management/performance fees inside di vault as share dilution."
    },
    {
      "type": "p",
      "text": "**Why di app dey talk say I dey restricted jurisdiction?** Dem block access for some jurisdictions (sanctions and other ineligible regions). Read di Terms and di Restricted Jurisdictions page; if you think say na mistake, refresh or open support ticket. No use workaround wey go break di Terms."
    },
    {
      "type": "heading",
      "level": 2,
      "text": "E"
    },
    {
      "type": "p",
      "text": "**Wetin be epoch?** Withdrawal batching window for queued vaults. Requests dey join di open epoch; for cutoff e go close; then dem go process am and e go dey claimable."
    },
    {
      "type": "p",
      "text": "**Wetin be Concrete Enterprise?** Di platform to launch/run your own institutional-grade vault (bring your own strategy & wallets, hosted UI or SDK, daily NAV, monitoring portal)."
    },
    {
      "type": "p",
      "text": "**Wetin be ERC-4626?** Di Ethereum tokenized-vault standard wey Concrete vaults dey implement."
    },
    {
      "type": "heading",
      "level": 2,
      "text": "F"
    },
    {
      "type": "p",
      "text": "**Wetin be di fees?** Deposit/withdrawal: none. Management: 0-10%/yr (standard 1.5% for most vaults). Performance: 0-30% of net positive yield, optionally above hurdle. Cooldown exit: 0-1%. Dem dey configure am per vault. See [Fees](/docs/01-beginner/06-fees)."
    },
    {
      "type": "p",
      "text": "**Wetin FIFO mean here?** First-in-first-out order of queued withdrawals when caps spread dem across epochs."
    },
    {
      "type": "p",
      "text": "**Wetin be Funding Trail?** Academy page wey community build wey dey chart Blueprint Finance disclosed funding rounds since 2022. Verify with official sources."
    },
    {
      "type": "heading",
      "level": 2,
      "text": "G"
    },
    {
      "type": "p",
      "text": "**I need gas?** Yes - di native token of di chain (ETH for Ethereum) for approval, deposit, withdrawal request and claim transactions."
    },
    {
      "type": "p",
      "text": "**Who dey govern di vaults?** Dem split di roles: Vault Owner, `ROLE_ADMIN` and operational roles, and di Factory Owner. See [Architecture](/docs/03-advanced/01-architecture-deep-dive). Concrete never announce token, so no token-based governance dey today."
    },
    {
      "type": "heading",
      "level": 2,
      "text": "H"
    },
    {
      "type": "p",
      "text": "**Wetin be hurdle rate?** Target return for depositors; performance fees go only apply to yield wey pass am (fixed APY, fixed APR or dynamic)."
    },
    {
      "type": "p",
      "text": "**Wetin be hooks?** Optional modules wey dey run before/after deposit, mint, withdraw, redeem and transfer (like whitelist, deposit cap, deposit lock). Hook wey revert go block di operation."
    },
    {
      "type": "p",
      "text": "**Who dey monitor vaults?** Hypernative (24/7 detection) with ZeroShadow wey hold pre-delegated pause mandate."
    },
    {
      "type": "heading",
      "level": 2,
      "text": "I"
    },
    {
      "type": "p",
      "text": "**Anybody fit deposit for any vault?** No. *Permissioned / Permission Required* vaults (institutional, AssetCX, some private vaults) need approval."
    },
    {
      "type": "p",
      "text": "**Wetin be impermanent loss?** Wen LP position perform worse pass if you just hold as prices dey diverge. E matter for AMM/LP-based vaults and volatile pairs."
    },
    {
      "type": "p",
      "text": "**Dem insure am?** Di docs no describe any insurance layer. Assume say no insurance dey."
    },
    {
      "type": "heading",
      "level": 2,
      "text": "J"
    },
    {
      "type": "p",
      "text": "**Which jurisdictions dem restrict?** See di official [Restricted Jurisdictions](https://docs.concrete.xyz/restricted-jurisdictions/) page - na di authority and e fit change."
    },
    {
      "type": "heading",
      "level": 2,
      "text": "K"
    },
    {
      "type": "p",
      "text": "**Any Concrete tool dey ever need my seed phrase or private key?** Never. Even di read-only community tracker no dey ask for signatures/approvals. Anything wey ask for seed phrase na scam."
    },
    {
      "type": "p",
      "text": "**I need KYC?** For standard Earn vaults, di docs describe say you go accept di Terms/Privacy Policy and address screening (Chainalysis) for high-risk or restricted-jurisdiction activity; dem no describe separate KYC step. Institutional/AssetCX/permissioned vaults get dia own eligibility processes - ask di team."
    },
    {
      "type": "heading",
      "level": 2,
      "text": "L"
    },
    {
      "type": "p",
      "text": "**Wetin be liquidation protection / borrowing?** Some community content dey talk about borrow and liquidation-protection features. Di current official docs dey focus on Earn vaults, institutional vaults, AssetCX and Enterprise; check di docs before you assume say feature dey live."
    },
    {
      "type": "p",
      "text": "**How looping dey work?** Strategy wey dey borrow and re-supply again and again with flash loans to increase exposure - higher potential yield, higher liquidation/LTV risk."
    },
    {
      "type": "p",
      "text": "**Lock-up dey?** E depend on di vault: withdrawal queue (weeks for some), cooldown, or deposit-lock hooks."
    },
    {
      "type": "heading",
      "level": 2,
      "text": "M"
    },
    {
      "type": "p",
      "text": "**Wetin be di management fee base?** Yearly for vault AUM, e dey accrue continuously based on how much time don pass."
    },
    {
      "type": "p",
      "text": "**Wetin be multisig / MPC wallet?** Wallets wey need plenty approvals (Safe) or split-key signing (Fordefi) so no single person fit move funds."
    },
    {
      "type": "heading",
      "level": 2,
      "text": "N"
    },
    {
      "type": "p",
      "text": "**Wetin be NAV and how often dem dey update am?** Net asset value dey drive share price. Enterprise vaults dey run daily three-party automation cycle for NAV, epoch close and withdrawal processing."
    },
    {
      "type": "p",
      "text": "**How many users dey?** Di Earn app show ~53.76K depositors and $1.296B deposits on 20 Sep 2026."
    },
    {
      "type": "heading",
      "level": 2,
      "text": "O"
    },
    {
      "type": "p",
      "text": "**Wetin be off-chain accounting?** For custodied strategies, operator dey report di position value on-chain inside one validity window; if e expire, di vault go stop until dem fix am."
    },
    {
      "type": "p",
      "text": "**Who be OFAC?** Di US Treasury sanctions office; sanction lists dey guide restricted jurisdictions."
    },
    {
      "type": "heading",
      "level": 2,
      "text": "P"
    },
    {
      "type": "p",
      "text": "**How I go take get points?** Through quests for di official points site (X, Discord, content) and, for future phases, app usage. Details dey change - see points.concrete.xyz."
    },
    {
      "type": "p",
      "text": "**Wetin be pre-deposit vault?** Time-limited vault wey dey seed new chain/strategy: deposit for source chain, claim shares for target chain through LayerZero."
    },
    {
      "type": "p",
      "text": "**Wetin be priority withdrawal executor?** Trusted role wey fit fast-track payout for `grossAssets − unwindCost`, wey `unwindCostCapBP` (default 500 bps) cap."
    },
    {
      "type": "heading",
      "level": 2,
      "text": "Q"
    },
    {
      "type": "p",
      "text": "**Wetin be qualified custody?** Assets wey regulated custodian dey hold for client. AssetCX dey represent dem on-chain without to move dem."
    },
    {
      "type": "p",
      "text": "**Why my withdrawal dey \"Queued\"?** Your request dey inside di open epoch. E go turn *Processing* after cutoff and *Available* wen you fit claim."
    },
    {
      "type": "heading",
      "level": 2,
      "text": "R"
    },
    {
      "type": "p",
      "text": "**I fit lose money?** Yes. Strategy losses dey reduce share price; you fit lose some or all of your deposit. Past performance no dey show wetin go happen next."
    },
    {
      "type": "p",
      "text": "**Wetin be Royco for di app?** Partner-curated vaults (Royco ETH, Senior Royco USDC) wey dia deposit flow dey link to Royco app."
    },
    {
      "type": "p",
      "text": "**How I go take redeem?** Atomic vault → redeem for one tx. Queued vault → request, wait for di epoch, then claim. Pre-deposit → claim for di target chain."
    },
    {
      "type": "heading",
      "level": 2,
      "text": "S"
    },
    {
      "type": "p",
      "text": "**Wetin be di SDK?** `@concrete-xyz/sdk`, viem-based library with vanilla, React and Wagmi bindings. See [SDK guide](/docs/03-advanced/04-sdk-guide)."
    },
    {
      "type": "p",
      "text": "**Wetin be di subgraph?** Per-chain The Graph deployment wey dey index factories, vaults, strategies, queues and daily stats. See [Subgraph guide](/docs/03-advanced/05-subgraph-and-events)."
    },
    {
      "type": "p",
      "text": "**Wetin be slippage?** Di difference between di swap price wey you expect and di one wey dem execute; e matter for swap-in deposits and rebalancing."
    },
    {
      "type": "heading",
      "level": 2,
      "text": "T"
    },
    {
      "type": "p",
      "text": "**Wetin be TVL and why numbers dey different between pages?** Total value locked. Di homepage (\"assets on platform\"), di app (\"deposits\") and DefiLlama dey use different scopes/timing, so di figures dey differ."
    },
    {
      "type": "p",
      "text": "**Which tokens I fit deposit?** Each vault dey take one asset (WBTC, USDT, USDC, ETH/weETH, USD1, etc.). Enso fit allow swap-in."
    },
    {
      "type": "heading",
      "level": 2,
      "text": "U"
    },
    {
      "type": "p",
      "text": "**Concrete fit change my vault code?** Upgrades na **pull-based**: vault owners dey pull from di factory, Concrete no fit push upgrades enter deployed vaults; upgrades dey follow only migration paths wey di factory owner enable."
    },
    {
      "type": "p",
      "text": "**Wetin be USD1?** USD-pegged stablecoin wey World Liberty Financial issue (according to di docs glossary); RWA USD1 vault dey as permissioned product."
    },
    {
      "type": "heading",
      "level": 2,
      "text": "V"
    },
    {
      "type": "p",
      "text": "**Wetin be vault transparency?** App panel wey dey show off-chain portfolio breakdown by asset, protocol and network - e dey delay ~24 hours, and dem dey show am only wen dem enable am for di vault."
    },
    {
      "type": "p",
      "text": "**How I go take verify vault address?** Compare di address for di vault card with Etherscan (token name/symbol) and never trust addresses wey dem send for DMs."
    },
    {
      "type": "heading",
      "level": 2,
      "text": "W"
    },
    {
      "type": "p",
      "text": "**Why my final withdrawal amount differ from di estimate?** Dem dey lock di share price wen di epoch dey **processed**, no be wen you request."
    },
    {
      "type": "p",
      "text": "**Wetin be WBTC vault exit time?** Di card show 21-day withdrawal queue as at di snapshot date; check di live card."
    },
    {
      "type": "p",
      "text": "**Wetin be whitelist hook?** Hook wey dey restrict deposits to approved addresses."
    },
    {
      "type": "heading",
      "level": 2,
      "text": "X"
    },
    {
      "type": "p",
      "text": "**Which be di official social accounts?** X: **@ConcreteXYZ** (Concrete) and **@Blueprint_DeFi** (Blueprint Finance); Discord: discord.gg/concretexyz. Beware of lookalike handles and `.xyz` phishing domains - type `concrete.xyz` yourself."
    },
    {
      "type": "heading",
      "level": 2,
      "text": "Y"
    },
    {
      "type": "p",
      "text": "**Where di yield dey come from?** Whatever di vault strategies dey do (lending, looping, LP, custodied/off-chain, RWA…). Di protocol no dey prescribe source; di curator dey do am."
    },
    {
      "type": "p",
      "text": "**Yield dey compound automatically?** Yield dey show for di share price, so your holdings dey compound implicitly."
    },
    {
      "type": "heading",
      "level": 2,
      "text": "Z"
    },
    {
      "type": "p",
      "text": "**Who be ZeroShadow?** Security partner wey get pre-delegated authority to pause vaults under one defined mandate."
    },
    {
      "type": "p",
      "text": "**Zero fees anywhere?** No - deposits/withdrawals dey free but vaults fit charge management/performance fees, and you go always pay gas."
    }
  ],
  zh: [
    {
      "type": "quote",
      "text": "答案依据官方文档、在线站点（2026 年 9 月 20 日核查）以及社区工具的 README。涉及财务的问题，请到 [app.concrete.xyz](https://app.concrete.xyz) 和 [docs.concrete.xyz](https://docs.concrete.xyz) 确认。不构成财务建议。"
    },
    {
      "type": "p",
      "text": "**快速跳转：** [A](#a) · [B](#b) · [C](#c) · [D](#d) · [E](#e) · [F](#f) · [G](#g) · [H](#h) · [I](#i) · [J](#j) · [K](#k) · [L](#l) · [M](#m) · [N](#n) · [O](#o) · [P](#p) · [Q](#q) · [R](#r) · [S](#s) · [T](#t) · [U](#u) · [V](#v) · [W](#w) · [X](#x) · [Y](#y) · [Z](#z)"
    },
    {
      "type": "hr"
    },
    {
      "type": "heading",
      "level": 2,
      "text": "A"
    },
    {
      "type": "p",
      "text": "**Concrete 有空投或代币吗？** 截至撰写时尚未公布。模拟“$CT”空投的社区工具都明确属于假设推演，使用的是用户自己提供的估值。请把任何“领取你的代币”链接都当作诈骗。"
    },
    {
      "type": "p",
      "text": "**Concrete 经过审计吗？** 是的——Halborn、Cantina、Zellic 和 Code4rena 分别审计了不同的组件与版本；Cantina 还运行着 bug bounty。参见 [安全](/docs/02-intermediate/05-security-and-audits)。审计能降低风险，但不能消除风险。"
    },
    {
      "type": "p",
      "text": "**什么是 AssetCX？** 一种机制，为托管在合格托管机构中的资产铸造 1:1 的链上映射，使其无需离开托管即可赚取 vault 收益。参见 [AssetCX](/docs/02-intermediate/03-institutional-assetcx-enterprise)。"
    },
    {
      "type": "p",
      "text": "**vault 卡片上的“APY”是什么意思？** 含复利的年化收益率。*目标* APY 是一个目标；*实时* APY 是各报告 APY 按仓位加权的平均值；*7 日实时*是最近一周的版本。都不是保证。"
    },
    {
      "type": "p",
      "text": "**什么是“授权（approval）”交易？** 首次授予的代币权限，允许 vault 合约在存款时划转你的代币。只在官方应用上授权确切的那个 vault；之后请撤销不再使用的授权。"
    },
    {
      "type": "p",
      "text": "**谁是 Allocator？** 一个自动化角色，根据链下路由的指令在各策略之间调配资金。"
    },
    {
      "type": "heading",
      "level": 2,
      "text": "B"
    },
    {
      "type": "p",
      "text": "**“bags”是什么？** 积分计划第 1 阶段中通过社交任务获得的积分前身；将按文档中未公布的比例转换为 Concrete 积分。"
    },
    {
      "type": "p",
      "text": "**我可以跨链桥入 vault 吗？** 部分 vault 支持 Enso 集成，可在一次流程中完成跨链桥和/或兑换并存款。"
    },
    {
      "type": "p",
      "text": "**Concrete 有比特币 vault 吗？** 有——应用上曾列出 WBTC Vault（Ethereum），快照日期时提款队列为 21 天，托管方为 Fireblocks。其他与 BTC 相关的份额代币（ctLBTC、ctBeraLBTC）出现在文档术语表中。"
    },
    {
      "type": "p",
      "text": "**vault 代码开源吗？** 合约源码位于私有仓库；合作伙伴签署 NDA 后可申请访问。审计报告是公开的。文档和 SDK 是公开的。"
    },
    {
      "type": "heading",
      "level": 2,
      "text": "C"
    },
    {
      "type": "p",
      "text": "**什么是 curator？** 设计并运行 vault 策略的运营方（Concrete 自己或 Royco、USDai 等合作伙伴）。"
    },
    {
      "type": "p",
      "text": "**支持哪些链？** SDK 列出 Ethereum、Arbitrum、Berachain、Katana、Corn 和 Morph。Subgraph 文档列出 Ethereum、Arbitrum One 和 Stable。每个 vault 都在特定的链上——请查看其卡片。"
    },
    {
      "type": "p",
      "text": "**什么是冷却期（cooldown）？** 在部分 vault 中，每笔存款对应的份额在该笔存款的冷却期结束前不能提取/转让。提前退出可能需要支付费用（0-1%，逐步递减），以份额支付。"
    },
    {
      "type": "p",
      "text": "**我的资金在 vault 合约里吗？** 根据文档，存款会被转发到各策略；对于托管型策略，资金位于 Gnosis Safe 或 Fordefi MPC 钱包——“资产在托管中，而不在 vault 中”。"
    },
    {
      "type": "p",
      "text": "**什么是 `ctAsset`？** ERC-20 vault 份额（例如 `ctWBTC`）。参见 [Vault 份额](/docs/01-beginner/04-vault-shares-and-yield)。"
    },
    {
      "type": "heading",
      "level": 2,
      "text": "D"
    },
    {
      "type": "p",
      "text": "**社区仪表盘上的 Concrete 数据从哪里来？** 社区工具通过公共 RPC 读取链上数据（ERC-4626 调用），并使用 DefiLlama 的公开 API 获取 TVL/APY。"
    },
    {
      "type": "p",
      "text": "**存款要付费吗？** 没有存款费（也没有提款费）。需要支付 gas。管理费/业绩费以份额稀释的形式在 vault 内部收取。"
    },
    {
      "type": "p",
      "text": "**为什么应用提示我处于受限司法辖区？** 部分司法辖区（制裁及其他不符合条件的地区）被限制访问。请阅读条款和受限司法辖区页面；如认为有误，请刷新或提交支持工单。不要使用违反条款的规避手段。"
    },
    {
      "type": "heading",
      "level": 2,
      "text": "E"
    },
    {
      "type": "p",
      "text": "**什么是 epoch？** 队列型 vault 中的提款批处理窗口。请求会加入当前开放的 epoch；到截止时间关闭；随后被处理并可领取。"
    },
    {
      "type": "p",
      "text": "**什么是 Concrete Enterprise？** 用于发行/运营你自己的机构级 vault 的平台（自带策略与钱包、托管 UI 或 SDK、每日 NAV、监控门户）。"
    },
    {
      "type": "p",
      "text": "**什么是 ERC-4626？** Concrete vault 所实现的以太坊代币化 vault 标准。"
    },
    {
      "type": "heading",
      "level": 2,
      "text": "F"
    },
    {
      "type": "p",
      "text": "**费用有哪些？** 存款/提款：无。管理费：0-10%/年（大多数 vault 标准为 1.5%）。业绩费：净正收益的 0-30%，可选择设置在 hurdle 之上。冷却期退出：0-1%。按 vault 分别配置。参见 [费用](/docs/01-beginner/06-fees)。"
    },
    {
      "type": "p",
      "text": "**这里的 FIFO 是什么意思？** 当上限使提款分散到多个 epoch 时，队列中的提款按先进先出的顺序处理。"
    },
    {
      "type": "p",
      "text": "**什么是 Funding Trail？** 社区制作的 Academy 页面，展示自 2022 年以来 Blueprint Finance 已披露的融资轮次。请以官方来源为准。"
    },
    {
      "type": "heading",
      "level": 2,
      "text": "G"
    },
    {
      "type": "p",
      "text": "**我需要 gas 吗？** 需要——授权、存款、提款请求和领取交易都需要该链的原生代币（Ethereum 上是 ETH）。"
    },
    {
      "type": "p",
      "text": "**谁来治理 vault？** 角色是分开的：Vault Owner、`ROLE_ADMIN` 及运营角色，以及 Factory Owner。参见 [架构](/docs/03-advanced/01-architecture-deep-dive)。Concrete 尚未公布代币，因此目前不存在基于代币的治理。"
    },
    {
      "type": "heading",
      "level": 2,
      "text": "H"
    },
    {
      "type": "p",
      "text": "**什么是 hurdle rate？** 面向存款人的目标回报；业绩费只针对超出该目标的收益收取（固定 APY、固定 APR 或动态）。"
    },
    {
      "type": "p",
      "text": "**什么是 hooks？** 在存款、mint、提款、赎回和转账之前/之后运行的可选模块（如白名单、存款上限、存款锁定）。发生 revert 的 hook 会阻止该操作。"
    },
    {
      "type": "p",
      "text": "**谁在监控 vault？** Hypernative（7×24 检测），ZeroShadow 持有预先委托的暂停授权。"
    },
    {
      "type": "heading",
      "level": 2,
      "text": "I"
    },
    {
      "type": "p",
      "text": "**任何人都可以向任何 vault 存款吗？** 不可以。*Permissioned / Permission Required* vault（机构、AssetCX、部分私有 vault）需要审批。"
    },
    {
      "type": "p",
      "text": "**什么是无常损失？** 当价格出现分歧时，LP 仓位相对于直接持有的表现不足。对基于 AMM/LP 的 vault 和波动较大的交易对很重要。"
    },
    {
      "type": "p",
      "text": "**有保险吗？** 文档没有描述任何保险层。请假设没有保险。"
    },
    {
      "type": "heading",
      "level": 2,
      "text": "J"
    },
    {
      "type": "p",
      "text": "**哪些司法辖区受限？** 请查看官方 [受限司法辖区](https://docs.concrete.xyz/restricted-jurisdictions/) 页面——以它为准，并且可能变化。"
    },
    {
      "type": "heading",
      "level": 2,
      "text": "K"
    },
    {
      "type": "p",
      "text": "**Concrete 的任何工具会要我的助记词或私钥吗？** 绝不会。只读的社区 tracker 也从不请求签名/授权。任何索要助记词的都是骗局。"
    },
    {
      "type": "p",
      "text": "**我需要 KYC 吗？** 对于标准 Earn vault，文档描述的是接受条款/隐私政策，以及对高风险或受限司法辖区活动进行地址筛查（Chainalysis）；没有描述单独的 KYC 步骤。机构/AssetCX/permissioned vault 有各自的资格流程——请咨询团队。"
    },
    {
      "type": "heading",
      "level": 2,
      "text": "L"
    },
    {
      "type": "p",
      "text": "**什么是清算保护 / 借贷？** 部分社区内容提到借贷和清算保护功能。当前官方文档聚焦于 Earn vault、机构 vault、AssetCX 和 Enterprise；在假定某功能已上线之前，请先查阅文档。"
    },
    {
      "type": "p",
      "text": "**looping 是怎么运作的？** 一种通过闪电贷反复借入并再供应以放大敞口的策略——潜在收益更高，清算/LTV 风险也更高。"
    },
    {
      "type": "p",
      "text": "**有锁定期吗？** 取决于 vault：提款队列（有些长达数周）、冷却期，或存款锁定 hooks。"
    },
    {
      "type": "heading",
      "level": 2,
      "text": "M"
    },
    {
      "type": "p",
      "text": "**管理费的计算基数是什么？** 按 vault 的 AUM 年化，并按经过的时间持续累计。"
    },
    {
      "type": "p",
      "text": "**什么是多签 / MPC 钱包？** 需要多方批准（Safe）或分片密钥签名（Fordefi）的钱包，确保没有任何一个人可以单独转移资金。"
    },
    {
      "type": "heading",
      "level": 2,
      "text": "N"
    },
    {
      "type": "p",
      "text": "**什么是 NAV，多久更新一次？** 净资产价值决定份额价格。Enterprise vault 每天运行三方自动化周期，用于 NAV、epoch 关闭和提款处理。"
    },
    {
      "type": "p",
      "text": "**有多少用户？** Earn 应用在 2026 年 9 月 20 日显示约 5.376 万存款人和 12.96 亿美元存款。"
    },
    {
      "type": "heading",
      "level": 2,
      "text": "O"
    },
    {
      "type": "p",
      "text": "**什么是链下会计？** 对托管型策略，运营方会在有效期窗口内将仓位价值上报到链上；如果过期，vault 会暂停直至修复。"
    },
    {
      "type": "p",
      "text": "**OFAC 是谁？** 美国财政部的制裁办公室；制裁名单为受限司法辖区提供依据。"
    },
    {
      "type": "heading",
      "level": 2,
      "text": "P"
    },
    {
      "type": "p",
      "text": "**如何获得积分？** 通过官方积分网站的任务（X、Discord、内容），以及未来阶段的应用使用。细节会变化——请见 points.concrete.xyz。"
    },
    {
      "type": "p",
      "text": "**什么是预存款 vault？** 限时 vault，用于为新链/新策略提供初始资金：在源链存款，通过 LayerZero 在目标链领取份额。"
    },
    {
      "type": "p",
      "text": "**什么是 priority withdrawal executor？** 一个受信任的角色，可按 `grossAssets − unwindCost` 加速支付，并受 `unwindCostCapBP`（默认 500 bps）限制。"
    },
    {
      "type": "heading",
      "level": 2,
      "text": "Q"
    },
    {
      "type": "p",
      "text": "**什么是合格托管（qualified custody）？** 由受监管的托管机构代客户持有的资产。AssetCX 在不移动它们的情况下在链上表示这些资产。"
    },
    {
      "type": "p",
      "text": "**为什么我的提款显示“Queued”？** 你的请求在当前开放的 epoch 中。截止后变为 *Processing*，可领取时变为 *Available*。"
    },
    {
      "type": "heading",
      "level": 2,
      "text": "R"
    },
    {
      "type": "p",
      "text": "**我会亏钱吗？** 会。策略亏损会降低份额价格；你可能损失部分或全部存款。过往表现不代表未来。"
    },
    {
      "type": "p",
      "text": "**应用上的 Royco 是什么？** 由合作伙伴管理的 vault（Royco ETH、Senior Royco USDC），其存款流程会链接到 Royco 的应用。"
    },
    {
      "type": "p",
      "text": "**如何赎回？** 原子型 vault → 一笔交易完成赎回。队列型 vault → 提交请求，等待 epoch，然后领取。预存款 → 在目标链上领取。"
    },
    {
      "type": "heading",
      "level": 2,
      "text": "S"
    },
    {
      "type": "p",
      "text": "**什么是 SDK？** `@concrete-xyz/sdk`，基于 viem 的库，提供原生、React 和 Wagmi 绑定。参见 [SDK 指南](/docs/03-advanced/04-sdk-guide)。"
    },
    {
      "type": "p",
      "text": "**什么是 subgraph？** 每条链一个 The Graph 部署，用于索引 factory、vault、策略、队列和每日统计。参见 [Subgraph 指南](/docs/03-advanced/05-subgraph-and-events)。"
    },
    {
      "type": "p",
      "text": "**什么是滑点？** 预期兑换价格与实际成交价格之间的差异；对通过兑换存款和再平衡很重要。"
    },
    {
      "type": "heading",
      "level": 2,
      "text": "T"
    },
    {
      "type": "p",
      "text": "**什么是 TVL？为什么不同页面上的数字不一样？** 总锁仓价值。首页（“assets on platform”）、应用（“deposits”）和 DefiLlama 使用不同的统计范围/时间点，所以数字不同。"
    },
    {
      "type": "p",
      "text": "**我可以存入哪些代币？** 每个 vault 只接受一种资产（WBTC、USDT、USDC、ETH/weETH、USD1 等）。Enso 可能支持兑换后存入。"
    },
    {
      "type": "heading",
      "level": 2,
      "text": "U"
    },
    {
      "type": "p",
      "text": "**Concrete 能更改我的 vault 代码吗？** 升级是**拉取式（pull-based）**的：vault 所有者从 factory 拉取，Concrete 无法把升级推送到已部署的 vault；升级只会沿 factory owner 启用的迁移路径进行。"
    },
    {
      "type": "p",
      "text": "**什么是 USD1？** 由 World Liberty Financial 发行的美元锚定稳定币（据文档术语表）；存在一个作为 permissioned 产品的 RWA USD1 vault。"
    },
    {
      "type": "heading",
      "level": 2,
      "text": "V"
    },
    {
      "type": "p",
      "text": "**什么是 vault 透明度？** 应用中的一个面板，按资产、协议和网络展示链下投资组合明细——延迟约 24 小时，且仅在该 vault 启用时显示。"
    },
    {
      "type": "p",
      "text": "**如何核实 vault 地址？** 将 vault 卡片上的地址与 Etherscan（代币名称/符号）比对，切勿相信私信中发来的地址。"
    },
    {
      "type": "heading",
      "level": 2,
      "text": "W"
    },
    {
      "type": "p",
      "text": "**为什么我最终的提款金额与估算不同？** 份额价格是在 epoch **被处理**时锁定的，而不是在你提交请求时。"
    },
    {
      "type": "p",
      "text": "**WBTC vault 的退出时间是多久？** 快照日期时卡片显示提款队列为 21 天；请查看实时卡片。"
    },
    {
      "type": "p",
      "text": "**什么是白名单 hook？** 将存款限制在已批准地址的 hook。"
    },
    {
      "type": "heading",
      "level": 2,
      "text": "X"
    },
    {
      "type": "p",
      "text": "**官方社交账号有哪些？** X：**@ConcreteXYZ**（Concrete）和 **@Blueprint_DeFi**（Blueprint Finance）；Discord：discord.gg/concretexyz。谨防相似的账号名和 `.xyz` 钓鱼域名——请自己输入 `concrete.xyz`。"
    },
    {
      "type": "heading",
      "level": 2,
      "text": "Y"
    },
    {
      "type": "p",
      "text": "**收益从哪里来？** 来自 vault 的策略所做的一切（借贷、looping、LP、托管/链下、RWA…）。协议本身不规定来源；由 curator 决定。"
    },
    {
      "type": "p",
      "text": "**收益会自动复利吗？** 收益体现在份额价格中，因此持仓会隐式复利。"
    },
    {
      "type": "heading",
      "level": 2,
      "text": "Z"
    },
    {
      "type": "p",
      "text": "**ZeroShadow 是谁？** 一家安全合作伙伴，在既定授权范围内拥有预先委托的暂停 vault 的权限。"
    },
    {
      "type": "p",
      "text": "**任何地方都零费用吗？** 不是——存款/提款免费，但 vault 可能收取管理费/业绩费，而且你始终需要支付 gas。"
    }
  ],
  id: [
    {
      "type": "quote",
      "text": "Jawaban didasarkan pada dokumentasi resmi, situs live (diperiksa 20 Sep 2026), dan README tool komunitas. Untuk hal yang menyangkut keuangan, konfirmasi di [app.concrete.xyz](https://app.concrete.xyz) dan [docs.concrete.xyz](https://docs.concrete.xyz). Bukan nasihat keuangan."
    },
    {
      "type": "p",
      "text": "**Loncat ke:** [A](#a) · [B](#b) · [C](#c) · [D](#d) · [E](#e) · [F](#f) · [G](#g) · [H](#h) · [I](#i) · [J](#j) · [K](#k) · [L](#l) · [M](#m) · [N](#n) · [O](#o) · [P](#p) · [Q](#q) · [R](#r) · [S](#s) · [T](#t) · [U](#u) · [V](#v) · [W](#w) · [X](#x) · [Y](#y) · [Z](#z)"
    },
    {
      "type": "hr"
    },
    {
      "type": "heading",
      "level": 2,
      "text": "A"
    },
    {
      "type": "p",
      "text": "**Apakah ada airdrop atau token Concrete?** Belum diumumkan hingga tulisan ini dibuat. Tool komunitas yang memodelkan airdrop \"$CT\" jelas merupakan skenario what-if dengan tebakan yang diisi pengguna. Perlakukan setiap tautan \"claim your token\" sebagai penipuan."
    },
    {
      "type": "p",
      "text": "**Apakah Concrete diaudit?** Ya - Halborn, Cantina, Zellic, dan Code4rena telah mengaudit komponen dan versi yang berbeda; Cantina juga menjalankan bug bounty. Lihat [Keamanan](/docs/02-intermediate/05-security-and-audits). Audit mengurangi risiko tetapi tidak menghilangkannya."
    },
    {
      "type": "p",
      "text": "**Apa itu AssetCX?** Mekanisme yang mencetak representasi on-chain 1:1 dari aset yang disimpan di kustodian berkualifikasi sehingga aset tersebut bisa menghasilkan yield vault tanpa keluar dari kustodian. Lihat [AssetCX](/docs/02-intermediate/03-institutional-assetcx-enterprise)."
    },
    {
      "type": "p",
      "text": "**Apa arti \"APY\" pada kartu vault?** Yield tahunan dengan compounding. APY *target* adalah sasaran; APY *live* adalah rata-rata tertimbang posisi dari APY yang dilaporkan; *7-day live* adalah versi satu minggu terakhir. Tidak ada yang merupakan jaminan."
    },
    {
      "type": "p",
      "text": "**Apa itu transaksi \"approval\"?** Izin token pertama kali yang memungkinkan kontrak vault menarik token Anda untuk deposit. Setujui hanya vault yang tepat di aplikasi resmi; cabut approval yang tidak terpakai nanti."
    },
    {
      "type": "p",
      "text": "**Siapa Allocator?** Peran otomatis yang memindahkan modal antar strategi sesuai instruksi routing off-chain."
    },
    {
      "type": "heading",
      "level": 2,
      "text": "B"
    },
    {
      "type": "p",
      "text": "**Apa itu \"bags\"?** Cikal bakal poin yang diperoleh melalui quest sosial di Fase 1 program Poin; akan dikonversi menjadi Concrete Points dengan rasio yang tidak dipublikasikan di docs."
    },
    {
      "type": "p",
      "text": "**Bisakah saya melakukan bridge ke vault?** Beberapa vault mendukung integrasi Enso untuk bridge dan/atau swap lalu deposit dalam satu alur."
    },
    {
      "type": "p",
      "text": "**Apakah Concrete punya vault Bitcoin?** Ya - WBTC Vault (Ethereum) pernah terdaftar di aplikasi, dengan antrean penarikan 21 hari dan kustodian Fireblocks pada tanggal snapshot. Token share terkait BTC lainnya (ctLBTC, ctBeraLBTC) muncul di glosarium docs."
    },
    {
      "type": "p",
      "text": "**Apakah kode vault open source?** Source kontrak ada di repositori privat; partner bisa meminta akses setelah menandatangani NDA. Laporan audit bersifat publik. Docs dan SDK bersifat publik."
    },
    {
      "type": "heading",
      "level": 2,
      "text": "C"
    },
    {
      "type": "p",
      "text": "**Apa itu curator?** Operator yang merancang dan menjalankan strategi vault (Concrete atau partner seperti Royco atau USDai)."
    },
    {
      "type": "p",
      "text": "**Chain apa saja yang didukung?** SDK mencantumkan Ethereum, Arbitrum, Berachain, Katana, Corn, dan Morph. Docs subgraph mencantumkan Ethereum, Arbitrum One, dan Stable. Setiap vault berada di chain tertentu - periksa kartunya."
    },
    {
      "type": "p",
      "text": "**Apa itu cooldown?** Pada beberapa vault, share dari setiap deposit tidak bisa ditarik/ditransfer sampai cooldown deposit tersebut selesai. Keluar lebih awal bisa dikenai fee (0-1%, menurun) yang dibayar dalam bentuk share."
    },
    {
      "type": "p",
      "text": "**Apakah dana saya ada di kontrak vault?** Menurut docs, deposit diteruskan ke strategi; untuk strategi berkustodian, dana berada di Gnosis Safe atau wallet MPC Fordefi - \"aset berada di kustodian, bukan di vault\"."
    },
    {
      "type": "p",
      "text": "**Apa itu `ctAsset`?** Share vault ERC-20 (mis. `ctWBTC`). Lihat [Share vault](/docs/01-beginner/04-vault-shares-and-yield)."
    },
    {
      "type": "heading",
      "level": 2,
      "text": "D"
    },
    {
      "type": "p",
      "text": "**Dari mana data Concrete di dashboard komunitas berasal?** Tool komunitas membaca on-chain lewat RPC publik (panggilan ERC-4626) dan API publik DefiLlama untuk TVL/APY."
    },
    {
      "type": "p",
      "text": "**Apakah deposit dikenai biaya?** Tidak ada fee deposit (dan tidak ada fee penarikan). Gas tetap berlaku. Fee management/performance dipotong di dalam vault sebagai dilusi share."
    },
    {
      "type": "p",
      "text": "**Mengapa aplikasi mengatakan saya berada di yurisdiksi terlarang?** Akses diblokir di beberapa yurisdiksi (sanksi dan wilayah lain yang tidak memenuhi syarat). Baca Terms dan halaman Restricted Jurisdictions; jika menurut Anda itu keliru, refresh atau buka tiket dukungan. Jangan gunakan cara akal-akalan yang melanggar Terms."
    },
    {
      "type": "heading",
      "level": 2,
      "text": "E"
    },
    {
      "type": "p",
      "text": "**Apa itu epoch?** Jendela batching penarikan pada vault berantrean. Permintaan masuk ke epoch yang terbuka; pada cutoff epoch ditutup; lalu diproses dan bisa di-claim."
    },
    {
      "type": "p",
      "text": "**Apa itu Concrete Enterprise?** Platform untuk meluncurkan/menjalankan vault kelas institusional Anda sendiri (bawa strategi & wallet sendiri, UI hosted atau SDK, NAV harian, portal monitoring)."
    },
    {
      "type": "p",
      "text": "**Apa itu ERC-4626?** Standar tokenized-vault Ethereum yang diimplementasikan vault Concrete."
    },
    {
      "type": "heading",
      "level": 2,
      "text": "F"
    },
    {
      "type": "p",
      "text": "**Apa saja fee-nya?** Deposit/penarikan: tidak ada. Management: 0-10%/tahun (standar 1,5% pada sebagian besar vault). Performance: 0-30% dari yield positif bersih, opsional di atas hurdle. Keluar saat cooldown: 0-1%. Dikonfigurasi per vault. Lihat [Fee](/docs/01-beginner/06-fees)."
    },
    {
      "type": "p",
      "text": "**Apa arti FIFO di sini?** Urutan first-in-first-out untuk penarikan berantrean ketika batas menyebarkannya ke beberapa epoch."
    },
    {
      "type": "p",
      "text": "**Apa itu Funding Trail?** Halaman Academy buatan komunitas yang memetakan putaran pendanaan Blueprint Finance yang diungkapkan sejak 2022. Verifikasi dengan sumber resmi."
    },
    {
      "type": "heading",
      "level": 2,
      "text": "G"
    },
    {
      "type": "p",
      "text": "**Apakah saya butuh gas?** Ya - token native chain (ETH di Ethereum) untuk transaksi approval, deposit, permintaan penarikan, dan claim."
    },
    {
      "type": "p",
      "text": "**Siapa yang mengatur tata kelola vault?** Peran dibagi: Vault Owner, `ROLE_ADMIN` dan peran operasional, serta Factory Owner. Lihat [Arsitektur](/docs/03-advanced/01-architecture-deep-dive). Concrete belum mengumumkan token, sehingga saat ini tidak ada tata kelola berbasis token."
    },
    {
      "type": "heading",
      "level": 2,
      "text": "H"
    },
    {
      "type": "p",
      "text": "**Apa itu hurdle rate?** Target return untuk depositor; fee performance hanya berlaku pada yield di atasnya (APY tetap, APR tetap, atau dinamis)."
    },
    {
      "type": "p",
      "text": "**Apa itu hooks?** Modul opsional yang berjalan sebelum/sesudah deposit, mint, withdraw, redeem, dan transfer (mis. whitelist, deposit cap, deposit lock). Hook yang revert akan memblokir operasi."
    },
    {
      "type": "p",
      "text": "**Siapa yang memantau vault?** Hypernative (deteksi 24/7) dengan ZeroShadow memegang mandat pause yang didelegasikan sebelumnya."
    },
    {
      "type": "heading",
      "level": 2,
      "text": "I"
    },
    {
      "type": "p",
      "text": "**Bisakah siapa saja deposit di vault mana pun?** Tidak. Vault *Permissioned / Permission Required* (institusional, AssetCX, beberapa vault privat) memerlukan persetujuan."
    },
    {
      "type": "p",
      "text": "**Apa itu impermanent loss?** Kinerja posisi LP yang lebih buruk dibanding sekadar menahan aset ketika harga berdivergensi. Penting untuk vault berbasis AMM/LP dan pasangan yang volatil."
    },
    {
      "type": "p",
      "text": "**Apakah ada asuransi?** Docs tidak menjelaskan adanya lapisan asuransi. Anggap tidak ada asuransi."
    },
    {
      "type": "heading",
      "level": 2,
      "text": "J"
    },
    {
      "type": "p",
      "text": "**Yurisdiksi mana yang dibatasi?** Lihat halaman resmi [Restricted Jurisdictions](https://docs.concrete.xyz/restricted-jurisdictions/) - itulah otoritasnya dan bisa berubah."
    },
    {
      "type": "heading",
      "level": 2,
      "text": "K"
    },
    {
      "type": "p",
      "text": "**Apakah tool Concrete pernah meminta seed phrase atau private key saya?** Tidak pernah. Tracker komunitas read-only juga tidak pernah meminta tanda tangan/approval. Apa pun yang meminta seed phrase adalah penipuan."
    },
    {
      "type": "p",
      "text": "**Apakah saya perlu KYC?** Untuk vault Earn standar, docs menjelaskan penerimaan Terms/Privacy Policy dan screening alamat (Chainalysis) untuk aktivitas berisiko tinggi atau dari yurisdiksi terlarang; tidak ada langkah KYC terpisah yang dijelaskan. Vault institusional/AssetCX/permissioned memiliki proses kelayakan sendiri - tanyakan ke tim."
    },
    {
      "type": "heading",
      "level": 2,
      "text": "L"
    },
    {
      "type": "p",
      "text": "**Apa itu liquidation protection / borrowing?** Sebagian konten komunitas menyebut fitur borrow dan liquidation-protection. Docs resmi saat ini berfokus pada vault Earn, vault institusional, AssetCX, dan Enterprise; periksa docs sebelum menganggap suatu fitur sudah live."
    },
    {
      "type": "p",
      "text": "**Bagaimana cara kerja looping?** Strategi yang berulang kali meminjam dan menyuplai kembali dengan flash loan untuk memperbesar eksposur - potensi yield lebih tinggi, risiko likuidasi/LTV lebih tinggi."
    },
    {
      "type": "p",
      "text": "**Apakah ada lock-up?** Tergantung vault: antrean penarikan (berminggu-minggu pada beberapa vault), cooldown, atau hook deposit-lock."
    },
    {
      "type": "heading",
      "level": 2,
      "text": "M"
    },
    {
      "type": "p",
      "text": "**Apa dasar perhitungan management fee?** Dihitung tahunan atas AUM vault, terakumulasi terus-menerus berdasarkan waktu yang berlalu."
    },
    {
      "type": "p",
      "text": "**Apa itu wallet multisig / MPC?** Wallet yang memerlukan beberapa persetujuan (Safe) atau penandatanganan kunci terpisah (Fordefi) sehingga tidak ada satu orang pun yang bisa memindahkan dana."
    },
    {
      "type": "heading",
      "level": 2,
      "text": "N"
    },
    {
      "type": "p",
      "text": "**Apa itu NAV dan seberapa sering diperbarui?** Net asset value menentukan harga share. Vault Enterprise menjalankan siklus otomasi tiga pihak harian untuk NAV, penutupan epoch, dan pemrosesan penarikan."
    },
    {
      "type": "p",
      "text": "**Berapa jumlah pengguna?** Aplikasi Earn menampilkan ~53,76 ribu depositor dan deposit $1,296 miliar pada 20 Sep 2026."
    },
    {
      "type": "heading",
      "level": 2,
      "text": "O"
    },
    {
      "type": "p",
      "text": "**Apa itu akuntansi off-chain?** Untuk strategi berkustodian, operator melaporkan nilai posisi on-chain dalam jendela validitas; jika habis, vault berhenti sampai diperbaiki."
    },
    {
      "type": "p",
      "text": "**Siapa OFAC?** Kantor sanksi Departemen Keuangan AS; daftar sanksi menjadi acuan yurisdiksi terlarang."
    },
    {
      "type": "heading",
      "level": 2,
      "text": "P"
    },
    {
      "type": "p",
      "text": "**Bagaimana cara mendapatkan poin?** Lewat quest di situs poin resmi (X, Discord, konten) dan, di fase mendatang, penggunaan aplikasi. Detail berubah - lihat points.concrete.xyz."
    },
    {
      "type": "p",
      "text": "**Apa itu vault pre-deposit?** Vault berbatas waktu yang menyemai chain/strategi baru: deposit di chain sumber, claim share di chain tujuan lewat LayerZero."
    },
    {
      "type": "p",
      "text": "**Apa itu priority withdrawal executor?** Peran tepercaya yang dapat mempercepat pembayaran sebesar `grossAssets − unwindCost`, dibatasi oleh `unwindCostCapBP` (default 500 bps)."
    },
    {
      "type": "heading",
      "level": 2,
      "text": "Q"
    },
    {
      "type": "p",
      "text": "**Apa itu qualified custody?** Aset yang disimpan kustodian teregulasi atas nama klien. AssetCX merepresentasikannya on-chain tanpa memindahkannya."
    },
    {
      "type": "p",
      "text": "**Mengapa penarikan saya berstatus \"Queued\"?** Permintaan Anda ada di epoch yang terbuka. Statusnya menjadi *Processing* setelah cutoff dan *Available* ketika Anda bisa claim."
    },
    {
      "type": "heading",
      "level": 2,
      "text": "R"
    },
    {
      "type": "p",
      "text": "**Bisakah saya kehilangan uang?** Ya. Kerugian strategi menurunkan harga share; Anda bisa kehilangan sebagian atau seluruh deposit. Kinerja masa lalu bukan indikasi masa depan."
    },
    {
      "type": "p",
      "text": "**Apa itu Royco di aplikasi?** Vault yang dikurasi partner (Royco ETH, Senior Royco USDC) yang alur depositnya terhubung ke aplikasi Royco."
    },
    {
      "type": "p",
      "text": "**Bagaimana cara redeem?** Vault atomic → redeem dalam satu tx. Vault berantrean → ajukan permintaan, tunggu epoch, lalu claim. Pre-deposit → claim di chain tujuan."
    },
    {
      "type": "heading",
      "level": 2,
      "text": "S"
    },
    {
      "type": "p",
      "text": "**Apa itu SDK?** `@concrete-xyz/sdk`, library berbasis viem dengan binding vanilla, React, dan Wagmi. Lihat [Panduan SDK](/docs/03-advanced/04-sdk-guide)."
    },
    {
      "type": "p",
      "text": "**Apa itu subgraph?** Deployment The Graph per chain yang mengindeks factory, vault, strategi, antrean, dan statistik harian. Lihat [Panduan subgraph](/docs/03-advanced/05-subgraph-and-events)."
    },
    {
      "type": "p",
      "text": "**Apa itu slippage?** Selisih antara harga swap yang diharapkan dan yang dieksekusi; penting untuk deposit via swap dan rebalancing."
    },
    {
      "type": "heading",
      "level": 2,
      "text": "T"
    },
    {
      "type": "p",
      "text": "**Apa itu TVL dan mengapa angkanya berbeda antar halaman?** Total value locked. Homepage (\"assets on platform\"), aplikasi (\"deposits\"), dan DefiLlama memakai cakupan/waktu yang berbeda, sehingga angkanya berbeda."
    },
    {
      "type": "p",
      "text": "**Token apa yang bisa saya deposit?** Setiap vault menerima satu aset (WBTC, USDT, USDC, ETH/weETH, USD1, dll.). Enso mungkin mengizinkan swap masuk."
    },
    {
      "type": "heading",
      "level": 2,
      "text": "U"
    },
    {
      "type": "p",
      "text": "**Bisakah Concrete mengubah kode vault saya?** Upgrade bersifat **pull-based**: pemilik vault menarik dari factory, Concrete tidak bisa mendorong upgrade ke vault yang sudah di-deploy; upgrade hanya mengikuti jalur migrasi yang diaktifkan factory owner."
    },
    {
      "type": "p",
      "text": "**Apa itu USD1?** Stablecoin yang dipatok ke USD dan diterbitkan World Liberty Financial (menurut glosarium docs); ada vault RWA USD1 sebagai produk permissioned."
    },
    {
      "type": "heading",
      "level": 2,
      "text": "V"
    },
    {
      "type": "p",
      "text": "**Apa itu vault transparency?** Panel di aplikasi yang menampilkan rincian portofolio off-chain per aset, protokol, dan jaringan - tertunda ~24 jam, hanya ditampilkan bila diaktifkan untuk vault tersebut."
    },
    {
      "type": "p",
      "text": "**Bagaimana cara memverifikasi alamat vault?** Bandingkan alamat di kartu vault dengan Etherscan (nama/simbol token) dan jangan pernah percaya alamat dari DM."
    },
    {
      "type": "heading",
      "level": 2,
      "text": "W"
    },
    {
      "type": "p",
      "text": "**Mengapa jumlah penarikan akhir saya berbeda dari estimasi?** Harga share dikunci saat epoch **diproses**, bukan saat Anda mengajukan permintaan."
    },
    {
      "type": "p",
      "text": "**Berapa waktu keluar vault WBTC?** Kartu menampilkan antrean penarikan 21 hari pada tanggal snapshot; periksa kartu live."
    },
    {
      "type": "p",
      "text": "**Apa itu whitelist hook?** Hook yang membatasi deposit hanya untuk alamat yang disetujui."
    },
    {
      "type": "heading",
      "level": 2,
      "text": "X"
    },
    {
      "type": "p",
      "text": "**Apa akun sosial resminya?** X: **@ConcreteXYZ** (Concrete) dan **@Blueprint_DeFi** (Blueprint Finance); Discord: discord.gg/concretexyz. Waspadai handle tiruan dan domain phishing `.xyz` - ketik `concrete.xyz` sendiri."
    },
    {
      "type": "heading",
      "level": 2,
      "text": "Y"
    },
    {
      "type": "p",
      "text": "**Dari mana yield berasal?** Apa pun yang dilakukan strategi vault (lending, looping, LP, berkustodian/off-chain, RWA…). Protokol tidak menentukan sumbernya; curator yang menentukan."
    },
    {
      "type": "p",
      "text": "**Apakah yield di-compound otomatis?** Yield tercermin pada harga share, sehingga kepemilikan ter-compound secara implisit."
    },
    {
      "type": "heading",
      "level": 2,
      "text": "Z"
    },
    {
      "type": "p",
      "text": "**Siapa ZeroShadow?** Partner keamanan dengan otoritas yang didelegasikan sebelumnya untuk mem-pause vault di bawah mandat tertentu."
    },
    {
      "type": "p",
      "text": "**Apakah nol fee di mana pun?** Tidak - deposit/penarikan gratis tetapi vault dapat menarik fee management/performance, dan Anda selalu membayar gas."
    }
  ],
};
