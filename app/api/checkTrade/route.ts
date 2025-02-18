import { NextResponse } from "next/server";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const userId = searchParams.get("user_id");

  if (!userId) {
    return NextResponse.json({ error: "user_id is required" }, { status: 400 });
  }

  try {
    const result = await pool.query(
      "SELECT can_trade FROM user_restrictions WHERE user_id = $1",
      [userId]
    );

    // Преобразуем в boolean (1 → true, 0 → false)
    const tradeAllowed = result.rows.length > 0 ? Boolean(result.rows[0].can_trade) : true;

    return NextResponse.json({ trade_allowed: tradeAllowed });
  } catch (error) {
    console.error("Database error:", error);
    return NextResponse.json({
      error: "Database error",
      details: error instanceof Error ? error.message : "Unknown error"
    }, { status: 500 });
  }
}
