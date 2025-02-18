import { NextResponse } from "next/server";
import pool from '@/lib/db';

export async function GET(req: Request) {
  const url = new URL(req.url);
  const userId = url.searchParams.get("user_id");

  if (!userId) {
    return NextResponse.json({ error: "user_id is required" }, { status: 400 });
  }

  try {
    const client = await pool.connect();
    try {
      const result = await client.query(
        "SELECT trade_allowed FROM user_restrictions WHERE user_id = $1",
        [userId]
      );

      const tradeAllowed = result.rows.length > 0 ? Boolean(result.rows[0].trade_allowed) : true;

      return NextResponse.json({ trade_allowed: tradeAllowed });
    } finally {
      client.release();
    }
  } catch (error) {
    console.error("Database error:", error);
    return NextResponse.json(
      { error: "Database error", details: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 }
    );
  }
}
