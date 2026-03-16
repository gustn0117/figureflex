'use client';
import { useState } from 'react';
import { useStore } from '@/store/useStore';

export default function AdminInquiriesPage() {
  const { inquiries, replyInquiry } = useStore();
  const [replyId, setReplyId] = useState<string | null>(null);
  const [replyText, setReplyText] = useState('');

  const handleReply = (id: string) => {
    if (!replyText.trim()) return;
    replyInquiry(id, replyText.trim());
    setReplyId(null);
    setReplyText('');
  };

  return (
    <div className="max-w-4xl">
      <h2 className="text-xl font-bold text-gray-800 mb-6">문의사항 관리</h2>

      <div className="space-y-3">
        {inquiries.map(inq => (
          <div key={inq.id} className="bg-white rounded-xl border border-gray-100 p-5">
            <div className="flex items-center gap-3 mb-3">
              <span className={`text-[10px] px-2 py-0.5 rounded-full ${inq.reply ? 'bg-green-100 text-green-600' : 'bg-orange-100 text-orange-600'}`}>
                {inq.reply ? '답변완료' : '미답변'}
              </span>
              <span className="text-sm font-medium">{inq.title}</span>
              <span className="text-xs text-gray-400 ml-auto">{inq.userName} | {inq.createdAt}</span>
            </div>

            <p className="text-sm text-gray-600 mb-3">{inq.content}</p>

            {inq.imageUrl && (
              <img src={inq.imageUrl} alt="첨부" className="max-h-40 rounded-lg border mb-3" />
            )}

            {inq.reply ? (
              <div className="bg-blue-50 rounded-lg p-3">
                <p className="text-xs text-blue-500 font-medium mb-1">답변 ({inq.repliedAt})</p>
                <p className="text-sm text-gray-700">{inq.reply}</p>
              </div>
            ) : (
              <>
                {replyId === inq.id ? (
                  <div className="space-y-2">
                    <textarea
                      value={replyText}
                      onChange={e => setReplyText(e.target.value)}
                      rows={3}
                      placeholder="답변을 입력하세요..."
                      className="w-full px-4 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-gray-900/20 resize-none"
                    />
                    <div className="flex gap-2">
                      <button onClick={() => handleReply(inq.id)}
                        className="bg-gray-900 text-white px-4 py-2 rounded-xl text-xs hover:bg-black">답변 등록</button>
                      <button onClick={() => { setReplyId(null); setReplyText(''); }}
                        className="text-xs text-gray-400 hover:text-gray-600">취소</button>
                    </div>
                  </div>
                ) : (
                  <button
                    onClick={() => setReplyId(inq.id)}
                    className="text-xs bg-gray-900 text-white px-4 py-2 rounded-xl hover:bg-black"
                  >
                    답변하기
                  </button>
                )}
              </>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
