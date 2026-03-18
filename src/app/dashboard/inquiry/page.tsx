'use client';
import { useState, useEffect } from 'react';
import { useStore } from '@/store/useStore';

export default function InquiryPage() {
  const { inquiries, addInquiry, fetchInquiries, currentUser } = useStore();
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ title: '', content: '', imageFile: null as File | null });
  const [imagePreview, setImagePreview] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchInquiries();
  }, []);

  const myInquiries = inquiries.filter(i => i.userId === currentUser?.id);

  const handlePhoto = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setForm({ ...form, imageFile: file });
      const r = new FileReader();
      r.onloadend = () => setImagePreview(r.result as string);
      r.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser) return;
    setSubmitting(true);
    try {
      await addInquiry({
        userId: currentUser.id,
        userName: currentUser.name,
        title: form.title,
        content: form.content,
        imageUrl: imagePreview,
      });
      setForm({ title: '', content: '', imageFile: null });
      setImagePreview('');
      setShowForm(false);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-xl font-bold text-gray-900">문의사항</h1>
        <button onClick={() => setShowForm(!showForm)}
          className={`text-sm px-4 py-2 rounded-lg transition-colors ${showForm ? 'bg-gray-100 text-gray-600' : 'bg-gray-900 text-white hover:bg-black'}`}>
          {showForm ? '취소' : '문의 등록'}
        </button>
      </div>

      {showForm && (
        <div className="border border-gray-200 rounded-lg p-5 mb-8">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs text-gray-500 mb-1.5 font-medium">제목</label>
              <input type="text" value={form.title} onChange={e => setForm({ ...form, title: e.target.value })}
                className="w-full px-3.5 py-2.5 border border-gray-300 rounded-lg text-sm" placeholder="문의 제목" required />
            </div>
            <div>
              <label className="block text-xs text-gray-500 mb-1.5 font-medium">내용</label>
              <textarea value={form.content} onChange={e => setForm({ ...form, content: e.target.value })}
                rows={4} className="w-full px-3.5 py-2.5 border border-gray-300 rounded-lg text-sm resize-none" placeholder="문의 내용을 입력하세요" required />
            </div>
            <div>
              <label className="flex items-center justify-center gap-2 py-3 border border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-gray-500 transition-colors">
                <input type="file" accept="image/*" onChange={handlePhoto} className="hidden" />
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-gray-400"><rect x="3" y="3" width="18" height="18" rx="2" /><circle cx="8.5" cy="8.5" r="1.5" /><polyline points="21 15 16 10 5 21" /></svg>
                <span className="text-sm text-gray-400">{form.imageFile ? form.imageFile.name : '이미지 첨부'}</span>
              </label>
              {imagePreview && <img src={imagePreview} alt="" className="mt-2 max-h-32 rounded-lg" />}
            </div>
            <button type="submit" disabled={submitting}
              className="bg-gray-900 text-white px-5 py-2.5 rounded-lg text-sm hover:bg-black disabled:opacity-50">
              {submitting ? '등록 중...' : '등록'}
            </button>
          </form>
        </div>
      )}

      {myInquiries.length === 0 ? (
        <div className="text-center py-20">
          <p className="text-gray-400 text-sm">등록된 문의사항이 없습니다.</p>
        </div>
      ) : (
        <div className="divide-y divide-gray-100">
          {myInquiries.map(inq => (
            <div key={inq.id} className="py-5">
              <div className="flex items-center gap-2 mb-2">
                <span className={`text-[10px] px-1.5 py-0.5 rounded font-medium ${inq.reply ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
                  {inq.reply ? '답변완료' : '대기중'}
                </span>
                <span className="text-sm font-medium text-gray-900">{inq.title}</span>
                <span className="text-[11px] text-gray-400 ml-auto">{inq.createdAt}</span>
              </div>
              <p className="text-sm text-gray-600 mb-2 leading-relaxed">{inq.content}</p>
              {inq.imageUrl && <img src={inq.imageUrl} alt="" className="max-h-32 rounded-lg mb-2" />}
              {inq.reply && (
                <div className="bg-gray-50 rounded-lg p-3 mt-3">
                  <p className="text-[11px] text-gray-500 mb-1">관리자 답변 ({inq.repliedAt})</p>
                  <p className="text-sm text-gray-700">{inq.reply}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
