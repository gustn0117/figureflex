'use client';
import { useStore } from '@/store/useStore';
import Link from 'next/link';

const categoryIcons: Record<string, JSX.Element> = {
  'cat-ichiban': <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" /></svg>,
  'cat-figure': <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2a4 4 0 0 1 4 4v2H8V6a4 4 0 0 1 4-4z" /><rect x="8" y="8" width="8" height="10" rx="1" /><path d="M10 18v4M14 18v4" /></svg>,
  'cat-gacha': <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><circle cx="12" cy="12" r="4" /><line x1="12" y1="2" x2="12" y2="8" /></svg>,
  'cat-goods': <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M20 12v10H4V12" /><rect x="2" y="7" width="20" height="5" rx="1" /><path d="M12 22V7" /><path d="M12 7H7.5a2.5 2.5 0 0 1 0-5C11 2 12 7 12 7z" /><path d="M12 7h4.5a2.5 2.5 0 0 0 0-5C13 2 12 7 12 7z" /></svg>,
};

const categoryBg: Record<string, string> = {
  'cat-ichiban': 'from-amber-400 to-orange-500',
  'cat-figure': 'from-indigo-400 to-violet-500',
  'cat-gacha': 'from-pink-400 to-rose-500',
  'cat-goods': 'from-emerald-400 to-teal-500',
};

function ProductIcon({ categoryId }: { categoryId: string }) {
  return (
    <div className={`w-full h-full flex items-center justify-center bg-gradient-to-br ${categoryBg[categoryId] || categoryBg['cat-goods']} opacity-10`}>
      <div className="scale-[4] opacity-50">
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
      <div className="relative bg-gradient-to-br from-gray-900 via-gray-800 to-gray-700 rounded-2xl p-8 pb-10 mb-8 text-white overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/3" />
        <div className="absolute bottom-0 left-1/2 w-40 h-40 bg-white/5 rounded-full translate-y-1/2" />
        <div className="relative z-10">
          <p className="text-white/60 text-xs font-semibold uppercase tracking-widest mb-1">Welcome back</p>
          <h1 className="text-2xl font-bold mb-1">{currentUser?.company}</h1>
          <p className="text-white/60 text-sm">도매 전용 주문 플랫폼</p>
        </div>
        <div className="relative z-10 flex gap-8 mt-7">
          {[
            { label: '내 등급', value: currentUser?.grade || '-' },
            { label: '주문', value: `${myOrders.length}건` },
            { label: '총 주문액', value: `${myOrders.reduce((s, o) => s + o.finalAmount, 0).toLocaleString()}원` },
          ].map((stat, i) => (
            <div key={i}>
              <p className="text-white/40 text-[11px] font-medium uppercase tracking-wide">{stat.label}</p>
              <p className="text-xl font-bold mt-0.5">{stat.value}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Quick Categories */}
      <div className="grid grid-cols-4 gap-3 mb-8">
        {[
          { label: '일번상', href: '/dashboard/ichiban', gradient: 'from-amber-400 to-orange-500' },
          { label: '피규어', href: '/dashboard/figures', gradient: 'from-indigo-400 to-violet-500' },
          { label: '가챠', href: '/dashboard/gacha', gradient: 'from-pink-400 to-rose-500' },
          { label: '굿즈', href: '/dashboard/goods', gradient: 'from-emerald-400 to-teal-500' },
        ].map((cat, i) => (
          <Link
            key={cat.href}
            href={cat.href}
            className="group relative bg-white rounded-2xl p-5 flex flex-col items-center gap-3 hover:shadow-lg hover:-translate-y-0.5 transition-all border border-gray-100 overflow-hidden"
          >
            <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${cat.gradient} flex items-center justify-center text-white shadow-lg group-hover:scale-110 transition-transform`}>
              {Object.values(categoryIcons)[i]}
            </div>
            <span className="text-sm font-semibold text-gray-900">{cat.label}</span>
          </Link>
        ))}
      </div>

      {/* Notices */}
      <div className="bg-white rounded-2xl border border-gray-100 p-6 mb-8">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-bold text-gray-900 flex items-center gap-2">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-900">
              <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
              <path d="M13.73 21a2 2 0 0 1-3.46 0" />
            </svg>
            공지사항
          </h3>
          <Link href="/dashboard/notices" className="text-xs text-accent font-semibold hover:underline">전체보기</Link>
        </div>
        <div className="divide-y divide-gray-100">
          {recentNotices.map(n => (
            <div key={n.id} className="flex items-center gap-3 py-3">
              {n.isImportant && <span className="text-[10px] bg-highlight text-white px-2 py-0.5 rounded-full shrink-0 font-semibold">중요</span>}
              <span className="text-sm text-gray-700 flex-1 truncate">{n.title}</span>
              <span className="text-[11px] text-gray-400 shrink-0 font-mono">{n.createdAt}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Products */}
      <div className="mb-4">
        <div className="flex items-center justify-between mb-5">
          <h3 className="text-lg font-bold text-gray-900">판매중 상품</h3>
          <span className="text-xs bg-gray-900/10 text-gray-900 font-semibold px-2.5 py-1 rounded-full">{saleProducts.length}개</span>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {saleProducts.map(p => {
            const discountPercent = Math.round((1 - p.prices[grade] / p.basePrice) * 100);
            return (
              <Link
                key={p.id}
                href={`/dashboard/product/${p.id}`}
                className="bg-white border border-gray-100 rounded-2xl overflow-hidden hover:shadow-xl hover:-translate-y-1 transition-all group"
              >
                <div className="aspect-[4/3] relative overflow-hidden bg-gray-50">
                  <ProductIcon categoryId={p.categoryId} />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${categoryBg[p.categoryId]} flex items-center justify-center text-white shadow-lg`}>
                      {categoryIcons[p.categoryId]}
                    </div>
                  </div>
                  {discountPercent > 0 && (
                    <span className="absolute top-2.5 left-2.5 bg-accent text-white text-[11px] px-2 py-0.5 rounded-lg font-bold">{discountPercent}%</span>
                  )}
                </div>
                <div className="p-4">
                  <p className="text-[13px] text-gray-800 font-medium mb-2.5 line-clamp-2 leading-snug min-h-[36px]">{p.name}</p>
                  <div className="flex items-end gap-2">
                    <p className="text-[15px] font-bold text-gray-900">{p.prices[grade].toLocaleString()}원</p>
                    <p className="text-xs text-gray-400 line-through mb-px">{p.basePrice.toLocaleString()}원</p>
                  </div>
                  <div className="flex items-center gap-1.5 mt-2.5">
                    <span className="text-[10px] text-gray-400 bg-gray-100 px-1.5 py-0.5 rounded font-medium">MOQ {p.minQuantity}</span>
                    <span className="text-[10px] text-gray-400 bg-gray-100 px-1.5 py-0.5 rounded font-medium">~{p.saleEndDate}</span>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}
