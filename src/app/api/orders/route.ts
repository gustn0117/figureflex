export const dynamic = 'force-dynamic';
import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';
import { getSession } from '@/lib/session';

function dbToOrder(o: any) {
  return {
    id: o.id,
    userId: o.user_id,
    userName: o.user_name,
    userGrade: o.user_grade,
    items: o.items ?? [],
    totalAmount: o.total_amount,
    discountRate: parseFloat(o.discount_rate),
    finalAmount: o.final_amount,
    depositAmount: o.deposit_amount,
    paidAmount: o.paid_amount,
    status: o.status,
    createdAt: o.created_at,
  };
}

export async function GET() {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: '로그인이 필요합니다.' }, { status: 401 });
    }

    let query = supabaseAdmin
      .from('orders')
      .select('*')
      .order('created_at', { ascending: false });

    // 일반 회원은 자기 주문만
    if (session.role !== 'admin') {
      query = query.eq('user_id', session.userId);
    }

    const { data, error } = await query;

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ orders: (data ?? []).map(dbToOrder) });
  } catch (err) {
    console.error('Orders GET error:', err);
    return NextResponse.json({ error: '서버 오류가 발생했습니다.' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: '로그인이 필요합니다.' }, { status: 401 });
    }

    const body = await req.json();
    const {
      userId, userName, userGrade, items,
      totalAmount, discountRate, finalAmount,
      depositAmount, paidAmount,
    } = body;

    const { data, error } = await supabaseAdmin
      .from('orders')
      .insert({
        user_id: userId,
        user_name: userName,
        user_grade: userGrade,
        items: items ?? [],
        total_amount: totalAmount ?? 0,
        discount_rate: discountRate ?? 0,
        final_amount: finalAmount ?? 0,
        deposit_amount: depositAmount ?? 0,
        paid_amount: paidAmount ?? 0,
        status: 'pending',
      })
      .select()
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ order: dbToOrder(data) });
  } catch (err) {
    console.error('Orders POST error:', err);
    return NextResponse.json({ error: '서버 오류가 발생했습니다.' }, { status: 500 });
  }
}
