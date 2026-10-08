import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

// Init Supabase (Graceful degradation if missing keys)
const supabaseUrl = process.env.SUPABASE_URL || '';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';
const supabase = supabaseUrl && supabaseServiceKey ? createClient(supabaseUrl, supabaseServiceKey) : null;

export async function POST(req: Request) {
  try {
    let source = 'floating-button';
    try {
      const body = await req.json();
      if (body?.source) source = body.source;
    } catch {
      // Body is optional
    }

    // 1. Derive Button Type & Page Path
    const buttonType = source.toLowerCase().includes('call') ? 'call' : 'whatsapp';
    const pagePath = req.headers.get('referer') || source || 'unknown';

    // 2. Fire-and-forget: Supabase Insert
    if (supabase) {
      supabase.from('wj_click_events').insert({
        button_type: buttonType,
        page_path: pagePath,
      }).then(({ error }) => {
        if (error) console.error('Supabase Click Insert Error:', error);
      });
    }

    // 3. Fire-and-forget: Telegram Live Feed
    if (process.env.TELEGRAM_BOT_TOKEN && process.env.TELEGRAM_LOG_CHANNEL_ID) {
      const liveMessage = `📍 Click: ${buttonType === 'whatsapp' ? '🟢 WhatsApp' : '📞 Call'} | ${pagePath} | just now`;
      fetch(`https://api.telegram.org/bot${process.env.TELEGRAM_BOT_TOKEN}/sendMessage`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          chat_id: process.env.TELEGRAM_LOG_CHANNEL_ID,
          text: liveMessage,
          disable_web_page_preview: true
        })
      }).catch(err => console.error('Telegram Live Feed Error:', err));
    }

    // Return immediately without awaiting the database or Telegram
    return NextResponse.json({
      success: true
    });
  } catch (err) {
    console.error('Error handling whatsapp clicks:', err);
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 });
  }
}
