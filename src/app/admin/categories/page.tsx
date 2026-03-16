'use client';
import { useState } from 'react';
import { useStore } from '@/store/useStore';

export default function AdminCategoriesPage() {
  const { categories, subCategories, addCategory, updateCategory, deleteCategory, addSubCategory, updateSubCategory, deleteSubCategory } = useStore();
  const [newCat, setNewCat] = useState('');
  const [newSub, setNewSub] = useState({ name: '', parentId: '' });
  const [editId, setEditId] = useState<string | null>(null);
  const [editName, setEditName] = useState('');

  const productCategories = categories.filter(c => !['cat-notice', 'cat-inquiry'].includes(c.id));

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
    <div className="max-w-4xl">
      <h2 className="text-xl font-bold text-gray-800 mb-6">카테고리 관리</h2>

      {/* Add Category */}
      <div className="bg-white rounded-xl border border-gray-100 p-5 mb-4">
        <h3 className="font-medium text-sm text-gray-700 mb-3">대분류 추가</h3>
        <div className="flex gap-2">
          <input
            type="text" value={newCat} onChange={e => setNewCat(e.target.value)}
            placeholder="카테고리명 입력"
            className="flex-1 px-4 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-gray-900/20"
          />
          <button onClick={handleAddCategory} className="bg-gray-900 text-white px-4 py-2 rounded-xl text-sm hover:bg-black">추가</button>
        </div>
      </div>

      {/* Add SubCategory */}
      <div className="bg-white rounded-xl border border-gray-100 p-5 mb-6">
        <h3 className="font-medium text-sm text-gray-700 mb-3">중분류 추가</h3>
        <div className="flex gap-2">
          <select value={newSub.parentId} onChange={e => setNewSub({...newSub, parentId: e.target.value})}
            className="px-4 py-2 border border-gray-200 rounded-xl text-sm bg-white focus:outline-none focus:ring-2 focus:ring-gray-900/20">
            <option value="">대분류 선택</option>
            {productCategories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
          </select>
          <input
            type="text" value={newSub.name} onChange={e => setNewSub({...newSub, name: e.target.value})}
            placeholder="중분류명 입력"
            className="flex-1 px-4 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-gray-900/20"
          />
          <button onClick={handleAddSub} className="bg-gray-900 text-white px-4 py-2 rounded-xl text-sm hover:bg-black">추가</button>
        </div>
      </div>

      {/* Category List */}
      <div className="space-y-3">
        {productCategories.map(cat => {
          const subs = subCategories.filter(sc => sc.parentId === cat.id);
          return (
            <div key={cat.id} className="bg-white rounded-xl border border-gray-100 overflow-hidden">
              <div className="flex items-center justify-between px-5 py-3 bg-gray-50">
                {editId === cat.id ? (
                  <div className="flex items-center gap-2">
                    <input value={editName} onChange={e => setEditName(e.target.value)}
                      className="px-3 py-1 border border-gray-200 rounded-lg text-sm" />
                    <button onClick={() => handleSaveEdit(cat.id, false)} className="text-xs text-blue-600">저장</button>
                    <button onClick={() => setEditId(null)} className="text-xs text-gray-400">취소</button>
                  </div>
                ) : (
                  <span className="font-medium text-sm">{cat.name}</span>
                )}
                <div className="flex items-center gap-1">
                  <button onClick={() => { setEditId(cat.id); setEditName(cat.name); }}
                    className="text-[10px] text-blue-600 px-2 py-1 rounded-lg hover:bg-blue-50">수정</button>
                  <button onClick={() => deleteCategory(cat.id)}
                    className="text-[10px] text-red-600 px-2 py-1 rounded-lg hover:bg-red-50">삭제</button>
                </div>
              </div>
              {subs.length > 0 && (
                <div className="px-5 py-2">
                  {subs.map(sub => (
                    <div key={sub.id} className="flex items-center justify-between py-1.5 border-b border-gray-50 last:border-0">
                      {editId === sub.id ? (
                        <div className="flex items-center gap-2">
                          <input value={editName} onChange={e => setEditName(e.target.value)}
                            className="px-3 py-1 border border-gray-200 rounded-lg text-sm" />
                          <button onClick={() => handleSaveEdit(sub.id, true)} className="text-xs text-blue-600">저장</button>
                          <button onClick={() => setEditId(null)} className="text-xs text-gray-400">취소</button>
                        </div>
                      ) : (
                        <span className="text-sm text-gray-600 pl-4">└ {sub.name}</span>
                      )}
                      <div className="flex items-center gap-1">
                        <button onClick={() => { setEditId(sub.id); setEditName(sub.name); }}
                          className="text-[10px] text-blue-600 px-2 py-1 rounded-lg hover:bg-blue-50">수정</button>
                        <button onClick={() => deleteSubCategory(sub.id)}
                          className="text-[10px] text-red-600 px-2 py-1 rounded-lg hover:bg-red-50">삭제</button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
