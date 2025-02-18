import { NextResponse } from 'next/server';
import { pool } from '@/lib/db';  // Меняем импорт на pool

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const userId = searchParams.get("user_id");

  if (!userId) {
    return NextResponse.json({ error: "user_id is required" }, { status: 400 });
  }

  try {
    const client = await pool.connect();
    try {
      const result = await client.query(
        "SELECT can_trade FROM user_restrictions WHERE user_id = $1",
        [userId]
      );
      const canTrade = result.rows.length > 0 ? result.rows[0].can_trade : 1;
      return NextResponse.json({ can_trade: canTrade });
    } finally {
      client.release();
    }
  } catch (error) {
    console.error("Database error:", error);
    if (error instanceof Error) {
      return NextResponse.json({
        error: "Database error",
        details: error.message
      }, { status: 500 });
    }
    return NextResponse.json({ error: "Unknown database error" }, { status: 500 });
  }
}
