'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useStore } from '@/store/useStore';
import { GRADE_DISCOUNTS } from '@/data/mockData';

export default function MyPage() {
  const router = useRouter();
  const { currentUser, orders, inquiries, cart } = useStore();
  const [showPwForm, setShowPwForm] = useState(false);
  const [pw, setPw] = useState({ current: '', newPw: '', confirm: '' });
  const [pwMsg, setPwMsg] = useState('');

  if (!currentUser) return null;

  const myOrders = orders.filter(o => o.userId === currentUser.id);
  const myInquiries = inquiries.filter(i => i.userId === currentUser.id);
  const totalSpent = myOrders.reduce((s, o) => s + o.finalAmount, 0);
  const discount = GRADE_DISCOUNTS[currentUser.grade] || 0;

  const handlePwChange = (e: React.FormEvent) => {
    e.preventDefault();
    if (pw.current !== currentUser.password) { setPwMsg('현재 비밀번호가 일치하지 않습니다.'); return; }
    if (pw.newPw.length < 6) { setPwMsg('새 비밀번호는 6자 이상이어야 합니다.'); return; }
    if (pw.newPw !== pw.confirm) { setPwMsg('새 비밀번호가 일치하지 않습니다.'); return; }
    const { users } = useStore.getState();
    useStore.setState({
      users: users.map(u => u.id === currentUser.id ? { ...u, password: pw.newPw } : u),
      currentUser: { ...currentUser, password: pw.newPw },
    });
    setPwMsg('비밀번호가 변경되었습니다.');
    setPw({ current: '', newPw: '', confirm: '' });
    setTimeout(() => { setPwMsg(''); setShowPwForm(false); }, 2000);
  };

  const menuItems = [
    { label: '주문내역', desc: `${myOrders.length}건`, href: '/dashboard/orders',
      icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2" /><rect x="8" y="2" width="8" height="4" rx="1" /></svg> },
    { label: '장바구니', desc: `${cart.length}건`, href: '/dashboard/cart',
      icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" /><line x1="3" y1="6" x2="21" y2="6" /><path d="M16 10a4 4 0 0 1-8 0" /></svg> },
    { label: '문의내역', desc: `${myInquiries.length}건`, href: '/dashboard/inquiry',
      icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" /></svg> },
    { label: '공지사항', desc: '', href: '/dashboard/notices',
      icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" /><path d="M13.73 21a2 2 0 0 1-3.46 0" /></svg> },
  ];

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-xl font-bold text-gray-900 mb-8">마이페이지</h1>

      {/* Profile */}
      <div className="border border-gray-200 rounded-lg p-6 mb-6">
        <div className="flex items-center justify-between mb-5">
          <div>
            <h2 className="text-lg font-bold text-gray-900">{currentUser.company}</h2>
            <p className="text-sm text-gray-400 mt-0.5">{currentUser.name}</p>
          </div>
          <span className={`text-xs font-semibold px-3 py-1 rounded badge-${currentUser.grade.toLowerCase()}`}>
            {currentUser.grade}
          </span>
        </div>

        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <p className="text-gray-400 text-xs mb-0.5">이메일</p>
            <p className="text-gray-700">{currentUser.email}</p>
          </div>
          <div>
            <p className="text-gray-400 text-xs mb-0.5">연락처</p>
            <p className="text-gray-700">{currentUser.phone}</p>
          </div>
          <div>
            <p className="text-gray-400 text-xs mb-0.5">업체 유형</p>
            <p className="text-gray-700">{currentUser.memberType === 'chain' ? '체인점' : '외부업체'}</p>
          </div>
          <div>
            <p className="text-gray-400 text-xs mb-0.5">할인율</p>
            <p className="text-gray-700">{Math.round(discount * 100)}%</p>
          </div>
          <div>
            <p className="text-gray-400 text-xs mb-0.5">추천인 코드</p>
            <p className="text-gray-700 font-mono text-xs">{currentUser.referralCode}</p>
          </div>
          <div>
            <p className="text-gray-400 text-xs mb-0.5">가입일</p>
            <p className="text-gray-700">{currentUser.createdAt}</p>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="border border-gray-200 rounded-lg p-4 text-center">
          <p className="text-xs text-gray-400 mb-1">총 주문</p>
          <p className="text-lg font-bold text-gray-900">{myOrders.length}건</p>
        </div>
        <div className="border border-gray-200 rounded-lg p-4 text-center">
          <p className="text-xs text-gray-400 mb-1">총 주문액</p>
          <p className="text-lg font-bold text-gray-900">{totalSpent.toLocaleString()}원</p>
        </div>
        <div className="border border-gray-200 rounded-lg p-4 text-center">
          <p className="text-xs text-gray-400 mb-1">장바구니</p>
          <p className="text-lg font-bold text-gray-900">{cart.length}건</p>
        </div>
      </div>

      {/* Quick menus */}
      <div className="border border-gray-200 rounded-lg divide-y divide-gray-100 mb-6">
        {menuItems.map(item => (
          <button key={item.href} onClick={() => router.push(item.href)}
            className="flex items-center gap-4 w-full px-5 py-4 hover:bg-gray-50 transition-colors text-left">
            <span className="text-gray-400">{item.icon}</span>
            <span className="text-sm font-medium text-gray-700 flex-1">{item.label}</span>
            {item.desc && <span className="text-xs text-gray-400">{item.desc}</span>}
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-gray-300"><polyline points="9 18 15 12 9 6" /></svg>
          </button>
        ))}
      </div>

      {/* Password change */}
      <div className="border border-gray-200 rounded-lg">
        <button onClick={() => setShowPwForm(!showPwForm)}
          className="flex items-center justify-between w-full px-5 py-4 text-sm font-medium text-gray-700 hover:bg-gray-50">
          비밀번호 변경
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={`text-gray-400 transition-transform ${showPwForm ? 'rotate-180' : ''}`}><polyline points="6 9 12 15 18 9" /></svg>
        </button>
        {showPwForm && (
          <div className="px-5 pb-5 border-t border-gray-100">
            <form onSubmit={handlePwChange} className="space-y-3 mt-4">
              <input type="password" placeholder="현재 비밀번호" value={pw.current} onChange={e => setPw({...pw, current: e.target.value})}
                className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none" required />
              <input type="password" placeholder="새 비밀번호 (6자 이상)" value={pw.newPw} onChange={e => setPw({...pw, newPw: e.target.value})}
                className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none" required />
              <input type="password" placeholder="새 비밀번호 확인" value={pw.confirm} onChange={e => setPw({...pw, confirm: e.target.value})}
                className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none" required />
              {pwMsg && <p className={`text-xs ${pwMsg.includes('변경') ? 'text-green-600' : 'text-red-500'}`}>{pwMsg}</p>}
              <button type="submit" className="bg-gray-900 text-white px-5 py-2 rounded-lg text-sm hover:bg-black">변경</button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}
