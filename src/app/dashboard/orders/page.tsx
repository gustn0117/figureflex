'use client';
import { useStore } from '@/store/useStore';

// PDF & Excel export functions
function exportToPDF(order: any) {
  // Dynamic import for client-side only
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
        idx + 1,
        item.productName,
        item.quantity,
        item.unitPrice.toLocaleString(),
        item.totalPrice.toLocaleString(),
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
      '번호': idx + 1,
      '상품명': item.productName,
      '수량': item.quantity,
      '단가': item.unitPrice,
      '합계': item.totalPrice,
    }));

    data.push({
      '번호': '',
      '상품명': '',
      '수량': '',
      '단가': '총합계',
      '합계': order.finalAmount,
    });

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
    <div className="max-w-5xl">
      <h2 className="text-xl font-bold text-gray-800 mb-6">주문내역</h2>

      {myOrders.length === 0 ? (
        <div className="bg-white rounded-xl border border-gray-100 p-12 text-center">
          <p className="text-gray-400 text-sm">주문 내역이 없습니다.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {myOrders.map(order => {
            const st = statusMap[order.status] || statusMap.pending;
            return (
              <div key={order.id} className="bg-white rounded-xl border border-gray-100 overflow-hidden">
                {/* Header */}
                <div className="flex items-center justify-between px-5 py-3 border-b border-gray-50 bg-gray-50/50">
                  <div className="flex items-center gap-3">
                    <span className="text-xs text-gray-400">#{order.id}</span>
                    <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${st.color}`}>{st.label}</span>
                    <span className="text-xs text-gray-400">{order.createdAt}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => exportToPDF(order)}
                      className="text-xs bg-red-50 text-red-600 px-3 py-1.5 rounded-lg hover:bg-red-100 transition-colors"
                    >
                      PDF
                    </button>
                    <button
                      onClick={() => exportToExcel(order)}
                      className="text-xs bg-green-50 text-green-600 px-3 py-1.5 rounded-lg hover:bg-green-100 transition-colors"
                    >
                      Excel
                    </button>
                  </div>
                </div>

                {/* Items */}
                <table className="w-full text-sm">
                  <thead>
                    <tr className="text-xs text-gray-400">
                      <th className="text-left px-5 py-2 font-medium">상품명</th>
                      <th className="text-center px-3 py-2 font-medium">수량</th>
                      <th className="text-right px-3 py-2 font-medium">단가</th>
                      <th className="text-right px-5 py-2 font-medium">합계</th>
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

                {/* Total */}
                <div className="flex items-center justify-end gap-4 px-5 py-3 bg-gray-50/50 border-t border-gray-50">
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
