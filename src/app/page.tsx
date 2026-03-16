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
    if (pendingUser) {
      setError('관리자 승인 대기 중입니다. 승인 후 로그인 가능합니다.');
      return;
    }
    const rejectedUser = users.find(u => u.email === email && u.password === password && u.status === 'rejected');
    if (rejectedUser) {
      setError('가입이 거부되었습니다. 관리자에게 문의하세요.');
      return;
    }
    const user = login(email, password);
    if (user) {
      if (user.role === 'admin') {
        router.push('/admin');
      } else {
        router.push('/dashboard');
      }
    } else {
      setError('이메일 또는 비밀번호가 올바르지 않습니다.');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-white">
      <div className="w-full max-w-sm px-6">
        {/* Logo */}
        <div className="text-center mb-10">
          <img src="/logo.jpg" alt="피규어플렉스" className="w-36 mx-auto mb-2 object-contain" style={{ mixBlendMode: 'multiply' }} />
        </div>

        {/* Login Form */}
        <div>
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                className="w-full px-0 py-3 border-b border-gray-200 text-sm focus:outline-none focus:border-gray-900 transition-colors"
                placeholder="이메일"
                required
              />
            </div>
            <div>
              <input
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                className="w-full px-0 py-3 border-b border-gray-200 text-sm focus:outline-none focus:border-gray-900 transition-colors"
                placeholder="비밀번호"
                required
              />
            </div>

            {error && (
              <div className="flex items-center gap-2 bg-red-50 text-red-600 text-sm px-4 py-3 rounded-xl">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="shrink-0">
                  <circle cx="12" cy="12" r="10" /><line x1="15" y1="9" x2="9" y2="15" /><line x1="9" y1="9" x2="15" y2="15" />
                </svg>
                {error}
              </div>
            )}

            <button type="submit"
              className="w-full bg-gray-900 text-white py-3 rounded-lg font-medium hover:bg-black transition-colors text-sm mt-2">
              로그인
            </button>
          </form>

          <div className="mt-6 text-center">
            <button onClick={() => router.push('/register')}
              className="text-sm text-gray-400 hover:text-gray-900 transition-colors">
              회원가입 신청
            </button>
          </div>
        </div>

        <div className="mt-8 text-center">
          <p className="text-[11px] text-gray-300 space-x-3">
            <span>admin@figureflex.com / admin1234</span>
          </p>
        </div>
      </div>
    </div>
  );
}
