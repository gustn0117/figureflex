'use client';
import { useStore } from '@/store/useStore';

function exportToPDF(order: any) {
  import('jspdf').then(({ default: jsPDF }) => {
    import('jspdf-autotable').then(() => {
      const doc = new jsPDF();
      doc.setFontSize(18); doc.text('FigureFlex Order', 14, 22);
      doc.setFontSize(10);
      doc.text(`Order: ${order.id}`, 14, 35); doc.text(`Date: ${order.createdAt}`, 14, 42);
      const data = order.items.map((i: any, idx: number) => [idx+1, i.productName, i.quantity, i.unitPrice.toLocaleString(), i.totalPrice.toLocaleString()]);
      (doc as any).autoTable({ startY: 50, head: [['#','Product','Qty','Price','Total']], body: data, theme: 'grid', headStyles: { fillColor: [17,17,17] } });
      const y = (doc as any).lastAutoTable.finalY || 100;
      doc.setFontSize(12); doc.text(`Total: ${order.finalAmount.toLocaleString()} KRW`, 14, y + 15);
      doc.save(`order_${order.id}.pdf`);
    });
  });
}

function exportToExcel(order: any) {
  import('xlsx').then(XLSX => {
    const data = order.items.map((i: any, idx: number) => ({ '#': idx+1, '상품명': i.productName, '수량': i.quantity, '단가': i.unitPrice, '합계': i.totalPrice }));
    data.push({ '#': '', '상품명': '', '수량': '', '단가': '총합계', '합계': order.finalAmount });
    const ws = XLSX.utils.json_to_sheet(data); const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Order'); XLSX.writeFile(wb, `order_${order.id}.xlsx`);
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
    <div className="max-w-4xl mx-auto">
      <h1 className="text-xl font-bold text-gray-900 mb-6">주문내역</h1>

      {myOrders.length === 0 ? (
        <div className="text-center py-20">
          <p className="text-gray-400 text-sm">주문 내역이 없습니다.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {myOrders.map(order => {
            const st = statusMap[order.status] || statusMap.pending;
            return (
              <div key={order.id} className="border border-gray-200 rounded-lg overflow-hidden">
                <div className="flex items-center justify-between px-5 py-3 bg-gray-50 text-sm">
                  <div className="flex items-center gap-3">
                    <span className="text-gray-400 font-mono text-xs">#{order.id}</span>
                    <span className={`text-[10px] px-2 py-0.5 rounded font-medium ${st.color}`}>{st.label}</span>
                    <span className="text-xs text-gray-400">{order.createdAt}</span>
                  </div>
                  <div className="flex gap-2">
                    <button onClick={() => exportToPDF(order)} className="text-[11px] text-gray-500 hover:text-gray-900">PDF</button>
                    <button onClick={() => exportToExcel(order)} className="text-[11px] text-gray-500 hover:text-gray-900">Excel</button>
                  </div>
                </div>
                <div className="divide-y divide-gray-50">
                  {order.items.map((item, idx) => (
                    <div key={idx} className="flex items-center justify-between px-5 py-3 text-sm">
                      <span className="text-gray-700 flex-1">{item.productName}</span>
                      <span className="text-gray-400 w-16 text-center">{item.quantity}개</span>
                      <span className="text-gray-500 w-24 text-right">{item.unitPrice.toLocaleString()}원</span>
                      <span className="font-medium text-gray-900 w-28 text-right">{item.totalPrice.toLocaleString()}원</span>
                    </div>
                  ))}
                </div>
                <div className="flex items-center justify-end px-5 py-3 bg-gray-50 gap-3">
                  <span className="text-sm text-gray-400">합계</span>
                  <span className="text-base font-bold text-gray-900">{order.finalAmount.toLocaleString()}원</span>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
