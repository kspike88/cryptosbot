import { NextResponse } from 'next/server';
import { supabase } from '@/lib/db';

export async function GET(req: Request) {
  const url = new URL(req.url);
  const userId = url.searchParams.get("user_id");

  if (!userId) {
    return NextResponse.json({ error: "user_id is required" }, { status: 400 });
  }

  try {
    const { data, error } = await supabase
      .from("user_restrictions")
      .select("trade_allowed")
      .eq("user_id", userId)
      .single();

    if (error) {
      throw error;
    }

    const tradeAllowed = data?.trade_allowed === 1;


    return NextResponse.json({ trade_allowed: tradeAllowed });
  } catch (error) {
    console.error("Database error:", error);
    return NextResponse.json(
      { error: "Database error", details: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 }
    );
  }
}
