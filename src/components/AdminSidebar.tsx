'use client';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useStore } from '@/store/useStore';

const menuItems = [
  { name: '대시보드', href: '/admin', icon: '📊' },
  { name: '회원 관리', href: '/admin/members', icon: '👥' },
  { name: '상품 관리', href: '/admin/products', icon: '📦' },
  { name: '카테고리 관리', href: '/admin/categories', icon: '🗂️' },
  { name: '주문 관리', href: '/admin/orders', icon: '🧾' },
  { name: '공지사항 관리', href: '/admin/notices', icon: '📋' },
  { name: '문의사항 관리', href: '/admin/inquiries', icon: '💬' },
];

export default function AdminSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const { logout } = useStore();

  return (
    <aside className="w-60 bg-primary text-white flex flex-col h-screen sticky top-0">
      <div className="px-5 py-5 border-b border-white/10">
        <Link href="/admin" className="flex items-center gap-2.5">
          <div className="w-9 h-9 bg-white/20 rounded-lg flex items-center justify-center">
            <span className="font-bold text-sm">F</span>
          </div>
          <div>
            <h1 className="text-sm font-bold leading-tight">피규어플렉스</h1>
            <p className="text-[10px] text-white/50">Admin Panel</p>
          </div>
        </Link>
      </div>

      <nav className="flex-1 px-3 py-3 overflow-y-auto">
        {menuItems.map(item => {
          const isActive = item.href === '/admin'
            ? pathname === '/admin'
            : pathname.startsWith(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm mb-0.5 transition-all ${
                isActive ? 'bg-white/15 font-medium' : 'text-white/70 hover:bg-white/10'
              }`}
            >
              <span className="text-base">{item.icon}</span>
              {item.name}
            </Link>
          );
        })}
      </nav>

      <div className="px-3 py-3 border-t border-white/10">
        <button
          onClick={() => { logout(); router.push('/'); }}
          className="flex items-center gap-2.5 w-full px-3 py-2 rounded-lg text-sm text-white/60 hover:bg-white/10 transition-all"
        >
          <span className="text-base">🚪</span>
          로그아웃
        </button>
      </div>
    </aside>
  );
}
