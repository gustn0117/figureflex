export const dynamic = 'force-dynamic';
import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';
import { getSession } from '@/lib/session';

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const session = await getSession();
    if (!session || session.role !== 'admin') {
      return NextResponse.json({ error: '권한이 없습니다.' }, { status: 403 });
    }

    const body = await req.json();
    const updateData: Record<string, any> = {};

    if (body.name !== undefined) updateData.name = body.name;
    if (body.description !== undefined) updateData.description = body.description;
    if (body.detailContent !== undefined) updateData.detail_content = body.detailContent;
    if (body.imageUrl !== undefined) updateData.image_url = body.imageUrl;
    if (body.images !== undefined) updateData.images = body.images;
    if (body.categoryId !== undefined) updateData.category_id = body.categoryId || null;
    if (body.subCategoryId !== undefined) updateData.sub_category_id = body.subCategoryId || null;
    if (body.basePrice !== undefined) updateData.base_price = body.basePrice;
    if (body.minQuantity !== undefined) updateData.min_quantity = body.minQuantity;
    if (body.maxQuantity !== undefined) updateData.max_quantity = body.maxQuantity;
    if (body.quantityStep !== undefined) updateData.quantity_step = body.quantityStep;
    if (body.stock !== undefined) updateData.stock = body.stock;
    if (body.saleStartDate !== undefined) updateData.sale_start_date = body.saleStartDate;
    if (body.saleEndDate !== undefined) updateData.sale_end_date = body.saleEndDate;
    if (body.status !== undefined) updateData.status = body.status;
    if (body.origin !== undefined) updateData.origin = body.origin;
    if (body.manufacturer !== undefined) updateData.manufacturer = body.manufacturer;
    if (body.visibleGrades !== undefined) updateData.visible_grades = body.visibleGrades;

    const { error } = await supabaseAdmin
      .from('products')
      .update(updateData)
      .eq('id', params.id);

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error('Product PUT error:', err);
    return NextResponse.json({ error: '서버 오류가 발생했습니다.' }, { status: 500 });
  }
}

export async function DELETE(_req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const session = await getSession();
    if (!session || session.role !== 'admin') {
      return NextResponse.json({ error: '권한이 없습니다.' }, { status: 403 });
    }

    const { error } = await supabaseAdmin
      .from('products')
      .delete()
      .eq('id', params.id);

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error('Product DELETE error:', err);
    return NextResponse.json({ error: '서버 오류가 발생했습니다.' }, { status: 500 });
  }
}
