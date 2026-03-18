'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useStore } from '@/store/useStore';

export default function MyPage() {
  const router = useRouter();
  const { currentUser, orders, inquiries, cart, fetchOrders, fetchInquiries, gradeDiscounts } = useStore();
  const [showPw, setShowPw] = useState(false);
  const [pw, setPw] = useState({ current: '', newPw: '', confirm: '' });
  const [pwMsg, setPwMsg] = useState('');
  const [pwLoading, setPwLoading] = useState(false);

  useEffect(() => {
    fetchOrders();
    fetchInquiries();
  }, []);

  if (!currentUser) return null;

  const myOrders = orders.filter(o => o.userId === currentUser.id);
  const myInquiries = inquiries.filter(i => i.userId === currentUser.id);
  const totalSpent = myOrders.reduce((s, o) => s + o.finalAmount, 0);
  const discount = gradeDiscounts[currentUser.grade] ?? 0;

  const handlePw = async (e: React.FormEvent) => {
    e.preventDefault();
    if (pw.newPw.length < 6) { setPwMsg('새 비밀번호는 6자 이상이어야 합니다.'); return; }
    if (pw.newPw !== pw.confirm) { setPwMsg('새 비밀번호가 일치하지 않습니다.'); return; }

    setPwLoading(true);
    try {
      const res = await fetch('/api/auth/change-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ currentPassword: pw.current, newPassword: pw.newPw }),
      });
      const data = await res.json();
      if (!res.ok) {
        setPwMsg(data.error ?? '비밀번호 변경에 실패했습니다.');
      } else {
        setPwMsg('변경되었습니다.');
        setPw({ current: '', newPw: '', confirm: '' });
        setTimeout(() => { setPwMsg(''); setShowPw(false); }, 1500);
      }
    } catch {
      setPwMsg('서버 오류가 발생했습니다.');
    } finally {
      setPwLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-xl font-bold text-gray-900 mb-8">마이페이지</h1>

      {/* Profile */}
      <div className="mb-8 pb-8 border-b border-gray-100">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-lg font-bold text-gray-900">{currentUser.company}</h2>
            <p className="text-sm text-gray-400">{currentUser.name}</p>
          </div>
          <span className={`text-xs font-semibold px-3 py-1 rounded badge-${currentUser.grade.toLowerCase()}`}>{currentUser.grade}</span>
        </div>

        <div className="grid grid-cols-2 gap-y-4 gap-x-8 text-sm">
          {[
            { l: '이메일', v: currentUser.email },
            { l: '연락처', v: currentUser.phone },
            { l: '업체 유형', v: currentUser.memberType === 'chain' ? '체인점' : '외부업체' },
            { l: '할인율', v: `${Math.round(discount * 100)}%` },
            { l: '추천인 코드', v: currentUser.referralCode },
            { l: '가입일', v: currentUser.createdAt },
          ].map((r, i) => (
            <div key={i}>
              <p className="text-xs text-gray-400 mb-0.5">{r.l}</p>
              <p className="text-gray-700">{r.v}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4 mb-8 pb-8 border-b border-gray-100">
        {[
          { l: '총 주문', v: `${myOrders.length}건` },
          { l: '총 주문액', v: `${totalSpent.toLocaleString()}원` },
          { l: '장바구니', v: `${cart.length}건` },
        ].map((s, i) => (
          <div key={i} className="text-center">
            <p className="text-xs text-gray-400 mb-1">{s.l}</p>
            <p className="text-lg font-bold text-gray-900">{s.v}</p>
          </div>
        ))}
      </div>

      {/* Menu */}
      <div className="space-y-1 mb-8 pb-8 border-b border-gray-100">
        {[
          { l: '주문내역', d: `${myOrders.length}건`, h: '/dashboard/orders' },
          { l: '장바구니', d: `${cart.length}건`, h: '/dashboard/cart' },
          { l: '문의내역', d: `${myInquiries.length}건`, h: '/dashboard/inquiry' },
          { l: '공지사항', d: '', h: '/dashboard/notices' },
        ].map(m => (
          <button key={m.h} onClick={() => router.push(m.h)}
            className="flex items-center w-full py-3 text-sm text-gray-700 hover:text-gray-900 transition-colors">
            <span className="flex-1 text-left">{m.l}</span>
            {m.d && <span className="text-xs text-gray-400 mr-2">{m.d}</span>}
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-gray-300"><polyline points="9 18 15 12 9 6" /></svg>
          </button>
        ))}
      </div>

      {/* Password */}
      <div>
        <button onClick={() => setShowPw(!showPw)}
          className="flex items-center justify-between w-full text-sm text-gray-700 py-2">
          비밀번호 변경
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
            className={`text-gray-400 transition-transform ${showPw ? 'rotate-180' : ''}`}><polyline points="6 9 12 15 18 9" /></svg>
        </button>
        {showPw && (
          <form onSubmit={handlePw} className="mt-3 space-y-3">
            <input type="password" placeholder="현재 비밀번호" value={pw.current} onChange={e => setPw({...pw, current: e.target.value})}
              className="w-full px-3.5 py-2.5 border border-gray-300 rounded-lg text-sm" required />
            <input type="password" placeholder="새 비밀번호 (6자 이상)" value={pw.newPw} onChange={e => setPw({...pw, newPw: e.target.value})}
              className="w-full px-3.5 py-2.5 border border-gray-300 rounded-lg text-sm" required />
            <input type="password" placeholder="새 비밀번호 확인" value={pw.confirm} onChange={e => setPw({...pw, confirm: e.target.value})}
              className="w-full px-3.5 py-2.5 border border-gray-300 rounded-lg text-sm" required />
            {pwMsg && <p className={`text-xs ${pwMsg.includes('변경') ? 'text-green-600' : 'text-red-500'}`}>{pwMsg}</p>}
            <button type="submit" disabled={pwLoading}
              className="bg-gray-900 text-white px-5 py-2 rounded-lg text-sm hover:bg-black disabled:opacity-50">
              {pwLoading ? '변경 중...' : '변경'}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
