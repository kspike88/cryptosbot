import { NextResponse } from "next/server";
import pool from '@/lib/db';

// Обработка запроса
export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const userId = searchParams.get("user_id"); // Правильное название параметра


  if (!userId) {
    return NextResponse.json({ error: "User ID is required" }, { status: 400 });
  }

  try {
    const client = await pool.connect();
    try {
      const result = await client.query(
        "SELECT can_exc_deal FROM user_restrictions WHERE user_id = $1",
        [userId]
      );

      const canExcDeal = result.rows.length > 0 ? result.rows[0].can_exc_deal : false;
      return NextResponse.json({ can_exc_deal: canExcDeal });
    } finally {
      client.release();
    }
  } catch (error) {
    console.error("Database error:", error);
    return NextResponse.json({ error: "Database error" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  const { userId, allow } = await req.json();

  if (!userId || typeof allow !== "boolean") {
    return NextResponse.json({ error: "Invalid input" }, { status: 400 });
  }

  try {
    const client = await pool.connect();
    try {
      await client.query(
        "UPDATE user_restrictions SET can_exc_deal = $1 WHERE user_id = $2",
        [allow, userId]
      );
      return NextResponse.json({ success: true });
    } finally {
      client.release();
    }
  } catch (error) {
    console.error("Database error:", error);
    return NextResponse.json(
      { success: false, error: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 }
    );
  }
}
