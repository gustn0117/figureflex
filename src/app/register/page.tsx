'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useStore } from '@/store/useStore';
import type { MemberType, UserGrade } from '@/types';

export default function RegisterPage() {
  const router = useRouter();
  const { register, users } = useStore();
  const [form, setForm] = useState({ email: '', password: '', passwordConfirm: '', name: '', company: '', phone: '', address: '', memberType: 'external' as MemberType, referredBy: '', photoFile: null as File | null });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [photoPreview, setPhotoPreview] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => setForm({ ...form, [e.target.name]: e.target.value });
  const handlePhoto = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) { setForm({ ...form, photoFile: file }); const r = new FileReader(); r.onloadend = () => setPhotoPreview(r.result as string); r.readAsDataURL(file); }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault(); setError('');
    if (form.password !== form.passwordConfirm) { setError('비밀번호가 일치하지 않습니다.'); return; }
    if (form.password.length < 6) { setError('비밀번호는 6자 이상이어야 합니다.'); return; }
    if (form.referredBy.trim() && !users.find(u => u.referralCode === form.referredBy.trim())) {
      setError('유효하지 않은 추천인 코드입니다.'); return;
    }
    const ok = register({ email: form.email, password: form.password, name: form.name, company: form.company, phone: form.phone, address: form.address, role: 'member', grade: '일반' as UserGrade, memberType: form.memberType, referredBy: form.referredBy, photoUrl: photoPreview });
    if (ok) setSuccess(true); else setError('이미 등록된 이메일입니다.');
  };

  const inputCls = "w-full px-3.5 py-2.5 border border-gray-300 rounded-lg text-sm placeholder:text-gray-400";

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white p-6">
        <div className="max-w-sm w-full text-center">
          <div className="w-14 h-14 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-7 h-7 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
          </div>
          <h2 className="text-xl font-bold text-gray-900 mb-2">가입 신청 완료</h2>
          <p className="text-sm text-gray-500 mb-6">관리자 승인 후 로그인 가능합니다.</p>
          <button onClick={() => router.push('/')} className="bg-gray-900 text-white px-6 py-2.5 rounded-lg text-sm hover:bg-black">로그인</button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-white p-6">
      <div className="w-full max-w-md">
        <button onClick={() => router.push('/')} className="text-sm text-gray-400 hover:text-gray-900 mb-6 inline-block">&larr; 돌아가기</button>
        <h1 className="text-2xl font-bold text-gray-900 mb-1">회원가입</h1>
        <p className="text-sm text-gray-400 mb-8">관리자 승인 후 이용 가능합니다</p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs text-gray-500 mb-1.5 font-medium">이메일</label>
            <input type="email" name="email" value={form.email} onChange={handleChange} className={inputCls} required />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div><label className="block text-xs text-gray-500 mb-1.5 font-medium">비밀번호</label>
              <input type="password" name="password" value={form.password} onChange={handleChange} className={inputCls} placeholder="6자 이상" required /></div>
            <div><label className="block text-xs text-gray-500 mb-1.5 font-medium">비밀번호 확인</label>
              <input type="password" name="passwordConfirm" value={form.passwordConfirm} onChange={handleChange} className={inputCls} required /></div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div><label className="block text-xs text-gray-500 mb-1.5 font-medium">담당자명</label>
              <input type="text" name="name" value={form.name} onChange={handleChange} className={inputCls} required /></div>
            <div><label className="block text-xs text-gray-500 mb-1.5 font-medium">업체명</label>
              <input type="text" name="company" value={form.company} onChange={handleChange} className={inputCls} required /></div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div><label className="block text-xs text-gray-500 mb-1.5 font-medium">연락처</label>
              <input type="tel" name="phone" value={form.phone} onChange={handleChange} className={inputCls} placeholder="010-0000-0000" required /></div>
            <div><label className="block text-xs text-gray-500 mb-1.5 font-medium">업체 유형</label>
              <select name="memberType" value={form.memberType} onChange={handleChange} className={inputCls}>
                <option value="chain">체인점</option><option value="external">외부업체</option>
              </select></div>
          </div>
          <div>
            <label className="block text-xs text-gray-500 mb-1.5 font-medium">사업지 주소</label>
            <input type="text" name="address" value={form.address} onChange={handleChange} className={inputCls} placeholder="사업장 주소를 입력하세요" required />
          </div>
          <div>
            <label className="block text-xs text-gray-500 mb-1.5 font-medium">추천인 코드 <span className="text-gray-400 font-normal">(선택)</span></label>
            <input type="text" name="referredBy" value={form.referredBy} onChange={handleChange} className={inputCls} placeholder="있는 경우에만 입력" />
          </div>
          <div>
            <label className="block text-xs text-gray-500 mb-1.5 font-medium">사업자등록증</label>
            <label className="flex items-center justify-center gap-2 py-3 border border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-gray-500 transition-colors">
              <input type="file" accept="image/*" onChange={handlePhoto} className="hidden" />
              <span className="text-sm text-gray-400">{form.photoFile ? form.photoFile.name : '파일 선택'}</span>
            </label>
            {photoPreview && <img src={photoPreview} alt="" className="mt-2 h-16 rounded-lg" />}
          </div>

          {error && <p className="text-sm text-red-500">{error}</p>}

          <button type="submit" className="w-full bg-gray-900 text-white py-2.5 rounded-lg text-sm font-medium hover:bg-black">가입 신청</button>
        </form>
      </div>
    </div>
  );
}
