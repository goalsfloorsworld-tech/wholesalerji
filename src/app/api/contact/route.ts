import { NextResponse } from 'next/server';
import { Resend } from 'resend';
import { WholesalerJiContactEmail } from '@/emails/WholesalerJiContactEmail';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { name, phone, city, userType, companyName, intent, cart, description, source: customSource } = body;

    // 1. Validate required fields
    if (!name || !phone || !city || !userType || !intent) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // 2. Normalize and Prepare Data
    const leadId = `WJ-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
    const source = (customSource && typeof customSource === 'string' && customSource.trim())
      ? customSource.trim()
      : "Contact Page";
    const submittedAt = new Date().toISOString();

    let selectedPanels = "";
    if (Array.isArray(cart) && cart.length > 0) {
      selectedPanels = cart.map((item: any) => `${item.quantity || 0} ${item.unit} of ${item.panelCode}`).join(', ');
    }

    // Prepare Results Object
    const results = {
      sheet: 'skipped',
      email: 'skipped',
      whatsapp: 'skipped'
    };

    // 3. Google Sheets (Independent)
    if (process.env.GOOGLE_WHOLESALERJI_SCRIPT_URL) {
      const sheetPayload = {
        leadId,
        source,
        name,
        phone,
        city,
        userType,
        companyName: companyName || '',
        intent,
        selectedPanels,
        messageSummary: description || ''
      };

      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 15000); // 15s timeout

        const res = await fetch(process.env.GOOGLE_WHOLESALERJI_SCRIPT_URL, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(sheetPayload),
          signal: controller.signal
        });
        clearTimeout(timeoutId);

        let data: { success: boolean; error?: string } = { success: false };
        try {
          data = await res.json();
        } catch (e) {
          console.error('Failed to parse Google Sheets response');
        }

        results.sheet = (res.ok && data.success) ? 'success' : 'failure';
        if (!data.success) {
           console.error('Google Sheets returned error:', data.error);
        }
      } catch (err) {
        console.error('Google Sheets Error:', err);
        results.sheet = 'failure';
      }
    } else {
        console.warn('GOOGLE_WHOLESALERJI_SCRIPT_URL is not defined');
    }

    // 4. Resend Email (Independent)
    if (process.env.RESEND_API_KEY) {
      try {
        const resend = new Resend(process.env.RESEND_API_KEY);
        // Using existing domain pattern available
        const { error } = await resend.emails.send({
          from: 'WholesalerJi <onboarding@resend.dev>', 
          to: ['goalsfloors.world@gmail.com'],
          subject: `New WholesalerJi Lead — ${source}`,
          react: WholesalerJiContactEmail({
            leadId,
            source,
            name,
            phone,
            city,
            userType,
            companyName: companyName || '',
            intent,
            selectedPanels,
            messageSummary: description || '',
            submittedAt
          })
        });

        results.email = error ? 'failure' : 'success';
        if (error) console.error('Resend Error:', error);
      } catch (err) {
        console.error('Resend Exception:', err);
        results.email = 'failure';
      }
    } else {
        console.warn('RESEND_API_KEY is not defined');
    }

    // 5. WhatsApp Bot Webhook (Independent)
    if (process.env.WHATSAPP_BOT_WEBHOOK_URL && process.env.WHATSAPP_BOT_WEBHOOK_SECRET) {
      const whatsappPayload = {
        leadId,
        source,
        name,
        phone,
        city,
        customerType: userType,
        company: companyName || '',
        requirement: intent === 'quantity' ? selectedPanels : 'Discuss / Need Info',
        quantity: intent === 'quantity' ? 'Bulk (See requirement)' : '',
        message: description || ''
      };

      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 15000); // 15s timeout

        const res = await fetch(process.env.WHATSAPP_BOT_WEBHOOK_URL, {
          method: 'POST',
          headers: { 
            'Content-Type': 'application/json',
            'x-api-key': process.env.WHATSAPP_BOT_WEBHOOK_SECRET
          },
          body: JSON.stringify(whatsappPayload),
          signal: controller.signal
        });
        clearTimeout(timeoutId);

        results.whatsapp = res.ok ? 'success' : 'failure';
      } catch (err) {
        console.error('WhatsApp Webhook Error:', err);
        results.whatsapp = 'failure';
      }
    } else {
        console.warn('WHATSAPP_BOT_WEBHOOK_URL or WHATSAPP_BOT_WEBHOOK_SECRET is not defined');
    }

    // 6. Telegram Alerts (Fire and Forget)
    if (process.env.TELEGRAM_BOT_TOKEN && process.env.TELEGRAM_ADMIN_CHAT_ID) {
      const isFailure = results.sheet === 'failure' || results.email === 'failure' || results.whatsapp === 'failure';
      
      let telegramMessage = '';
      if (isFailure) {
        const failedServices = Object.entries(results).filter(([_, status]) => status === 'failure').map(([svc]) => svc).join(', ');
        telegramMessage = `🚨 LEAD CAPTURE DEGRADED 🚨\n\nLead ID: ${leadId}\nFailed Services: ${failedServices}\n\nName: ${name}\nPhone: ${phone}\nCity: ${city}\nIntent: ${intent}\nTime: ${submittedAt}`;
      } else {
        telegramMessage = `✅ NEW LEAD RECEIVED\n\nLead ID: ${leadId}\nName: ${name}\nPhone: ${phone}\nCity: ${city}\nUser Type: ${userType}\nIntent: ${intent}\nPanels: ${selectedPanels || 'N/A'}`;
      }

      fetch(`https://api.telegram.org/bot${process.env.TELEGRAM_BOT_TOKEN}/sendMessage`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          chat_id: process.env.TELEGRAM_ADMIN_CHAT_ID,
          text: telegramMessage
        })
      }).catch(err => console.error('Telegram Alert Error:', err));
    }

    // 7. Final Safe Response
    // As long as the API received and attempted it, we tell the frontend success.
    // If absolutely everything failed, we could return 500, but normally we just return the status.
    return NextResponse.json({
      success: true,
      leadId,
      status: results
    });

  } catch (error) {
    console.error('API Route Error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
