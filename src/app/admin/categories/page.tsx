'use client';
import { useState } from 'react';
import { useStore } from '@/store/useStore';

export default function AdminCategoriesPage() {
  const { categories, subCategories, addCategory, updateCategory, deleteCategory, addSubCategory, updateSubCategory, deleteSubCategory, fetchCategories } = useStore();
  const [newCat, setNewCat] = useState('');
  const [newSub, setNewSub] = useState({ name: '', parentId: '' });
  const [editId, setEditId] = useState<string | null>(null);
  const [editName, setEditName] = useState('');

  const productCategories = categories.filter(c => !['cat-notice', 'cat-inquiry'].includes(c.id));
  const inputCls = "flex-1 px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-accent/20 focus:border-accent bg-white";
  const btnCls = "bg-gray-900 text-white px-4 py-2.5 rounded-xl text-sm font-medium hover:bg-black transition-colors whitespace-nowrap";

  const handleAddCategory = () => {
    if (!newCat.trim()) return;
    addCategory({
      id: `cat-${Date.now()}`,
      name: newCat.trim(),
      slug: newCat.trim().toLowerCase().replace(/\s+/g, '-'),
      parentId: null,
      order: categories.length + 1,
    });
    setNewCat('');
  };

  const handleAddSub = () => {
    if (!newSub.name.trim() || !newSub.parentId) return;
    addSubCategory({
      id: `sub-${Date.now()}`,
      name: newSub.name.trim(),
      slug: newSub.name.trim().toLowerCase().replace(/\s+/g, '-'),
      parentId: newSub.parentId,
      order: subCategories.filter(sc => sc.parentId === newSub.parentId).length + 1,
    });
    setNewSub({ name: '', parentId: '' });
  };

  const handleSaveEdit = (id: string, isSub: boolean) => {
    if (isSub) updateSubCategory(id, { name: editName });
    else updateCategory(id, { name: editName });
    setEditId(null);
    setEditName('');
  };

  return (
    <div className="max-w-3xl">
      <div className="mb-6">
        <h2 className="text-xl font-bold text-gray-900">카테고리 관리</h2>
        <p className="text-sm text-gray-400 mt-1">상품 분류 카테고리 설정</p>
      </div>

      {/* Add forms */}
      <div className="grid grid-cols-2 gap-4 mb-7">
        <div className="bg-white rounded-2xl border border-gray-100 p-5">
          <h3 className="text-sm font-semibold text-gray-700 mb-3">대분류 추가</h3>
          <div className="flex gap-2">
            <input
              type="text" value={newCat} onChange={e => setNewCat(e.target.value)}
              placeholder="카테고리명"
              className={inputCls}
              onKeyDown={e => e.key === 'Enter' && handleAddCategory()}
            />
            <button onClick={handleAddCategory} className={btnCls}>추가</button>
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-gray-100 p-5">
          <h3 className="text-sm font-semibold text-gray-700 mb-3">중분류 추가</h3>
          <div className="flex gap-2">
            <select value={newSub.parentId} onChange={e => setNewSub({...newSub, parentId: e.target.value})}
              className="px-3 py-2.5 border border-gray-200 rounded-xl text-sm bg-white focus:outline-none focus:ring-2 focus:ring-accent/20">
              <option value="">대분류 선택</option>
              {productCategories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
            <input
              type="text" value={newSub.name} onChange={e => setNewSub({...newSub, name: e.target.value})}
              placeholder="중분류명"
              className={inputCls}
              onKeyDown={e => e.key === 'Enter' && handleAddSub()}
            />
            <button onClick={handleAddSub} className={btnCls}>추가</button>
          </div>
        </div>
      </div>

      {/* Category List */}
      <div className="space-y-3">
        {productCategories.map(cat => {
          const subs = subCategories.filter(sc => sc.parentId === cat.id);
          return (
            <div key={cat.id} className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
              {/* Main category header */}
              <div className="flex items-center justify-between px-5 py-3.5 bg-gray-50 border-b border-gray-100">
                <div className="flex items-center gap-2.5">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-gray-400">
                    <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z" />
                  </svg>
                  {editId === cat.id ? (
                    <div className="flex items-center gap-2">
                      <input value={editName} onChange={e => setEditName(e.target.value)}
                        className="px-3 py-1 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-accent/20"
                        autoFocus
                        onKeyDown={e => { if(e.key === 'Enter') handleSaveEdit(cat.id, false); if(e.key === 'Escape') setEditId(null); }}
                      />
                      <button onClick={() => handleSaveEdit(cat.id, false)} className="text-xs font-medium text-blue-600 hover:text-blue-800">저장</button>
                      <button onClick={() => setEditId(null)} className="text-xs text-gray-400">취소</button>
                    </div>
                  ) : (
                    <span className="font-semibold text-sm text-gray-800">{cat.name}</span>
                  )}
                  <span className="text-[11px] text-gray-400 bg-gray-100 px-2 py-0.5 rounded-full">{subs.length}개 하위</span>
                </div>
                {editId !== cat.id && (
                  <div className="flex items-center gap-1">
                    <button onClick={() => { setEditId(cat.id); setEditName(cat.name); }}
                      className="text-xs text-blue-600 px-2.5 py-1.5 rounded-lg hover:bg-blue-50 font-medium transition-colors">수정</button>
                    <button onClick={() => { if(confirm(`'${cat.name}' 카테고리를 삭제하시겠습니까? 하위 카테고리도 함께 삭제됩니다.`)) deleteCategory(cat.id) }}
                      className="text-xs text-red-500 px-2.5 py-1.5 rounded-lg hover:bg-red-50 font-medium transition-colors">삭제</button>
                  </div>
                )}
              </div>

              {/* Sub categories */}
              {subs.length > 0 && (
                <div className="divide-y divide-gray-50">
                  {subs.map(sub => (
                    <div key={sub.id} className="flex items-center justify-between px-5 py-3 hover:bg-gray-50/50">
                      <div className="flex items-center gap-2 pl-4">
                        <span className="text-gray-300 text-xs">└</span>
                        {editId === sub.id ? (
                          <div className="flex items-center gap-2">
                            <input value={editName} onChange={e => setEditName(e.target.value)}
                              className="px-3 py-1 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-accent/20"
                              autoFocus
                              onKeyDown={e => { if(e.key === 'Enter') handleSaveEdit(sub.id, true); if(e.key === 'Escape') setEditId(null); }}
                            />
                            <button onClick={() => handleSaveEdit(sub.id, true)} className="text-xs font-medium text-blue-600 hover:text-blue-800">저장</button>
                            <button onClick={() => setEditId(null)} className="text-xs text-gray-400">취소</button>
                          </div>
                        ) : (
                          <span className="text-sm text-gray-600">{sub.name}</span>
                        )}
                      </div>
                      {editId !== sub.id && (
                        <div className="flex items-center gap-1">
                          <button onClick={() => { setEditId(sub.id); setEditName(sub.name); }}
                            className="text-xs text-blue-600 px-2.5 py-1.5 rounded-lg hover:bg-blue-50 font-medium transition-colors">수정</button>
                          <button onClick={() => deleteSubCategory(sub.id)}
                            className="text-xs text-red-500 px-2.5 py-1.5 rounded-lg hover:bg-red-50 font-medium transition-colors">삭제</button>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}

              {subs.length === 0 && (
                <div className="px-5 py-3 text-xs text-gray-300 pl-9">하위 카테고리 없음</div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
