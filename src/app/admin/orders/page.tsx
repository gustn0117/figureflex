'use client';
import { useState, useMemo, useEffect } from 'react';
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

interface FlatRow {
  orderId: string;
  userName: string;
  userGrade: string;
  productName: string;
  productImage: string;
  quantity: number;
  totalAmount: number;
  deposit: number;
  balance: number;
  status: OrderStatus;
  statusLabel: string;
  createdAt: string;
  order: Order;
}

function flattenOrders(orders: Order[], products: any[]): FlatRow[] {
  const rows: FlatRow[] = [];
  for (const o of orders) {
    const deposit = o.depositAmount ?? o.finalAmount;
    const balance = o.finalAmount - deposit;
    for (const item of o.items) {
      let img = item.productImage || '';
      if (!img) {
        const p = products.find((pr: any) => pr.id === item.productId);
        if (p) img = p.imageUrl || p.image_url || '';
      }
      rows.push({
        orderId: o.id,
        userName: o.userName,
        userGrade: o.userGrade || '-',
        productName: item.productName,
        productImage: img,
        quantity: item.quantity,
        totalAmount: o.finalAmount,
        deposit,
        balance,
        status: o.status,
        statusLabel: statusMap[o.status]?.label || o.status,
        createdAt: o.createdAt,
        order: o,
      });
    }
  }
  return rows;
}

async function toBuffer(dataOrUrl: string): Promise<ArrayBuffer | null> {
  try {
    if (dataOrUrl.startsWith('data:')) {
      // data URI → buffer
      const base64 = dataOrUrl.split(',')[1];
      const binary = atob(base64);
      const bytes = new Uint8Array(binary.length);
      for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
      return bytes.buffer;
    } else {
      const res = await fetch(dataOrUrl);
      return await res.arrayBuffer();
    }
  } catch { return null; }
}

async function exportExcel(orders: Order[]) {
  // products를 직접 fetch해서 이미지 매핑
  let products: any[] = [];
  try {
    const res = await fetch('/api/products');
    const data = await res.json();
    products = data.products ?? [];
  } catch { /* ignore */ }
  const productMap = new Map(products.map((p: any) => [p.id, p.imageUrl || p.image_url || '']));

  const ExcelJS = (await import('exceljs')).default;
  const workbook = new ExcelJS.Workbook();
  const ws = workbook.addWorksheet('주문목록');

  const headers = ['주문번호', '상품사진', '주문자', '등급', '상품이름', '상품수', '총금액', '계약금(카드)', '잔금(계좌)', '상태', '주문일'];
  const headerRow = ws.addRow(headers);
  headerRow.font = { bold: true, size: 12, color: { argb: 'FF333333' } };
  headerRow.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFE8E8E8' } };
  headerRow.alignment = { vertical: 'middle', horizontal: 'center' };
  headerRow.height = 32;
  const borderStyle: any = { style: 'thin', color: { argb: 'FFD0D0D0' } };
  const cellBorder: any = { top: borderStyle, left: borderStyle, bottom: borderStyle, right: borderStyle };
  headerRow.eachCell(cell => { cell.border = cellBorder; });

  ws.columns = [
    { width: 30 }, // 주문번호
    { width: 16 }, // 사진
    { width: 16 }, // 주문자
    { width: 12 }, // 등급
    { width: 24 }, // 상품이름
    { width: 12 }, // 상품수
    { width: 18 }, // 총금액
    { width: 18 }, // 계약금
    { width: 18 }, // 잔금
    { width: 12 }, // 상태
    { width: 16 }, // 주문일
  ];

  for (const o of orders) {
    const deposit = o.depositAmount ?? o.finalAmount;
    const balance = o.finalAmount - deposit;
    for (const item of o.items) {
      const img = item.productImage || productMap.get(item.productId) || '';

      const rowNum = ws.rowCount + 1;
      const row = ws.addRow([
        o.id, '', o.userName, o.userGrade || '-', item.productName,
        item.quantity, o.finalAmount,
        deposit, balance > 0 ? balance : 0,
        statusMap[o.status]?.label || o.status, o.createdAt,
      ]);
      row.height = 75;
      row.alignment = { vertical: 'middle' };
      row.font = { size: 11 };
      row.eachCell(cell => { cell.border = cellBorder; });
      // 금액 셀 우측정렬
      [7, 8, 9].forEach(c => { row.getCell(c).alignment = { vertical: 'middle', horizontal: 'right' }; });
      // 상품수, 등급, 상태 가운데 정렬
      [4, 6, 10].forEach(c => { row.getCell(c).alignment = { vertical: 'middle', horizontal: 'center' }; });

      console.log(`[Excel] item="${item.productName}" img=${img ? img.substring(0, 30) + '...' : 'EMPTY'} productMap=${productMap.size}`);
      if (img) {
        try {
          const buf = await toBuffer(img);
          console.log(`[Excel] buffer result: ${buf ? buf.byteLength + ' bytes' : 'NULL'}`);
          if (buf) {
            const ext = img.includes('image/png') ? 'png' as const : 'jpeg' as const;
            const imageId = workbook.addImage({ buffer: buf, extension: ext });
            ws.addImage(imageId, {
              tl: { col: 1.1, row: rowNum - 0.9 },
              ext: { width: 70, height: 70 },
            });
            console.log(`[Excel] image added successfully, id=${imageId}`);
          }
        } catch (e) { console.error('Excel image error:', e); }
      }
    }
  }

  // 금액 포맷 (콤마)
  ws.eachRow((row, rowNumber) => {
    if (rowNumber === 1) return;
    [7, 8, 9].forEach(col => {
      const cell = row.getCell(col);
      cell.numFmt = '#,##0';
    });
  });

  const buffer = await workbook.xlsx.writeBuffer();
  const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url; a.download = `주문목록_${new Date().toISOString().split('T')[0]}.xlsx`;
  a.click(); URL.revokeObjectURL(url);
}

