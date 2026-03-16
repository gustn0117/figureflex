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
      {/* Notices */}
      {recentNotices.length > 0 && (
        <div className="mb-10 pb-8 border-b border-gray-100">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-sm font-semibold text-gray-900">공지사항</h2>
            <Link href="/dashboard/notices" className="text-xs text-gray-400 hover:text-gray-900">더보기</Link>
          </div>
          <div className="space-y-2">
            {recentNotices.map(n => (
              <div key={n.id} className="flex items-center gap-3">
                {n.isImportant && <span className="text-[10px] bg-gray-900 text-white px-1.5 py-0.5 rounded font-medium">중요</span>}
                <span className="text-sm text-gray-600 flex-1 truncate">{n.title}</span>
                <span className="text-[11px] text-gray-400">{n.createdAt}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Products */}
      {saleProducts.length > 0 ? (
        <div>
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-sm font-semibold text-gray-900">판매중 상품</h2>
            <span className="text-xs text-gray-400">{saleProducts.length}개</span>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-4 gap-y-8">
            {saleProducts.map(p => {
              const discountPercent = Math.round((1 - p.prices[grade] / p.basePrice) * 100);
              return (
                <Link key={p.id} href={`/dashboard/product/${p.id}`} className="group">
                  <div className="aspect-square rounded-lg overflow-hidden bg-gray-100 mb-3">
                    <ProductImage imageUrl={p.imageUrl} categoryId={p.categoryId} alt={p.name} />
                  </div>
                  <p className="text-[13px] text-gray-600 mb-1.5 line-clamp-2 leading-snug group-hover:text-gray-900">{p.name}</p>
                  <div className="flex items-baseline gap-1.5">
                    {discountPercent > 0 && <span className="text-sm font-bold text-red-500">{discountPercent}%</span>}
                    <span className="text-sm font-bold text-gray-900">{p.prices[grade].toLocaleString()}원</span>
                  </div>
                  {discountPercent > 0 && <p className="text-xs text-gray-400 line-through">{p.basePrice.toLocaleString()}원</p>}
                </Link>
              );
            })}
          </div>
        </div>
      ) : (
        <div className="text-center py-20">
          <p className="text-gray-400 text-sm">등록된 상품이 없습니다.</p>
        </div>
      )}
    </div>
  );
}
