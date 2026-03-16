'use client';
import { useStore } from '@/store/useStore';
import type { OrderStatus } from '@/types';

const statusOptions: { value: OrderStatus; label: string }[] = [
  { value: 'pending', label: '대기' },
  { value: 'confirmed', label: '확인' },
  { value: 'preparing', label: '준비중' },
  { value: 'shipped', label: '발송' },
  { value: 'completed', label: '완료' },
  { value: 'cancelled', label: '취소' },
];

const statusColors: Record<string, string> = {
  pending: 'bg-yellow-100 text-yellow-700',
  confirmed: 'bg-blue-100 text-blue-700',
  preparing: 'bg-purple-100 text-purple-700',
  shipped: 'bg-indigo-100 text-indigo-700',
  completed: 'bg-green-100 text-green-700',
  cancelled: 'bg-red-100 text-red-700',
};

export default function AdminOrdersPage() {
  const { orders, updateOrderStatus } = useStore();

  return (
    <div className="max-w-6xl">
      <h2 className="text-xl font-bold text-gray-800 mb-6">주문 관리</h2>

      <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-gray-50 text-xs text-gray-500">
              <th className="text-left px-5 py-3 font-medium">주문번호</th>
              <th className="text-left px-3 py-3 font-medium">주문자</th>
              <th className="text-center px-3 py-3 font-medium">상품수</th>
              <th className="text-right px-3 py-3 font-medium">금액</th>
              <th className="text-center px-3 py-3 font-medium">상태</th>
              <th className="text-center px-3 py-3 font-medium">날짜</th>
              <th className="text-center px-3 py-3 font-medium">상태변경</th>
            </tr>
          </thead>
          <tbody>
            {orders.map(order => (
              <tr key={order.id} className="border-t border-gray-50 hover:bg-gray-50/50">
                <td className="px-5 py-3 text-xs font-mono">{order.id}</td>
                <td className="px-3 py-3">{order.userName}</td>
                <td className="text-center px-3 py-3">{order.items.length}</td>
                <td className="text-right px-3 py-3 font-medium">{order.finalAmount.toLocaleString()}원</td>
                <td className="text-center px-3 py-3">
                  <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${statusColors[order.status]}`}>
                    {statusOptions.find(s => s.value === order.status)?.label}
                  </span>
                </td>
                <td className="text-center px-3 py-3 text-xs text-gray-400">{order.createdAt}</td>
                <td className="text-center px-3 py-3">
                  <select
                    value={order.status}
                    onChange={e => updateOrderStatus(order.id, e.target.value as OrderStatus)}
                    className="text-xs border border-gray-200 rounded-lg px-2 py-1 bg-white"
                  >
                    {statusOptions.map(s => (
                      <option key={s.value} value={s.value}>{s.label}</option>
                    ))}
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
