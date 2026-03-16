'use client';
import { useState } from 'react';
import { useStore } from '@/store/useStore';
import { GRADE_DISCOUNTS } from '@/data/mockData';
import type { Product, UserGrade } from '@/types';

export default function AdminProductsPage() {
  const { products, categories, subCategories, addProduct, updateProduct, deleteProduct } = useStore();
  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [mainImage, setMainImage] = useState('');
  const [subImages, setSubImages] = useState<string[]>([]);
  const [form, setForm] = useState({
    name: '', description: '', detailContent: '', categoryId: '', subCategoryId: '',
    basePrice: 0, minQuantity: 1, maxQuantity: 100, stock: 100,
    saleStartDate: '', saleEndDate: '', origin: '', manufacturer: '',
  });

  const productCategories = categories.filter(c => !['cat-notice', 'cat-inquiry'].includes(c.id));
  const inputCls = "w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-accent/20 focus:border-accent bg-white";

  const resetForm = () => {
    setForm({ name: '', description: '', detailContent: '', categoryId: '', subCategoryId: '', basePrice: 0, minQuantity: 1, maxQuantity: 100, stock: 100, saleStartDate: '', saleEndDate: '', origin: '', manufacturer: '' });
    setMainImage('');
    setSubImages([]);
    setEditId(null);
    setShowForm(false);
  };

  const handleEdit = (p: Product) => {
    setForm({
      name: p.name, description: p.description, detailContent: p.detailContent || '',
      categoryId: p.categoryId, subCategoryId: p.subCategoryId, basePrice: p.basePrice,
      minQuantity: p.minQuantity, maxQuantity: p.maxQuantity, stock: p.stock,
      saleStartDate: p.saleStartDate, saleEndDate: p.saleEndDate,
      origin: p.origin || '', manufacturer: p.manufacturer || '',
    });
    setMainImage(p.imageUrl || '');
    setSubImages(p.images || []);
    setEditId(p.id);
    setShowForm(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const readFile = (file: File): Promise<string> =>
    new Promise(resolve => {
      const r = new FileReader();
      r.onloadend = () => resolve(r.result as string);
      r.readAsDataURL(file);
    });

  const handleMainImage = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) setMainImage(await readFile(file));
  };

  const handleSubImages = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;
    const newImages: string[] = [];
    for (let i = 0; i < Math.min(files.length, 5 - subImages.length); i++) {
      newImages.push(await readFile(files[i]));
    }
    setSubImages(prev => [...prev, ...newImages]);
  };

  const removeSubImage = (idx: number) => {
    setSubImages(prev => prev.filter((_, i) => i !== idx));
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

    const productData = {
      ...form, prices,
      imageUrl: mainImage,
      images: subImages,
      status: 'sale' as const,
    };

    if (editId) {
      updateProduct(editId, productData);
    } else {
      addProduct({ id: `prod-${Date.now()}`, ...productData, createdAt: new Date().toISOString().split('T')[0] });
    }
    resetForm();
  };

  const filteredSubs = subCategories.filter(sc => sc.parentId === form.categoryId);
  const hasImg = (url: string) => url && url.length > 0 && !url.startsWith('/images/');

  return (
    <div className="max-w-6xl">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-gray-800">상품 관리</h2>
        <button onClick={() => { resetForm(); setShowForm(!showForm); }}
          className="bg-gray-900 text-white px-4 py-2 rounded-xl text-sm font-medium hover:bg-black">
          {showForm ? '취소' : '상품 등록'}
        </button>
      </div>

      {showForm && (
        <div className="bg-white rounded-2xl border border-gray-100 p-6 mb-6">
          <h3 className="font-bold text-gray-800 mb-5 text-lg">{editId ? '상품 수정' : '상품 등록'}</h3>
          <form onSubmit={handleSubmit} className="space-y-6">

            {/* Images Section */}
            <div>
              <p className="text-sm font-semibold text-gray-700 mb-3">상품 이미지</p>
              <div className="flex gap-3 flex-wrap">
                {/* Main image */}
                <label className="cursor-pointer group">
                  <input type="file" accept="image/*" onChange={handleMainImage} className="hidden" />
                  {hasImg(mainImage) ? (
                    <div className="w-28 h-28 rounded-xl border-2 border-accent overflow-hidden relative">
                      <img src={mainImage} alt="" className="w-full h-full object-cover" />
                      <span className="absolute bottom-0 left-0 right-0 bg-accent text-white text-[10px] text-center py-0.5 font-semibold">대표</span>
                      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all" />
                    </div>
                  ) : (
                    <div className="w-28 h-28 rounded-xl border-2 border-dashed border-gray-300 flex flex-col items-center justify-center gap-1.5 group-hover:border-accent transition-colors bg-gray-50">
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-gray-400">
                        <rect x="3" y="3" width="18" height="18" rx="2" /><circle cx="8.5" cy="8.5" r="1.5" /><polyline points="21 15 16 10 5 21" />
                      </svg>
                      <span className="text-[10px] text-gray-400 font-medium">대표 이미지</span>
                    </div>
                  )}
                </label>

                {/* Sub images */}
                {subImages.map((img, idx) => (
                  <div key={idx} className="w-28 h-28 rounded-xl border border-gray-200 overflow-hidden relative group">
                    <img src={img} alt="" className="w-full h-full object-cover" />
                    <button type="button" onClick={() => removeSubImage(idx)}
                      className="absolute top-1 right-1 w-5 h-5 bg-black/60 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                      <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>
                    </button>
                    <span className="absolute bottom-0 left-0 right-0 bg-black/40 text-white text-[9px] text-center py-0.5">{idx + 1}</span>
                  </div>
                ))}

                {/* Add sub image button */}
                {subImages.length < 5 && (
                  <label className="cursor-pointer">
                    <input type="file" accept="image/*" multiple onChange={handleSubImages} className="hidden" />
                    <div className="w-28 h-28 rounded-xl border-2 border-dashed border-gray-200 flex flex-col items-center justify-center gap-1.5 hover:border-gray-400 transition-colors bg-gray-50">
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-gray-400">
                        <line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" />
                      </svg>
                      <span className="text-[10px] text-gray-400">추가 ({subImages.length}/5)</span>
                    </div>
                  </label>
                )}
              </div>
            </div>

            {/* Basic Info */}
            <div>
              <p className="text-sm font-semibold text-gray-700 mb-3">기본 정보</p>
              <div className="grid grid-cols-2 gap-3">
                <div className="col-span-2">
                  <label className="block text-xs text-gray-500 mb-1">상품명 *</label>
                  <input type="text" value={form.name} onChange={e => setForm({...form, name: e.target.value})} className={inputCls} required placeholder="상품명을 입력하세요" />
                </div>
                <div className="col-span-2">
                  <label className="block text-xs text-gray-500 mb-1">간단 설명</label>
                  <input type="text" value={form.description} onChange={e => setForm({...form, description: e.target.value})} className={inputCls} placeholder="상품 리스트에 표시되는 한 줄 설명" />
                </div>
                <div>
                  <label className="block text-xs text-gray-500 mb-1">대분류 *</label>
                  <select value={form.categoryId} onChange={e => setForm({...form, categoryId: e.target.value, subCategoryId: ''})} className={inputCls} required>
                    <option value="">선택</option>
                    {productCategories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-xs text-gray-500 mb-1">중분류</label>
                  <select value={form.subCategoryId} onChange={e => setForm({...form, subCategoryId: e.target.value})} className={inputCls}>
                    <option value="">없음</option>
                    {filteredSubs.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-xs text-gray-500 mb-1">원산지</label>
                  <input type="text" value={form.origin} onChange={e => setForm({...form, origin: e.target.value})} className={inputCls} placeholder="예: 일본" />
                </div>
                <div>
                  <label className="block text-xs text-gray-500 mb-1">제조사</label>
                  <input type="text" value={form.manufacturer} onChange={e => setForm({...form, manufacturer: e.target.value})} className={inputCls} placeholder="예: 반다이" />
                </div>
              </div>
            </div>

            {/* Price & Quantity */}
            <div>
              <p className="text-sm font-semibold text-gray-700 mb-3">가격 / 수량</p>
              <div className="grid grid-cols-4 gap-3">
                <div>
                  <label className="block text-xs text-gray-500 mb-1">기본가 (원) *</label>
                  <input type="number" value={form.basePrice || ''} onChange={e => setForm({...form, basePrice: Number(e.target.value)})} className={inputCls} required placeholder="0" />
                </div>
                <div>
                  <label className="block text-xs text-gray-500 mb-1">재고</label>
                  <input type="number" value={form.stock || ''} onChange={e => setForm({...form, stock: Number(e.target.value)})} className={inputCls} />
                </div>
                <div>
                  <label className="block text-xs text-gray-500 mb-1">최소 주문</label>
                  <input type="number" value={form.minQuantity || ''} onChange={e => setForm({...form, minQuantity: Number(e.target.value)})} className={inputCls} />
                </div>
                <div>
                  <label className="block text-xs text-gray-500 mb-1">최대 주문</label>
                  <input type="number" value={form.maxQuantity || ''} onChange={e => setForm({...form, maxQuantity: Number(e.target.value)})} className={inputCls} />
                </div>
              </div>
              {form.basePrice > 0 && (
                <div className="mt-2 bg-gray-50 rounded-lg p-3 grid grid-cols-4 gap-2 text-xs">
                  {(['VVIP', 'VIP', 'GOLD', 'SILVER'] as const).map(g => (
                    <div key={g} className="flex items-center justify-between">
                      <span className="text-gray-400">{g}</span>
                      <span className="font-semibold text-gray-700">{Math.round(form.basePrice * (1 - GRADE_DISCOUNTS[g])).toLocaleString()}원</span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Sale Period */}
            <div>
              <p className="text-sm font-semibold text-gray-700 mb-3">판매 기간</p>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs text-gray-500 mb-1">판매 시작일 *</label>
                  <input type="date" value={form.saleStartDate} onChange={e => setForm({...form, saleStartDate: e.target.value})} className={inputCls} required />
                </div>
                <div>
                  <label className="block text-xs text-gray-500 mb-1">판매 종료일 *</label>
                  <input type="date" value={form.saleEndDate} onChange={e => setForm({...form, saleEndDate: e.target.value})} className={inputCls} required />
                </div>
              </div>
            </div>

            {/* Detail Content */}
            <div>
              <p className="text-sm font-semibold text-gray-700 mb-3">상세 설명</p>
              <textarea value={form.detailContent} onChange={e => setForm({...form, detailContent: e.target.value})}
                rows={6} className={`${inputCls} resize-none`} placeholder="상품 상세 페이지에 표시되는 상세 설명을 입력하세요. 줄바꿈이 그대로 반영됩니다." />
            </div>

            {/* Submit */}
            <div className="flex gap-3 pt-2">
              <button type="submit" className="bg-gray-900 text-white px-8 py-3 rounded-xl text-sm font-semibold hover:bg-black">
                {editId ? '수정 완료' : '상품 등록'}
              </button>
              <button type="button" onClick={resetForm} className="text-sm text-gray-400 hover:text-gray-600 px-4">취소</button>
            </div>
          </form>
        </div>
      )}

      {/* Product List */}
      <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-gray-50 text-xs text-gray-500">
              <th className="text-left px-4 py-3 font-medium w-14">이미지</th>
              <th className="text-left px-3 py-3 font-medium">상품명</th>
              <th className="text-center px-3 py-3 font-medium">카테고리</th>
              <th className="text-right px-3 py-3 font-medium">기본가</th>
              <th className="text-center px-3 py-3 font-medium">재고</th>
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
                  <td className="px-4 py-2">
                    <div className="w-10 h-10 rounded-lg overflow-hidden bg-gray-100 flex items-center justify-center">
                      {hasImg(p.imageUrl) ? (
                        <img src={p.imageUrl} alt="" className="w-full h-full object-cover" />
                      ) : (
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-gray-300">
                          <rect x="3" y="3" width="18" height="18" rx="2" /><circle cx="8.5" cy="8.5" r="1.5" /><polyline points="21 15 16 10 5 21" />
                        </svg>
                      )}
                    </div>
                  </td>
                  <td className="px-3 py-3">
                    <p className="font-medium text-gray-800">{p.name}</p>
                    <p className="text-[11px] text-gray-400 mt-0.5">{p.manufacturer || ''} {p.origin ? `/ ${p.origin}` : ''}</p>
                  </td>
                  <td className="text-center px-3 py-3 text-xs text-gray-500">{cat?.name}</td>
                  <td className="text-right px-3 py-3 font-medium">{p.basePrice.toLocaleString()}원</td>
                  <td className="text-center px-3 py-3 text-xs">{p.stock}</td>
                  <td className="text-center px-3 py-3">
                    <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${isExpired ? 'bg-red-100 text-red-600' : 'bg-green-100 text-green-600'}`}>
                      {isExpired ? '종료' : '판매중'}
                    </span>
                  </td>
                  <td className="text-center px-3 py-3">
                    <div className="flex items-center justify-center gap-1">
                      <button onClick={() => handleEdit(p)} className="text-[10px] bg-blue-50 text-blue-600 px-2.5 py-1 rounded-lg hover:bg-blue-100 font-medium">수정</button>
                      <button onClick={() => { if(confirm('삭제하시겠습니까?')) deleteProduct(p.id) }} className="text-[10px] bg-red-50 text-red-600 px-2.5 py-1 rounded-lg hover:bg-red-100 font-medium">삭제</button>
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
