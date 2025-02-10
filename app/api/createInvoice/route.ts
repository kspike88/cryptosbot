import { NextResponse } from 'next/server';

const API_TOKEN = '329422:AAteiFxctWQnr3f2YqWxfiI646yRIEMGeRk';
const API_URL = 'https://pay.crypt.bot/api/createInvoice';

export async function OPTIONS() {
  return NextResponse.json({}, {
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  });
}

export async function POST(req: Request) {
  console.log('🔥 API createInvoice вызван');

  try {
    const body = await req.json();
    console.log('📦 Данные запроса:', body);

    const response = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Crypto-Pay-API-Token': API_TOKEN,
      },
      body: JSON.stringify(body),
    });

    const data = await response.json();
    console.log('✅ Ответ от CryptoBot:', data);

    return NextResponse.json(data, {
      headers: {
        'Access-Control-Allow-Origin': '*',
      },
    });
  } catch (error) {
    console.error('❌ Ошибка:', error);
    return NextResponse.json({ error: 'Ошибка сервера' }, { status: 500 });
  }
}
