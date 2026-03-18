export const dynamic = 'force-dynamic';
import { NextResponse } from 'next/server';
import { getSession } from '@/lib/session';
import { supabaseAdmin } from '@/lib/supabase';

export async function GET() {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ user: null }, { status: 200 });
    }

    const { data: user, error } = await supabaseAdmin
      .from('users')
      .select('*')
      .eq('id', session.userId)
      .single();

    if (error || !user) {
      return NextResponse.json({ user: null }, { status: 200 });
    }

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

    return NextResponse.json({ user: userData });
  } catch (err) {
    console.error('Me error:', err);
    return NextResponse.json({ user: null }, { status: 200 });
  }
}
