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
    if (rejectedUser) { setError('가입이 거부되었습니다. 관리자에게 문의하세요.'); return; }
    const user = login(email, password);
    if (user) { router.push(user.role === 'admin' ? '/admin' : '/dashboard'); }
    else { setError('이메일 또는 비밀번호가 올바르지 않습니다.'); }
  };

  return (
    <div className="min-h-screen flex">
      {/* Left - branding */}
      <div className="hidden lg:flex lg:w-1/2 bg-[#FFF8F0] items-center justify-center p-12">
        <div className="max-w-sm text-center">
          <img src="/logo.jpg" alt="" className="w-48 mx-auto mb-6" />
          <p className="text-gray-500 leading-relaxed text-sm">피규어, 가챠, 굿즈 도매 전용 주문 플랫폼.<br/>등급별 할인가로 편리하게 주문하세요.</p>
        </div>
      </div>

      {/* Right - form */}
      <div className="flex-1 flex items-center justify-center p-6 bg-white">
        <div className="w-full max-w-sm">
          <div className="lg:hidden mb-10">
            <img src="/logo.jpg" alt="피규어플렉스" className="h-12 mb-3" style={{ mixBlendMode: 'multiply' }} />
          </div>

          <h1 className="text-2xl font-bold text-gray-900 mb-1">로그인</h1>
          <p className="text-sm text-gray-400 mb-8">계정 정보를 입력해주세요</p>

          <form onSubmit={handleLogin} className="space-y-5">
            <div>
              <label className="block text-xs text-gray-500 mb-1.5 font-medium">이메일</label>
              <input type="email" value={email} onChange={e => setEmail(e.target.value)}
                className="w-full px-3.5 py-2.5 border border-gray-300 rounded-lg text-sm placeholder:text-gray-400" placeholder="email@example.com" required />
            </div>
            <div>
              <label className="block text-xs text-gray-500 mb-1.5 font-medium">비밀번호</label>
              <input type="password" value={password} onChange={e => setPassword(e.target.value)}
                className="w-full px-3.5 py-2.5 border border-gray-300 rounded-lg text-sm placeholder:text-gray-400" placeholder="비밀번호 입력" required />
            </div>

            {error && <p className="text-sm text-red-500">{error}</p>}

            <button type="submit" className="w-full bg-gray-900 text-white py-2.5 rounded-lg text-sm font-medium hover:bg-black transition-colors">
              로그인
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-gray-400">
            계정이 없으신가요? <button onClick={() => router.push('/register')} className="text-gray-900 font-medium hover:underline">회원가입</button>
          </p>

          <div className="mt-10 pt-6 border-t border-gray-100 text-[11px] text-gray-300 text-center">
            admin@figureflex.com / admin1234
          </div>
        </div>
      </div>
    </div>
  );
}
