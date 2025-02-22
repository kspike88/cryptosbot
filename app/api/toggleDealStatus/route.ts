import { NextResponse } from "next/server";
import pool from '@/lib/db';

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const userId = searchParams.get("user_id");

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
