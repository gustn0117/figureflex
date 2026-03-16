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
    <div className="max-w-4xl">
      <h2 className="text-xl font-bold text-gray-800 mb-6">장바구니</h2>

      {cart.length === 0 ? (
        <div className="bg-white rounded-xl border border-gray-100 p-12 text-center">
          <p className="text-gray-400 text-sm mb-4">장바구니가 비어있습니다.</p>
          <button
            onClick={() => router.push('/dashboard/figures')}
            className="text-sm text-primary hover:underline"
          >
            상품 둘러보기
          </button>
        </div>
      ) : (
        <>
          <div className="bg-white rounded-xl border border-gray-100 overflow-hidden mb-4">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50 text-xs text-gray-500">
                  <th className="text-left px-5 py-3 font-medium">상품명</th>
                  <th className="text-center px-3 py-3 font-medium">단가</th>
                  <th className="text-center px-3 py-3 font-medium">수량</th>
                  <th className="text-right px-3 py-3 font-medium">합계</th>
                  <th className="w-12 px-3 py-3"></th>
                </tr>
              </thead>
              <tbody>
                {cartProducts.map(cp => (
                  <tr key={cp.productId} className="border-t border-gray-50">
                    <td className="px-5 py-4">
                      <p className="text-sm text-gray-700">{cp.product.name}</p>
                    </td>
                    <td className="text-center px-3 py-4 text-sm">{cp.unitPrice.toLocaleString()}원</td>
                    <td className="text-center px-3 py-4">
                      <input
                        type="number"
                        value={cp.quantity}
                        onChange={e => updateCartQuantity(cp.productId, Math.max(cp.product.minQuantity, Math.min(cp.product.maxQuantity, Number(e.target.value))))}
                        min={cp.product.minQuantity}
                        max={cp.product.maxQuantity}
                        className="w-20 px-2 py-1 border border-gray-200 rounded-lg text-sm text-center focus:outline-none focus:ring-2 focus:ring-primary/20"
                      />
                    </td>
                    <td className="text-right px-3 py-4 text-sm font-medium">{cp.total.toLocaleString()}원</td>
                    <td className="text-center px-3 py-4">
                      <button
                        onClick={() => removeFromCart(cp.productId)}
                        className="text-gray-400 hover:text-red-500 text-sm"
                      >
                        ✕
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Total */}
          <div className="bg-white rounded-xl border border-gray-100 p-5 flex items-center justify-between">
            <div>
              <p className="text-xs text-gray-400 mb-1">등급 적용가 기준 합계 ({grade})</p>
              <p className="text-2xl font-bold text-primary">{totalAmount.toLocaleString()}원</p>
            </div>
            <button
              onClick={handleOrder}
              className="bg-primary text-white px-8 py-3 rounded-xl font-medium text-sm hover:bg-primary/90 transition-all"
            >
              주문하기
            </button>
          </div>
        </>
      )}
    </div>
  );
}
