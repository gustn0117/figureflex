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
    <div className="min-h-screen flex items-center justify-center bg-white relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-accent/5 rounded-full -translate-y-1/2 translate-x-1/3" />
      <div className="absolute bottom-0 left-0 w-80 h-80 bg-accent/5 rounded-full translate-y-1/2 -translate-x-1/3" />

      <div className="w-full max-w-sm px-6 relative z-10">
        {/* Logo */}
        <div className="text-center mb-8">
          <img
            src="/logo.jpg"
            alt="피규어플렉스"
            className="w-40 mx-auto mb-1 object-contain rounded-2xl"
            style={{ mixBlendMode: 'multiply' }}
          />
          <p className="text-xs text-gray-400 tracking-wider uppercase">Wholesale Platform</p>
        </div>

        {/* Login Form */}
        <div className="bg-white rounded-2xl shadow-xl shadow-black/5 border border-gray-100 p-7">
          <h2 className="text-lg font-bold text-gray-900 mb-5">로그인</h2>
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-gray-500 mb-1.5 uppercase tracking-wide">이메일</label>
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:bg-white transition-all"
                placeholder="이메일을 입력하세요"
                required
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-500 mb-1.5 uppercase tracking-wide">비밀번호</label>
              <input
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:bg-white transition-all"
                placeholder="비밀번호를 입력하세요"
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

            <button
              type="submit"
              className="w-full bg-gray-900 text-white py-3 rounded-xl font-semibold hover:bg-black active:scale-[0.98] transition-all text-sm shadow-lg shadow-black/10"
            >
              로그인
            </button>
          </form>

          <div className="mt-5 pt-4 border-t border-gray-100 text-center">
            <button
              onClick={() => router.push('/register')}
              className="text-sm text-gray-400 hover:text-gray-900 transition-colors font-medium"
            >
              회원가입 신청
            </button>
          </div>
        </div>

        {/* Demo info */}
        <div className="mt-5 bg-gray-50 rounded-xl p-4 border border-gray-100">
          <p className="text-[10px] text-gray-400 text-center mb-2 uppercase tracking-widest font-semibold">Demo Accounts</p>
          <div className="text-xs text-gray-500 space-y-1.5">
            <div className="flex justify-between"><span className="text-gray-400">관리자</span><span className="font-mono text-[11px]">admin@figureflex.com / admin1234</span></div>
            <div className="flex justify-between"><span className="text-gray-400">체인점</span><span className="font-mono text-[11px]">chain@test.com / test1234</span></div>
            <div className="flex justify-between"><span className="text-gray-400">외부업체</span><span className="font-mono text-[11px]">external@test.com / test1234</span></div>
          </div>
        </div>
      </div>
    </div>
  );
}
