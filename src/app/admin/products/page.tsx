'use client';
import { useState } from 'react';
import { useStore } from '@/store/useStore';
import { GRADE_DISCOUNTS } from '@/data/mockData';
import type { Product, UserGrade } from '@/types';

const GRADES: { key: UserGrade; label: string; color: string }[] = [
  { key: 'VVIP', label: 'VVIP', color: 'text-purple-600 bg-purple-50' },
  { key: 'VIP',  label: 'VIP',  color: 'text-blue-600 bg-blue-50' },
  { key: 'GOLD', label: 'GOLD', color: 'text-yellow-600 bg-yellow-50' },
  { key: 'SILVER', label: 'SILVER', color: 'text-gray-600 bg-gray-100' },
];

const fmt = (n: number | string) => {
  const num = typeof n === 'string' ? Number(n.replace(/,/g, '')) : n;
  if (!num || isNaN(num)) return '';
  return num.toLocaleString('ko-KR');
};
const parse = (s: string) => {
  const n = Number(s.replace(/,/g, ''));
  return isNaN(n) ? 0 : n;
};

function PriceInput({ label, value, onChange, colorCls }: {
  label: string; value: number; onChange: (v: number) => void; colorCls?: string;
}) {
  const [display, setDisplay] = useState(value > 0 ? fmt(value) : '');
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value.replace(/[^0-9]/g, '');
    setDisplay(raw ? Number(raw).toLocaleString('ko-KR') : '');
    onChange(raw ? Number(raw) : 0);
  };
  return (
    <div className="flex-1">
      <label className={`block text-[11px] font-semibold mb-1 px-2 py-0.5 rounded-md w-fit ${colorCls || 'text-gray-500 bg-gray-100'}`}>{label}</label>
      <div className="relative">
        <input
          type="text"
          inputMode="numeric"
          value={display}
          onChange={handleChange}
          onBlur={() => setDisplay(value > 0 ? fmt(value) : '')}
          className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-accent/20 focus:border-accent bg-white text-right pr-8"
          placeholder="0"
        />
        <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-gray-400">원</span>
      </div>
    </div>
  );
}

function DateRangePicker({ startDate, endDate, onChangeStart, onChangeEnd }: {
  startDate: string; endDate: string;
  onChangeStart: (d: string) => void; onChangeEnd: (d: string) => void;
}) {
  const today = new Date();
  const toDateStr = (d: Date) => d.toISOString().split('T')[0];
  const addDays = (n: number) => { const d = new Date(today); d.setDate(d.getDate() + n); return toDateStr(d); };
  const addMonths = (n: number) => { const d = new Date(today); d.setMonth(d.getMonth() + n); return toDateStr(d); };

  const quickSets = [
    { label: '1주일', start: toDateStr(today), end: addDays(7) },
    { label: '1개월', start: toDateStr(today), end: addMonths(1) },
    { label: '3개월', start: toDateStr(today), end: addMonths(3) },
    { label: '6개월', start: toDateStr(today), end: addMonths(6) },
    { label: '1년', start: toDateStr(today), end: addMonths(12) },
    { label: '무기한', start: toDateStr(today), end: '2099-12-31' },
  ];

  const formatDisplay = (d: string) => {
    if (!d) return '';
    if (d === '2099-12-31') return '무기한';
    const [y, m, day] = d.split('-');
    return `${y}.${m}.${day}`;
  };

  return (
    <div>
      <p className="text-sm font-semibold text-gray-700 mb-3">판매 기간</p>

      {/* Quick buttons */}
      <div className="flex gap-2 mb-3 flex-wrap">
        {quickSets.map(q => {
          const active = startDate === q.start && endDate === q.end;
          return (
            <button
              key={q.label}
              type="button"
              onClick={() => { onChangeStart(q.start); onChangeEnd(q.end); }}
              className={`text-xs px-3 py-1.5 rounded-lg font-medium transition-colors border ${
                active ? 'bg-gray-900 text-white border-gray-900' : 'bg-white text-gray-600 border-gray-200 hover:border-gray-400'
              }`}
            >
              {q.label}
            </button>
          );
        })}
      </div>

      {/* Date inputs */}
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-xs text-gray-500 mb-1">시작일 *</label>
          <input
            type="date"
            value={startDate}
            onChange={e => onChangeStart(e.target.value)}
            className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-accent/20 focus:border-accent bg-white"
            required
          />
        </div>
        <div>
          <label className="block text-xs text-gray-500 mb-1">종료일 *</label>
          <input
            type="date"
            value={endDate === '2099-12-31' ? '' : endDate}
            placeholder="무기한"
            onChange={e => onChangeEnd(e.target.value || '2099-12-31')}
            className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-accent/20 focus:border-accent bg-white"
          />
          {endDate === '2099-12-31' && (
            <p className="text-[11px] text-gray-400 mt-1">무기한 판매</p>
          )}
        </div>
      </div>

      {/* Summary */}
      {startDate && endDate && (
        <div className="mt-2 bg-gray-50 rounded-lg px-3 py-2 flex items-center gap-2">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-gray-400 flex-shrink-0">
            <rect x="3" y="4" width="18" height="18" rx="2" /><line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" /><line x1="3" y1="10" x2="21" y2="10" />
          </svg>
          <span className="text-xs text-gray-500">
            {formatDisplay(startDate)} ~ {formatDisplay(endDate)}
          </span>
        </div>
      )}
    </div>
  );
}

