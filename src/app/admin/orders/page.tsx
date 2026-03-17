'use client';
import { useState, useMemo } from 'react';
import { useStore } from '@/store/useStore';
import type { Order, OrderStatus } from '@/types';

const statusFlow: { value: OrderStatus; label: string; color: string }[] = [
  { value: 'pending',   label: '대기',   color: 'bg-yellow-50 text-yellow-700 border-yellow-200' },
  { value: 'confirmed', label: '확인',   color: 'bg-blue-50 text-blue-700 border-blue-200' },
  { value: 'preparing', label: '준비중', color: 'bg-purple-50 text-purple-700 border-purple-200' },
  { value: 'shipped',   label: '발송',   color: 'bg-indigo-50 text-indigo-700 border-indigo-200' },
  { value: 'completed', label: '완료',   color: 'bg-green-50 text-green-700 border-green-200' },
  { value: 'cancelled', label: '취소',   color: 'bg-red-50 text-red-600 border-red-200' },
];
const statusMap = Object.fromEntries(statusFlow.map(s => [s.value, s]));

type SortKey = 'date' | 'company' | 'amount';

function exportCSV(orders: Order[]) {
  const header = ['주문번호', '주문자', '등급', '상품수', '총금액', '계약금(카드)', '잔금(계좌)', '상태', '주문일'];
  const rows = orders.map(o => {
    const deposit = o.depositAmount ?? o.finalAmount;
    const balance = o.finalAmount - deposit;
    return [
      o.id,
      o.userName,
      o.userGrade || '-',
      String(o.items.length),
      String(o.finalAmount),
      String(deposit),
      String(balance),
      statusMap[o.status]?.label || o.status,
      o.createdAt,
    ];
  });
  const csv = [header, ...rows].map(r => r.map(c => `"${c}"`).join(',')).join('\n');
  const blob = new Blob(['\uFEFF' + csv], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url; a.download = `주문목록_${new Date().toISOString().split('T')[0]}.csv`;
  a.click(); URL.revokeObjectURL(url);
}

function exportPDF(orders: Order[]) {
  const rows = orders.map(o => {
    const deposit = o.depositAmount ?? o.finalAmount;
    const balance = o.finalAmount - deposit;
    return `
    <tr>
      <td>${o.id}</td>
      <td>${o.userName}</td>
      <td style="text-align:center">${o.userGrade || '-'}</td>
      <td style="text-align:center">${o.items.length}개</td>
      <td style="text-align:right">${o.finalAmount.toLocaleString()}원</td>
      <td style="text-align:right;color:#2563eb">${deposit.toLocaleString()}원</td>
      <td style="text-align:right;color:#16a34a">${balance > 0 ? balance.toLocaleString() + '원' : '-'}</td>
      <td style="text-align:center">${statusMap[o.status]?.label || o.status}</td>
      <td style="text-align:center">${o.createdAt}</td>
    </tr>`;
  }).join('');

  const html = `<!DOCTYPE html><html><head><meta charset="utf-8">
    <title>주문목록</title>
    <style>
      body { font-family: 'Apple SD Gothic Neo', sans-serif; font-size: 12px; margin: 20px; }
      h2 { font-size: 16px; margin-bottom: 4px; }
      p { font-size: 11px; color: #666; margin-bottom: 16px; }
      table { width: 100%; border-collapse: collapse; }
      th { background: #f5f5f5; padding: 8px 10px; text-align: left; border-bottom: 2px solid #ddd; font-size: 11px; }
      td { padding: 7px 10px; border-bottom: 1px solid #eee; }
    </style></head><body>
    <h2>피규어플렉스 주문목록</h2>
    <p>출력일: ${new Date().toLocaleDateString('ko-KR')} / 총 ${orders.length}건</p>
    <table><thead><tr>
      <th>주문번호</th><th>주문자</th><th>등급</th><th>상품수</th><th>총금액</th><th>계약금(카드)</th><th>잔금(계좌)</th><th>상태</th><th>주문일</th>
    </tr></thead><tbody>${rows}</tbody></table>
    </body></html>`;

  const win = window.open('', '_blank');
  if (!win) return;
  win.document.write(html);
  win.document.close();
  win.focus();
  setTimeout(() => { win.print(); win.close(); }, 300);
}

export default function AdminOrdersPage() {
  const { orders, updateOrderStatus } = useStore();
  const [selected, setSelected] = useState<string[]>([]);
  const [sort, setSort] = useState<SortKey>('date');

  const sorted = useMemo(() => {
    return [...orders].sort((a, b) => {
      if (sort === 'company') return a.userName.localeCompare(b.userName);
      if (sort === 'amount') return b.finalAmount - a.finalAmount;
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });
  }, [orders, sort]);

  const toggleSelect = (id: string) => setSelected(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);
  const toggleAll = () => setSelected(selected.length === sorted.length ? [] : sorted.map(o => o.id));
  const selectedOrders = sorted.filter(o => selected.includes(o.id));
  const exportTarget = selected.length > 0 ? selectedOrders : sorted;

  return (
    <div className="max-w-6xl">
      <div className="mb-6">
        <h2 className="text-xl font-bold text-gray-900">주문 관리</h2>
        <p className="text-sm text-gray-400 mt-1">주문 현황 및 상태 변경</p>
      </div>

      {/* Status summary */}
      <div className="flex gap-2 mb-5 flex-wrap">
        {statusFlow.map(s => {
          const cnt = orders.filter(o => o.status === s.value).length;
          return (
            <div key={s.value} className={`text-xs px-3 py-2 rounded-xl font-medium border ${s.color}`}>
              {s.label} <span className="font-bold ml-1">{cnt}</span>
            </div>
          );
        })}
      </div>

      {/* Toolbar */}
      <div className="flex items-center gap-3 mb-4 flex-wrap">
        <div className="flex gap-1.5 bg-gray-100 rounded-xl p-1">
          {([['date', '날짜순'], ['company', '업체순'], ['amount', '금액순']] as [SortKey, string][]).map(([key, label]) => (
            <button key={key} onClick={() => setSort(key)}
              className={`text-xs px-3 py-1.5 rounded-lg font-medium transition-all ${sort === key ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}>
              {label}
            </button>
          ))}
        </div>

        <div className="flex-1" />

        <div className="flex items-center gap-2">
          {selected.length > 0 && (
            <span className="text-xs text-gray-500 font-medium">{selected.length}건 선택</span>
          )}
          <button onClick={() => exportCSV(exportTarget)}
            className="flex items-center gap-1.5 text-xs border border-gray-200 bg-white text-gray-600 px-3 py-2 rounded-xl hover:border-gray-400 hover:text-gray-900 transition-all font-medium">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><polyline points="14 2 14 8 20 8" /><line x1="16" y1="13" x2="8" y2="13" /><line x1="16" y1="17" x2="8" y2="17" /><polyline points="10 9 9 9 8 9" />
            </svg>
            엑셀 {selected.length > 0 ? `(${selected.length})` : '전체'}
          </button>
          <button onClick={() => exportPDF(exportTarget)}
            className="flex items-center gap-1.5 text-xs border border-gray-200 bg-white text-gray-600 px-3 py-2 rounded-xl hover:border-gray-400 hover:text-gray-900 transition-all font-medium">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="6 9 6 2 18 2 18 9" /><path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2" /><rect x="6" y="14" width="12" height="8" />
            </svg>
            PDF {selected.length > 0 ? `(${selected.length})` : '전체'}
          </button>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
        {orders.length === 0 ? (
          <div className="text-center py-16 text-gray-400 text-sm">주문 내역이 없습니다.</div>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50 text-xs text-gray-500 border-b border-gray-100">
                <th className="px-4 py-3.5 w-10">
                  <input type="checkbox" checked={sorted.length > 0 && selected.length === sorted.length}
                    onChange={toggleAll} className="rounded cursor-pointer" />
                </th>
                <th className="text-left px-3 py-3.5 font-medium">주문자</th>
                <th className="text-center px-3 py-3.5 font-medium">등급</th>
                <th className="text-center px-3 py-3.5 font-medium">상품수</th>
                <th className="text-right px-3 py-3.5 font-medium">총금액</th>
                <th className="text-right px-3 py-3.5 font-medium text-blue-600">계약금(카드)</th>
                <th className="text-right px-3 py-3.5 font-medium text-green-700">잔금(계좌)</th>
                <th className="text-center px-3 py-3.5 font-medium">상태</th>
                <th className="text-center px-3 py-3.5 font-medium">주문일</th>
                <th className="text-center px-3 py-3.5 font-medium">상태 변경</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {sorted.map(order => {
                const s = statusMap[order.status];
                const isSelected = selected.includes(order.id);
                const deposit = order.depositAmount ?? order.finalAmount;
                const balance = order.finalAmount - deposit;
                return (
                  <tr key={order.id} className={`transition-colors ${isSelected ? 'bg-blue-50/30' : 'hover:bg-gray-50/50'}`}>
                    <td className="px-4 py-3.5 text-center">
                      <input type="checkbox" checked={isSelected} onChange={() => toggleSelect(order.id)} className="rounded cursor-pointer" />
                    </td>
                    <td className="px-3 py-3.5 font-medium text-gray-800">{order.userName}</td>
                    <td className="text-center px-3 py-3.5">
                      <span className="text-[11px] px-2 py-0.5 rounded-md bg-gray-100 text-gray-600 font-medium">{order.userGrade || '-'}</span>
                    </td>
                    <td className="text-center px-3 py-3.5 text-gray-600">{order.items.length}개</td>
                    <td className="text-right px-3 py-3.5 font-semibold text-gray-900">{order.finalAmount.toLocaleString()}원</td>
                    <td className="text-right px-3 py-3.5 font-semibold text-blue-600">{deposit.toLocaleString()}원</td>
                    <td className="text-right px-3 py-3.5 font-semibold text-green-700">{balance > 0 ? `${balance.toLocaleString()}원` : '-'}</td>
                    <td className="text-center px-3 py-3.5">
                      <span className={`text-[11px] px-2.5 py-1 rounded-lg font-medium border ${s?.color || ''}`}>{s?.label}</span>
                    </td>
                    <td className="text-center px-3 py-3.5 text-xs text-gray-400">{order.createdAt}</td>
                    <td className="text-center px-3 py-3.5">
                      <select value={order.status} onChange={e => updateOrderStatus(order.id, e.target.value as OrderStatus)}
                        className="text-xs border border-gray-200 rounded-lg px-2.5 py-1.5 bg-white focus:outline-none focus:ring-2 focus:ring-gray-900/20 cursor-pointer">
                        {statusFlow.map(s => <option key={s.value} value={s.value}>{s.label}</option>)}
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
