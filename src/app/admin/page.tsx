'use client';
import Link from 'next/link';
import { useStore } from '@/store/useStore';

const statCards = [
  {
    key: 'members',
    label: '전체 회원',
    color: 'text-blue-600',
    bg: 'bg-blue-50',
    icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" /></svg>,
  },
  {
    key: 'products',
    label: '등록 상품',
    color: 'text-purple-600',
    bg: 'bg-purple-50',
    icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" /><polyline points="3.27 6.96 12 12.01 20.73 6.96" /><line x1="12" y1="22.08" x2="12" y2="12" /></svg>,
  },
  {
    key: 'orders',
    label: '전체 주문',
    color: 'text-green-600',
    bg: 'bg-green-50',
    icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2" /><rect x="8" y="2" width="8" height="4" rx="1" /><path d="M9 14l2 2 4-4" /></svg>,
  },
  {
    key: 'revenue',
    label: '총 매출',
    color: 'text-orange-600',
    bg: 'bg-orange-50',
    icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="1" x2="12" y2="23" /><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" /></svg>,
  },
];

export default function AdminDashboard() {
  const { users, products, orders, inquiries } = useStore();
  const pendingUsers = users.filter(u => u.status === 'pending');
  const pendingInquiries = inquiries.filter(i => !i.reply);
  const pendingOrders = orders.filter(o => o.status === 'pending');
  const totalRevenue = orders.reduce((s, o) => s + o.finalAmount, 0);

  const stats: Record<string, { value: string; sub?: string }> = {
    members: {
      value: String(users.filter(u => u.role === 'member').length),
      sub: pendingUsers.length > 0 ? `승인 대기 ${pendingUsers.length}명` : undefined,
    },
    products: { value: String(products.length) },
    orders: {
      value: `${orders.length}건`,
      sub: pendingOrders.length > 0 ? `처리 대기 ${pendingOrders.length}건` : undefined,
    },
    revenue: { value: `${totalRevenue.toLocaleString()}원` },
  };

  return (
    <div className="max-w-5xl">
      <div className="mb-7">
        <h2 className="text-xl font-bold text-gray-900">대시보드</h2>
        <p className="text-sm text-gray-400 mt-1">피규어플렉스 관리자 페이지</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4 mb-6 md:mb-8">
        {statCards.map(card => (
          <div key={card.key} className="bg-white rounded-2xl border border-gray-100 p-3 md:p-5">
            <div className={`w-8 h-8 md:w-10 md:h-10 ${card.bg} rounded-xl flex items-center justify-center mb-2 md:mb-3`}>
              <span className={card.color}>{card.icon}</span>
            </div>
            <p className="text-[10px] md:text-xs text-gray-400 mb-0.5 md:mb-1">{card.label}</p>
            <p className="text-lg md:text-2xl font-bold text-gray-900">{stats[card.key].value}</p>
            {stats[card.key].sub && (
              <p className="text-[11px] text-accent mt-1 font-medium">{stats[card.key].sub}</p>
            )}
          </div>
        ))}
      </div>

      {/* Alerts */}
      <div className="space-y-4">
        {pendingUsers.length > 0 && (
          <div className="bg-white rounded-2xl border border-amber-200 overflow-hidden">
            <div className="flex items-center justify-between px-3 md:px-5 py-3 md:py-3.5 bg-amber-50 border-b border-amber-100">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
                <h3 className="font-semibold text-amber-800 text-sm">승인 대기 회원</h3>
                <span className="text-xs bg-amber-400 text-white px-1.5 py-0.5 rounded-full font-bold">{pendingUsers.length}</span>
              </div>
              <Link href="/admin/members?tab=pending" className="text-xs text-amber-600 hover:text-amber-800 font-medium">
                전체보기 →
              </Link>
            </div>
            <div className="divide-y divide-gray-50">
              {pendingUsers.map(u => (
                <div key={u.id} className="flex items-center gap-3 md:gap-4 px-3 md:px-5 py-3">
                  <div className="w-7 h-7 rounded-full bg-gray-200 flex items-center justify-center flex-shrink-0">
                    <span className="text-xs font-bold text-gray-600">{u.name[0]}</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs md:text-sm font-medium text-gray-800 truncate">{u.name} <span className="text-gray-400 font-normal">({u.company})</span></p>
                    <p className="text-[10px] md:text-xs text-gray-400 truncate">{u.email}</p>
                  </div>
                  <span className="text-[10px] md:text-[11px] text-gray-400 hidden sm:inline">{u.createdAt}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {pendingInquiries.length > 0 && (
          <div className="bg-white rounded-2xl border border-blue-200 overflow-hidden">
            <div className="flex items-center justify-between px-3 md:px-5 py-3 md:py-3.5 bg-blue-50 border-b border-blue-100">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-blue-400 animate-pulse" />
                <h3 className="font-semibold text-blue-800 text-sm">미답변 문의</h3>
                <span className="text-xs bg-blue-500 text-white px-1.5 py-0.5 rounded-full font-bold">{pendingInquiries.length}</span>
              </div>
              <Link href="/admin/inquiries" className="text-xs text-blue-600 hover:text-blue-800 font-medium">
                전체보기 →
              </Link>
            </div>
            <div className="divide-y divide-gray-50">
              {pendingInquiries.slice(0, 3).map(inq => (
                <div key={inq.id} className="flex items-center gap-3 md:gap-4 px-3 md:px-5 py-3">
                  <div className="flex-1 min-w-0">
                    <p className="text-xs md:text-sm font-medium text-gray-800 truncate">{inq.title}</p>
                    <p className="text-[10px] md:text-xs text-gray-400">{inq.userName}</p>
                  </div>
                  <span className="text-[10px] md:text-[11px] text-gray-400 hidden sm:inline">{inq.createdAt}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {pendingUsers.length === 0 && pendingInquiries.length === 0 && (
          <div className="bg-white rounded-2xl border border-gray-100 px-5 py-8 text-center">
            <div className="w-12 h-12 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-3">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-green-500">
                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" />
              </svg>
            </div>
            <p className="text-sm font-medium text-gray-600">처리할 항목이 없습니다</p>
            <p className="text-xs text-gray-400 mt-1">모든 요청이 처리되었습니다.</p>
          </div>
        )}
      </div>
    </div>
  );
}
