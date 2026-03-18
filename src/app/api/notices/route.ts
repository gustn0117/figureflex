import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';
import { getSession } from '@/lib/session';

function dbToNotice(n: any) {
  return {
    id: n.id,
    title: n.title,
    content: n.content,
    images: n.image_url ? [n.image_url] : [],
    isImportant: n.is_new,
    createdAt: n.created_at,
  };
}

export async function GET() {
  try {
    const { data, error } = await supabaseAdmin
      .from('notices')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ notices: (data ?? []).map(dbToNotice) });
  } catch (err) {
    console.error('Notices GET error:', err);
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
    const { title, content, images, isImportant } = body;

    const { data, error } = await supabaseAdmin
      .from('notices')
      .insert({
        title,
        content: content ?? '',
        image_url: images && images.length > 0 ? images[0] : '',
        is_new: isImportant ?? true,
      })
      .select()
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ notice: dbToNotice(data) });
  } catch (err) {
    console.error('Notices POST error:', err);
    return NextResponse.json({ error: '서버 오류가 발생했습니다.' }, { status: 500 });
  }
}
