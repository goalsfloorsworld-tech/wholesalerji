import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

/*
  =============================================================
  TELEGRAM BOT SETUP INSTRUCTIONS
  =============================================================
  1. Open Telegram and search for "@BotFather".
  2. Send `/newbot`, follow prompts to get your bot's API Token.
     -> Save as TELEGRAM_BOT_TOKEN in your env.
  3. Create a private Telegram Channel (e.g., "WholesalerJi Live Logs").
  4. Add your newly created bot to this channel as an Administrator (so it can send messages).
  5. Send a test message "hello" to the channel.
  6. Go to your browser: https://api.telegram.org/bot<YOUR_BOT_TOKEN>/getUpdates
     -> Find the "chat": {"id": -1001234567890} for the channel.
     -> Save this as TELEGRAM_LOG_CHANNEL_ID in your env.
  7. Start a Direct Message with your bot and send "hello".
  8. Refresh the getUpdates URL. Find your personal chat "id" (e.g., 123456789).
     -> Save this as TELEGRAM_ADMIN_CHAT_ID in your env.
  9. Set the webhook so Telegram sends messages to this route:
     -> Run in browser/terminal:
        https://api.telegram.org/bot<YOUR_BOT_TOKEN>/setWebhook?url=https://yourdomain.com/api/telegram-webhook
  =============================================================
*/

const supabaseUrl = process.env.SUPABASE_URL || '';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';
const supabase = supabaseUrl && supabaseServiceKey ? createClient(supabaseUrl, supabaseServiceKey) : null;

export async function POST(req: Request) {
  try {
    const body = await req.json();

    // Only process text messages (commands)
    if (!body.message || !body.message.text) {
      return new Response('OK', { status: 200 });
    }

    const chatId = body.message.chat.id.toString();
    const text = body.message.text.trim();

    // Security: Only allow TELEGRAM_ADMIN_CHAT_ID to execute commands
    if (chatId !== process.env.TELEGRAM_ADMIN_CHAT_ID) {
      return new Response('OK', { status: 200 });
    }

    if (!supabase) {
      await sendReply(chatId, "Supabase environment variables are missing.");
      return new Response('OK', { status: 200 });
    }

    // Command Parsing
    if (text.startsWith('/analytics')) {
      await handleAnalyticsCommand(chatId, text);
    } else if (text.startsWith('/archive')) {
      await handleArchiveCommand(chatId, text);
    }

    // Always return 200 so Telegram doesn't retry
    return new Response('OK', { status: 200 });

  } catch (error) {
    console.error('Telegram Webhook Error:', error);
    return new Response('OK', { status: 200 });
  }
}

// ------------------------------------------------------------------
// COMMAND HANDLERS
// ------------------------------------------------------------------

async function handleAnalyticsCommand(chatId: string, text: string) {
  const args = text.split(' ').slice(1);
  let startDate = new Date();
  let endDate = new Date();

  if (args.length === 0) {
    // Default: Last 7 days
    startDate.setDate(startDate.getDate() - 7);
  } else if (args.length === 2) {
    // Custom Range: DD-MM-YYYY DD-MM-YYYY
    const dateRegex = /^(\d{2})-(\d{2})-(\d{4})$/;
    const startMatch = args[0].match(dateRegex);
    const endMatch = args[1].match(dateRegex);

    if (!startMatch || !endMatch) {
      await sendReply(chatId, "Invalid date format.\nUsage:\n/analytics\n/analytics 01-10-2023 31-10-2023");
      return;
    }

    startDate = new Date(Number(startMatch[3]), Number(startMatch[2]) - 1, Number(startMatch[1]));
    endDate = new Date(Number(endMatch[3]), Number(endMatch[2]) - 1, Number(endMatch[1]), 23, 59, 59, 999);
  } else {
    await sendReply(chatId, "Invalid arguments.\nUsage:\n/analytics\n/analytics 01-10-2023 31-10-2023");
    return;
  }

  // Query Supabase
  const { data, error } = await supabase!
    .from('wj_click_events')
    .select('button_type, page_path')
    .gte('created_at', startDate.toISOString())
    .lte('created_at', endDate.toISOString());

  if (error) {
    console.error('Supabase query error:', error);
    await sendReply(chatId, "Database query failed.");
    return;
  }

  if (!data || data.length === 0) {
    await sendReply(chatId, `No click events found between ${startDate.toDateString()} and ${endDate.toDateString()}.`);
    return;
  }

  // Aggregate Data
  const totalClicks = data.length;
  let whatsappCount = 0;
  let callCount = 0;
  const pageCounts: Record<string, number> = {};

  for (const row of data) {
    if (row.button_type === 'whatsapp') whatsappCount++;
    else if (row.button_type === 'call') callCount++;

    pageCounts[row.page_path] = (pageCounts[row.page_path] || 0) + 1;
  }

  // Sort pages
  const sortedPages = Object.entries(pageCounts)
    .sort((a, b) => b[1] - a[1]);

  let responseText = `📊 *Analytics Report*\n📅 ${startDate.toLocaleDateString()} to ${endDate.toLocaleDateString()}\n\n`;
  responseText += `Total Clicks: *${totalClicks}*\n`;
  responseText += `🟢 WhatsApp: ${whatsappCount}\n`;
  responseText += `📞 Call: ${callCount}\n\n`;
  responseText += `*Top Pages:*\n`;

  // Truncate to top 15 pages to stay under 4000 char Telegram limit
  const maxPagesToShow = 15;
  for (let i = 0; i < Math.min(sortedPages.length, maxPagesToShow); i++) {
    const [path, count] = sortedPages[i];
    responseText += `• ${count} clicks - ${path}\n`;
  }

  if (sortedPages.length > maxPagesToShow) {
    responseText += `\n...and ${sortedPages.length - maxPagesToShow} more pages.`;
  }

  await sendReply(chatId, responseText);
}

