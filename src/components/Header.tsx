'use client';
import { usePathname, useRouter } from 'next/navigation';
import { useStore } from '@/store/useStore';
import { useState, useRef, useEffect } from 'react';

const navItems = [
  { label: '제일복권', href: '/dashboard/ichiban' },
  { label: '피규어', href: '/dashboard/figures' },
  { label: '가챠', href: '/dashboard/gacha' },
  { label: '굿즈', href: '/dashboard/goods' },
  { label: '공지사항', href: '/dashboard/notices' },
  { label: '문의사항', href: '/dashboard/inquiry' },
];

export default function Header() {
  const pathname = usePathname();
  const router = useRouter();
  const { currentUser, logout, cart } = useStore();
  const [mobileOpen, setMobileOpen] = useState(false);

  if (!currentUser) return null;
  const cartCount = cart.reduce((s, i) => s + i.quantity, 0);

  return (
    <header className="bg-white sticky top-0 z-50 shadow-[0_1px_0_0_#e5e7eb]">
      <div className="max-w-6xl mx-auto px-3 md:px-5">
        {/* Top utility */}
        <div className="flex items-center justify-end gap-3 md:gap-5 h-8 md:h-10 text-[10px] md:text-[12px] text-gray-400 border-b border-gray-100">
          <button onClick={() => router.push('/dashboard/orders')} className="hover:text-gray-700 transition-colors"><span className="hidden sm:inline">주문내역</span><span className="sm:hidden"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"/><rect x="8" y="2" width="8" height="4" rx="1"/></svg></span></button>
          <span className="text-gray-200 hidden sm:inline">|</span>
          <button onClick={() => router.push('/dashboard/mypage')} className="hover:text-gray-700 transition-colors font-medium text-gray-500"><span className="hidden sm:inline">내정보</span><span className="sm:hidden"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg></span></button>
          <span className="text-gray-200 hidden sm:inline">|</span>
          <button onClick={() => { logout(); router.push('/'); }} className="hover:text-gray-700 transition-colors"><span className="hidden sm:inline">로그아웃</span><span className="sm:hidden"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg></span></button>
        </div>

        {/* Main bar */}
        <div className="flex items-center justify-between h-16 md:h-28">
          <button onClick={() => router.push('/dashboard')} className="flex items-center gap-2 md:gap-4">
            <img src="/logo2.jpg" alt="" className="h-10 md:h-20 w-auto" style={{ mixBlendMode: 'multiply' }} />
            <span className="text-[20px] md:text-[36px] font-bold text-gray-900 tracking-tight">피규어플렉스</span>
          </button>

          <div className="flex items-center gap-4">
            <button onClick={() => router.push('/dashboard/cart')} className="relative text-gray-500 hover:text-gray-900 p-1.5">
              <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" /><line x1="3" y1="6" x2="21" y2="6" /><path d="M16 10a4 4 0 0 1-8 0" /></svg>
              {cartCount > 0 && <span className="absolute -top-0.5 -right-0.5 min-w-[20px] h-[20px] bg-gray-900 text-white text-[10px] rounded-full flex items-center justify-center font-bold px-1">{cartCount}</span>}
            </button>
            <button onClick={() => router.push('/dashboard/mypage')} className="text-gray-500 hover:text-gray-900 p-1.5">
              <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" /></svg>
            </button>
            <button onClick={() => setMobileOpen(!mobileOpen)} className="md:hidden text-gray-500 p-1.5">
              <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                {mobileOpen ? <><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></> : <><line x1="3" y1="7" x2="21" y2="7" /><line x1="3" y1="12" x2="21" y2="12" /><line x1="3" y1="17" x2="21" y2="17" /></>}
              </svg>
            </button>
          </div>
        </div>

        {/* Category nav - horizontal scroll on mobile, flex on desktop */}
        <nav className="hidden md:flex items-center gap-0 -mb-px">
          {navItems.map(item => (
            <button key={item.href} onClick={() => router.push(item.href)}
              className={`px-5 py-4 text-[14px] font-medium border-b-2 transition-colors ${
                pathname === item.href ? 'border-gray-900 text-gray-900' : 'border-transparent text-gray-400 hover:text-gray-700'
              }`}>
              {item.label}
            </button>
          ))}
        </nav>
        <nav className="md:hidden flex items-center gap-0 -mb-px overflow-x-auto scrollbar-hide">
          {navItems.map(item => (
            <button key={item.href} onClick={() => router.push(item.href)}
              className={`px-3 py-2.5 text-[13px] font-medium border-b-2 transition-colors whitespace-nowrap flex-shrink-0 ${
                pathname === item.href ? 'border-gray-900 text-gray-900' : 'border-transparent text-gray-400 hover:text-gray-700'
              }`}>
              {item.label}
            </button>
          ))}
        </nav>
      </div>

      {/* Mobile nav */}
      {mobileOpen && (
        <div className="md:hidden bg-white border-t border-gray-100">
          <div className="max-w-6xl mx-auto px-5 py-2">
            {navItems.map(item => (
              <button key={item.href} onClick={() => { router.push(item.href); setMobileOpen(false); }}
                className={`block w-full text-left px-3 py-2.5 text-sm rounded ${pathname === item.href ? 'text-gray-900 font-medium bg-gray-50' : 'text-gray-500'}`}>
                {item.label}
              </button>
            ))}
          </div>
        </div>
      )}
    </header>
  );
}
