'use client';
import { useState } from 'react';
import { useStore } from '@/store/useStore';
import { GRADE_DISCOUNTS } from '@/data/mockData';
import type { Product, UserGrade } from '@/types';

export default function AdminProductsPage() {
  const { products, categories, subCategories, addProduct, updateProduct, deleteProduct } = useStore();
  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [imagePreview, setImagePreview] = useState('');
  const [form, setForm] = useState({
    name: '', description: '', categoryId: '', subCategoryId: '',
    basePrice: 0, minQuantity: 1, maxQuantity: 100, stock: 100,
    saleStartDate: '', saleEndDate: '',
  });

  const productCategories = categories.filter(c => !['cat-notice', 'cat-inquiry'].includes(c.id));

  const resetForm = () => {
    setForm({ name: '', description: '', categoryId: '', subCategoryId: '', basePrice: 0, minQuantity: 1, maxQuantity: 100, stock: 100, saleStartDate: '', saleEndDate: '' });
    setImagePreview('');
    setEditId(null);
    setShowForm(false);
  };

  const handleEdit = (p: Product) => {
    setForm({
      name: p.name, description: p.description, categoryId: p.categoryId,
      subCategoryId: p.subCategoryId, basePrice: p.basePrice,
      minQuantity: p.minQuantity, maxQuantity: p.maxQuantity, stock: p.stock,
      saleStartDate: p.saleStartDate, saleEndDate: p.saleEndDate,
    });
    setImagePreview(p.imageUrl || '');
    setEditId(p.id);
    setShowForm(true);
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => setImagePreview(reader.result as string);
    reader.readAsDataURL(file);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const base = form.basePrice;
    const prices: Record<UserGrade, number> = {
      VVIP: Math.round(base * (1 - GRADE_DISCOUNTS.VVIP)),
      VIP: Math.round(base * (1 - GRADE_DISCOUNTS.VIP)),
      GOLD: Math.round(base * (1 - GRADE_DISCOUNTS.GOLD)),
      SILVER: Math.round(base * (1 - GRADE_DISCOUNTS.SILVER)),
    };

    if (editId) {
      updateProduct(editId, { ...form, prices, imageUrl: imagePreview, status: 'sale' });
    } else {
      addProduct({
        id: `prod-${Date.now()}`,
        ...form,
        prices,
        imageUrl: imagePreview,
        status: 'sale',
        createdAt: new Date().toISOString().split('T')[0],
      });
    }
    resetForm();
  };

  const filteredSubs = subCategories.filter(sc => sc.parentId === form.categoryId);

  return (
    <div className="max-w-6xl">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-gray-800">상품 관리</h2>
        <button
          onClick={() => { resetForm(); setShowForm(!showForm); }}
          className="bg-gray-900 text-white px-4 py-2 rounded-xl text-sm font-medium hover:bg-black"
        >
          {showForm ? '취소' : '상품 등록'}
        </button>
      </div>

      {showForm && (
        <div className="bg-white rounded-xl border border-gray-100 p-6 mb-6">
          <h3 className="font-bold text-gray-700 mb-4">{editId ? '상품 수정' : '상품 등록'}</h3>
          <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-4">
            {/* Image Upload */}
            <div className="col-span-2">
              <label className="block text-xs text-gray-500 mb-1">상품 이미지</label>
              <div className="flex items-start gap-4">
                <label className="cursor-pointer group">
                  <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
                  {imagePreview && !imagePreview.startsWith('/images/') ? (
                    <div className="w-32 h-32 rounded-xl border-2 border-dashed border-gray-200 overflow-hidden group-hover:border-accent transition-colors relative">
                      <img src={imagePreview} alt="상품 이미지" className="w-full h-full object-cover" />
                      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-all flex items-center justify-center">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="opacity-0 group-hover:opacity-100 transition-opacity">
                          <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><polyline points="17 8 12 3 7 8" /><line x1="12" y1="3" x2="12" y2="15" />
                        </svg>
                      </div>
                    </div>
                  ) : (
                    <div className="w-32 h-32 rounded-xl border-2 border-dashed border-gray-200 flex flex-col items-center justify-center gap-2 group-hover:border-accent transition-colors bg-gray-50">
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-gray-400">
                        <rect x="3" y="3" width="18" height="18" rx="2" ry="2" /><circle cx="8.5" cy="8.5" r="1.5" /><polyline points="21 15 16 10 5 21" />
                      </svg>
                      <span className="text-[10px] text-gray-400">이미지 업로드</span>
                    </div>
                  )}
                </label>
                {imagePreview && !imagePreview.startsWith('/images/') && (
                  <button type="button" onClick={() => setImagePreview('')} className="text-xs text-red-500 hover:text-red-700 mt-1">삭제</button>
                )}
              </div>
            </div>

            <div className="col-span-2">
              <label className="block text-xs text-gray-500 mb-1">상품명 *</label>
              <input type="text" value={form.name} onChange={e => setForm({...form, name: e.target.value})}
                className="w-full px-4 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-gray-900/20" required />
            </div>
            <div className="col-span-2">
              <label className="block text-xs text-gray-500 mb-1">설명</label>
              <textarea value={form.description} onChange={e => setForm({...form, description: e.target.value})}
                rows={2} className="w-full px-4 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-gray-900/20 resize-none" />
            </div>
            <div>
              <label className="block text-xs text-gray-500 mb-1">대분류 *</label>
              <select value={form.categoryId} onChange={e => setForm({...form, categoryId: e.target.value, subCategoryId: ''})}
                className="w-full px-4 py-2 border border-gray-200 rounded-xl text-sm bg-white focus:outline-none focus:ring-2 focus:ring-gray-900/20" required>
                <option value="">선택</option>
                {productCategories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs text-gray-500 mb-1">중분류</label>
              <select value={form.subCategoryId} onChange={e => setForm({...form, subCategoryId: e.target.value})}
                className="w-full px-4 py-2 border border-gray-200 rounded-xl text-sm bg-white focus:outline-none focus:ring-2 focus:ring-gray-900/20">
                <option value="">없음</option>
                {filteredSubs.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs text-gray-500 mb-1">기본가 (원) *</label>
              <input type="number" value={form.basePrice} onChange={e => setForm({...form, basePrice: Number(e.target.value)})}
                className="w-full px-4 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-gray-900/20" required />
              <p className="text-[10px] text-gray-400 mt-1">VVIP:{Math.round(form.basePrice*0.7).toLocaleString()} / VIP:{Math.round(form.basePrice*0.8).toLocaleString()} / GOLD:{Math.round(form.basePrice*0.9).toLocaleString()} / SILVER:{Math.round(form.basePrice*0.95).toLocaleString()}</p>
            </div>
            <div>
              <label className="block text-xs text-gray-500 mb-1">재고</label>
              <input type="number" value={form.stock} onChange={e => setForm({...form, stock: Number(e.target.value)})}
                className="w-full px-4 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-gray-900/20" />
            </div>
            <div>
              <label className="block text-xs text-gray-500 mb-1">최소 주문수량</label>
              <input type="number" value={form.minQuantity} onChange={e => setForm({...form, minQuantity: Number(e.target.value)})}
                className="w-full px-4 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-gray-900/20" />
            </div>
            <div>
              <label className="block text-xs text-gray-500 mb-1">최대 주문수량</label>
              <input type="number" value={form.maxQuantity} onChange={e => setForm({...form, maxQuantity: Number(e.target.value)})}
                className="w-full px-4 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-gray-900/20" />
            </div>
            <div>
              <label className="block text-xs text-gray-500 mb-1">판매 시작일 *</label>
              <input type="date" value={form.saleStartDate} onChange={e => setForm({...form, saleStartDate: e.target.value})}
                className="w-full px-4 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-gray-900/20" required />
            </div>
            <div>
              <label className="block text-xs text-gray-500 mb-1">판매 종료일 *</label>
              <input type="date" value={form.saleEndDate} onChange={e => setForm({...form, saleEndDate: e.target.value})}
                className="w-full px-4 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-gray-900/20" required />
            </div>
            <div className="col-span-2">
              <button type="submit" className="bg-gray-900 text-white px-6 py-2.5 rounded-xl text-sm font-medium hover:bg-black">
                {editId ? '수정' : '등록'}
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-gray-50 text-xs text-gray-500">
              <th className="text-left px-4 py-3 font-medium w-12">이미지</th>
              <th className="text-left px-3 py-3 font-medium">상품명</th>
              <th className="text-center px-3 py-3 font-medium">카테고리</th>
              <th className="text-right px-3 py-3 font-medium">기본가</th>
              <th className="text-center px-3 py-3 font-medium">수량</th>
              <th className="text-center px-3 py-3 font-medium">상태</th>
              <th className="text-center px-3 py-3 font-medium">관리</th>
            </tr>
          </thead>
          <tbody>
            {products.map(p => {
              const cat = categories.find(c => c.id === p.categoryId);
              const today = new Date().toISOString().split('T')[0];
              const isExpired = p.saleEndDate < today;
              const hasImg = p.imageUrl && p.imageUrl.length > 0 && !p.imageUrl.startsWith('/images/');
              return (
                <tr key={p.id} className="border-t border-gray-50 hover:bg-gray-50/50">
                  <td className="px-4 py-2">
                    <div className="w-10 h-10 rounded-lg overflow-hidden bg-gray-100 flex items-center justify-center">
                      {hasImg ? (
                        <img src={p.imageUrl} alt="" className="w-full h-full object-cover" />
                      ) : (
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-gray-300">
                          <rect x="3" y="3" width="18" height="18" rx="2" ry="2" /><circle cx="8.5" cy="8.5" r="1.5" /><polyline points="21 15 16 10 5 21" />
                        </svg>
                      )}
                    </div>
                  </td>
                  <td className="px-3 py-3 font-medium">{p.name}</td>
                  <td className="text-center px-3 py-3 text-xs text-gray-500">{cat?.name}</td>
                  <td className="text-right px-3 py-3">{p.basePrice.toLocaleString()}원</td>
                  <td className="text-center px-3 py-3 text-xs">{p.minQuantity}~{p.maxQuantity}</td>
                  <td className="text-center px-3 py-3">
                    <span className={`text-[10px] px-2 py-0.5 rounded-full ${isExpired ? 'bg-red-100 text-red-600' : 'bg-green-100 text-green-600'}`}>
                      {isExpired ? '종료' : '판매중'}
                    </span>
                  </td>
                  <td className="text-center px-3 py-3">
                    <div className="flex items-center justify-center gap-1">
                      <button onClick={() => handleEdit(p)} className="text-[10px] bg-blue-50 text-blue-600 px-2 py-1 rounded-lg hover:bg-blue-100">수정</button>
                      <button onClick={() => deleteProduct(p.id)} className="text-[10px] bg-red-50 text-red-600 px-2 py-1 rounded-lg hover:bg-red-100">삭제</button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
