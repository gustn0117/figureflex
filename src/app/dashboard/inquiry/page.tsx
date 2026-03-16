'use client';
import { useState } from 'react';
import { useStore } from '@/store/useStore';

export default function InquiryPage() {
  const { inquiries, addInquiry, currentUser } = useStore();
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ title: '', content: '', imageFile: null as File | null });
  const [imagePreview, setImagePreview] = useState('');

  const myInquiries = inquiries.filter(i => i.userId === currentUser?.id);

  const handlePhoto = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setForm({ ...form, imageFile: file });
      const reader = new FileReader();
      reader.onloadend = () => setImagePreview(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser) return;
    addInquiry({
      id: `inq-${Date.now()}`,
      userId: currentUser.id,
      userName: currentUser.name,
      title: form.title,
      content: form.content,
      imageUrl: imagePreview,
      reply: '',
      createdAt: new Date().toISOString().split('T')[0],
      repliedAt: '',
    });
    setForm({ title: '', content: '', imageFile: null });
    setImagePreview('');
    setShowForm(false);
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-gray-800">문의사항</h2>
        <button
          onClick={() => setShowForm(!showForm)}
          className={`flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-sm font-medium transition-all ${
            showForm
              ? 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              : 'bg-gray-900 text-white hover:bg-black shadow-lg shadow-black/10'
          }`}
        >
          {showForm ? (
            <>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
              취소
            </>
          ) : (
            <>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="12" y1="5" x2="12" y2="19" />
                <line x1="5" y1="12" x2="19" y2="12" />
              </svg>
              문의 등록
            </>
          )}
        </button>
      </div>

      {showForm && (
        <div className="bg-white rounded-2xl border border-gray-100 p-6 mb-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1.5">제목</label>
              <input
                type="text"
                value={form.title}
                onChange={e => setForm({ ...form, title: e.target.value })}
                className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-gray-900/20 focus:border-gray-900"
                placeholder="문의 제목을 입력하세요"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1.5">내용</label>
              <textarea
                value={form.content}
                onChange={e => setForm({ ...form, content: e.target.value })}
                rows={5}
                className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-gray-900/20 focus:border-gray-900 resize-none"
                placeholder="문의 내용을 입력하세요"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1.5">사진 첨부</label>
              <label className="flex items-center justify-center gap-2 px-4 py-4 border-2 border-dashed border-gray-200 rounded-xl cursor-pointer hover:border-gray-900/40 transition-colors">
                <input type="file" accept="image/*" onChange={handlePhoto} className="hidden" />
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-gray-400">
                  <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                  <circle cx="8.5" cy="8.5" r="1.5" />
                  <polyline points="21 15 16 10 5 21" />
                </svg>
                <span className="text-sm text-gray-400">
                  {form.imageFile ? form.imageFile.name : '클릭하여 이미지를 첨부하세요'}
                </span>
              </label>
              {imagePreview && (
                <img src={imagePreview} alt="첨부 이미지" className="mt-3 max-h-40 rounded-xl border" />
              )}
            </div>
            <button type="submit" className="bg-gray-900 text-white px-6 py-2.5 rounded-xl text-sm font-medium hover:bg-black transition-all">
              등록
            </button>
          </form>
        </div>
      )}

      <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
        {myInquiries.length === 0 ? (
          <div className="p-16 text-center">
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" className="mx-auto text-gray-300 mb-4">
              <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
            </svg>
            <p className="text-sm text-gray-400">등록된 문의사항이 없습니다.</p>
          </div>
        ) : (
          myInquiries.map(inq => (
            <div key={inq.id} className="border-b border-gray-50 last:border-0 p-5">
              <div className="flex items-center gap-3 mb-2">
                <span className={`text-[10px] px-2.5 py-0.5 rounded-full font-medium ${inq.reply ? 'bg-green-100 text-green-600' : 'bg-orange-100 text-orange-600'}`}>
                  {inq.reply ? '답변완료' : '대기중'}
                </span>
                <span className="text-sm font-medium text-gray-700">{inq.title}</span>
                <span className="text-xs text-gray-400 ml-auto">{inq.createdAt}</span>
              </div>
              <p className="text-sm text-gray-500 mb-2 leading-relaxed">{inq.content}</p>
              {inq.imageUrl && (
                <img src={inq.imageUrl} alt="첨부" className="max-h-32 rounded-lg border mb-2" />
              )}
              {inq.reply && (
                <div className="bg-blue-50 rounded-lg p-4 mt-3">
                  <div className="flex items-center gap-1.5 mb-1.5">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-blue-500">
                      <polyline points="9 17 4 12 9 7" />
                      <path d="M20 18v-2a4 4 0 0 0-4-4H4" />
                    </svg>
                    <p className="text-xs text-blue-500 font-medium">관리자 답변 ({inq.repliedAt})</p>
                  </div>
                  <p className="text-sm text-gray-700">{inq.reply}</p>
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}
