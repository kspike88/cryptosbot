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
      .select("trade_allowed, can_trade")
      .eq("user_id", userId)
      .single();

    if (error) {
      throw error;
    }

    console.log("🔍 Полученные данные из БД:", data);

    return NextResponse.json({
      trade_allowed: !!data?.trade_allowed, // Приводим к boolean
      can_trade: !!data?.can_trade // Приводим к boolean
    });
  } catch (error) {
    console.error("Database error:", error);
    return NextResponse.json(
      { error: "Database error", details: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 }
    );
  }
}
