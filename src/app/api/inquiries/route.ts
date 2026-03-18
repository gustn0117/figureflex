export const dynamic = 'force-dynamic';
import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';
import { getSession } from '@/lib/session';

function dbToInquiry(i: any) {
  return {
    id: i.id,
    userId: i.user_id,
    userName: i.user_name,
    title: i.title,
    content: i.content,
    imageUrl: i.image_url,
    reply: i.reply ?? '',
    repliedAt: i.replied_at ?? '',
    createdAt: i.created_at,
  };
}

export async function GET() {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: '로그인이 필요합니다.' }, { status: 401 });
    }

    let query = supabaseAdmin
      .from('inquiries')
      .select('*')
      .order('created_at', { ascending: false });

    if (session.role !== 'admin') {
      query = query.eq('user_id', session.userId);
    }

    const { data, error } = await query;

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ inquiries: (data ?? []).map(dbToInquiry) });
  } catch (err) {
    console.error('Inquiries GET error:', err);
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
    const { userId, userName, title, content, imageUrl } = body;

    const { data, error } = await supabaseAdmin
      .from('inquiries')
      .insert({
        user_id: userId,
        user_name: userName,
        title,
        content: content ?? '',
        image_url: imageUrl ?? '',
      })
      .select()
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ inquiry: dbToInquiry(data) });
  } catch (err) {
    console.error('Inquiries POST error:', err);
    return NextResponse.json({ error: '서버 오류가 발생했습니다.' }, { status: 500 });
  }
}
