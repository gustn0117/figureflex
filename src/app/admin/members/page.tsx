'use client';
import { useState } from 'react';
import { useStore } from '@/store/useStore';
import type { UserGrade } from '@/types';

const gradeOptions: UserGrade[] = ['VVIP', 'VIP', 'GOLD', 'SILVER'];

export default function AdminMembersPage() {
  const { users, approveUser, rejectUser, updateUserGrade } = useStore();
  const [tab, setTab] = useState<'all' | 'pending'>('all');

  const members = users.filter(u => u.role === 'member');
  const filtered = tab === 'pending'
    ? members.filter(u => u.status === 'pending')
    : members;

  return (
    <div className="max-w-6xl">
      <h2 className="text-xl font-bold text-gray-800 mb-6">회원 관리</h2>

      <div className="flex gap-2 mb-4">
        <button
          onClick={() => setTab('all')}
          className={`text-xs px-3 py-1.5 rounded-full ${tab === 'all' ? 'bg-gray-900 text-white' : 'bg-gray-100 text-gray-600'}`}
        >
          전체 ({members.length})
        </button>
        <button
          onClick={() => setTab('pending')}
          className={`text-xs px-3 py-1.5 rounded-full ${tab === 'pending' ? 'bg-gray-900 text-white' : 'bg-gray-100 text-gray-600'}`}
        >
          승인대기 ({members.filter(u => u.status === 'pending').length})
        </button>
      </div>

      <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-gray-50 text-xs text-gray-500">
              <th className="text-left px-5 py-3 font-medium">업체명</th>
              <th className="text-left px-3 py-3 font-medium">담당자</th>
              <th className="text-left px-3 py-3 font-medium">이메일</th>
              <th className="text-center px-3 py-3 font-medium">유형</th>
              <th className="text-center px-3 py-3 font-medium">등급</th>
              <th className="text-center px-3 py-3 font-medium">상태</th>
              <th className="text-center px-3 py-3 font-medium">추천인</th>
              <th className="text-center px-3 py-3 font-medium">가입일</th>
              <th className="text-center px-3 py-3 font-medium">관리</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map(u => (
              <tr key={u.id} className="border-t border-gray-50 hover:bg-gray-50/50">
                <td className="px-5 py-3 font-medium">{u.company}</td>
                <td className="px-3 py-3">{u.name}</td>
                <td className="px-3 py-3 text-gray-500 text-xs">{u.email}</td>
                <td className="text-center px-3 py-3">
                  <span className="text-xs bg-gray-100 px-2 py-0.5 rounded-full">
                    {u.memberType === 'chain' ? '체인점' : '외부업체'}
                  </span>
                </td>
                <td className="text-center px-3 py-3">
                  {u.status === 'approved' ? (
                    <select
                      value={u.grade}
                      onChange={e => updateUserGrade(u.id, e.target.value as UserGrade)}
                      className="text-xs border border-gray-200 rounded-lg px-2 py-1 bg-white"
                    >
                      {gradeOptions.map(g => (
                        <option key={g} value={g}>{g}</option>
                      ))}
                    </select>
                  ) : (
                    <span className="text-xs text-gray-400">-</span>
                  )}
                </td>
                <td className="text-center px-3 py-3">
                  <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${
                    u.status === 'approved' ? 'bg-green-100 text-green-600' :
                    u.status === 'pending' ? 'bg-orange-100 text-orange-600' :
                    'bg-red-100 text-red-600'
                  }`}>
                    {u.status === 'approved' ? '승인' : u.status === 'pending' ? '대기' : '거부'}
                  </span>
                </td>
                <td className="text-center px-3 py-3 text-xs text-gray-400">{u.referredBy || '-'}</td>
                <td className="text-center px-3 py-3 text-xs text-gray-400">{u.createdAt}</td>
                <td className="text-center px-3 py-3">
                  {u.status === 'pending' && (
                    <div className="flex items-center justify-center gap-1">
                      <button
                        onClick={() => approveUser(u.id)}
                        className="text-[10px] bg-green-500 text-white px-2 py-1 rounded-lg hover:bg-green-600"
                      >
                        승인
                      </button>
                      <button
                        onClick={() => rejectUser(u.id)}
                        className="text-[10px] bg-red-500 text-white px-2 py-1 rounded-lg hover:bg-red-600"
                      >
                        거부
                      </button>
                    </div>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
