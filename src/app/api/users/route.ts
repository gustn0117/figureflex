import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';
import { getSession } from '@/lib/session';

function dbToUser(u: any) {
  return {
    id: u.id,
    email: u.email,
    name: u.name,
    company: u.company,
    phone: u.phone,
    address: u.address,
    role: u.role,
    grade: u.grade,
    memberType: u.member_type,
    status: u.status,
    referralCode: u.referral_code,
    referredBy: u.referred_by ?? '',
    photoUrl: u.photo_url,
    createdAt: u.created_at,
    // password 필드는 절대 노출하지 않음
  };
}

export async function GET() {
  try {
    const session = await getSession();
    if (!session || session.role !== 'admin') {
      return NextResponse.json({ error: '권한이 없습니다.' }, { status: 403 });
    }

    const { data, error } = await supabaseAdmin
      .from('users')
      .select('id, email, name, company, phone, address, role, grade, member_type, status, referral_code, referred_by, photo_url, created_at')
      .order('created_at', { ascending: false });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ users: (data ?? []).map(dbToUser) });
  } catch (err) {
    console.error('Users GET error:', err);
    return NextResponse.json({ error: '서버 오류가 발생했습니다.' }, { status: 500 });
  }
}
