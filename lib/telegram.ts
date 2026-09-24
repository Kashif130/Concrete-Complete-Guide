// Thin wrapper around the Telegram Bot HTTP API. Server-side only — the
// bot token never reaches the browser. Requires TELEGRAM_BOT_TOKEN to be
// set; every function here is a no-op (returns false) without it, same
// "gracefully absent, never a hard crash" pattern as reviewsStore.ts /
// quizLeaderboardStore.ts when their own env vars aren't set.

function token(): string | null {
  const t = process.env.TELEGRAM_BOT_TOKEN;
  return t && t.trim() ? t.trim() : null;
}

export function telegramConfigured(): boolean {
  return token() !== null;
}

export async function sendTelegramMessage(chatId: string | number, text: string): Promise<boolean> {
  const t = token();
  if (!t) return false;
  try {
    const res = await fetch(`https://api.telegram.org/bot${t}/sendMessage`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        chat_id: chatId,
        text,
        parse_mode: "HTML",
        disable_web_page_preview: true,
      }),
      signal: AbortSignal.timeout(8000),
    });
    return res.ok;
  } catch {
    return false;
  }
}
