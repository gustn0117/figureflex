'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useStore } from '@/store/useStore';

export default function LoginPage() {
  const router = useRouter();
  const { login, users } = useStore();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    const pendingUser = users.find(u => u.email === email && u.password === password && u.status === 'pending');
    if (pendingUser) { setError('관리자 승인 대기 중입니다.'); return; }
    const rejectedUser = users.find(u => u.email === email && u.password === password && u.status === 'rejected');
    if (rejectedUser) { setError('가입이 거부되었습니다.'); return; }
    const user = login(email, password);
    if (user) { router.push(user.role === 'admin' ? '/admin' : '/dashboard'); }
    else { setError('이메일 또는 비밀번호가 올바르지 않습니다.'); }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-white px-5">
      <div className="w-full max-w-sm">
        <div className="text-center mb-10">
          <img src="/logo.jpg" alt="피규어플렉스" className="w-28 mx-auto mb-3" style={{ mixBlendMode: 'multiply' }} />
          <p className="text-[13px] text-gray-400">도매 전용 주문 플랫폼</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-4">
          <input type="email" value={email} onChange={e => setEmail(e.target.value)}
            className="w-full px-4 py-3 border border-gray-200 rounded-lg text-sm bg-gray-50 focus:bg-white placeholder:text-gray-400" placeholder="이메일" required />
          <input type="password" value={password} onChange={e => setPassword(e.target.value)}
            className="w-full px-4 py-3 border border-gray-200 rounded-lg text-sm bg-gray-50 focus:bg-white placeholder:text-gray-400" placeholder="비밀번호" required />

          {error && <p className="text-sm text-red-500">{error}</p>}

          <button type="submit" className="w-full bg-gray-900 text-white py-3 rounded-lg text-sm font-medium hover:bg-black transition-colors">
            로그인
          </button>
        </form>

        <p className="mt-6 text-center text-[13px] text-gray-400">
          계정이 없으신가요? <button onClick={() => router.push('/register')} className="text-gray-900 font-medium hover:underline">회원가입</button>
        </p>

        <p className="mt-10 text-center text-[11px] text-gray-300">admin@figureflex.com / admin1234</p>
      </div>
    </div>
  );
}
