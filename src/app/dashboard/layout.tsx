'use client';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useStore } from '@/store/useStore';
import Header from '@/components/Header';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const { currentUser } = useStore();

  const fetchSettings = useStore(s => s.fetchSettings);
  const fetchCart = useStore(s => s.fetchCart);

  useEffect(() => {
    if (!currentUser) router.push('/');
    else {
      fetchSettings();
      fetchCart();
    }
  }, [currentUser, router]);

  if (!currentUser) return null;

  return (
    <div className="min-h-screen bg-[#f7f7f8] flex flex-col">
      <Header />
      <main className="max-w-6xl mx-auto px-3 md:px-5 py-4 md:py-8 flex-1 w-full">
        {children}
      </main>
      <footer className="border-t border-gray-200 bg-white">
        <div className="max-w-6xl mx-auto px-3 md:px-5 py-4 md:py-6 flex items-center justify-between text-[10px] md:text-xs text-gray-400">
          <div>
            <p className="font-medium text-gray-500">피규어플렉스</p>
            <p className="mt-0.5">도매 전용 주문 플랫폼</p>
          </div>
          <p>FigureFlex</p>
        </div>
      </footer>
    </div>
  );
}
