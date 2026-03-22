'use client';
import { useState, useEffect } from 'react';
import { useStore } from '@/store/useStore';
import type { UserGrade } from '@/types';

const GRADES: { key: UserGrade; label: string; color: string; bg: string }[] = [
  { key: 'VVIP',   label: 'VVIP',   color: 'text-purple-700', bg: 'bg-purple-50 border-purple-200' },
  { key: 'VIP',    label: 'VIP',    color: 'text-blue-700',   bg: 'bg-blue-50 border-blue-200' },
  { key: 'GOLD',   label: 'GOLD',   color: 'text-yellow-700', bg: 'bg-yellow-50 border-yellow-200' },
  { key: 'SILVER', label: 'SILVER', color: 'text-gray-700',   bg: 'bg-gray-50 border-gray-200' },
  { key: '일반',   label: '일반',   color: 'text-slate-600',  bg: 'bg-slate-50 border-slate-200' },
];

export default function AdminSettingsPage() {
  const { gradeDiscounts, updateGradeDiscount, depositRates, updateDepositRate, fetchSettings, saveSettings } = useStore();
  const [savedDiscount, setSavedDiscount] = useState(false);
  const [savedDeposit, setSavedDeposit] = useState(false);
  const [localRates, setLocalRates] = useState<Record<string, number>>({ ...gradeDiscounts });
  const [localDeposit, setLocalDeposit] = useState<Record<string, number>>({ ...depositRates });
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    fetchSettings().then(() => {
      const { gradeDiscounts: gd, depositRates: dr } = useStore.getState();
      setLocalRates({ ...gd });
      setLocalDeposit({ ...dr });
      setLoaded(true);
    });
  }, []);

  // store 값이 바뀌면 (다른 곳에서 fetchSettings 호출 등) localRates도 동기화
  useEffect(() => {
    if (loaded) return; // 이미 fetch 완료 후에는 사용자 입력 우선
    setLocalRates({ ...gradeDiscounts });
    setLocalDeposit({ ...depositRates });
  }, [gradeDiscounts, depositRates]);

  const handleSaveDiscount = async () => {
    Object.entries(localRates).forEach(([grade, rate]) => updateGradeDiscount(grade, rate));
    await saveSettings();
    setSavedDiscount(true);
    setTimeout(() => setSavedDiscount(false), 2000);
  };

  const handleSaveDeposit = async () => {
    Object.entries(localDeposit).forEach(([grade, rate]) => updateDepositRate(grade, rate));
    await saveSettings();
    setSavedDeposit(true);
    setTimeout(() => setSavedDeposit(false), 2000);
  };

  const exampleBase = 50000;

  return (
    <div className="max-w-2xl space-y-6">
      <div className="mb-6">
        <h2 className="text-xl font-bold text-gray-900">등급 설정</h2>
        <p className="text-sm text-gray-400 mt-1">등급별 할인율 및 계약금 비율을 설정합니다.</p>
      </div>

      {/* 할인율 */}
      <div className="bg-white rounded-2xl border border-gray-100 p-4 md:p-6">
        <p className="text-sm font-semibold text-gray-700 mb-1">등급별 할인율</p>
        <p className="text-xs text-gray-400 mb-5">상품 등록 시 자동계산에 적용됩니다.</p>
        <div className="space-y-4">
          {GRADES.map(g => {
            const rate = localRates[g.key] ?? 0;
            const discountedPrice = Math.round(exampleBase * (1 - rate));
            return (
              <div key={g.key} className={`rounded-xl border p-3 md:p-4 ${g.bg}`}>
                <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-2 md:mb-3 gap-1">
                  <span className={`text-sm font-bold ${g.color}`}>{g.label}</span>
                  <span className="text-[11px] md:text-xs text-gray-500">
                    예시: {exampleBase.toLocaleString()}원 → <span className="font-semibold text-gray-800">{discountedPrice.toLocaleString()}원</span>
                  </span>
                </div>
                <div className="flex items-center gap-2 md:gap-3">
                  <input type="range" min={0} max={500} step={1}
                    value={Math.round(rate * 1000)}
                    onChange={e => setLocalRates(prev => ({ ...prev, [g.key]: Number(e.target.value) / 1000 }))}
                    className="flex-1 h-2 accent-gray-900 cursor-pointer"
                  />
                  <div className="flex items-center gap-1 w-24 md:w-28">
                    <input type="number" min={0} max={50} step={0.1}
                      value={parseFloat((rate * 100).toFixed(1))}
                      onChange={e => setLocalRates(prev => ({ ...prev, [g.key]: Math.min(50, Math.max(0, Number(e.target.value))) / 100 }))}
                      className="w-20 px-2 py-1.5 border border-gray-300 rounded-lg text-sm text-right focus:outline-none focus:ring-2 focus:ring-gray-900/20 bg-white"
                    />
                    <span className="text-sm font-medium text-gray-600">%</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
        <div className="mt-5 md:mt-6 pt-4 md:pt-5 border-t border-gray-100 flex flex-col sm:flex-row items-start sm:items-center gap-2 md:gap-3">
          <button onClick={handleSaveDiscount}
            className={`px-6 py-2.5 rounded-xl text-sm font-semibold transition-all ${savedDiscount ? 'bg-green-500 text-white' : 'bg-gray-900 text-white hover:bg-black'}`}>
            {savedDiscount ? '저장됨 ✓' : '저장하기'}
          </button>
          <p className="text-xs text-gray-400">저장 후 상품 등록 시 자동계산에 반영됩니다.</p>
        </div>
      </div>

      {/* 계약금 비율 */}
      <div className="bg-white rounded-2xl border border-gray-100 p-4 md:p-6">
        <p className="text-sm font-semibold text-gray-700 mb-1">등급별 계약금 비율</p>
        <p className="text-xs text-gray-400 mb-5">주문 시 카드결제 계약금 비율입니다. 잔금은 계좌이체로 진행됩니다.</p>
        <div className="space-y-4">
          {GRADES.map(g => {
            const rate = localDeposit[g.key] ?? 1;
            const depositAmt = Math.round(exampleBase * rate);
            const balanceAmt = exampleBase - depositAmt;
            return (
              <div key={g.key} className={`rounded-xl border p-3 md:p-4 ${g.bg}`}>
                <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-2 md:mb-3 gap-1">
                  <span className={`text-sm font-bold ${g.color}`}>{g.label}</span>
                  <div className="text-[11px] md:text-xs text-gray-500 text-right">
                    <span>계약금 <span className="font-semibold text-gray-800">{depositAmt.toLocaleString()}원</span></span>
                    {balanceAmt > 0 && <span className="ml-2">잔금 <span className="font-semibold text-gray-800">{balanceAmt.toLocaleString()}원</span></span>}
                  </div>
                </div>
                <div className="flex items-center gap-2 md:gap-3">
                  <input type="range" min={10} max={1000} step={1}
                    value={Math.round(rate * 1000)}
                    onChange={e => setLocalDeposit(prev => ({ ...prev, [g.key]: Number(e.target.value) / 1000 }))}
                    className="flex-1 h-2 accent-gray-900 cursor-pointer"
                  />
                  <div className="flex items-center gap-1 w-24 md:w-28">
                    <input type="number" min={1} max={100} step={0.1}
                      value={parseFloat((rate * 100).toFixed(1))}
                      onChange={e => setLocalDeposit(prev => ({ ...prev, [g.key]: Math.min(100, Math.max(1, Number(e.target.value))) / 100 }))}
                      className="w-20 px-2 py-1.5 border border-gray-300 rounded-lg text-sm text-right focus:outline-none focus:ring-2 focus:ring-gray-900/20 bg-white"
                    />
                    <span className="text-sm font-medium text-gray-600">%</span>
                  </div>
                </div>
                <p className="text-[11px] text-gray-400 mt-2">
                  {rate >= 1 ? '전액 카드결제 (계좌이체 없음)' : `카드 ${parseFloat((rate * 100).toFixed(1))}% + 계좌이체 ${parseFloat(((1 - rate) * 100).toFixed(1))}%`}
                </p>
              </div>
            );
          })}
        </div>
        <div className="mt-5 md:mt-6 pt-4 md:pt-5 border-t border-gray-100 flex flex-col sm:flex-row items-start sm:items-center gap-2 md:gap-3">
          <button onClick={handleSaveDeposit}
            className={`px-6 py-2.5 rounded-xl text-sm font-semibold transition-all ${savedDeposit ? 'bg-green-500 text-white' : 'bg-gray-900 text-white hover:bg-black'}`}>
            {savedDeposit ? '저장됨 ✓' : '저장하기'}
          </button>
          <p className="text-xs text-gray-400">신규 주문부터 적용됩니다.</p>
        </div>
      </div>

      <div className="bg-amber-50 border border-amber-200 rounded-2xl p-5">
        <p className="text-sm font-semibold text-amber-800 mb-2">안내</p>
        <ul className="text-xs text-amber-700 space-y-1 list-disc list-inside">
          <li>할인율은 상품 등록 시 &ldquo;자동계산&rdquo; 버튼에만 적용됩니다.</li>
          <li>계약금 비율 변경은 기존 주문에 소급 적용되지 않습니다.</li>
          <li>일반 등급은 전액 카드결제가 기본값입니다.</li>
        </ul>
      </div>
    </div>
  );
}
