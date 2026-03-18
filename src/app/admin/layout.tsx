'use client';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useStore } from '@/store/useStore';
import AdminSidebar from '@/components/AdminSidebar';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const { currentUser } = useStore();

  const fetchSettings = useStore(s => s.fetchSettings);

  useEffect(() => {
    if (!currentUser || currentUser.role !== 'admin') {
      router.push('/');
    } else {
      fetchSettings();
    }
  }, [currentUser, router]);

  if (!currentUser || currentUser.role !== 'admin') return null;

  return (
    <div className="flex min-h-screen bg-slate-50">
      <AdminSidebar />
      <main className="flex-1 p-6 overflow-auto">
        {children}
      </main>
    </div>
  );
}
