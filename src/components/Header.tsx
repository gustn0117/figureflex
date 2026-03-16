'use client';
import { usePathname, useRouter } from 'next/navigation';
import { useStore } from '@/store/useStore';
import { useState, useRef, useEffect } from 'react';

const navItems = [
  { label: '일번상', href: '/dashboard/ichiban' },
  { label: '피규어', href: '/dashboard/figures' },
  { label: '가챠', href: '/dashboard/gacha' },
  { label: '굿즈', href: '/dashboard/goods' },
];

export default function Header() {
  const pathname = usePathname();
  const router = useRouter();
  const { currentUser, logout, cart } = useStore();
  const [menuOpen, setMenuOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const h = (e: MouseEvent) => { if (menuRef.current && !menuRef.current.contains(e.target as Node)) setMenuOpen(false); };
    document.addEventListener('mousedown', h);
    return () => document.removeEventListener('mousedown', h);
  }, []);

  if (!currentUser) return null;
  const cartCount = cart.reduce((s, i) => s + i.quantity, 0);

  return (
    <header className="bg-white sticky top-0 z-50">
      {/* Top bar */}
      <div className="border-b border-gray-100">
        <div className="max-w-6xl mx-auto px-5 flex items-center justify-between h-8">
          <div />
          <div className="flex items-center gap-4 text-[11px] text-gray-400">
            <button onClick={() => router.push('/dashboard/notices')} className="hover:text-gray-900">공지사항</button>
            <button onClick={() => router.push('/dashboard/inquiry')} className="hover:text-gray-900">문의하기</button>
            <button onClick={() => router.push('/dashboard/mypage')} className="hover:text-gray-900">마이페이지</button>
            <button onClick={() => { logout(); router.push('/'); }} className="hover:text-gray-900">로그아웃</button>
          </div>
        </div>
      </div>

      {/* Main header */}
      <div className="border-b border-gray-200">
        <div className="max-w-6xl mx-auto px-5 flex items-center justify-between h-16">
          {/* Logo */}
          <button onClick={() => router.push('/dashboard')} className="flex items-center gap-2.5 shrink-0">
            <img src="/logo.jpg" alt="피규어플렉스" className="h-10 w-auto" style={{ mixBlendMode: 'multiply' }} />
            <span className="text-lg font-bold text-gray-900 hidden sm:block">피규어플렉스</span>
          </button>

          {/* Search / Right icons */}
          <div className="flex items-center gap-4">
            {/* Cart */}
            <button onClick={() => router.push('/dashboard/cart')} className="relative text-gray-500 hover:text-gray-900 transition-colors">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" /><line x1="3" y1="6" x2="21" y2="6" /><path d="M16 10a4 4 0 0 1-8 0" />
              </svg>
              {cartCount > 0 && (
                <span className="absolute -top-1.5 -right-1.5 min-w-[18px] h-[18px] bg-red-500 text-white text-[10px] rounded-full flex items-center justify-center font-bold px-1">{cartCount}</span>
              )}
            </button>

            {/* My page */}
            <button onClick={() => router.push('/dashboard/mypage')} className="text-gray-500 hover:text-gray-900 transition-colors">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" />
              </svg>
            </button>

            {/* Mobile toggle */}
            <button onClick={() => setMobileOpen(!mobileOpen)} className="md:hidden text-gray-500">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                {mobileOpen
                  ? <><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></>
                  : <><line x1="3" y1="7" x2="21" y2="7" /><line x1="3" y1="12" x2="21" y2="12" /><line x1="3" y1="17" x2="21" y2="17" /></>
                }
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Category nav */}
      <div className="border-b border-gray-100 hidden md:block">
        <div className="max-w-6xl mx-auto px-5">
          <nav className="flex items-center gap-0">
            {navItems.map(item => (
              <button key={item.href} onClick={() => router.push(item.href)}
                className={`px-5 py-3 text-sm transition-colors relative ${
                  pathname === item.href
                    ? 'text-gray-900 font-semibold after:absolute after:bottom-0 after:left-0 after:right-0 after:h-[2px] after:bg-gray-900'
                    : 'text-gray-500 hover:text-gray-900'
                }`}>
                {item.label}
              </button>
            ))}
          </nav>
        </div>
      </div>

      {/* Mobile nav */}
      {mobileOpen && (
        <div className="md:hidden border-b border-gray-200 bg-white">
          <div className="max-w-6xl mx-auto px-5 py-3 space-y-1">
            {navItems.map(item => (
              <button key={item.href} onClick={() => { router.push(item.href); setMobileOpen(false); }}
                className={`block w-full text-left px-3 py-2 text-sm rounded ${pathname === item.href ? 'text-gray-900 font-medium bg-gray-50' : 'text-gray-500'}`}>
                {item.label}
              </button>
            ))}
            <div className="border-t border-gray-100 pt-2 mt-2">
              <button onClick={() => { router.push('/dashboard/notices'); setMobileOpen(false); }} className="block w-full text-left px-3 py-2 text-sm text-gray-500">공지사항</button>
              <button onClick={() => { router.push('/dashboard/inquiry'); setMobileOpen(false); }} className="block w-full text-left px-3 py-2 text-sm text-gray-500">문의하기</button>
              <button onClick={() => { router.push('/dashboard/mypage'); setMobileOpen(false); }} className="block w-full text-left px-3 py-2 text-sm text-gray-500">마이페이지</button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
