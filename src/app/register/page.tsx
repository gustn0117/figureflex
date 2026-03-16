'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useStore } from '@/store/useStore';
import type { MemberType, UserGrade } from '@/types';

export default function RegisterPage() {
  const router = useRouter();
  const { register, users } = useStore();
  const [form, setForm] = useState({
    email: '', password: '', passwordConfirm: '', name: '', company: '',
    phone: '', memberType: 'external' as MemberType, referredBy: '',
    photoFile: null as File | null,
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [photoPreview, setPhotoPreview] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handlePhoto = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setForm({ ...form, photoFile: file });
      const reader = new FileReader();
      reader.onloadend = () => setPhotoPreview(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (form.password !== form.passwordConfirm) { setError('비밀번호가 일치하지 않습니다.'); return; }
    if (form.password.length < 6) { setError('비밀번호는 6자 이상이어야 합니다.'); return; }
    if (!form.referredBy.trim()) { setError('추천인 코드를 입력해주세요.'); return; }
    const referrer = users.find(u => u.referralCode === form.referredBy.trim());
    if (!referrer) { setError('유효하지 않은 추천인 코드입니다.'); return; }

    const ok = register({
      email: form.email, password: form.password, name: form.name, company: form.company,
      phone: form.phone, role: 'member', grade: 'SILVER' as UserGrade,
      memberType: form.memberType, referredBy: form.referredBy, photoUrl: photoPreview,
    });

    if (ok) setSuccess(true);
    else setError('이미 등록된 이메일입니다.');
  };

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="bg-white rounded-2xl shadow-xl shadow-black/5 border border-gray-100 p-10 max-w-md w-full text-center mx-4">
          <div className="w-16 h-16 bg-green-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h2 className="text-xl font-bold text-gray-900 mb-2">가입 신청 완료</h2>
          <p className="text-gray-500 text-sm mb-6 leading-relaxed">
            관리자 승인 후 로그인이 가능합니다.<br />
            승인까지 영업일 기준 1~2일 소요됩니다.
          </p>
          <button
            onClick={() => router.push('/')}
            className="bg-gray-900 text-white px-8 py-3 rounded-xl text-sm font-semibold hover:bg-black transition-all shadow-lg shadow-black/10"
          >
            로그인 페이지로 이동
          </button>
        </div>
      </div>
    );
  }

  const inputClass = "w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:bg-white transition-all";

  return (
    <div className="min-h-screen flex items-center justify-center bg-white py-12 relative overflow-hidden">
      <div className="absolute top-0 right-0 w-96 h-96 bg-accent/5 rounded-full -translate-y-1/2 translate-x-1/3" />
      <div className="absolute bottom-0 left-0 w-80 h-80 bg-accent/5 rounded-full translate-y-1/2 -translate-x-1/3" />

      <div className="w-full max-w-lg px-6 relative z-10">
        <div className="text-center mb-6">
          <img src="/logo.jpg" alt="피규어플렉스" className="w-24 mx-auto mb-2 object-contain" style={{ mixBlendMode: 'multiply' }} />
          <h1 className="text-xl font-bold text-gray-900">회원가입 신청</h1>
          <p className="text-xs text-gray-400 mt-1">관리자 승인 후 이용 가능합니다</p>
        </div>

        <div className="bg-white rounded-2xl shadow-xl shadow-black/5 border border-gray-100 p-7">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div className="col-span-2">
                <label className="block text-xs font-semibold text-gray-500 mb-1.5 uppercase tracking-wide">이메일</label>
                <input type="email" name="email" value={form.email} onChange={handleChange} className={inputClass} placeholder="email@example.com" required />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-500 mb-1.5 uppercase tracking-wide">비밀번호</label>
                <input type="password" name="password" value={form.password} onChange={handleChange} className={inputClass} placeholder="6자 이상" required />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-500 mb-1.5 uppercase tracking-wide">비밀번호 확인</label>
                <input type="password" name="passwordConfirm" value={form.passwordConfirm} onChange={handleChange} className={inputClass} required />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-500 mb-1.5 uppercase tracking-wide">담당자명</label>
                <input type="text" name="name" value={form.name} onChange={handleChange} className={inputClass} required />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-500 mb-1.5 uppercase tracking-wide">업체명</label>
                <input type="text" name="company" value={form.company} onChange={handleChange} className={inputClass} required />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-500 mb-1.5 uppercase tracking-wide">연락처</label>
                <input type="tel" name="phone" value={form.phone} onChange={handleChange} placeholder="010-0000-0000" className={inputClass} required />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-500 mb-1.5 uppercase tracking-wide">업체 유형</label>
                <select name="memberType" value={form.memberType} onChange={handleChange} className={`${inputClass} bg-gray-50`}>
                  <option value="chain">체인점</option>
                  <option value="external">외부업체</option>
                </select>
              </div>
              <div className="col-span-2">
                <label className="block text-xs font-semibold text-gray-500 mb-1.5 uppercase tracking-wide">추천인 코드</label>
                <input type="text" name="referredBy" value={form.referredBy} onChange={handleChange} placeholder="추천인 코드를 입력하세요" className={inputClass} required />
              </div>
              <div className="col-span-2">
                <label className="block text-xs font-semibold text-gray-500 mb-1.5 uppercase tracking-wide">사업자등록증 첨부</label>
                <div className="flex items-center gap-3">
                  <label className="flex-1 flex items-center justify-center gap-2 px-4 py-3.5 border-2 border-dashed border-gray-200 rounded-xl cursor-pointer hover:border-gray-900/40 transition-colors bg-gray-50">
                    <input type="file" accept="image/*" onChange={handlePhoto} className="hidden" />
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-gray-400">
                      <rect x="3" y="3" width="18" height="18" rx="2" ry="2" /><circle cx="8.5" cy="8.5" r="1.5" /><polyline points="21 15 16 10 5 21" />
                    </svg>
                    <span className="text-sm text-gray-400">{form.photoFile ? form.photoFile.name : '파일을 선택하세요'}</span>
                  </label>
                  {photoPreview && <img src={photoPreview} alt="미리보기" className="w-14 h-14 object-cover rounded-xl border" />}
                </div>
              </div>
            </div>

            {error && (
              <div className="flex items-center gap-2 bg-red-50 text-red-600 text-sm px-4 py-3 rounded-xl">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="shrink-0"><circle cx="12" cy="12" r="10" /><line x1="15" y1="9" x2="9" y2="15" /><line x1="9" y1="9" x2="15" y2="15" /></svg>
                {error}
              </div>
            )}

            <button type="submit" className="w-full bg-gray-900 text-white py-3 rounded-xl font-semibold hover:bg-black transition-all text-sm shadow-lg shadow-black/10">
              가입 신청
            </button>
          </form>

          <div className="mt-4 pt-4 border-t border-gray-100 text-center">
            <button onClick={() => router.push('/')} className="text-sm text-gray-400 hover:text-gray-900 transition-colors font-medium">
              로그인 페이지로 돌아가기
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
