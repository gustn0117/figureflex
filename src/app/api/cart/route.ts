export const dynamic = 'force-dynamic';
import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';
import { getSession } from '@/lib/session';

export async function GET() {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: '로그인이 필요합니다.' }, { status: 401 });
    }

    const { data, error } = await supabaseAdmin
      .from('cart_items')
      .select('product_id, quantity')
      .eq('user_id', session.userId)
      .order('created_at', { ascending: true });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    const cart = (data ?? []).map((item: any) => ({
      productId: item.product_id,
      quantity: item.quantity,
    }));

    return NextResponse.json({ cart });
  } catch (err) {
    console.error('Cart GET error:', err);
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
    const { productId, quantity } = body;

    if (!productId || !quantity || quantity < 1) {
      return NextResponse.json({ error: '상품 ID와 수량을 확인해주세요.' }, { status: 400 });
    }

    // 기존 항목 확인
    const { data: existing, error: fetchError } = await supabaseAdmin
      .from('cart_items')
      .select('id, quantity')
      .eq('user_id', session.userId)
      .eq('product_id', productId)
      .maybeSingle();

    if (fetchError) {
      return NextResponse.json({ error: fetchError.message }, { status: 500 });
    }

    if (existing) {
      // 수량 합산
      const { error: updateError } = await supabaseAdmin
        .from('cart_items')
        .update({ quantity: existing.quantity + quantity })
        .eq('id', existing.id);

      if (updateError) {
        return NextResponse.json({ error: updateError.message }, { status: 500 });
      }
    } else {
      // 새 항목 추가
      const { error: insertError } = await supabaseAdmin
        .from('cart_items')
        .insert({
          user_id: session.userId,
          product_id: productId,
          quantity,
        });

      if (insertError) {
        return NextResponse.json({ error: insertError.message }, { status: 500 });
      }
    }

    return NextResponse.json({ message: '장바구니에 추가되었습니다.' });
  } catch (err) {
    console.error('Cart POST error:', err);
    return NextResponse.json({ error: '서버 오류가 발생했습니다.' }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: '로그인이 필요합니다.' }, { status: 401 });
    }

    const body = await req.json();
    const { productId, quantity } = body;

    if (!productId || quantity == null || quantity < 1) {
      return NextResponse.json({ error: '상품 ID와 수량을 확인해주세요.' }, { status: 400 });
    }

    const { error } = await supabaseAdmin
      .from('cart_items')
      .update({ quantity })
      .eq('user_id', session.userId)
      .eq('product_id', productId);

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ message: '수량이 변경되었습니다.' });
  } catch (err) {
    console.error('Cart PUT error:', err);
    return NextResponse.json({ error: '서버 오류가 발생했습니다.' }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: '로그인이 필요합니다.' }, { status: 401 });
    }

    let productId: string | undefined;
    try {
      const body = await req.json();
      productId = body.productId;
    } catch {
      // body가 없으면 전체 삭제
    }

    let query = supabaseAdmin
      .from('cart_items')
      .delete()
      .eq('user_id', session.userId);

    if (productId) {
      query = query.eq('product_id', productId);
    }

    const { error } = await query;

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    const message = productId
      ? '상품이 장바구니에서 삭제되었습니다.'
      : '장바구니가 비워졌습니다.';

    return NextResponse.json({ message });
  } catch (err) {
    console.error('Cart DELETE error:', err);
    return NextResponse.json({ error: '서버 오류가 발생했습니다.' }, { status: 500 });
  }
}
