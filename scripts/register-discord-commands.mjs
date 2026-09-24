// Registers (or updates) the bot's global slash commands with Discord.
// Run this ONCE after deploying, and again any time a command definition
// below changes — Discord caches global command definitions and they can
// take up to an hour to propagate, so this isn't run on every deploy.
//
// Usage:
//   DISCORD_APPLICATION_ID=... DISCORD_BOT_TOKEN=... node scripts/register-discord-commands.mjs
//
// Both values come from the Discord Developer Portal (discord.com/developers/applications):
//   DISCORD_APPLICATION_ID — "Application ID" on the General Information page
//   DISCORD_BOT_TOKEN      — Bot page → Reset Token (same token the deployed
//                             app uses as DISCORD_BOT_TOKEN)

const APP_ID = process.env.DISCORD_APPLICATION_ID;
const TOKEN = process.env.DISCORD_BOT_TOKEN;

if (!APP_ID || !TOKEN) {
  console.error("Set DISCORD_APPLICATION_ID and DISCORD_BOT_TOKEN before running this script.");
  process.exit(1);
}

const STRING = 3;
const INTEGER = 4;

// Dropdown choices (Discord shows these as a picker, so users can't type a wrong value).
// Keep the values in sync with VAULT_BASE (lib/vault/data.ts), QUIZ_BATCHES (content/quiz.ts)
// and the locales in lib/i18n.ts.
const VAULT_CHOICES = [
  { name: "weETH (Institutional)", value: "weeth" },
  { name: "ctWBTC", value: "ctwbtc" },
  { name: "ctUSD (Stable) / ctDefiUSDT", value: "ctusd" },
  { name: "frxUSD+", value: "frxusd" },
  { name: "Concrete Frontier (USDC)", value: "frontier" },
  { name: "RWA USD1", value: "rwausd1" },
  { name: "Senior Royco USDC", value: "srroyusdc" },
  { name: "Royco ETH (roywstETH)", value: "royeth" },
];

const QUIZ_CHOICES = [
  { name: "Level 1 · Beginner", value: "beginner" },
  { name: "Level 2 · Intermediate", value: "intermediate" },
  { name: "Level 3 · Advanced", value: "advanced" },
  { name: "Level 4 · Ecosystem", value: "ecosystem" },
  { name: "Level 5 · Institutional", value: "institutional" },
  { name: "Level 6 · Moai Master", value: "moai-master" },
];

const LANG_CHOICES = [
  { name: "English", value: "en" },
  { name: "Roman Urdu", value: "ur" },
  { name: "Hindi", value: "hi" },
  { name: "Nigerian Pidgin", value: "pcm" },
  { name: "Chinese (Simplified)", value: "zh" },
  { name: "Indonesian", value: "id" },
];

const CHAIN_CHOICES = [
  { name: "Ethereum", value: "ethereum" },
  { name: "Arbitrum", value: "arbitrum" },
  { name: "Base", value: "base" },
];

const commands = [
  {
    name: "watchprice",
    description: "Alert when a vault's share price crosses a threshold",
    options: [
      { name: "chain", description: "Which chain the vault is on", type: STRING, required: true, choices: CHAIN_CHOICES },
      { name: "vault", description: "Vault contract address", type: STRING, required: true },
      {
        name: "direction",
        description: "above or below",
        type: STRING,
        required: true,
        choices: [
          { name: "above", value: "above" },
          { name: "below", value: "below" },
        ],
      },
      { name: "price", description: "Threshold share price", type: 10 /* NUMBER */, required: true },
    ],
  },
  {
    name: "watchapy",
    description: "Alert when a vault's modeled APY crosses a threshold",
    options: [
      { name: "vault", description: "Which vault to watch", type: STRING, required: true, choices: VAULT_CHOICES },
      {
        name: "direction",
        description: "above or below",
        type: STRING,
        required: true,
        choices: [
          { name: "above", value: "above" },
          { name: "below", value: "below" },
        ],
      },
      { name: "apy", description: "Threshold APY, in %", type: 10, required: true },
    ],
  },
  {
    name: "watchct",
    description: "Alert when $CT price crosses a threshold",
    options: [
      {
        name: "direction",
        description: "above or below",
        type: STRING,
        required: true,
        choices: [
          { name: "above", value: "above" },
          { name: "below", value: "below" },
        ],
      },
      { name: "price", description: "Threshold USD price", type: 10, required: true },
    ],
  },
  { name: "myalerts", description: "List your active alerts" },
  {
    name: "unwatch",
    description: "Remove one alert",
    options: [{ name: "id", description: "Alert id, shown in /myalerts", type: STRING, required: true }],
  },
  { name: "stop", description: "Remove all your alerts" },
  {
    name: "link",
    description: "Remember a wallet for /points and /myvaults",
    options: [{ name: "wallet", description: "0x wallet address", type: STRING, required: true }],
  },
  { name: "unlink", description: "Forget your linked wallet" },
  {
    name: "points",
    description: "Points balance + leaderboard rank",
    options: [{ name: "wallet", description: "Wallet address (uses linked wallet if omitted)", type: STRING, required: false }],
  },
  {
    name: "myvaults",
    description: "Your live positions across every known Concrete vault",
    options: [{ name: "wallet", description: "Wallet address (uses linked wallet if omitted)", type: STRING, required: false }],
  },
  {
    name: "lang",
    description: "Set your language for /docs",
    options: [{ name: "code", description: "Language for /docs", type: STRING, required: true, choices: LANG_CHOICES }],
  },
  {
    name: "docs",
    description: "Browse the Concrete Guide (27 pages)",
    options: [{ name: "number", description: "Doc number (omit to see the list)", type: INTEGER, required: false }],
  },
  {
    name: "quiz",
    description: "Start (or list) the Concrete Guide quiz",
    options: [{ name: "level", description: "Pick a level (omit to see the list)", type: STRING, required: false, choices: QUIZ_CHOICES }],
  },
  { name: "quizrank", description: "Top 10 quiz leaderboard" },
  { name: "help", description: "Show all commands" },
];

const res = await fetch(`https://discord.com/api/v10/applications/${APP_ID}/commands`, {
  method: "PUT",
  headers: { Authorization: `Bot ${TOKEN}`, "content-type": "application/json" },
  body: JSON.stringify(commands),
});

if (!res.ok) {
  console.error(`Failed: ${res.status} ${res.statusText}`);
  console.error(await res.text());
  process.exit(1);
}

const registered = await res.json();
console.log(`Registered ${registered.length} commands:`, registered.map((c) => c.name).join(", "));
