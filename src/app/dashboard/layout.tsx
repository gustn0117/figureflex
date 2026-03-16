'use client';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useStore } from '@/store/useStore';
import Header from '@/components/Header';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const { currentUser } = useStore();

  useEffect(() => {
    if (!currentUser) router.push('/');
  }, [currentUser, router]);

  if (!currentUser) return null;

  return (
    <div className="min-h-screen bg-[#fafafa]">
      <Header />
      <main className="max-w-6xl mx-auto px-5 py-8">
        {children}
      </main>
      <footer className="border-t border-gray-100 mt-16">
        <div className="max-w-6xl mx-auto px-5 py-8 text-xs text-gray-400">
          <p className="font-medium text-gray-500 mb-1">피규어플렉스 FigureFlex</p>
          <p>피규어/가챠/굿즈 도매 전용 주문 플랫폼</p>
        </div>
      </footer>
    </div>
  );
}
