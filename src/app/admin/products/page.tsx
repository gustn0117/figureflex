'use client';
import { useState } from 'react';
import { useStore } from '@/store/useStore';
import { GRADE_DISCOUNTS } from '@/data/mockData';
import type { Product, UserGrade } from '@/types';

export default function AdminProductsPage() {
  const { products, categories, subCategories, addProduct, updateProduct, deleteProduct } = useStore();
  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [form, setForm] = useState({
    name: '', description: '', categoryId: '', subCategoryId: '',
    basePrice: 0, minQuantity: 1, maxQuantity: 100, stock: 100,
    saleStartDate: '', saleEndDate: '',
  });

  const productCategories = categories.filter(c => !['cat-notice', 'cat-inquiry'].includes(c.id));

  const resetForm = () => {
    setForm({ name: '', description: '', categoryId: '', subCategoryId: '', basePrice: 0, minQuantity: 1, maxQuantity: 100, stock: 100, saleStartDate: '', saleEndDate: '' });
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
    setEditId(p.id);
    setShowForm(true);
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
      updateProduct(editId, { ...form, prices, status: 'sale' });
    } else {
      addProduct({
        id: `prod-${Date.now()}`,
        ...form,
        prices,
        imageUrl: '',
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
              <th className="text-left px-5 py-3 font-medium">상품명</th>
              <th className="text-center px-3 py-3 font-medium">카테고리</th>
              <th className="text-right px-3 py-3 font-medium">기본가</th>
              <th className="text-center px-3 py-3 font-medium">수량</th>
              <th className="text-center px-3 py-3 font-medium">기간</th>
              <th className="text-center px-3 py-3 font-medium">상태</th>
              <th className="text-center px-3 py-3 font-medium">관리</th>
            </tr>
          </thead>
          <tbody>
            {products.map(p => {
              const cat = categories.find(c => c.id === p.categoryId);
              const today = new Date().toISOString().split('T')[0];
              const isExpired = p.saleEndDate < today;
              return (
                <tr key={p.id} className="border-t border-gray-50 hover:bg-gray-50/50">
                  <td className="px-5 py-3">{p.name}</td>
                  <td className="text-center px-3 py-3 text-xs text-gray-500">{cat?.name}</td>
                  <td className="text-right px-3 py-3">{p.basePrice.toLocaleString()}원</td>
                  <td className="text-center px-3 py-3 text-xs">{p.minQuantity}~{p.maxQuantity}</td>
                  <td className="text-center px-3 py-3 text-xs text-gray-400">{p.saleStartDate} ~ {p.saleEndDate}</td>
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
