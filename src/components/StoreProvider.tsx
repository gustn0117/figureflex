'use client';
import { useEffect, useState } from 'react';
import { useStore } from '@/store/useStore';

export default function StoreProvider({ children }: { children: React.ReactNode }) {
  const [hydrated, setHydrated] = useState(false);
  const { initSession, fetchCategories, fetchSettings } = useStore();

  useEffect(() => {
    const init = async () => {
      // 병렬로 세션 + 공통 데이터 초기화
      await Promise.all([
        initSession(),
        fetchCategories(),
        fetchSettings(),
      ]);
      setHydrated(true);
    };
    init();
  }, []);

  if (!hydrated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="w-8 h-8 border-2 border-gray-200 border-t-gray-900 rounded-full animate-spin" />
      </div>
    );
  }

  return <>{children}</>;
}
