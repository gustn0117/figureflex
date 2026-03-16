'use client';
import { useStore } from '@/store/useStore';
import Link from 'next/link';

export default function DashboardHome() {
  const { currentUser, notices, products, orders } = useStore();

  const recentNotices = notices.slice(0, 3);
  const saleProducts = products.filter(p => p.status === 'sale').slice(0, 4);
  const myOrders = orders.filter(o => o.userId === currentUser?.id);

  return (
    <div className="max-w-6xl">
      <h2 className="text-xl font-bold text-gray-800 mb-6">
        {currentUser?.company}님, 환영합니다
      </h2>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-4 mb-8">
        <div className="bg-white rounded-xl p-5 border border-gray-100">
          <p className="text-xs text-gray-400 mb-1">등급</p>
          <p className={`text-lg font-bold badge-${currentUser?.grade.toLowerCase()} inline-block px-3 py-1 rounded-full text-sm`}>
            {currentUser?.grade}
          </p>
        </div>
        <div className="bg-white rounded-xl p-5 border border-gray-100">
          <p className="text-xs text-gray-400 mb-1">판매중 상품</p>
          <p className="text-2xl font-bold text-primary">{products.filter(p => p.status === 'sale').length}</p>
        </div>
        <div className="bg-white rounded-xl p-5 border border-gray-100">
          <p className="text-xs text-gray-400 mb-1">내 주문</p>
          <p className="text-2xl font-bold text-primary">{myOrders.length}건</p>
        </div>
        <div className="bg-white rounded-xl p-5 border border-gray-100">
          <p className="text-xs text-gray-400 mb-1">총 주문액</p>
          <p className="text-2xl font-bold text-primary">
            {myOrders.reduce((s, o) => s + o.finalAmount, 0).toLocaleString()}원
          </p>
        </div>
      </div>

      {/* Recent Notices */}
      <div className="bg-white rounded-xl border border-gray-100 p-5 mb-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-bold text-gray-800">최근 공지사항</h3>
          <Link href="/dashboard/notices" className="text-xs text-gray-400 hover:text-primary">더보기</Link>
        </div>
        <div className="space-y-2">
          {recentNotices.map(n => (
            <div key={n.id} className="flex items-center gap-3 py-2 border-b border-gray-50 last:border-0">
              {n.isImportant && <span className="text-[10px] bg-highlight text-white px-2 py-0.5 rounded-full">중요</span>}
              <span className="text-sm text-gray-700 flex-1">{n.title}</span>
              <span className="text-xs text-gray-400">{n.createdAt}</span>
            </div>
          ))}
        </div>
      </div>

      {/* New Products */}
      <div className="bg-white rounded-xl border border-gray-100 p-5">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-bold text-gray-800">신규 상품</h3>
        </div>
        <div className="grid grid-cols-4 gap-4">
          {saleProducts.map(p => (
            <Link
              key={p.id}
              href={`/dashboard/product/${p.id}`}
              className="border border-gray-100 rounded-xl overflow-hidden hover:shadow-md transition-shadow"
            >
              <div className="aspect-square bg-gray-100 flex items-center justify-center text-4xl">
                {p.categoryId === 'cat-ichiban' ? '🎰' : p.categoryId === 'cat-figure' ? '🗿' : p.categoryId === 'cat-gacha' ? '🎱' : '🎁'}
              </div>
              <div className="p-3">
                <p className="text-xs text-gray-500 mb-1 line-clamp-1">{p.name}</p>
                <p className="text-sm font-bold text-primary">
                  {(p.prices[currentUser?.grade || 'SILVER']).toLocaleString()}원
                </p>
                <p className="text-[10px] text-gray-400 line-through">
                  {p.basePrice.toLocaleString()}원
                </p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
