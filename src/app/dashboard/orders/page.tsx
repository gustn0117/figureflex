'use client';
import { useStore } from '@/store/useStore';

function exportToPDF(order: any) {
  import('jspdf').then(({ default: jsPDF }) => {
    import('jspdf-autotable').then(() => {
      const doc = new jsPDF();
      doc.setFontSize(18);
      doc.text('FigureFlex Order', 14, 22);
      doc.setFontSize(10);
      doc.text(`Order ID: ${order.id}`, 14, 35);
      doc.text(`Date: ${order.createdAt}`, 14, 42);
      doc.text(`Customer: ${order.userName}`, 14, 49);
      doc.text(`Status: ${order.status}`, 14, 56);
      const tableData = order.items.map((item: any, idx: number) => [
        idx + 1, item.productName, item.quantity,
        item.unitPrice.toLocaleString(), item.totalPrice.toLocaleString(),
      ]);
      (doc as any).autoTable({
        startY: 65,
        head: [['#', 'Product', 'Qty', 'Unit Price', 'Total']],
        body: tableData,
        theme: 'grid',
        headStyles: { fillColor: [26, 26, 46] },
      });
      const finalY = (doc as any).lastAutoTable.finalY || 100;
      doc.setFontSize(12);
      doc.text(`Total: ${order.finalAmount.toLocaleString()} KRW`, 14, finalY + 15);
      doc.save(`order_${order.id}.pdf`);
    });
  });
}

function exportToExcel(order: any) {
  import('xlsx').then((XLSX) => {
    const data = order.items.map((item: any, idx: number) => ({
      '번호': idx + 1, '상품명': item.productName, '수량': item.quantity,
      '단가': item.unitPrice, '합계': item.totalPrice,
    }));
    data.push({ '번호': '', '상품명': '', '수량': '', '단가': '총합계', '합계': order.finalAmount });
    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Order');
    XLSX.writeFile(wb, `order_${order.id}.xlsx`);
  });
}

const statusMap: Record<string, { label: string; color: string }> = {
  pending: { label: '대기', color: 'bg-yellow-100 text-yellow-700' },
  confirmed: { label: '확인', color: 'bg-blue-100 text-blue-700' },
  preparing: { label: '준비중', color: 'bg-purple-100 text-purple-700' },
  shipped: { label: '발송', color: 'bg-indigo-100 text-indigo-700' },
  completed: { label: '완료', color: 'bg-green-100 text-green-700' },
  cancelled: { label: '취소', color: 'bg-red-100 text-red-700' },
};

export default function OrdersPage() {
  const { orders, currentUser } = useStore();
  const myOrders = orders.filter(o => o.userId === currentUser?.id);

  return (
    <div>
      <h2 className="text-xl font-bold text-gray-800 mb-6">주문내역</h2>

      {myOrders.length === 0 ? (
        <div className="bg-white rounded-xl border border-gray-100 p-16 text-center">
          <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" className="mx-auto text-gray-300 mb-4">
            <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2" />
            <rect x="8" y="2" width="8" height="4" rx="1" />
          </svg>
          <p className="text-gray-400 text-sm">주문 내역이 없습니다.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {myOrders.map(order => {
            const st = statusMap[order.status] || statusMap.pending;
            return (
              <div key={order.id} className="bg-white rounded-xl border border-gray-100 overflow-hidden">
                <div className="flex items-center justify-between px-5 py-3.5 border-b border-gray-50 bg-gray-50/50">
                  <div className="flex items-center gap-3">
                    <span className="text-xs font-mono text-gray-400">#{order.id}</span>
                    <span className={`text-[10px] px-2.5 py-0.5 rounded-full font-medium ${st.color}`}>{st.label}</span>
                    <span className="text-xs text-gray-400">{order.createdAt}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => exportToPDF(order)}
                      className="flex items-center gap-1 text-xs bg-red-50 text-red-600 px-3 py-1.5 rounded-lg hover:bg-red-100 transition-colors"
                    >
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                        <polyline points="14 2 14 8 20 8" />
                      </svg>
                      PDF
                    </button>
                    <button
                      onClick={() => exportToExcel(order)}
                      className="flex items-center gap-1 text-xs bg-green-50 text-green-600 px-3 py-1.5 rounded-lg hover:bg-green-100 transition-colors"
                    >
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                        <polyline points="14 2 14 8 20 8" />
                      </svg>
                      Excel
                    </button>
                  </div>
                </div>

                <table className="w-full text-sm">
                  <thead>
                    <tr className="text-xs text-gray-400">
                      <th className="text-left px-5 py-2.5 font-medium">상품명</th>
                      <th className="text-center px-3 py-2.5 font-medium">수량</th>
                      <th className="text-right px-3 py-2.5 font-medium">단가</th>
                      <th className="text-right px-5 py-2.5 font-medium">합계</th>
                    </tr>
                  </thead>
                  <tbody>
                    {order.items.map((item, idx) => (
                      <tr key={idx} className="border-t border-gray-50">
                        <td className="px-5 py-3 text-gray-700">{item.productName}</td>
                        <td className="text-center px-3 py-3">{item.quantity}</td>
                        <td className="text-right px-3 py-3">{item.unitPrice.toLocaleString()}원</td>
                        <td className="text-right px-5 py-3 font-medium">{item.totalPrice.toLocaleString()}원</td>
                      </tr>
                    ))}
                  </tbody>
                </table>

                <div className="flex items-center justify-end gap-4 px-5 py-4 bg-gray-50/50 border-t border-gray-50">
                  <span className="text-sm text-gray-500">총 결제금액</span>
                  <span className="text-lg font-bold text-primary">{order.finalAmount.toLocaleString()}원</span>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
