'use client';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useStore } from '@/store/useStore';
import { useState } from 'react';

const menuItems = [
  {
    name: '대시보드', href: '/admin',
    icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="7" height="7" /><rect x="14" y="3" width="7" height="7" /><rect x="14" y="14" width="7" height="7" /><rect x="3" y="14" width="7" height="7" /></svg>
  },
  {
    name: '회원 관리', href: '/admin/members', badge: 'pending_users',
    icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M23 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" /></svg>
  },
  {
    name: '상품 관리', href: '/admin/products',
    icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" /><polyline points="3.27 6.96 12 12.01 20.73 6.96" /><line x1="12" y1="22.08" x2="12" y2="12" /></svg>
  },
  {
    name: '카테고리', href: '/admin/categories',
    icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z" /></svg>
  },
  {
    name: '주문 관리', href: '/admin/orders', badge: 'pending_orders',
    icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2" /><rect x="8" y="2" width="8" height="4" rx="1" /><path d="M9 14l2 2 4-4" /></svg>
  },
  {
    name: '공지사항', href: '/admin/notices',
    icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" /><path d="M13.73 21a2 2 0 0 1-3.46 0" /></svg>
  },
  {
    name: '문의사항', href: '/admin/inquiries', badge: 'pending_inquiries',
    icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" /></svg>
  },
  {
    name: '등급 설정', href: '/admin/settings',
    icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="3" /><path d="M19.07 4.93a10 10 0 0 1 0 14.14M4.93 4.93a10 10 0 0 0 0 14.14" /></svg>
  },
];

export default function AdminSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const { logout, currentUser, users, orders, inquiries } = useStore();
  const [mobileOpen, setMobileOpen] = useState(false);

  const badges: Record<string, number> = {
    pending_users: users.filter(u => u.status === 'pending').length,
    pending_orders: orders.filter(o => o.status === 'pending').length,
    pending_inquiries: inquiries.filter(i => !i.reply).length,
  };

  const sidebarContent = (
    <>
      {/* Brand */}
      <div className="px-5 py-4 border-b border-gray-100">
        <Link href="/admin" className="flex items-center gap-2.5" onClick={() => setMobileOpen(false)}>
          <img src="/logo2.jpg" alt="피규어플렉스" className="h-10 w-auto object-contain" style={{ mixBlendMode: 'multiply' }} />
          <div>
            <p className="text-[18px] font-bold text-gray-900 leading-none">피규어플렉스</p>
            <p className="text-[12px] text-gray-400 mt-1 tracking-wider font-medium">ADMIN</p>
          </div>
        </Link>
      </div>

      {/* Admin info */}
      {currentUser && (
        <div className="px-4 py-3 border-b border-gray-100 bg-gray-50">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-full bg-gray-900 flex items-center justify-center flex-shrink-0">
              <span className="text-white text-[14px] font-bold">{currentUser.name[0]}</span>
            </div>
            <div className="min-w-0">
              <p className="text-[14px] font-semibold text-gray-800 truncate">{currentUser.name}</p>
              <p className="text-[12px] text-gray-400 truncate">{currentUser.email}</p>
            </div>
          </div>
        </div>
      )}

      {/* Nav */}
      <nav className="flex-1 px-3 py-3 overflow-y-auto space-y-0.5">
        {menuItems.map(item => {
          const isActive = item.href === '/admin'
            ? pathname === '/admin'
            : pathname.startsWith(item.href);
          const badgeCount = item.badge ? badges[item.badge] : 0;
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setMobileOpen(false)}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl text-[15px] transition-all ${
                isActive
                  ? 'bg-gray-900 text-white font-medium'
                  : 'text-gray-500 hover:bg-gray-100 hover:text-gray-800'
              }`}
            >
              <span className={isActive ? 'text-white' : 'text-gray-400'}>{item.icon}</span>
              <span className="flex-1">{item.name}</span>
              {badgeCount > 0 && (
                <span className={`text-[12px] font-bold px-2 py-0.5 rounded-full min-w-[20px] text-center ${
                  isActive ? 'bg-white text-gray-900' : 'bg-red-500 text-white'
                }`}>
                  {badgeCount}
                </span>
              )}
            </Link>
          );
        })}
      </nav>

      {/* Logout */}
      <div className="px-3 py-3 border-t border-gray-100">
        <button
          onClick={() => { logout(); router.push('/'); }}
          className="flex items-center gap-3 w-full px-4 py-3 rounded-xl text-[15px] text-gray-400 hover:bg-gray-100 hover:text-gray-700 transition-all"
        >
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" /><polyline points="16 17 21 12 16 7" /><line x1="21" y1="12" x2="9" y2="12" />
          </svg>
          로그아웃
        </button>
      </div>
    </>
  );

  return (
    <>
      {/* Mobile hamburger toggle button */}
      <button
        onClick={() => setMobileOpen(true)}
        className="md:hidden fixed top-3 left-3 z-[60] bg-white border border-gray-200 rounded-lg p-2 shadow-sm"
        aria-label="메뉴 열기"
      >
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <line x1="3" y1="7" x2="21" y2="7" /><line x1="3" y1="12" x2="21" y2="12" /><line x1="3" y1="17" x2="21" y2="17" />
        </svg>
      </button>

      {/* Mobile overlay backdrop */}
      {mobileOpen && (
        <div
          className="md:hidden fixed inset-0 bg-black/40 z-[70]"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Mobile sidebar (slide-over) */}
      <aside
        className={`md:hidden fixed inset-y-0 left-0 z-[80] w-[280px] bg-white border-r border-gray-100 flex flex-col h-screen transform transition-transform duration-300 ${
          mobileOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Close button */}
        <button
          onClick={() => setMobileOpen(false)}
          className="absolute top-3 right-3 p-1.5 text-gray-400 hover:text-gray-700"
          aria-label="메뉴 닫기"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>
        {sidebarContent}
      </aside>

      {/* Desktop sidebar (always visible) */}
      <aside className="hidden md:flex w-[300px] bg-white border-r border-gray-100 flex-col h-screen sticky top-0">
        {sidebarContent}
      </aside>
    </>
  );
}
