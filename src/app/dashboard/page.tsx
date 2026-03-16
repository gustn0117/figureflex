'use client';
import { useStore } from '@/store/useStore';
import Link from 'next/link';
import ProductImage from '@/components/ProductImage';

export default function DashboardHome() {
  const { currentUser, notices, products, orders } = useStore();

  const recentNotices = notices.slice(0, 3);
  const saleProducts = products.filter(p => p.status === 'sale');
  const myOrders = orders.filter(o => o.userId === currentUser?.id);
  const grade = currentUser?.grade || 'SILVER';

  return (
    <div>
      {/* Welcome */}
      <div className="mb-10">
        <p className="text-sm text-gray-400">{currentUser?.grade} 등급</p>
        <h1 className="text-2xl font-bold text-gray-900 mt-0.5">{currentUser?.company}</h1>
      </div>

      {/* Stats */}
      <div className="flex gap-8 mb-10 pb-10 border-b border-gray-100">
        {[
          { label: '주문', value: `${myOrders.length}건` },
          { label: '총 주문액', value: `${myOrders.reduce((s, o) => s + o.finalAmount, 0).toLocaleString()}원` },
          { label: '장바구니', value: `${currentUser ? useStore.getState().cart.length : 0}건` },
        ].map((stat, i) => (
          <div key={i}>
            <p className="text-xs text-gray-400 mb-1">{stat.label}</p>
            <p className="text-lg font-bold text-gray-900">{stat.value}</p>
          </div>
        ))}
      </div>

      {/* Categories */}
      <div className="mb-10">
        <h2 className="text-sm font-semibold text-gray-900 mb-4">카테고리</h2>
        <div className="grid grid-cols-4 gap-3">
          {[
            { label: '일번상', href: '/dashboard/ichiban' },
            { label: '피규어', href: '/dashboard/figures' },
            { label: '가챠', href: '/dashboard/gacha' },
            { label: '굿즈', href: '/dashboard/goods' },
          ].map(cat => (
            <Link key={cat.href} href={cat.href}
              className="border border-gray-200 rounded-lg p-4 text-center hover:border-gray-900 transition-colors">
              <span className="text-sm font-medium text-gray-700">{cat.label}</span>
            </Link>
          ))}
        </div>
      </div>

      {/* Notices */}
      {recentNotices.length > 0 && (
        <div className="mb-10">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-semibold text-gray-900">공지사항</h2>
            <Link href="/dashboard/notices" className="text-xs text-gray-400 hover:text-gray-900">더보기</Link>
          </div>
          <div className="divide-y divide-gray-100">
            {recentNotices.map(n => (
              <div key={n.id} className="flex items-center gap-3 py-3">
                {n.isImportant && <span className="text-[10px] bg-gray-900 text-white px-1.5 py-0.5 rounded font-medium">중요</span>}
                <span className="text-sm text-gray-600 flex-1 truncate">{n.title}</span>
                <span className="text-[11px] text-gray-400">{n.createdAt}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Products */}
      {saleProducts.length > 0 && (
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-semibold text-gray-900">판매중 상품</h2>
            <span className="text-xs text-gray-400">{saleProducts.length}개</span>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {saleProducts.map(p => {
              const discountPercent = Math.round((1 - p.prices[grade] / p.basePrice) * 100);
              return (
                <Link key={p.id} href={`/dashboard/product/${p.id}`} className="group">
                  <div className="aspect-square rounded-lg overflow-hidden bg-gray-100 mb-3">
                    <ProductImage imageUrl={p.imageUrl} categoryId={p.categoryId} alt={p.name} />
                  </div>
                  <p className="text-sm text-gray-800 mb-1 line-clamp-2 leading-snug group-hover:text-gray-900">{p.name}</p>
                  <div className="flex items-baseline gap-1.5">
                    {discountPercent > 0 && <span className="text-sm font-bold text-red-500">{discountPercent}%</span>}
                    <span className="text-sm font-bold text-gray-900">{p.prices[grade].toLocaleString()}원</span>
                  </div>
                  <p className="text-xs text-gray-400 line-through">{p.basePrice.toLocaleString()}원</p>
                </Link>
              );
            })}
          </div>
        </div>
      )}

      {/* Empty state */}
      {saleProducts.length === 0 && recentNotices.length === 0 && (
        <div className="text-center py-20">
          <p className="text-gray-400 text-sm">등록된 상품이 없습니다.</p>
        </div>
      )}
    </div>
  );
}
