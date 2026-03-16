'use client';
import { usePathname, useRouter } from 'next/navigation';
import { useStore } from '@/store/useStore';
import { useState, useRef, useEffect } from 'react';

const navItems = [
  { label: '공지', href: '/dashboard/notices' },
  { label: '일번상', href: '/dashboard/ichiban' },
  { label: '피규어', href: '/dashboard/figures' },
  { label: '가챠', href: '/dashboard/gacha' },
  { label: '굿즈', href: '/dashboard/goods' },
  { label: '문의', href: '/dashboard/inquiry' },
];

export default function Header() {
  const pathname = usePathname();
  const router = useRouter();
  const { currentUser, logout, cart } = useStore();
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) setUserMenuOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  if (!currentUser) return null;
  const cartCount = cart.reduce((s, i) => s + i.quantity, 0);

  return (
    <header className="border-b border-gray-200 bg-white sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-5">
        <div className="flex items-center h-14">
          {/* Logo */}
          <button onClick={() => router.push('/dashboard')} className="shrink-0 mr-8">
            <img src="/logo.jpg" alt="피규어플렉스" className="h-7 w-auto" style={{ mixBlendMode: 'multiply' }} />
          </button>

          {/* Nav */}
          <nav className="hidden md:flex items-center gap-1 flex-1">
            {navItems.map(item => (
              <button key={item.href} onClick={() => router.push(item.href)}
                className={`px-3 py-1.5 text-[13px] rounded-md transition-colors ${
                  pathname === item.href ? 'text-gray-900 font-semibold bg-gray-100' : 'text-gray-500 hover:text-gray-900'
                }`}>
                {item.label}
              </button>
            ))}
          </nav>

          {/* Right */}
          <div className="flex items-center gap-3 ml-auto">
            {/* Cart */}
            <button onClick={() => router.push('/dashboard/cart')}
              className={`relative p-1.5 rounded-md transition-colors ${pathname === '/dashboard/cart' ? 'text-gray-900' : 'text-gray-400 hover:text-gray-900'}`}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" /><line x1="3" y1="6" x2="21" y2="6" /><path d="M16 10a4 4 0 0 1-8 0" />
              </svg>
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 min-w-[16px] h-4 bg-red-500 text-white text-[10px] rounded-full flex items-center justify-center font-bold px-1">{cartCount}</span>
              )}
            </button>

            {/* Orders */}
            <button onClick={() => router.push('/dashboard/orders')}
              className={`p-1.5 rounded-md transition-colors ${pathname === '/dashboard/orders' ? 'text-gray-900' : 'text-gray-400 hover:text-gray-900'}`}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2" /><rect x="8" y="2" width="8" height="4" rx="1" />
              </svg>
            </button>

            <div className="w-px h-5 bg-gray-200 hidden sm:block" />

            {/* User */}
            <div className="relative" ref={menuRef}>
              <button onClick={() => setUserMenuOpen(!userMenuOpen)}
                className="flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900 transition-colors">
                <span className="hidden sm:inline text-[13px]">{currentUser.company}</span>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="6 9 12 15 18 9" /></svg>
              </button>
              {userMenuOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-50">
                  <div className="px-3 py-2 border-b border-gray-100">
                    <p className="text-sm font-medium text-gray-900">{currentUser.company}</p>
                    <p className="text-[11px] text-gray-400">{currentUser.name} / {currentUser.grade}</p>
                  </div>
                  <button onClick={() => { logout(); router.push('/'); }}
                    className="flex items-center gap-2 w-full px-3 py-2 text-sm text-gray-500 hover:bg-gray-50 hover:text-gray-900">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" /><polyline points="16 17 21 12 16 7" /><line x1="21" y1="12" x2="9" y2="12" /></svg>
                    로그아웃
                  </button>
                </div>
              )}
            </div>

            {/* Mobile toggle */}
            <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="md:hidden p-1.5 text-gray-500">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                {mobileMenuOpen
                  ? <><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></>
                  : <><line x1="4" y1="7" x2="20" y2="7" /><line x1="4" y1="12" x2="20" y2="12" /><line x1="4" y1="17" x2="20" y2="17" /></>
                }
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-gray-100 bg-white">
          <div className="max-w-6xl mx-auto px-5 py-2">
            {navItems.map(item => (
              <button key={item.href} onClick={() => { router.push(item.href); setMobileMenuOpen(false); }}
                className={`block w-full text-left px-3 py-2.5 text-sm rounded-md ${pathname === item.href ? 'text-gray-900 font-medium bg-gray-50' : 'text-gray-500'}`}>
                {item.label}
              </button>
            ))}
          </div>
        </div>
      )}
    </header>
  );
}
