'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useStore } from '@/store/useStore';

export default function LoginPage() {
  const router = useRouter();
  const { login } = useStore();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const result = await login(email, password);
      if (result.error) {
        setError(result.error);
      } else if (result.user) {
        router.push(result.user.role === 'admin' ? '/admin' : '/dashboard');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-white px-4 sm:px-5">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8 sm:mb-10">
          <img src="/logo2.jpg" alt="피규어플렉스" className="w-36 sm:w-44 mx-auto mb-3" style={{ mixBlendMode: 'multiply' }} />
        </div>

        <form onSubmit={handleLogin} className="space-y-4">
          <input type="email" value={email} onChange={e => setEmail(e.target.value)}
            className="w-full px-4 py-3 border border-gray-200 rounded-lg text-sm bg-gray-50 focus:bg-white placeholder:text-gray-400" placeholder="이메일" required />
          <input type="password" value={password} onChange={e => setPassword(e.target.value)}
            className="w-full px-4 py-3 border border-gray-200 rounded-lg text-sm bg-gray-50 focus:bg-white placeholder:text-gray-400" placeholder="비밀번호" required />

          {error && <p className="text-sm text-red-500">{error}</p>}

          <button type="submit" disabled={loading}
            className="w-full bg-gray-900 text-white py-3 rounded-lg text-sm font-medium hover:bg-black transition-colors disabled:opacity-50">
            {loading ? '로그인 중...' : '로그인'}
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
