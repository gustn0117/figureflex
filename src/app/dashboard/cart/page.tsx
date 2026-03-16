'use client';
import { useRouter } from 'next/navigation';
import { useStore } from '@/store/useStore';
import type { UserGrade } from '@/types';

export default function CartPage() {
  const router = useRouter();
  const { cart, products, currentUser, updateCartQuantity, removeFromCart, placeOrder } = useStore();
  const grade: UserGrade = currentUser?.grade || 'SILVER';

  const cartProducts = cart.map(ci => {
    const product = products.find(p => p.id === ci.productId)!;
    const unitPrice = product.prices[grade];
    return { ...ci, product, unitPrice, total: unitPrice * ci.quantity };
  });

  const totalAmount = cartProducts.reduce((sum, cp) => sum + cp.total, 0);

  const handleOrder = () => {
    const orderId = placeOrder();
    if (orderId) {
      router.push('/dashboard/orders');
    }
  };

  return (
    <div>
      <h2 className="text-xl font-bold text-gray-800 mb-6">장바구니</h2>

      {cart.length === 0 ? (
        <div className="bg-white rounded-2xl border border-gray-100 p-16 text-center">
          <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" className="mx-auto text-gray-300 mb-4">
            <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" />
            <line x1="3" y1="6" x2="21" y2="6" />
            <path d="M16 10a4 4 0 0 1-8 0" />
          </svg>
          <p className="text-gray-400 text-sm mb-4">장바구니가 비어있습니다.</p>
          <button
            onClick={() => router.push('/dashboard/figures')}
            className="text-sm text-gray-900 hover:underline"
          >
            상품 둘러보기
          </button>
        </div>
      ) : (
        <>
          <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden mb-4">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50 text-xs text-gray-500">
                  <th className="text-left px-5 py-3.5 font-medium">상품명</th>
                  <th className="text-center px-3 py-3.5 font-medium">단가</th>
                  <th className="text-center px-3 py-3.5 font-medium">수량</th>
                  <th className="text-right px-3 py-3.5 font-medium">합계</th>
                  <th className="w-12 px-3 py-3.5"></th>
                </tr>
              </thead>
              <tbody>
                {cartProducts.map(cp => (
                  <tr key={cp.productId} className="border-t border-gray-50">
                    <td className="px-5 py-4">
                      <p className="text-sm font-medium text-gray-700">{cp.product.name}</p>
                    </td>
                    <td className="text-center px-3 py-4 text-sm text-gray-600">{cp.unitPrice.toLocaleString()}원</td>
                    <td className="text-center px-3 py-4">
                      <div className="flex items-center justify-center">
                        <div className="flex items-center border border-gray-200 rounded-lg overflow-hidden">
                          <button
                            onClick={() => updateCartQuantity(cp.productId, Math.max(cp.product.minQuantity, cp.quantity - 1))}
                            className="w-8 h-8 flex items-center justify-center text-gray-500 hover:bg-gray-50"
                          >
                            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="5" y1="12" x2="19" y2="12" /></svg>
                          </button>
                          <input
                            type="number"
                            value={cp.quantity}
                            onChange={e => updateCartQuantity(cp.productId, Math.max(cp.product.minQuantity, Math.min(cp.product.maxQuantity, Number(e.target.value))))}
                            min={cp.product.minQuantity}
                            max={cp.product.maxQuantity}
                            className="w-14 h-8 text-center text-sm border-x border-gray-200 focus:outline-none"
                          />
                          <button
                            onClick={() => updateCartQuantity(cp.productId, Math.min(cp.product.maxQuantity, cp.quantity + 1))}
                            className="w-8 h-8 flex items-center justify-center text-gray-500 hover:bg-gray-50"
                          >
                            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" /></svg>
                          </button>
                        </div>
                      </div>
                    </td>
                    <td className="text-right px-3 py-4 text-sm font-bold text-gray-800">{cp.total.toLocaleString()}원</td>
                    <td className="text-center px-3 py-4">
                      <button
                        onClick={() => removeFromCart(cp.productId)}
                        className="text-gray-400 hover:text-red-500 transition-colors"
                      >
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                          <line x1="18" y1="6" x2="6" y2="18" />
                          <line x1="6" y1="6" x2="18" y2="18" />
                        </svg>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Total */}
          <div className="bg-white rounded-2xl border border-gray-100 p-6 flex items-center justify-between">
            <div>
              <p className="text-xs text-gray-400 mb-1">{grade} 등급 적용가 기준</p>
              <p className="text-2xl font-extrabold text-gray-900">{totalAmount.toLocaleString()}원</p>
            </div>
            <button
              onClick={handleOrder}
              className="bg-gray-900 text-white px-10 py-3.5 rounded-xl font-semibold text-sm hover:bg-black transition-all flex items-center gap-2 shadow-lg shadow-black/10 active:scale-[0.98]"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2" />
                <rect x="8" y="2" width="8" height="4" rx="1" />
                <path d="M9 14l2 2 4-4" />
              </svg>
              주문하기
            </button>
          </div>
        </>
      )}
    </div>
  );
}
