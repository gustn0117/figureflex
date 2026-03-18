export const dynamic = 'force-dynamic';
import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { supabaseAdmin } from '@/lib/supabase';
import { createSession } from '@/lib/session';

export async function POST(req: NextRequest) {
  try {
    const { email, password } = await req.json();

    if (!email || !password) {
      return NextResponse.json({ error: '이메일과 비밀번호를 입력하세요.' }, { status: 400 });
    }

    const { data: user, error } = await supabaseAdmin
      .from('users')
      .select('*')
      .eq('email', email)
      .single();

    if (error || !user) {
      return NextResponse.json({ error: '이메일 또는 비밀번호가 올바르지 않습니다.' }, { status: 401 });
    }

    const isValid = await bcrypt.compare(password, user.password_hash);
    if (!isValid) {
      return NextResponse.json({ error: '이메일 또는 비밀번호가 올바르지 않습니다.' }, { status: 401 });
    }

    if (user.status === 'pending') {
      return NextResponse.json({ error: '관리자 승인 대기 중입니다.' }, { status: 403 });
    }
    if (user.status === 'rejected') {
      return NextResponse.json({ error: '가입이 거부되었습니다.' }, { status: 403 });
    }

    const token = await createSession({
      userId: user.id,
      email: user.email,
      role: user.role,
      grade: user.grade,
    });

    const userData = {
      id: user.id,
      email: user.email,
      name: user.name,
      company: user.company,
      phone: user.phone,
      address: user.address,
      role: user.role,
      grade: user.grade,
      memberType: user.member_type,
      status: user.status,
      referralCode: user.referral_code,
      referredBy: user.referred_by ?? '',
      photoUrl: user.photo_url,
      createdAt: user.created_at,
    };

    const res = NextResponse.json({ user: userData });
    res.cookies.set('ff_session', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7, // 7일
      path: '/',
    });

    return res;
  } catch (err) {
    console.error('Login error:', err);
    return NextResponse.json({ error: '서버 오류가 발생했습니다.' }, { status: 500 });
  }
}
