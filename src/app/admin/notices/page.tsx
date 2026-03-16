'use client';
import { useState } from 'react';
import { useStore } from '@/store/useStore';

export default function AdminNoticesPage() {
  const { notices, addNotice, updateNotice, deleteNotice } = useStore();
  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [form, setForm] = useState({ title: '', content: '', isImportant: false });

  const inputCls = "w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-accent/20 focus:border-accent bg-white";

  const resetForm = () => {
    setForm({ title: '', content: '', isImportant: false });
    setEditId(null);
    setShowForm(false);
  };

  const handleEdit = (n: any) => {
    setForm({ title: n.title, content: n.content, isImportant: n.isImportant });
    setEditId(n.id);
    setShowForm(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
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
        <div>
          <h2 className="text-xl font-bold text-gray-900">공지사항 관리</h2>
          <p className="text-sm text-gray-400 mt-1">회원에게 표시되는 공지사항</p>
        </div>
        <button onClick={() => { resetForm(); setShowForm(!showForm); }}
          className="bg-gray-900 text-white px-4 py-2.5 rounded-xl text-sm font-medium hover:bg-black transition-colors">
          {showForm ? '취소' : '공지 등록'}
        </button>
      </div>

      {showForm && (
        <div className="bg-white rounded-2xl border border-gray-100 p-6 mb-5">
          <h3 className="font-semibold text-gray-800 mb-4">{editId ? '공지 수정' : '공지 등록'}</h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs text-gray-500 mb-1.5">제목 *</label>
              <input type="text" value={form.title} onChange={e => setForm({...form, title: e.target.value})}
                className={inputCls} required placeholder="공지 제목을 입력하세요" />
            </div>
            <div>
              <label className="block text-xs text-gray-500 mb-1.5">내용 *</label>
              <textarea value={form.content} onChange={e => setForm({...form, content: e.target.value})}
                rows={5} className={`${inputCls} resize-none`} required placeholder="공지 내용을 입력하세요" />
            </div>
            <label className="flex items-center gap-2.5 cursor-pointer w-fit">
              <div
                onClick={() => setForm({...form, isImportant: !form.isImportant})}
                className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-colors cursor-pointer ${form.isImportant ? 'bg-accent border-accent' : 'border-gray-300 bg-white'}`}
              >
                {form.isImportant && (
                  <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                )}
              </div>
              <span className="text-sm text-gray-600">중요 공지로 설정</span>
            </label>
            <div className="flex gap-3 pt-1">
              <button type="submit" className="bg-gray-900 text-white px-6 py-2.5 rounded-xl text-sm font-medium hover:bg-black transition-colors">
                {editId ? '수정 완료' : '등록하기'}
              </button>
              <button type="button" onClick={resetForm} className="text-sm text-gray-400 hover:text-gray-600 px-4">취소</button>
            </div>
          </form>
        </div>
      )}

      <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
        {notices.length === 0 ? (
          <div className="text-center py-16 text-gray-400 text-sm">
            등록된 공지사항이 없습니다.
          </div>
        ) : (
          <div className="divide-y divide-gray-50">
            {notices.map(n => (
              <div key={n.id} className="flex items-center gap-3 px-5 py-4 hover:bg-gray-50/50 transition-colors">
                {n.isImportant && (
                  <span className="text-[10px] bg-accent text-white px-2 py-0.5 rounded-full font-semibold flex-shrink-0">중요</span>
                )}
                <span className="text-sm text-gray-800 flex-1 min-w-0 truncate">{n.title}</span>
                <span className="text-xs text-gray-400 flex-shrink-0">{n.createdAt}</span>
                <div className="flex gap-1 flex-shrink-0">
                  <button onClick={() => handleEdit(n)} className="text-xs text-blue-600 px-2.5 py-1.5 rounded-lg hover:bg-blue-50 font-medium transition-colors">수정</button>
                  <button onClick={() => { if(confirm('삭제하시겠습니까?')) deleteNotice(n.id) }} className="text-xs text-red-500 px-2.5 py-1.5 rounded-lg hover:bg-red-50 font-medium transition-colors">삭제</button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
