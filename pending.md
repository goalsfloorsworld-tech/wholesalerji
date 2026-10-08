# Pending — WholesalerJi

## Telegram Webhook Setup (do this once the site is LIVE on Hostinger)

Status: Everything is ready EXCEPT the webhook registration (which needs a public URL).

### Already done ✅
- TELEGRAM_BOT_TOKEN — set in .env.local
- TELEGRAM_LOG_CHANNEL_ID — set in .env.local
- TELEGRAM_ADMIN_CHAT_ID — set in .env.local
- SUPABASE_URL — set in .env.local
- SUPABASE_SERVICE_ROLE_KEY — set in .env.local
- Supabase table `wj_click_events` — created (SQL already run)
- Bot added as Administrator to the private Telegram log channel
- Code already live and working for: form submission alerts + WhatsApp/Call click tracking
  (these fire automatically via direct fetch() calls — NOT dependent on the webhook)

### Still to do (ONLY after Hostinger deployment is live) 🔲
1. Make sure these same 6 env vars are also added in Hostinger's cPanel environment variables section (not just .env.local — that file doesn't exist on the live server).
2. Run this URL once (replace token + domain) to register the webhook:
   https://api.telegram.org/bot<YOUR_BOT_TOKEN>/setWebhook?url=https://yourdomain.com/api/telegram-webhook
3. Confirm it replies: {"ok":true,"result":true,"description":"Webhook was set"}
4. Test by sending /analytics and /archive to the bot from the admin Telegram account.

### Important clarification (so we don't re-confuse this later)
- This is a WEBHOOK, not a websocket. No persistent connection — Telegram just needs a public
  URL to send a normal HTTP POST to whenever someone messages the bot.
- Button clicks / form submits → Telegram alerts: this is ALREADY fully working the moment
  the site goes live, with zero extra setup. It doesn't depend on the webhook at all.
- The webhook is ONLY needed for the reverse direction: typing /analytics or /archive
  INTO Telegram and getting a reply back from the bot.

---

## Also pending: Elite-Fluted page overhaul (Prompt B — not yet started)
- H1 fix: move visible hero text out of <h1>, wrap real H1 in sr-only, keep hero copy as-is visually
- Heading hierarchy re-check after the above
- Visual audit: too many text/icon boxes, no real installed photography (unlike primo/elite)
- No real elite-fluted photos available yet — use existing primo/elite installed images as
  TEMPORARY substitutes where contextually reasonable, swap to real photos once user has them
- Section parity: bring elite-fluted up to the same visual quality/structure as primo & elite