async function exportPDF(orders: Order[]) {
  let products: any[] = [];
  try {
    const res = await fetch('/api/products');
    const data = await res.json();
    products = data.products ?? [];
  } catch { /* ignore */ }
  const productMap = new Map(products.map((p: any) => [p.id, p.imageUrl || p.image_url || '']));

  const rowsHtml: string[] = [];
  for (const o of orders) {
    const deposit = o.depositAmount ?? o.finalAmount;
    const balance = o.finalAmount - deposit;
    for (const item of o.items) {
      const img = item.productImage || productMap.get(item.productId) || '';
      rowsHtml.push(`<tr>
        <td style="font-size:10px;word-break:break-all;max-width:120px">${o.id.slice(0, 18)}...</td>
        <td>${img ? `<img src="${img}" style="width:40px;height:40px;object-fit:cover;border-radius:4px">` : '-'}</td>
        <td>${o.userName}</td>
        <td style="text-align:center">${o.userGrade || '-'}</td>
        <td>${item.productName}</td>
        <td style="text-align:center">${item.quantity}개</td>
        <td style="text-align:right">${o.finalAmount.toLocaleString()}원</td>
        <td style="text-align:right;color:#2563eb">${deposit.toLocaleString()}원</td>
        <td style="text-align:right;color:#16a34a">${balance > 0 ? balance.toLocaleString() + '원' : '-'}</td>
        <td style="text-align:center">${statusMap[o.status]?.label || o.status}</td>
        <td style="text-align:center">${o.createdAt}</td>
      </tr>`);
    }
  }
  const html = `<!DOCTYPE html><html><head><meta charset="utf-8"><title>주문목록</title>
    <style>body{font-family:'Apple SD Gothic Neo',sans-serif;font-size:12px;margin:20px}h2{font-size:16px;margin-bottom:4px}p{font-size:11px;color:#666;margin-bottom:16px}table{width:100%;border-collapse:collapse}th{background:#f5f5f5;padding:8px 6px;text-align:left;border-bottom:2px solid #ddd;font-size:10px}td{padding:6px;border-bottom:1px solid #eee;font-size:11px}</style>
    </head><body>
    <h2>피규어플렉스 주문목록</h2>
    <p>출력일: ${new Date().toLocaleDateString('ko-KR')} / 총 ${orders.length}건</p>
    <table><thead><tr><th>주문번호</th><th>사진</th><th>업체</th><th>등급</th><th>상품이름</th><th>상품수</th><th>총금액</th><th>계약금(카드)</th><th>잔금(계좌)</th><th>상태</th><th>주문일</th></tr></thead><tbody>${rowsHtml.join('')}</tbody></table>
    </body></html>`;
  const win = window.open('', '_blank');
  if (!win) return;
  win.document.write(html); win.document.close(); win.focus();
  setTimeout(() => { win.print(); win.close(); }, 300);
}