async function handleArchiveCommand(chatId: string, text: string) {
  const args = text.split(' ').slice(1);
  let startDate = new Date(0); // Epoch start
  let endDate = new Date();

  if (args.length === 0) {
    await sendReply(chatId, "⚠️ This will archive and delete ALL click data.\nReply `/archive confirm` to proceed.", "Markdown");
    return;
  }

  if (args.length === 1 && args[0] === 'confirm') {
    // Delete all logic runs with epoch start and now
  } else if (args.length === 2) {
    const dateRegex = /^(\d{2})-(\d{2})-(\d{4})$/;
    const startMatch = args[0].match(dateRegex);
    const endMatch = args[1].match(dateRegex);

    if (!startMatch || !endMatch) {
      await sendReply(chatId, "Invalid date format.\nUsage:\n/archive confirm\n/archive 01-10-2023 31-10-2023");
      return;
    }

    startDate = new Date(Number(startMatch[3]), Number(startMatch[2]) - 1, Number(startMatch[1]));
    endDate = new Date(Number(endMatch[3]), Number(endMatch[2]) - 1, Number(endMatch[1]), 23, 59, 59, 999);
  } else {
    await sendReply(chatId, "Invalid arguments.\nUsage:\n/archive confirm\n/archive 01-10-2023 31-10-2023");
    return;
  }

  // 1. Query Supabase
  const { data, error } = await supabase!
    .from('wj_click_events')
    .select('*')
    .gte('created_at', startDate.toISOString())
    .lte('created_at', endDate.toISOString());

  if (error) {
    await sendReply(chatId, "Database query failed.");
    return;
  }

  if (!data || data.length === 0) {
    await sendReply(chatId, "There is no data to archive for the specified range.");
    return;
  }

  const exportedIds = data.map(r => r.id);

  // 2. Format Data
  const jsonContent = JSON.stringify(data, null, 2);
  const csvHeaders = "id,button_type,page_path,created_at\n";
  const csvContent = csvHeaders + data.map(r => `${r.id},${r.button_type},"${r.page_path}",${r.created_at}`).join("\n");

  const jsonFilename = `archive_${Date.now()}.json`;
  const csvFilename = `archive_${Date.now()}.csv`;

  // 3. Send Documents
  const jsonSuccess = await sendDocument(chatId, jsonContent, jsonFilename, 'application/json');
  const csvSuccess = await sendDocument(chatId, csvContent, csvFilename, 'text/csv');

  // 4. Safe Delete
  if (jsonSuccess && csvSuccess) {
    const { error: deleteError } = await supabase!
      .from('wj_click_events')
      .delete()
      .in('id', exportedIds);

    if (deleteError) {
      console.error('Supabase delete error:', deleteError);
      await sendReply(chatId, "✅ Files successfully delivered, but ❌ FAILED to delete rows from database. Please check Supabase manually.");
    } else {
      await sendReply(chatId, `✅ Successfully archived and deleted ${exportedIds.length} records.`);
    }
  } else {
    await sendReply(chatId, "❌ Failed to deliver archive files to Telegram. Database deletion aborted safely.");
  }
}

// ------------------------------------------------------------------
// TELEGRAM API HELPERS
// ------------------------------------------------------------------

async function sendReply(chatId: string, text: string, parseMode: string = "Markdown") {
  if (!process.env.TELEGRAM_BOT_TOKEN) return false;
  try {
    const res = await fetch(`https://api.telegram.org/bot${process.env.TELEGRAM_BOT_TOKEN}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ chat_id: chatId, text, parse_mode: parseMode })
    });
    return res.ok;
  } catch (err) {
    console.error('Telegram Reply Error:', err);
    return false;
  }
}

async function sendDocument(chatId: string, fileContent: string, filename: string, mimeType: string) {
  if (!process.env.TELEGRAM_BOT_TOKEN) return false;
  try {
    const formData = new FormData();
    formData.append('chat_id', chatId);
    
    // Create a Blob from the string content
    const blob = new Blob([fileContent], { type: mimeType });
    formData.append('document', blob, filename);

    const res = await fetch(`https://api.telegram.org/bot${process.env.TELEGRAM_BOT_TOKEN}/sendDocument`, {
      method: 'POST',
      body: formData
    });
    
    return res.ok;
  } catch (err) {
    console.error('Telegram sendDocument Error:', err);
    return false;
  }
}
