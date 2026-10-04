import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

const DATA_FILE = path.join(process.cwd(), 'src', 'data', 'whatsapp_clicks.json');

function getClicksData() {
  try {
    if (!fs.existsSync(DATA_FILE)) {
      const initial = { totalClicks: 0, lastClickedAt: null, history: [] };
      fs.writeFileSync(DATA_FILE, JSON.stringify(initial, null, 2), 'utf-8');
      return initial;
    }
    const raw = fs.readFileSync(DATA_FILE, 'utf-8');
    return JSON.parse(raw);
  } catch (err) {
    console.error('Error reading whatsapp clicks file:', err);
    return { totalClicks: 0, lastClickedAt: null, history: [] };
  }
}

function saveClicksData(data: unknown) {
  try {
    fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2), 'utf-8');
  } catch (err) {
    console.error('Error saving whatsapp clicks file:', err);
  }
}

export async function GET() {
  const data = getClicksData();
  return NextResponse.json(data);
}

export async function POST(req: Request) {
  try {
    let source = 'floating-button';
    try {
      const body = await req.json();
      if (body?.source) source = body.source;
    } catch {
      // Body is optional
    }

    const data = getClicksData();
    const timestamp = new Date().toISOString();

    data.totalClicks = (data.totalClicks || 0) + 1;
    data.lastClickedAt = timestamp;

    if (!Array.isArray(data.history)) {
      data.history = [];
    }

    // Keep up to 100 latest click records
    data.history.unshift({
      id: data.totalClicks,
      timestamp,
      source,
    });
    if (data.history.length > 100) {
      data.history = data.history.slice(0, 100);
    }

    saveClicksData(data);

    return NextResponse.json({
      success: true,
      totalClicks: data.totalClicks,
      lastClickedAt: data.lastClickedAt,
    });
  } catch (err) {
    console.error('Error updating whatsapp clicks:', err);
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 });
  }
}
