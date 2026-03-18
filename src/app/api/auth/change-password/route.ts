export const dynamic = 'force-dynamic';
import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { supabaseAdmin } from '@/lib/supabase';
import { getSession } from '@/lib/session';

export async function POST(req: NextRequest) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: '로그인이 필요합니다.' }, { status: 401 });
    }

    const { currentPassword, newPassword } = await req.json();

    if (!currentPassword || !newPassword) {
      return NextResponse.json({ error: '비밀번호를 입력하세요.' }, { status: 400 });
    }
    if (newPassword.length < 6) {
      return NextResponse.json({ error: '새 비밀번호는 6자 이상이어야 합니다.' }, { status: 400 });
    }

    const { data: user } = await supabaseAdmin
      .from('users')
      .select('password_hash')
      .eq('id', session.userId)
      .single();

    if (!user) {
      return NextResponse.json({ error: '사용자를 찾을 수 없습니다.' }, { status: 404 });
    }

    const isValid = await bcrypt.compare(currentPassword, user.password_hash);
    if (!isValid) {
      return NextResponse.json({ error: '현재 비밀번호가 일치하지 않습니다.' }, { status: 400 });
    }

    const newHash = await bcrypt.hash(newPassword, 10);
    await supabaseAdmin
      .from('users')
      .update({ password_hash: newHash })
      .eq('id', session.userId);

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error('Change password error:', err);
    return NextResponse.json({ error: '서버 오류가 발생했습니다.' }, { status: 500 });
  }
}
