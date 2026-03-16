'use client';
import { useStore } from '@/store/useStore';
import Link from 'next/link';

const categoryIcons: Record<string, JSX.Element> = {
  'cat-ichiban': (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-amber-500">
      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
    </svg>
  ),
  'cat-figure': (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-indigo-500">
      <path d="M12 2a4 4 0 0 1 4 4v2H8V6a4 4 0 0 1 4-4z" />
      <rect x="8" y="8" width="8" height="10" rx="1" />
      <path d="M10 18v4M14 18v4" />
    </svg>
  ),
  'cat-gacha': (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-pink-500">
      <circle cx="12" cy="12" r="10" />
      <circle cx="12" cy="12" r="4" />
      <line x1="12" y1="2" x2="12" y2="8" />
    </svg>
  ),
  'cat-goods': (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-emerald-500">
      <path d="M20 12v10H4V12" />
      <rect x="2" y="7" width="20" height="5" rx="1" />
      <path d="M12 22V7" />
      <path d="M12 7H7.5a2.5 2.5 0 0 1 0-5C11 2 12 7 12 7z" />
      <path d="M12 7h4.5a2.5 2.5 0 0 0 0-5C13 2 12 7 12 7z" />
    </svg>
  ),
};

function ProductIcon({ categoryId }: { categoryId: string }) {
  return (
    <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="scale-[2.5]">
        {categoryIcons[categoryId] || categoryIcons['cat-goods']}
      </div>
    </div>
  );
}

export default function DashboardHome() {
  const { currentUser, notices, products, orders } = useStore();

  const recentNotices = notices.slice(0, 3);
  const saleProducts = products.filter(p => p.status === 'sale');
  const myOrders = orders.filter(o => o.userId === currentUser?.id);
  const grade = currentUser?.grade || 'SILVER';

  return (
    <div>
      {/* Hero Banner */}
      <div className="bg-gradient-to-r from-primary to-accent rounded-2xl p-8 mb-8 text-white">
        <h1 className="text-2xl font-bold mb-2">{currentUser?.company}님, 환영합니다</h1>
        <p className="text-white/70 text-sm">도매 전용 피규어/가챠/굿즈 주문 플랫폼</p>
        <div className="flex gap-6 mt-6">
          <div>
            <p className="text-white/50 text-xs">내 등급</p>
            <p className="text-lg font-bold">{currentUser?.grade}</p>
          </div>
          <div className="w-px bg-white/20" />
          <div>
            <p className="text-white/50 text-xs">주문 건수</p>
            <p className="text-lg font-bold">{myOrders.length}건</p>
          </div>
          <div className="w-px bg-white/20" />
          <div>
            <p className="text-white/50 text-xs">총 주문액</p>
            <p className="text-lg font-bold">{myOrders.reduce((s, o) => s + o.finalAmount, 0).toLocaleString()}원</p>
          </div>
        </div>
      </div>

      {/* Quick Categories */}
      <div className="grid grid-cols-4 gap-4 mb-8">
        {[
          { label: '일번상', href: '/dashboard/ichiban', icon: categoryIcons['cat-ichiban'], bg: 'bg-amber-50', border: 'border-amber-100' },
          { label: '피규어', href: '/dashboard/figures', icon: categoryIcons['cat-figure'], bg: 'bg-indigo-50', border: 'border-indigo-100' },
          { label: '가챠', href: '/dashboard/gacha', icon: categoryIcons['cat-gacha'], bg: 'bg-pink-50', border: 'border-pink-100' },
          { label: '굿즈', href: '/dashboard/goods', icon: categoryIcons['cat-goods'], bg: 'bg-emerald-50', border: 'border-emerald-100' },
        ].map(cat => (
          <Link
            key={cat.href}
            href={cat.href}
            className={`${cat.bg} border ${cat.border} rounded-xl p-5 flex flex-col items-center gap-3 hover:shadow-md transition-all group`}
          >
            <div className="group-hover:scale-110 transition-transform">{cat.icon}</div>
            <span className="text-sm font-medium text-gray-700">{cat.label}</span>
          </Link>
        ))}
      </div>

      {/* Recent Notices */}
      <div className="bg-white rounded-xl border border-gray-100 p-5 mb-8">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="text-gray-700">
              <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
              <path d="M13.73 21a2 2 0 0 1-3.46 0" />
            </svg>
            <h3 className="font-bold text-gray-800">공지사항</h3>
          </div>
          <Link href="/dashboard/notices" className="text-xs text-gray-400 hover:text-primary transition-colors">전체보기</Link>
        </div>
        <div className="divide-y divide-gray-50">
          {recentNotices.map(n => (
            <div key={n.id} className="flex items-center gap-3 py-3">
              {n.isImportant && <span className="text-[10px] bg-highlight text-white px-2 py-0.5 rounded-full shrink-0">중요</span>}
              <span className="text-sm text-gray-700 flex-1 truncate">{n.title}</span>
              <span className="text-xs text-gray-400 shrink-0">{n.createdAt}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Products */}
      <div className="mb-4">
        <div className="flex items-center justify-between mb-5">
          <h3 className="text-lg font-bold text-gray-800">판매중 상품</h3>
          <span className="text-xs text-gray-400">{saleProducts.length}개 상품</span>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {saleProducts.map(p => (
            <Link
              key={p.id}
              href={`/dashboard/product/${p.id}`}
              className="bg-white border border-gray-100 rounded-xl overflow-hidden hover:shadow-lg hover:-translate-y-0.5 transition-all group"
            >
              <div className="aspect-square relative overflow-hidden">
                <ProductIcon categoryId={p.categoryId} />
                <span className="absolute top-2.5 left-2.5 bg-green-500 text-white text-[10px] px-2.5 py-0.5 rounded-full font-medium">판매중</span>
              </div>
              <div className="p-4">
                <p className="text-sm text-gray-800 font-medium mb-2 line-clamp-2 leading-snug min-h-[40px]">{p.name}</p>
                <div className="flex items-end gap-2">
                  <p className="text-base font-bold text-primary">{p.prices[grade].toLocaleString()}원</p>
                  <p className="text-xs text-gray-400 line-through mb-px">{p.basePrice.toLocaleString()}원</p>
                </div>
                <div className="flex items-center gap-1.5 mt-2">
                  <span className="text-[10px] text-gray-400 bg-gray-50 px-1.5 py-0.5 rounded">MOQ {p.minQuantity}개</span>
                  <span className="text-[10px] text-gray-400 bg-gray-50 px-1.5 py-0.5 rounded">~{p.saleEndDate}</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
