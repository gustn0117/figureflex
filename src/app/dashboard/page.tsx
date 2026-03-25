'use client';
import { useState, useEffect } from 'react';
import { useStore } from '@/store/useStore';
import Link from 'next/link';
import ProductImage from '@/components/ProductImage';

export default function DashboardHome() {
  const { currentUser, notices, products, orders, cart, addToCart, fetchProducts, fetchNotices, fetchOrders } = useStore();
  const [addedId, setAddedId] = useState<string | null>(null);

  useEffect(() => {
    fetchProducts();
    fetchNotices();
    fetchOrders();
  }, []);

  const recentNotices = notices.slice(0, 3);
  const grade = currentUser?.grade || 'SILVER';
  const saleProducts = products.filter(p => p.status === 'sale' && (!p.visibleGrades || p.visibleGrades.length === 0 || p.visibleGrades.includes(grade)));
  const myOrders = orders.filter(o => o.userId === currentUser?.id);
  const totalSpent = myOrders.reduce((s, o) => s + o.finalAmount, 0);

  const handleQuickCart = (e: React.MouseEvent, p: any) => {
    e.preventDefault(); e.stopPropagation();
    addToCart(p.id, p.minQuantity);
    setAddedId(p.id);
    setTimeout(() => setAddedId(null), 1500);
  };

  return (
    <div>
      {/* Welcome banner */}
      <div className="bg-gray-900 rounded-xl p-4 sm:p-6 mb-6 sm:mb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <p className="text-gray-400 text-xs mb-1">{currentUser?.grade} 등급</p>
          <h1 className="text-white text-lg sm:text-xl font-bold">{currentUser?.company}님, 안녕하세요</h1>
        </div>
        <div className="flex gap-5 sm:gap-8 text-white text-right">
          <div><p className="text-gray-400 text-[11px]">주문</p><p className="text-base sm:text-lg font-bold">{myOrders.length}건</p></div>
          <div><p className="text-gray-400 text-[11px]">총 주문액</p><p className="text-base sm:text-lg font-bold">{totalSpent.toLocaleString()}원</p></div>
          <div><p className="text-gray-400 text-[11px]">장바구니</p><p className="text-base sm:text-lg font-bold">{cart.length}건</p></div>
        </div>
      </div>

      {/* Quick categories */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6 sm:mb-8">
        {[
          { label: '제일복권', href: '/dashboard/ichiban', desc: '이치방쿠지 / 기타' },
          { label: '피규어', href: '/dashboard/figures', desc: '반다이 / 후류 / 세가' },
          { label: '가챠', href: '/dashboard/gacha', desc: '반다이 / 일반' },
          { label: '굿즈', href: '/dashboard/goods', desc: '아크릴 / 기타' },
        ].map(cat => (
          <Link key={cat.href} href={cat.href}
            className="bg-white border border-gray-200 rounded-xl p-3.5 sm:p-5 hover:border-gray-400 transition-colors group">
            <p className="text-sm font-semibold text-gray-900 mb-1">{cat.label}</p>
            <p className="text-[11px] text-gray-400">{cat.desc}</p>
          </Link>
        ))}
      </div>

      {/* Notices */}
      {recentNotices.length > 0 && (
        <div className="bg-white border border-gray-200 rounded-xl mb-8">
          <div className="flex items-center justify-between px-5 py-3.5 border-b border-gray-100">
            <h2 className="text-sm font-semibold text-gray-900">공지사항</h2>
            <Link href="/dashboard/notices" className="text-[11px] text-gray-400 hover:text-gray-900">더보기</Link>
          </div>
          <div className="divide-y divide-gray-50">
            {recentNotices.map(n => (
              <div key={n.id} className="flex items-center gap-3 px-5 py-3">
                {n.isImportant && <span className="text-[10px] bg-red-500 text-white px-1.5 py-0.5 rounded font-medium shrink-0">N</span>}
                <span className="text-sm text-gray-600 flex-1 truncate">{n.title}</span>
                <span className="text-[11px] text-gray-400 shrink-0">{n.createdAt}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Products */}
      {saleProducts.length > 0 ? (
        <div>
          <div className="flex items-center justify-between mb-4 sm:mb-5">
            <h2 className="text-sm font-semibold text-gray-900">판매중 상품</h2>
            <span className="text-[11px] text-gray-400">{saleProducts.length}개</span>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-3 gap-y-4 sm:gap-x-4 sm:gap-y-6">
            {saleProducts.map(p => {
              const myPrice = p.prices?.[grade] ?? Math.round(p.basePrice);
              return (
                <Link key={p.id} href={`/dashboard/product/${p.id}`}
                  className="group bg-white border border-gray-100 rounded-lg overflow-hidden hover:border-gray-300 transition-all">
                  <div className="aspect-square relative overflow-hidden bg-gray-50">
                    <ProductImage imageUrl={p.imageUrl} categoryId={p.categoryId} alt={p.name} />
                    <div className="absolute bottom-2 right-2">
                      <button onClick={(e) => handleQuickCart(e, p)}
                        className={`w-8 h-8 rounded-full flex items-center justify-center shadow-sm transition-all ${addedId === p.id ? 'bg-green-500 text-white' : 'bg-white text-gray-500 hover:bg-gray-900 hover:text-white'}`}>
                        {addedId === p.id
                          ? <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><polyline points="20 6 9 17 4 12" /></svg>
                          : <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" /><line x1="3" y1="6" x2="21" y2="6" /><path d="M16 10a4 4 0 0 1-8 0" /></svg>
                        }
                      </button>
                    </div>
                  </div>
                  <div className="p-3">
                    <p className="text-[10px] text-gray-400 mb-1.5">~{p.saleEndDate} 마감</p>
                    <p className="text-[13px] text-gray-700 mb-2 line-clamp-2 leading-snug min-h-[36px] group-hover:text-gray-900">{p.name}</p>
                    <p className="text-xs text-gray-400 line-through">{p.basePrice.toLocaleString()}원</p>
                    <p className="text-[15px] font-bold text-gray-900 mt-0.5">{myPrice.toLocaleString()}원</p>
                    <p className="text-[11px] text-gray-500 mt-1">{grade} 최적가 : <span className="font-semibold text-red-500">{myPrice.toLocaleString()}원</span></p>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      ) : (
        <div className="text-center py-16 bg-white border border-gray-200 rounded-xl">
          <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" className="mx-auto text-gray-300 mb-3">
            <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" /><line x1="3" y1="6" x2="21" y2="6" /><path d="M16 10a4 4 0 0 1-8 0" />
          </svg>
          <p className="text-gray-400 text-sm mb-1">아직 등록된 상품이 없습니다</p>
          <p className="text-[11px] text-gray-300">관리자가 상품을 등록하면 여기에 표시됩니다</p>
        </div>
      )}
    </div>
  );
}
