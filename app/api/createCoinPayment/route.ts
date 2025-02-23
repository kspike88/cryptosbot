import { NextResponse } from 'next/server';
import CoinPayments from 'coinpayments';

const coinPaymentsClient = new CoinPayments({
  key: process.env.COINPAYMENTS_PUBLIC_KEY!,
  secret: process.env.COINPAYMENTS_PRIVATE_KEY!
});

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
  console.log('🔥 API createCoinPayment вызван');

  try {
    const { amount, currency, userId } = await req.json();
    console.log('📦 Данные запроса:', { amount, currency, userId });

    const payment = await coinPaymentsClient.createTransaction({
      amount,
      currency1: 'USD',
      currency2: currency,
      buyer_email: 'buyer@example.com',
      item_name: 'Пополнение баланса',
      custom: userId,
      ipn_url: 'https://ваш-сайт.com/api/coinpaymentsIPN'
    });

    console.log('✅ Ответ от CoinPayments:', payment);

    return NextResponse.json({ success: true, payment }, {
      headers: { 'Access-Control-Allow-Origin': '*' }
    });
  } catch (error) {
    console.error('❌ Ошибка:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