export default function AdminOrdersPage() {
  const { orders, fetchOrders, updateOrderStatus } = useStore();
  const [selected, setSelected] = useState<string[]>([]);
  const [sort, setSort] = useState<SortKey>('date');
  const [productImages, setProductImages] = useState<Map<string, string>>(new Map());

  useEffect(() => {
    fetchOrders();
    // 테이블 이미지용 products 직접 fetch
    fetch('/api/products').then(r => r.json()).then(data => {
      const map = new Map<string, string>();
      for (const p of (data.products ?? [])) {
        map.set(p.id, p.imageUrl || p.image_url || '');
      }
      setProductImages(map);
    }).catch(() => {});
  }, []);

  const sorted = useMemo(() => {
    return [...orders].sort((a, b) => {
      if (sort === 'company') return a.userName.localeCompare(b.userName);
      if (sort === 'amount') return b.finalAmount - a.finalAmount;
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });
  }, [orders, sort]);

  const flatRows = useMemo(() => {
    return sorted.flatMap(o => {
      const deposit = o.depositAmount ?? o.finalAmount;
      const balance = o.finalAmount - deposit;
      return o.items.map(item => ({
        orderId: o.id,
        userName: o.userName,
        userGrade: o.userGrade || '-',
        productName: item.productName,
        productImage: item.productImage || productImages.get(item.productId) || '',
        quantity: item.quantity,
        totalAmount: o.finalAmount,
        deposit,
        balance,
        status: o.status,
        statusLabel: statusMap[o.status]?.label || o.status,
        createdAt: o.createdAt,
        order: o,
      }));
    });
  }, [sorted, productImages]);

  const toggleSelect = (id: string) => setSelected(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);
  const toggleAll = () => setSelected(selected.length === sorted.length ? [] : sorted.map(o => o.id));
  const selectedOrders = sorted.filter(o => selected.includes(o.id));
  const exportTarget = selected.length > 0 ? selectedOrders : sorted;

  return (
    <div className="max-w-7xl">
      <div className="mb-6">
        <h2 className="text-xl font-bold text-gray-900">주문 관리</h2>
        <p className="text-sm text-gray-400 mt-1">주문 현황 및 상태 변경</p>
      </div>

      <div className="flex gap-1.5 md:gap-2 mb-4 md:mb-5 flex-wrap">
        {statusFlow.map(s => {
          const cnt = orders.filter(o => o.status === s.value).length;
          return (
            <div key={s.value} className={`text-[10px] md:text-xs px-2 md:px-3 py-1.5 md:py-2 rounded-xl font-medium border ${s.color}`}>
              {s.label} <span className="font-bold ml-0.5 md:ml-1">{cnt}</span>
            </div>
          );
        })}
      </div>

      <div className="flex items-center gap-2 md:gap-3 mb-3 md:mb-4 flex-wrap">
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
          {selected.length > 0 && <span className="text-xs text-gray-500 font-medium">{selected.length}건 선택</span>}
          <button onClick={() => exportExcel(exportTarget)}
            className="flex items-center gap-1.5 text-xs border border-gray-200 bg-white text-gray-600 px-3 py-2 rounded-xl hover:border-gray-400 hover:text-gray-900 transition-all font-medium">
            엑셀 {selected.length > 0 ? `(${selected.length})` : '전체'}
          </button>
          <button onClick={() => exportPDF(exportTarget)}
            className="flex items-center gap-1.5 text-xs border border-gray-200 bg-white text-gray-600 px-3 py-2 rounded-xl hover:border-gray-400 hover:text-gray-900 transition-all font-medium">
            PDF {selected.length > 0 ? `(${selected.length})` : '전체'}
          </button>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
        {orders.length === 0 ? (
          <div className="text-center py-16 text-gray-400 text-sm">주문 내역이 없습니다.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-xs md:text-sm min-w-[900px]">
              <thead>
                <tr className="bg-gray-50 text-xs text-gray-500 border-b border-gray-100">
                  <th className="px-3 py-3.5 w-10"><input type="checkbox" checked={sorted.length > 0 && selected.length === sorted.length} onChange={toggleAll} className="rounded cursor-pointer" /></th>
                  <th className="text-left px-2 py-3.5 font-medium">주문번호</th>
                  <th className="text-center px-2 py-3.5 font-medium">사진</th>
                  <th className="text-left px-2 py-3.5 font-medium">업체</th>
                  <th className="text-center px-2 py-3.5 font-medium">등급</th>
                  <th className="text-left px-2 py-3.5 font-medium">상품이름</th>
                  <th className="text-center px-2 py-3.5 font-medium">상품수</th>
                  <th className="text-right px-2 py-3.5 font-medium">총금액</th>
                  <th className="text-right px-2 py-3.5 font-medium text-blue-600">계약금(카드)</th>
                  <th className="text-right px-2 py-3.5 font-medium text-green-700">잔금(계좌)</th>
                  <th className="text-center px-2 py-3.5 font-medium">상태</th>
                  <th className="text-center px-2 py-3.5 font-medium">주문일</th>
                  <th className="text-center px-2 py-3.5 font-medium">상태 변경</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {flatRows.map((row, idx) => {
                  const s = statusMap[row.status];
                  const isSelected = selected.includes(row.orderId);
                  return (
                    <tr key={`${row.orderId}-${idx}`} className={`transition-colors ${isSelected ? 'bg-blue-50/30' : 'hover:bg-gray-50/50'}`}>
                      <td className="px-3 py-3 text-center"><input type="checkbox" checked={isSelected} onChange={() => toggleSelect(row.orderId)} className="rounded cursor-pointer" /></td>
                      <td className="px-2 py-3 text-[11px] text-gray-400 font-mono max-w-[100px] truncate">{row.orderId.slice(0, 12)}...</td>
                      <td className="px-2 py-3 text-center">
                        {row.productImage ? (
                          <img src={row.productImage} alt="" className="w-10 h-10 rounded object-cover mx-auto" />
                        ) : (
                          <div className="w-10 h-10 rounded bg-gray-100 flex items-center justify-center mx-auto">
                            <svg className="w-4 h-4 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                          </div>
                        )}
                      </td>
                      <td className="px-2 py-3 font-medium text-gray-800">{row.userName}</td>
                      <td className="text-center px-2 py-3"><span className="text-[11px] px-2 py-0.5 rounded-md bg-gray-100 text-gray-600 font-medium">{row.userGrade}</span></td>
                      <td className="px-2 py-3 text-gray-700">{row.productName}</td>
                      <td className="text-center px-2 py-3 text-gray-600">{row.quantity}개</td>
                      <td className="text-right px-2 py-3 font-semibold text-gray-900">{row.totalAmount.toLocaleString()}원</td>
                      <td className="text-right px-2 py-3 font-semibold text-blue-600">{row.deposit.toLocaleString()}원</td>
                      <td className="text-right px-2 py-3 font-semibold text-green-700">{row.balance > 0 ? `${row.balance.toLocaleString()}원` : '-'}</td>
                      <td className="text-center px-2 py-3"><span className={`text-[11px] px-2.5 py-1 rounded-lg font-medium border ${s?.color || ''}`}>{s?.label}</span></td>
                      <td className="text-center px-2 py-3 text-xs text-gray-400">{row.createdAt}</td>
                      <td className="text-center px-2 py-3">
                        <select value={row.status} onChange={e => updateOrderStatus(row.orderId, e.target.value as OrderStatus)}
                          className="text-xs border border-gray-200 rounded-lg px-2 py-1.5 bg-white focus:outline-none focus:ring-2 focus:ring-gray-900/20 cursor-pointer">
                          {statusFlow.map(s => <option key={s.value} value={s.value}>{s.label}</option>)}
                        </select>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
