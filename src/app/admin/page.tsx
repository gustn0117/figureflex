'use client';
import { useStore } from '@/store/useStore';

export default function AdminDashboard() {
  const { users, products, orders, inquiries } = useStore();
  const pendingUsers = users.filter(u => u.status === 'pending');
  const pendingInquiries = inquiries.filter(i => !i.reply);
  const pendingOrders = orders.filter(o => o.status === 'pending');
  const totalRevenue = orders.reduce((s, o) => s + o.finalAmount, 0);

  return (
    <div className="max-w-6xl">
      <h2 className="text-xl font-bold text-gray-800 mb-6">관리자 대시보드</h2>

      <div className="grid grid-cols-4 gap-4 mb-8">
        <div className="bg-white rounded-xl p-5 border border-gray-100">
          <p className="text-xs text-gray-400 mb-1">전체 회원</p>
          <p className="text-2xl font-bold text-primary">{users.filter(u => u.role === 'member').length}</p>
          {pendingUsers.length > 0 && (
            <p className="text-[10px] text-orange-500 mt-1">승인 대기 {pendingUsers.length}명</p>
          )}
        </div>
        <div className="bg-white rounded-xl p-5 border border-gray-100">
          <p className="text-xs text-gray-400 mb-1">등록 상품</p>
          <p className="text-2xl font-bold text-primary">{products.length}</p>
        </div>
        <div className="bg-white rounded-xl p-5 border border-gray-100">
          <p className="text-xs text-gray-400 mb-1">전체 주문</p>
          <p className="text-2xl font-bold text-primary">{orders.length}건</p>
          {pendingOrders.length > 0 && (
            <p className="text-[10px] text-orange-500 mt-1">처리 대기 {pendingOrders.length}건</p>
          )}
        </div>
        <div className="bg-white rounded-xl p-5 border border-gray-100">
          <p className="text-xs text-gray-400 mb-1">총 매출</p>
          <p className="text-2xl font-bold text-primary">{totalRevenue.toLocaleString()}원</p>
        </div>
      </div>

      {/* Pending approvals */}
      {pendingUsers.length > 0 && (
        <div className="bg-orange-50 rounded-xl border border-orange-100 p-5 mb-6">
          <h3 className="font-bold text-orange-700 mb-3">승인 대기 회원 ({pendingUsers.length}명)</h3>
          {pendingUsers.map(u => (
            <div key={u.id} className="flex items-center gap-3 py-2 border-b border-orange-100 last:border-0">
              <span className="text-sm">{u.name} ({u.company})</span>
              <span className="text-xs text-gray-400">{u.email}</span>
              <span className="text-xs text-gray-400">{u.createdAt}</span>
            </div>
          ))}
        </div>
      )}

      {/* Pending inquiries */}
      {pendingInquiries.length > 0 && (
        <div className="bg-blue-50 rounded-xl border border-blue-100 p-5">
          <h3 className="font-bold text-blue-700 mb-3">미답변 문의 ({pendingInquiries.length}건)</h3>
          {pendingInquiries.map(inq => (
            <div key={inq.id} className="flex items-center gap-3 py-2 border-b border-blue-100 last:border-0">
              <span className="text-sm">{inq.title}</span>
              <span className="text-xs text-gray-400">{inq.userName}</span>
              <span className="text-xs text-gray-400">{inq.createdAt}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
