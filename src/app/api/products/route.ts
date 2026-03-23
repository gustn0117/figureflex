export const dynamic = 'force-dynamic';
import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';
import { getSession } from '@/lib/session';

function dbToProduct(p: any) {
  return {
    id: p.id,
    name: p.name,
    description: p.description,
    detailContent: p.detail_content,
    imageUrl: p.image_url,
    images: p.images ?? [],
    categoryId: p.category_id ?? '',
    subCategoryId: p.sub_category_id ?? '',
    basePrice: p.base_price,
    prices: { VVIP: 0, VIP: 0, GOLD: 0, SILVER: 0, '일반': 0 }, // 런타임에서 계산
    minQuantity: p.min_quantity,
    maxQuantity: p.max_quantity,
    quantityStep: p.quantity_step,
    stock: p.stock,
    saleStartDate: p.sale_start_date,
    saleEndDate: p.sale_end_date,
    status: p.status,
    origin: p.origin,
    manufacturer: p.manufacturer,
    visibleGrades: p.visible_grades ?? [],
    createdAt: p.created_at,
  };
}

export async function GET() {
  try {
    const { data, error } = await supabaseAdmin
      .from('products')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ products: (data ?? []).map(dbToProduct) });
  } catch (err) {
    console.error('Products GET error:', err);
    return NextResponse.json({ error: '서버 오류가 발생했습니다.' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await getSession();
    if (!session || session.role !== 'admin') {
      return NextResponse.json({ error: '권한이 없습니다.' }, { status: 403 });
    }

    const body = await req.json();
    const {
      name, description, detailContent, imageUrl, images,
      categoryId, subCategoryId, basePrice, minQuantity,
      maxQuantity, quantityStep, stock, saleStartDate, saleEndDate,
      status, origin, manufacturer,
    } = body;

    const { data, error } = await supabaseAdmin
      .from('products')
      .insert({
        name,
        description: description ?? '',
        detail_content: detailContent ?? '',
        image_url: imageUrl ?? '',
        images: images ?? [],
        category_id: categoryId || null,
        sub_category_id: subCategoryId || null,
        base_price: basePrice ?? 0,
        min_quantity: minQuantity ?? 1,
        max_quantity: maxQuantity ?? 100,
        quantity_step: quantityStep ?? 1,
        stock: stock ?? 0,
        sale_start_date: saleStartDate ?? '',
        sale_end_date: saleEndDate ?? '',
        status: status ?? 'sale',
        origin: origin ?? '',
        manufacturer: manufacturer ?? '',
        visible_grades: body.visibleGrades ?? [],
      })
      .select()
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ product: dbToProduct(data) });
  } catch (err) {
    console.error('Products POST error:', err);
    return NextResponse.json({ error: '서버 오류가 발생했습니다.' }, { status: 500 });
  }
}
