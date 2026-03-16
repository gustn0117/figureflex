'use client';
import { useStore } from '@/store/useStore';
import type { OrderStatus } from '@/types';

const statusFlow: { value: OrderStatus; label: string; color: string }[] = [
  { value: 'pending',   label: '대기',   color: 'bg-yellow-50 text-yellow-700 border-yellow-200' },
  { value: 'confirmed', label: '확인',   color: 'bg-blue-50 text-blue-700 border-blue-200' },
  { value: 'preparing', label: '준비중', color: 'bg-purple-50 text-purple-700 border-purple-200' },
  { value: 'shipped',   label: '발송',   color: 'bg-indigo-50 text-indigo-700 border-indigo-200' },
  { value: 'completed', label: '완료',   color: 'bg-green-50 text-green-700 border-green-200' },
  { value: 'cancelled', label: '취소',   color: 'bg-red-50 text-red-600 border-red-200' },
];

export default function AdminOrdersPage() {
  const { orders, updateOrderStatus } = useStore();

  const statusMap = Object.fromEntries(statusFlow.map(s => [s.value, s]));

  return (
    <div className="max-w-6xl">
      <div className="mb-6">
        <h2 className="text-xl font-bold text-gray-900">주문 관리</h2>
        <p className="text-sm text-gray-400 mt-1">주문 현황 및 상태 변경</p>
      </div>

      {/* Summary row */}
      <div className="flex gap-2 mb-5 flex-wrap">
        {statusFlow.map(s => {
          const cnt = orders.filter(o => o.status === s.value).length;
          return (
            <div key={s.value} className={`text-xs px-3 py-2 rounded-xl border font-medium ${s.color}`}>
              {s.label} <span className="font-bold ml-1">{cnt}</span>
            </div>
          );
        })}
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
        {orders.length === 0 ? (
          <div className="text-center py-16 text-gray-400 text-sm">
            주문 내역이 없습니다.
          </div>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50 text-xs text-gray-500 border-b border-gray-100">
                <th className="text-left px-5 py-3.5 font-medium">주문번호</th>
                <th className="text-left px-3 py-3.5 font-medium">주문자</th>
                <th className="text-center px-3 py-3.5 font-medium">상품수</th>
                <th className="text-right px-3 py-3.5 font-medium">금액</th>
                <th className="text-center px-3 py-3.5 font-medium">상태</th>
                <th className="text-center px-3 py-3.5 font-medium">주문일</th>
                <th className="text-center px-3 py-3.5 font-medium">상태 변경</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {orders.map(order => {
                const s = statusMap[order.status];
                return (
                  <tr key={order.id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="px-5 py-3.5 text-xs font-mono text-gray-400">{order.id}</td>
                    <td className="px-3 py-3.5 font-medium text-gray-800">{order.userName}</td>
                    <td className="text-center px-3 py-3.5 text-gray-600">{order.items.length}개</td>
                    <td className="text-right px-3 py-3.5 font-semibold text-gray-900">{order.finalAmount.toLocaleString()}원</td>
                    <td className="text-center px-3 py-3.5">
                      <span className={`text-[11px] px-2.5 py-1 rounded-lg font-medium border ${s?.color || ''}`}>
                        {s?.label}
                      </span>
                    </td>
                    <td className="text-center px-3 py-3.5 text-xs text-gray-400">{order.createdAt}</td>
                    <td className="text-center px-3 py-3.5">
                      <select
                        value={order.status}
                        onChange={e => updateOrderStatus(order.id, e.target.value as OrderStatus)}
                        className="text-xs border border-gray-200 rounded-lg px-2.5 py-1.5 bg-white focus:outline-none focus:ring-2 focus:ring-gray-900/20 cursor-pointer"
                      >
                        {statusFlow.map(s => (
                          <option key={s.value} value={s.value}>{s.label}</option>
                        ))}
                      </select>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
