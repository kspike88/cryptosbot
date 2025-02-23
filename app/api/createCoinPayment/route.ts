import { NextResponse } from 'next/server';
import CoinPayments from 'coinpayments';

const coinPaymentsClient = new CoinPayments({
  key: process.env.COINPAYMENTS_PUBLIC_KEY!,
  secret: process.env.COINPAYMENTS_PRIVATE_KEY!,
});

export async function OPTIONS() {
  return NextResponse.json(
    {},
    {
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type',
      },
    }
  );
}

export async function POST(req: Request) {
  console.log('🔥 API createCoinPayment вызван');

  try {
    const { amount, currency, userId } = await req.json();
    console.log('📦 Данные запроса:', { amount, currency, userId });

    // Проверка на KYC (если не пройден, используем тестовую валюту)
    const isKYCVerified = false; // Замените на true, если KYC пройден
    const currency2 = isKYCVerified ? currency : 'LTCT'; // Используем тестовую валюту, если KYC не пройден

    const payment = await coinPaymentsClient.createTransaction({
      amount,
      currency1: 'USD', // Валюта, в которой пользователь оплачивает
      currency2, // Валюта, в которой вы получаете платеж
      buyer_email: 'buyer@example.com', // Замените на email пользователя
      item_name: 'Пополнение баланса',
      custom: userId,
      ipn_url: 'https://ваш-сайт.com/api/coinpaymentsIPN', // Укажите ваш IPN URL
    });

    console.log('✅ Ответ от CoinPayments:', payment);

    return NextResponse.json(
      { success: true, payment },
      {
        headers: { 'Access-Control-Allow-Origin': '*' },
      }
    );
  } catch (error) {
    console.error('❌ Ошибка:', error);
    return NextResponse.json(
      { success: false, error: String(error) },
      { status: 500 }
    );
  }
}
