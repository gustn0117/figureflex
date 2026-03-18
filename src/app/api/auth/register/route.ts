import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { supabaseAdmin } from '@/lib/supabase';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { email, password, name, company, phone, address, memberType, referredBy, photoUrl } = body;

    if (!email || !password || !name || !company || !phone) {
      return NextResponse.json({ error: '필수 항목을 입력하세요.' }, { status: 400 });
    }

    // 이메일 중복 확인
    const { data: existing } = await supabaseAdmin
      .from('users')
      .select('id')
      .eq('email', email)
      .single();

    if (existing) {
      return NextResponse.json({ error: '이미 등록된 이메일입니다.' }, { status: 409 });
    }

    // 추천인 코드 확인
    if (referredBy && referredBy.trim()) {
      const { data: referrer } = await supabaseAdmin
        .from('users')
        .select('id')
        .eq('referral_code', referredBy.trim())
        .single();

      if (!referrer) {
        return NextResponse.json({ error: '유효하지 않은 추천인 코드입니다.' }, { status: 400 });
      }
    }

    const passwordHash = await bcrypt.hash(password, 10);
    const referralCode = `REF${Date.now().toString(36).toUpperCase()}`;

    const { data: newUser, error } = await supabaseAdmin
      .from('users')
      .insert({
        email,
        password_hash: passwordHash,
        name,
        company,
        phone,
        address: address ?? '',
        role: 'member',
        grade: '일반',
        member_type: memberType ?? 'external',
        status: 'pending',
        referral_code: referralCode,
        referred_by: referredBy && referredBy.trim() ? referredBy.trim() : null,
        photo_url: photoUrl ?? '',
      })
      .select()
      .single();

    if (error) {
      console.error('Register error:', error);
      return NextResponse.json({ error: '회원가입에 실패했습니다.' }, { status: 500 });
    }

    return NextResponse.json({ ok: true, userId: newUser.id });
  } catch (err) {
    console.error('Register error:', err);
    return NextResponse.json({ error: '서버 오류가 발생했습니다.' }, { status: 500 });
  }
}
