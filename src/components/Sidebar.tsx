'use client';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useStore } from '@/store/useStore';

const menuItems = [
  { name: '공지사항', href: '/dashboard/notices', icon: '📋' },
  { name: '제일복권', href: '/dashboard/ichiban', icon: '🎰' },
  { name: '피규어', href: '/dashboard/figures', icon: '🗿' },
  { name: '가챠', href: '/dashboard/gacha', icon: '🎱' },
  { name: '굿즈', href: '/dashboard/goods', icon: '🎁' },
  { name: '문의사항', href: '/dashboard/inquiry', icon: '💬' },
];

const bottomItems = [
  { name: '장바구니', href: '/dashboard/cart', icon: '🛒' },
  { name: '주문내역', href: '/dashboard/orders', icon: '📦' },
];

export default function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const { currentUser, logout, cart } = useStore();

  const handleLogout = () => {
    logout();
    router.push('/');
  };

  const cartCount = cart.reduce((sum, c) => sum + c.quantity, 0);

  return (
    <aside className="w-60 bg-white border-r border-gray-100 flex flex-col h-screen sticky top-0">
      {/* Logo */}
      <div className="px-5 py-5 border-b border-gray-50">
        <Link href="/dashboard" className="flex items-center gap-2.5">
          <div className="w-9 h-9 bg-gray-900 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-sm">F</span>
          </div>
          <div>
            <h1 className="text-sm font-bold text-gray-900 leading-tight">피규어플렉스</h1>
            <p className="text-[10px] text-gray-400">FigureFlex</p>
          </div>
        </Link>
      </div>

      {/* User Info */}
      {currentUser && (
        <div className="px-5 py-3 border-b border-gray-50">
          <p className="text-xs text-gray-500">{currentUser.company}</p>
          <div className="flex items-center gap-2 mt-1">
            <span className="text-sm font-medium">{currentUser.name}</span>
            <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium badge-${currentUser.grade.toLowerCase()}`}>
              {currentUser.grade}
            </span>
          </div>
        </div>
      )}

      {/* Main Nav */}
      <nav className="flex-1 px-3 py-3 overflow-y-auto">
        <p className="text-[10px] font-medium text-gray-400 uppercase tracking-wider px-2 mb-2">카테고리</p>
        {menuItems.map(item => {
          const isActive = pathname.startsWith(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm mb-0.5 transition-all ${
                isActive
                  ? 'bg-gray-900/5 text-gray-900 font-medium'
                  : 'text-gray-600 hover:bg-gray-50'
              }`}
            >
              <span className="text-base">{item.icon}</span>
              {item.name}
            </Link>
          );
        })}

        <div className="border-t border-gray-50 my-3" />
        <p className="text-[10px] font-medium text-gray-400 uppercase tracking-wider px-2 mb-2">주문</p>
        {bottomItems.map(item => {
          const isActive = pathname.startsWith(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm mb-0.5 transition-all ${
                isActive
                  ? 'bg-gray-900/5 text-gray-900 font-medium'
                  : 'text-gray-600 hover:bg-gray-50'
              }`}
            >
              <span className="text-base">{item.icon}</span>
              {item.name}
              {item.href === '/dashboard/cart' && cartCount > 0 && (
                <span className="ml-auto bg-highlight text-white text-[10px] px-1.5 py-0.5 rounded-full">{cartCount}</span>
              )}
            </Link>
          );
        })}
      </nav>

      {/* Logout */}
      <div className="px-3 py-3 border-t border-gray-50">
        <button
          onClick={handleLogout}
          className="flex items-center gap-2.5 w-full px-3 py-2 rounded-lg text-sm text-gray-500 hover:bg-gray-50 transition-all"
        >
          <span className="text-base">🚪</span>
          로그아웃
        </button>
      </div>
    </aside>
  );
}
