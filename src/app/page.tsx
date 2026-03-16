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
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100">
      <div className="w-full max-w-md px-6">
        {/* Logo */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-primary rounded-2xl mb-4 shadow-lg">
            <span className="text-3xl font-bold text-white">F</span>
          </div>
          <h1 className="text-3xl font-bold text-primary tracking-tight">피규어플렉스</h1>
          <p className="text-sm text-gray-400 mt-1">FigureFlex Wholesale</p>
        </div>

        {/* Login Form */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
          <form onSubmit={handleLogin} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1.5">이메일</label>
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-sm"
                placeholder="이메일을 입력하세요"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1.5">비밀번호</label>
              <input
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-sm"
                placeholder="비밀번호를 입력하세요"
                required
              />
            </div>

            {error && (
              <div className="bg-red-50 text-red-600 text-sm px-4 py-3 rounded-xl border border-red-100">
                {error}
              </div>
            )}

            <button
              type="submit"
              className="w-full bg-primary text-white py-3 rounded-xl font-medium hover:bg-primary/90 transition-all text-sm"
            >
              로그인
            </button>
          </form>

          <div className="mt-6 text-center">
            <button
              onClick={() => router.push('/register')}
              className="text-sm text-gray-400 hover:text-primary transition-colors"
            >
              회원가입 신청
            </button>
          </div>
        </div>

        {/* Demo info */}
        <div className="mt-6 bg-white/60 rounded-xl p-4 border border-gray-100">
          <p className="text-xs text-gray-400 text-center mb-2">테스트 계정</p>
          <div className="text-xs text-gray-500 space-y-1">
            <p><span className="text-gray-400">관리자:</span> admin@figureflex.com / admin1234</p>
            <p><span className="text-gray-400">체인점:</span> chain@test.com / test1234</p>
            <p><span className="text-gray-400">외부업체:</span> external@test.com / test1234</p>
          </div>
        </div>
      </div>
    </div>
  );
}