export default function AdminProductsPage() {
  const { products, categories, subCategories, addProduct, updateProduct, deleteProduct } = useStore();
  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [mainImage, setMainImage] = useState('');
  const [subImages, setSubImages] = useState<string[]>([]);
  const [gradePrices, setGradePrices] = useState<Record<UserGrade, number>>({
    VVIP: 0, VIP: 0, GOLD: 0, SILVER: 0,
  });
  const [form, setForm] = useState({
    name: '', description: '', detailContent: '', categoryId: '', subCategoryId: '',
    basePrice: 0, minQuantity: 1, maxQuantity: 100, stock: 100,
    saleStartDate: '', saleEndDate: '', origin: '', manufacturer: '',
  });

  const productCategories = categories.filter(c => !['cat-notice', 'cat-inquiry'].includes(c.id));
  const inputCls = "w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-accent/20 focus:border-accent bg-white";

  const autoCalcPrices = (base: number) => {
    setGradePrices({
      VVIP: Math.round(base * (1 - GRADE_DISCOUNTS.VVIP)),
      VIP: Math.round(base * (1 - GRADE_DISCOUNTS.VIP)),
      GOLD: Math.round(base * (1 - GRADE_DISCOUNTS.GOLD)),
      SILVER: Math.round(base * (1 - GRADE_DISCOUNTS.SILVER)),
    });
  };

  const resetForm = () => {
    setForm({ name: '', description: '', detailContent: '', categoryId: '', subCategoryId: '', basePrice: 0, minQuantity: 1, maxQuantity: 100, stock: 100, saleStartDate: '', saleEndDate: '', origin: '', manufacturer: '' });
    setGradePrices({ VVIP: 0, VIP: 0, GOLD: 0, SILVER: 0 });
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
    setGradePrices(p.prices || { VVIP: 0, VIP: 0, GOLD: 0, SILVER: 0 });
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
    const productData = {
      ...form,
      prices: gradePrices,
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
          <form onSubmit={handleSubmit} className="space-y-7">

            {/* Images Section */}
            <div>
              <p className="text-sm font-semibold text-gray-700 mb-3">상품 이미지</p>
              <div className="flex gap-3 flex-wrap">
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

            {/* Price Section */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <p className="text-sm font-semibold text-gray-700">가격 설정</p>
                <button
                  type="button"
                  onClick={() => form.basePrice > 0 && autoCalcPrices(form.basePrice)}
                  disabled={!form.basePrice}
                  className="text-xs text-gray-500 hover:text-gray-800 border border-gray-200 rounded-lg px-3 py-1.5 disabled:opacity-40 hover:border-gray-400 transition-colors"
                >
                  기본가 기준 자동계산
                </button>
              </div>

              {/* Base price */}
              <div className="mb-4">
                <label className="block text-xs text-gray-500 mb-1">기본가 (정가) *</label>
                <div className="relative">
                  <input
                    type="text"
                    inputMode="numeric"
                    value={form.basePrice > 0 ? fmt(form.basePrice) : ''}
                    onChange={e => {
                      const v = parse(e.target.value);
                      setForm({...form, basePrice: v});
                    }}
                    className={`${inputCls} pr-8 text-right`}
                    required
                    placeholder="0"
                  />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-gray-400">원</span>
                </div>
              </div>

              {/* Grade prices */}
              <div className="bg-gray-50 rounded-xl p-4 border border-gray-100">
                <p className="text-xs text-gray-500 mb-3 font-medium">등급별 가격 <span className="text-gray-400 font-normal">(직접 입력 또는 자동계산)</span></p>
                <div className="grid grid-cols-2 gap-3">
                  {GRADES.map(g => (
                    <PriceInput
                      key={g.key}
                      label={g.label}
                      value={gradePrices[g.key]}
                      onChange={v => setGradePrices(prev => ({ ...prev, [g.key]: v }))}
                      colorCls={g.color}
                    />
                  ))}
                </div>
                {form.basePrice > 0 && (
                  <p className="text-[11px] text-gray-400 mt-3">
                    기본 할인율: VVIP {(GRADE_DISCOUNTS.VVIP * 100).toFixed(0)}% · VIP {(GRADE_DISCOUNTS.VIP * 100).toFixed(0)}% · GOLD {(GRADE_DISCOUNTS.GOLD * 100).toFixed(0)}% · SILVER {(GRADE_DISCOUNTS.SILVER * 100).toFixed(0)}%
                  </p>
                )}
              </div>
            </div>

            {/* Quantity & Stock */}
            <div>
              <p className="text-sm font-semibold text-gray-700 mb-3">수량 / 재고</p>
              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs text-gray-500 mb-1">재고</label>
                  <input type="number" value={form.stock || ''} onChange={e => setForm({...form, stock: Number(e.target.value)})} className={inputCls} min={0} />
                </div>
                <div>
                  <label className="block text-xs text-gray-500 mb-1">최소 주문</label>
                  <input type="number" value={form.minQuantity || ''} onChange={e => setForm({...form, minQuantity: Number(e.target.value)})} className={inputCls} min={1} />
                </div>
                <div>
                  <label className="block text-xs text-gray-500 mb-1">최대 주문</label>
                  <input type="number" value={form.maxQuantity || ''} onChange={e => setForm({...form, maxQuantity: Number(e.target.value)})} className={inputCls} min={1} />
                </div>
              </div>
            </div>

            {/* Sale Period */}
            <DateRangePicker
              startDate={form.saleStartDate}
              endDate={form.saleEndDate}
              onChangeStart={d => setForm({...form, saleStartDate: d})}
              onChangeEnd={d => setForm({...form, saleEndDate: d})}
            />

            {/* Detail Content */}
            <div>
              <p className="text-sm font-semibold text-gray-700 mb-3">상세 설명</p>
              <textarea value={form.detailContent} onChange={e => setForm({...form, detailContent: e.target.value})}
                rows={6} className={`${inputCls} resize-none`} placeholder="상품 상세 페이지에 표시되는 상세 설명을 입력하세요." />
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
              <th className="text-center px-3 py-3 font-medium hidden md:table-cell">등급가</th>
              <th className="text-center px-3 py-3 font-medium">재고</th>
              <th className="text-center px-3 py-3 font-medium">상태</th>
              <th className="text-center px-3 py-3 font-medium">관리</th>
            </tr>
          </thead>
          <tbody>
            {products.length === 0 ? (
              <tr>
                <td colSpan={8} className="text-center py-16 text-gray-400 text-sm">
                  등록된 상품이 없습니다. 상품을 등록해주세요.
                </td>
              </tr>
            ) : products.map(p => {
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
                  <td className="text-center px-3 py-3 hidden md:table-cell">
                    <div className="flex flex-col gap-0.5 text-[10px]">
                      {GRADES.map(g => (
                        <div key={g.key} className="flex items-center justify-between gap-2">
                          <span className={`px-1.5 py-0.5 rounded text-[9px] font-semibold ${g.color}`}>{g.label}</span>
                          <span className="text-gray-600">{(p.prices?.[g.key] || 0).toLocaleString()}원</span>
                        </div>
                      ))}
                    </div>
                  </td>
                  <td className="text-center px-3 py-3 text-xs">{p.stock.toLocaleString()}</td>
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
