'use client';
import { useState } from 'react';
import { useStore } from '@/store/useStore';
import type { UserGrade } from '@/types';

const GRADES: { key: UserGrade; label: string; color: string; bg: string }[] = [
  { key: 'VVIP',   label: 'VVIP',   color: 'text-purple-700', bg: 'bg-purple-50 border-purple-200' },
  { key: 'VIP',    label: 'VIP',    color: 'text-blue-700',   bg: 'bg-blue-50 border-blue-200' },
  { key: 'GOLD',   label: 'GOLD',   color: 'text-yellow-700', bg: 'bg-yellow-50 border-yellow-200' },
  { key: 'SILVER', label: 'SILVER', color: 'text-gray-700',   bg: 'bg-gray-50 border-gray-200' },
];

export default function AdminSettingsPage() {
  const { gradeDiscounts, updateGradeDiscount } = useStore();
  const [saved, setSaved] = useState(false);
  const [localRates, setLocalRates] = useState<Record<string, number>>({ ...gradeDiscounts });

  const handleSave = () => {
    Object.entries(localRates).forEach(([grade, rate]) => updateGradeDiscount(grade, rate));
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const exampleBase = 50000;

  return (
    <div className="max-w-2xl">
      <div className="mb-6">
        <h2 className="text-xl font-bold text-gray-900">등급 설정</h2>
        <p className="text-sm text-gray-400 mt-1">등급별 기본 할인율을 설정합니다. 상품 등록 시 자동계산에 적용됩니다.</p>
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 p-6">
        <p className="text-sm font-semibold text-gray-700 mb-5">등급별 할인율</p>

        <div className="space-y-4">
          {GRADES.map(g => {
            const rate = localRates[g.key] ?? 0;
            const discountedPrice = Math.round(exampleBase * (1 - rate));
            return (
              <div key={g.key} className={`rounded-xl border p-4 ${g.bg}`}>
                <div className="flex items-center justify-between mb-3">
                  <span className={`text-sm font-bold ${g.color}`}>{g.label}</span>
                  <span className="text-xs text-gray-500">
                    예시: {exampleBase.toLocaleString()}원 → <span className="font-semibold text-gray-800">{discountedPrice.toLocaleString()}원</span>
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <input
                    type="range"
                    min={0} max={50} step={1}
                    value={Math.round(rate * 100)}
                    onChange={e => setLocalRates(prev => ({ ...prev, [g.key]: Number(e.target.value) / 100 }))}
                    className="flex-1 h-2 accent-gray-900 cursor-pointer"
                  />
                  <div className="flex items-center gap-1 w-24">
                    <input
                      type="number"
                      min={0} max={50} step={1}
                      value={Math.round(rate * 100)}
                      onChange={e => setLocalRates(prev => ({ ...prev, [g.key]: Math.min(50, Math.max(0, Number(e.target.value))) / 100 }))}
                      className="w-16 px-2 py-1.5 border border-gray-300 rounded-lg text-sm text-right focus:outline-none focus:ring-2 focus:ring-gray-900/20 bg-white"
                    />
                    <span className="text-sm font-medium text-gray-600">%</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <div className="mt-6 pt-5 border-t border-gray-100 flex items-center gap-3">
          <button onClick={handleSave}
            className={`px-6 py-2.5 rounded-xl text-sm font-semibold transition-all ${saved ? 'bg-green-500 text-white' : 'bg-gray-900 text-white hover:bg-black'}`}>
            {saved ? '저장됨 ✓' : '저장하기'}
          </button>
          <p className="text-xs text-gray-400">저장 후 상품 등록 시 자동계산에 반영됩니다.</p>
        </div>
      </div>

      {/* Info */}
      <div className="bg-amber-50 border border-amber-200 rounded-2xl p-5 mt-4">
        <p className="text-sm font-semibold text-amber-800 mb-2">안내</p>
        <ul className="text-xs text-amber-700 space-y-1 list-disc list-inside">
          <li>여기서 설정한 할인율은 상품 등록 시 &ldquo;자동계산&rdquo; 버튼에만 적용됩니다.</li>
          <li>각 상품의 등급별 가격은 상품 등록/수정 시 개별 조정 가능합니다.</li>
          <li>기존 등록된 상품 가격은 변경되지 않습니다.</li>
        </ul>
      </div>
    </div>
  );
}
