'use client';
import { useStore } from '@/store/useStore';
import Link from 'next/link';
import ProductImage from '@/components/ProductImage';
import { categoryIcons } from '@/components/ProductImage';

export default function DashboardHome() {
  const { currentUser, notices, products, orders } = useStore();

  const recentNotices = notices.slice(0, 3);
  const saleProducts = products.filter(p => p.status === 'sale');
  const myOrders = orders.filter(o => o.userId === currentUser?.id);
  const grade = currentUser?.grade || 'SILVER';

  return (
    <div>
      {/* Welcome */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">{currentUser?.company}</h1>
        <p className="text-sm text-gray-400 mt-1">도매 전용 주문 플랫폼</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4 mb-8">
        {[
          { label: '내 등급', value: currentUser?.grade || '-' },
          { label: '주문 건수', value: `${myOrders.length}건` },
          { label: '총 주문액', value: `${myOrders.reduce((s, o) => s + o.finalAmount, 0).toLocaleString()}원` },
        ].map((stat, i) => (
          <div key={i} className="bg-white rounded-xl border border-gray-100 p-5">
            <p className="text-xs text-gray-400 mb-1">{stat.label}</p>
            <p className="text-xl font-bold text-gray-900">{stat.value}</p>
          </div>
        ))}
      </div>

      {/* Quick Categories */}
      <div className="grid grid-cols-4 gap-3 mb-8">
        {[
          { label: '일번상', href: '/dashboard/ichiban', key: 'cat-ichiban' },
          { label: '피규어', href: '/dashboard/figures', key: 'cat-figure' },
          { label: '가챠', href: '/dashboard/gacha', key: 'cat-gacha' },
          { label: '굿즈', href: '/dashboard/goods', key: 'cat-goods' },
        ].map(cat => (
          <Link key={cat.href} href={cat.href}
            className="bg-white rounded-xl border border-gray-100 p-4 flex items-center gap-3 hover:border-gray-300 transition-all group">
            <div className="w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center text-gray-500 group-hover:bg-gray-200 transition-colors">
              {categoryIcons[cat.key]}
            </div>
            <span className="text-sm font-medium text-gray-700">{cat.label}</span>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="ml-auto text-gray-300"><polyline points="9 18 15 12 9 6" /></svg>
          </Link>
        ))}
      </div>

      {/* Notices */}
      <div className="bg-white rounded-xl border border-gray-100 mb-8">
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
          <h3 className="font-semibold text-gray-900 text-sm">공지사항</h3>
          <Link href="/dashboard/notices" className="text-xs text-gray-400 hover:text-gray-900">전체보기</Link>
        </div>
        <div className="divide-y divide-gray-50">
          {recentNotices.map(n => (
            <div key={n.id} className="flex items-center gap-3 px-5 py-3">
              {n.isImportant && <span className="text-[10px] bg-red-500 text-white px-1.5 py-0.5 rounded shrink-0 font-medium">중요</span>}
              <span className="text-sm text-gray-600 flex-1 truncate">{n.title}</span>
              <span className="text-[11px] text-gray-400 shrink-0">{n.createdAt}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Products */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold text-gray-900">판매중 상품</h3>
          <span className="text-xs text-gray-400">{saleProducts.length}개</span>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
          {saleProducts.map(p => {
            const discountPercent = Math.round((1 - p.prices[grade] / p.basePrice) * 100);
            return (
              <Link key={p.id} href={`/dashboard/product/${p.id}`}
                className="bg-white border border-gray-100 rounded-xl overflow-hidden hover:border-gray-300 transition-all">
                <div className="aspect-square relative overflow-hidden">
                  <ProductImage imageUrl={p.imageUrl} categoryId={p.categoryId} alt={p.name} />
                  {discountPercent > 0 && (
                    <span className="absolute top-2 left-2 bg-red-500 text-white text-[11px] px-1.5 py-0.5 rounded font-bold">{discountPercent}%</span>
                  )}
                </div>
                <div className="p-3">
                  <p className="text-[13px] text-gray-800 mb-2 line-clamp-2 leading-snug min-h-[36px]">{p.name}</p>
                  <p className="text-[15px] font-bold text-gray-900">{p.prices[grade].toLocaleString()}원</p>
                  <p className="text-xs text-gray-400 line-through">{p.basePrice.toLocaleString()}원</p>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}
