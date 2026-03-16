'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useStore } from '@/store/useStore';
import type { MemberType, UserGrade } from '@/types';

export default function RegisterPage() {
  const router = useRouter();
  const { register, users } = useStore();
  const [form, setForm] = useState({
    email: '',
    password: '',
    passwordConfirm: '',
    name: '',
    company: '',
    phone: '',
    memberType: 'external' as MemberType,
    referredBy: '',
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

    if (form.password !== form.passwordConfirm) {
      setError('비밀번호가 일치하지 않습니다.');
      return;
    }
    if (form.password.length < 6) {
      setError('비밀번호는 6자 이상이어야 합니다.');
      return;
    }
    // 추천인코드 확인
    if (!form.referredBy.trim()) {
      setError('추천인 코드를 입력해주세요.');
      return;
    }
    const referrer = users.find(u => u.referralCode === form.referredBy.trim());
    if (!referrer) {
      setError('유효하지 않은 추천인 코드입니다.');
      return;
    }

    const ok = register({
      email: form.email,
      password: form.password,
      name: form.name,
      company: form.company,
      phone: form.phone,
      role: 'member',
      grade: 'SILVER' as UserGrade,
      memberType: form.memberType,
      referredBy: form.referredBy,
      photoUrl: photoPreview,
    });

    if (ok) {
      setSuccess(true);
    } else {
      setError('이미 등록된 이메일입니다.');
    }
  };

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-10 max-w-md w-full text-center">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h2 className="text-xl font-bold text-gray-800 mb-2">가입 신청 완료</h2>
          <p className="text-gray-500 text-sm mb-6">
            관리자 승인 후 로그인이 가능합니다.<br />
            승인까지 영업일 기준 1~2일 소요됩니다.
          </p>
          <button
            onClick={() => router.push('/')}
            className="bg-primary text-white px-8 py-3 rounded-xl text-sm font-medium hover:bg-primary/90 transition-all"
          >
            로그인 페이지로 이동
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100 py-12">
      <div className="w-full max-w-lg px-6">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-primary">회원가입 신청</h1>
          <p className="text-sm text-gray-400 mt-1">관리자 승인 후 이용 가능합니다</p>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="col-span-2">
                <label className="block text-sm font-medium text-gray-600 mb-1">이메일 *</label>
                <input
                  type="email" name="email" value={form.email} onChange={handleChange}
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">비밀번호 *</label>
                <input
                  type="password" name="password" value={form.password} onChange={handleChange}
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">비밀번호 확인 *</label>
                <input
                  type="password" name="passwordConfirm" value={form.passwordConfirm} onChange={handleChange}
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">담당자명 *</label>
                <input
                  type="text" name="name" value={form.name} onChange={handleChange}
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">업체명 *</label>
                <input
                  type="text" name="company" value={form.company} onChange={handleChange}
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">연락처 *</label>
                <input
                  type="tel" name="phone" value={form.phone} onChange={handleChange}
                  placeholder="010-0000-0000"
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">업체 유형 *</label>
                <select
                  name="memberType" value={form.memberType} onChange={handleChange}
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary bg-white"
                >
                  <option value="chain">체인점</option>
                  <option value="external">외부업체</option>
                </select>
              </div>
              <div className="col-span-2">
                <label className="block text-sm font-medium text-gray-600 mb-1">추천인 코드 *</label>
                <input
                  type="text" name="referredBy" value={form.referredBy} onChange={handleChange}
                  placeholder="추천인 코드를 입력하세요"
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                  required
                />
              </div>
              <div className="col-span-2">
                <label className="block text-sm font-medium text-gray-600 mb-1">사업자등록증 / 증빙서류 첨부</label>
                <div className="flex items-center gap-4">
                  <label className="flex-1 flex items-center justify-center px-4 py-3 border-2 border-dashed border-gray-200 rounded-xl cursor-pointer hover:border-primary/40 transition-colors">
                    <input type="file" accept="image/*" onChange={handlePhoto} className="hidden" />
                    <span className="text-sm text-gray-400">
                      {form.photoFile ? form.photoFile.name : '파일을 선택하세요'}
                    </span>
                  </label>
                  {photoPreview && (
                    <img src={photoPreview} alt="미리보기" className="w-16 h-16 object-cover rounded-xl border" />
                  )}
                </div>
              </div>
            </div>

            {error && (
              <div className="bg-red-50 text-red-600 text-sm px-4 py-3 rounded-xl border border-red-100">
                {error}
              </div>
            )}

            <button
              type="submit"
              className="w-full bg-primary text-white py-3 rounded-xl font-medium hover:bg-primary/90 transition-all text-sm mt-2"
            >
              가입 신청
            </button>
          </form>

          <div className="mt-4 text-center">
            <button
              onClick={() => router.push('/')}
              className="text-sm text-gray-400 hover:text-primary transition-colors"
            >
              로그인 페이지로 돌아가기
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
