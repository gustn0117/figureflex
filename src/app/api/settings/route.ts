import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';
import { getSession } from '@/lib/session';

export async function GET() {
  try {
    const { data, error } = await supabaseAdmin
      .from('grade_settings')
      .select('*');

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    const gradeDiscounts: Record<string, number> = {};
    const depositRates: Record<string, number> = {};

    (data ?? []).forEach((row: any) => {
      gradeDiscounts[row.grade] = parseFloat(row.discount_rate);
      depositRates[row.grade] = parseFloat(row.deposit_rate);
    });

    return NextResponse.json({ gradeDiscounts, depositRates });
  } catch (err) {
    console.error('Settings GET error:', err);
    return NextResponse.json({ error: '서버 오류가 발생했습니다.' }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    const session = await getSession();
    if (!session || session.role !== 'admin') {
      return NextResponse.json({ error: '권한이 없습니다.' }, { status: 403 });
    }

    const body = await req.json();
    const { gradeDiscounts, depositRates } = body;

    const grades = ['VVIP', 'VIP', 'GOLD', 'SILVER', '일반'];
    const upserts = grades.map(grade => ({
      grade,
      discount_rate: gradeDiscounts?.[grade] ?? 0,
      deposit_rate: depositRates?.[grade] ?? 1,
    }));

    const { error } = await supabaseAdmin
      .from('grade_settings')
      .upsert(upserts, { onConflict: 'grade' });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error('Settings PUT error:', err);
    return NextResponse.json({ error: '서버 오류가 발생했습니다.' }, { status: 500 });
  }
}
