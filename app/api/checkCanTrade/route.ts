import { NextResponse } from 'next/server';
import { supabase } from '@/lib/db';

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const userId = searchParams.get('user_id');

  if (!userId) {
    return NextResponse.json({ error: 'user_id is required' }, { status: 400 });
  }

  try {
    const { data, error } = await supabase
      .from('user_restrictions')
      .select('can_trade')
      .eq('user_id', userId)
      .single();

    if (error) throw error;

    return NextResponse.json({ can_trade: data?.can_trade ?? false });
  } catch (error) {
    console.error('Database error:', error);
    return NextResponse.json({ error: 'Database error' }, { status: 500 });
  }
}
