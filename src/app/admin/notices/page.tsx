'use client';
import { useState } from 'react';
import { useStore } from '@/store/useStore';

export default function AdminNoticesPage() {
  const { notices, addNotice, updateNotice, deleteNotice } = useStore();
  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [form, setForm] = useState({ title: '', content: '', isImportant: false });

  const resetForm = () => {
    setForm({ title: '', content: '', isImportant: false });
    setEditId(null);
    setShowForm(false);
  };

  const handleEdit = (n: any) => {
    setForm({ title: n.title, content: n.content, isImportant: n.isImportant });
    setEditId(n.id);
    setShowForm(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editId) {
      updateNotice(editId, form);
    } else {
      addNotice({
        id: `notice-${Date.now()}`,
        ...form,
        createdAt: new Date().toISOString().split('T')[0],
      });
    }
    resetForm();
  };

  return (
    <div className="max-w-4xl">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-gray-800">공지사항 관리</h2>
        <button onClick={() => { resetForm(); setShowForm(!showForm); }}
          className="bg-gray-900 text-white px-4 py-2 rounded-xl text-sm font-medium hover:bg-black">
          {showForm ? '취소' : '공지 등록'}
        </button>
      </div>

      {showForm && (
        <div className="bg-white rounded-xl border border-gray-100 p-6 mb-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs text-gray-500 mb-1">제목 *</label>
              <input type="text" value={form.title} onChange={e => setForm({...form, title: e.target.value})}
                className="w-full px-4 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-gray-900/20" required />
            </div>
            <div>
              <label className="block text-xs text-gray-500 mb-1">내용 *</label>
              <textarea value={form.content} onChange={e => setForm({...form, content: e.target.value})}
                rows={4} className="w-full px-4 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-gray-900/20 resize-none" required />
            </div>
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" checked={form.isImportant} onChange={e => setForm({...form, isImportant: e.target.checked})}
                className="rounded" />
              <span className="text-sm text-gray-600">중요 공지</span>
            </label>
            <button type="submit" className="bg-gray-900 text-white px-6 py-2.5 rounded-xl text-sm font-medium hover:bg-black">
              {editId ? '수정' : '등록'}
            </button>
          </form>
        </div>
      )}

      <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
        {notices.map(n => (
          <div key={n.id} className="flex items-center gap-3 px-5 py-3 border-b border-gray-50 last:border-0 hover:bg-gray-50/50">
            {n.isImportant && <span className="text-[10px] bg-highlight text-white px-2 py-0.5 rounded-full">중요</span>}
            <span className="text-sm flex-1">{n.title}</span>
            <span className="text-xs text-gray-400">{n.createdAt}</span>
            <button onClick={() => handleEdit(n)} className="text-[10px] text-blue-600 px-2 py-1 rounded-lg hover:bg-blue-50">수정</button>
            <button onClick={() => deleteNotice(n.id)} className="text-[10px] text-red-600 px-2 py-1 rounded-lg hover:bg-red-50">삭제</button>
          </div>
        ))}
      </div>
    </div>
  );
}
