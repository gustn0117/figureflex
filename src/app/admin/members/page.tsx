'use client';
import { useState } from 'react';
import { useStore } from '@/store/useStore';
import type { UserGrade } from '@/types';

const gradeOptions: UserGrade[] = ['VVIP', 'VIP', 'GOLD', 'SILVER'];

const gradeBadge: Record<UserGrade, string> = {
  VVIP: 'bg-purple-100 text-purple-700',
  VIP: 'bg-blue-100 text-blue-700',
  GOLD: 'bg-yellow-100 text-yellow-700',
  SILVER: 'bg-gray-100 text-gray-600',
};

export default function AdminMembersPage() {
  const { users, approveUser, rejectUser, updateUserGrade } = useStore();
  const [tab, setTab] = useState<'all' | 'pending'>('all');

  const members = users.filter(u => u.role === 'member');
  const pendingCount = members.filter(u => u.status === 'pending').length;
  const filtered = tab === 'pending'
    ? members.filter(u => u.status === 'pending')
    : members;

  return (
    <div className="max-w-6xl">
      <div className="mb-6">
        <h2 className="text-xl font-bold text-gray-900">회원 관리</h2>
        <p className="text-sm text-gray-400 mt-1">회원 승인, 등급 변경</p>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-5">
        <button
          onClick={() => setTab('all')}
          className={`text-sm px-4 py-2 rounded-xl font-medium transition-all ${tab === 'all' ? 'bg-gray-900 text-white' : 'bg-white text-gray-500 border border-gray-200 hover:border-gray-400'}`}
        >
          전체 회원 <span className="ml-1 text-xs opacity-70">{members.length}</span>
        </button>
        <button
          onClick={() => setTab('pending')}
          className={`text-sm px-4 py-2 rounded-xl font-medium transition-all flex items-center gap-2 ${tab === 'pending' ? 'bg-gray-900 text-white' : 'bg-white text-gray-500 border border-gray-200 hover:border-gray-400'}`}
        >
          승인 대기
          {pendingCount > 0 && (
            <span className={`text-[11px] font-bold px-1.5 py-0.5 rounded-full ${tab === 'pending' ? 'bg-white text-gray-900' : 'bg-red-500 text-white'}`}>
              {pendingCount}
            </span>
          )}
        </button>
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
        {filtered.length === 0 ? (
          <div className="text-center py-16 text-gray-400 text-sm">
            {tab === 'pending' ? '승인 대기 중인 회원이 없습니다.' : '등록된 회원이 없습니다.'}
          </div>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50 text-xs text-gray-500 border-b border-gray-100">
                <th className="text-left px-5 py-3.5 font-medium">업체 / 담당자</th>
                <th className="text-left px-3 py-3.5 font-medium">이메일</th>
                <th className="text-center px-3 py-3.5 font-medium">유형</th>
                <th className="text-center px-3 py-3.5 font-medium">등급</th>
                <th className="text-center px-3 py-3.5 font-medium">상태</th>
                <th className="text-center px-3 py-3.5 font-medium">추천인</th>
                <th className="text-center px-3 py-3.5 font-medium">가입일</th>
                <th className="text-center px-3 py-3.5 font-medium">관리</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filtered.map(u => (
                <tr key={u.id} className="hover:bg-gray-50/50 transition-colors">
                  <td className="px-5 py-3.5">
                    <p className="font-semibold text-gray-800">{u.company}</p>
                    <p className="text-xs text-gray-400 mt-0.5">{u.name} · {u.phone}</p>
                  </td>
                  <td className="px-3 py-3.5 text-xs text-gray-500">{u.email}</td>
                  <td className="text-center px-3 py-3.5">
                    <span className={`text-[11px] px-2.5 py-1 rounded-lg font-medium ${u.memberType === 'chain' ? 'bg-indigo-50 text-indigo-600' : 'bg-gray-100 text-gray-600'}`}>
                      {u.memberType === 'chain' ? '체인점' : '외부업체'}
                    </span>
                  </td>
                  <td className="text-center px-3 py-3.5">
                    {u.status === 'approved' ? (
                      <select
                        value={u.grade}
                        onChange={e => updateUserGrade(u.id, e.target.value as UserGrade)}
                        className={`text-[11px] border rounded-lg px-2 py-1 font-medium cursor-pointer focus:outline-none focus:ring-2 focus:ring-gray-900/20 ${gradeBadge[u.grade]}`}
                        style={{ borderColor: 'transparent' }}
                      >
                        {gradeOptions.map(g => (
                          <option key={g} value={g}>{g}</option>
                        ))}
                      </select>
                    ) : (
                      <span className="text-xs text-gray-300">-</span>
                    )}
                  </td>
                  <td className="text-center px-3 py-3.5">
                    <span className={`text-[11px] px-2.5 py-1 rounded-lg font-medium ${
                      u.status === 'approved' ? 'bg-green-50 text-green-700' :
                      u.status === 'pending' ? 'bg-amber-50 text-amber-700' :
                      'bg-red-50 text-red-600'
                    }`}>
                      {u.status === 'approved' ? '승인됨' : u.status === 'pending' ? '대기중' : '거부됨'}
                    </span>
                  </td>
                  <td className="text-center px-3 py-3.5 text-xs text-gray-400">{u.referredBy || '-'}</td>
                  <td className="text-center px-3 py-3.5 text-xs text-gray-400">{u.createdAt}</td>
                  <td className="text-center px-3 py-3.5">
                    {u.status === 'pending' ? (
                      <div className="flex items-center justify-center gap-1.5">
                        <button
                          onClick={() => approveUser(u.id)}
                          className="text-[11px] bg-gray-900 text-white px-3 py-1.5 rounded-lg hover:bg-black font-medium transition-colors"
                        >
                          승인
                        </button>
                        <button
                          onClick={() => rejectUser(u.id)}
                          className="text-[11px] bg-white text-red-500 border border-red-200 px-3 py-1.5 rounded-lg hover:bg-red-50 font-medium transition-colors"
                        >
                          거부
                        </button>
                      </div>
                    ) : (
                      <span className="text-xs text-gray-300">-</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
