'use client';
import { useState } from 'react';
import { useStore } from '@/store/useStore';

export default function AdminInquiriesPage() {
  const { inquiries, replyInquiry } = useStore();
  const [replyId, setReplyId] = useState<string | null>(null);
  const [replyText, setReplyText] = useState('');
  const [filter, setFilter] = useState<'all' | 'unanswered'>('all');
  const [userFilter, setUserFilter] = useState<string>('all');

  const handleReply = (id: string) => {
    if (!replyText.trim()) return;
    replyInquiry(id, replyText.trim());
    setReplyId(null);
    setReplyText('');
  };

  // Unique users who submitted inquiries
  const uniqueUsers = Array.from(new Map(inquiries.map(i => [i.userId, { id: i.userId, name: i.userName }])).values());

  const unansweredCount = inquiries.filter(i => !i.reply).length;
  const filtered = inquiries
    .filter(i => filter === 'unanswered' ? !i.reply : true)
    .filter(i => userFilter === 'all' ? true : i.userId === userFilter);

  return (
    <div className="max-w-4xl">
      <div className="mb-6">
        <h2 className="text-xl font-bold text-gray-900">문의사항 관리</h2>
        <p className="text-sm text-gray-400 mt-1">회원 문의 답변 관리</p>
      </div>

      {/* Filter */}
      <div className="flex flex-wrap gap-2 mb-5">
        <button onClick={() => setFilter('all')}
          className={`text-sm px-4 py-2 rounded-xl font-medium transition-all ${filter === 'all' ? 'bg-gray-900 text-white' : 'bg-white text-gray-500 border border-gray-200 hover:border-gray-400'}`}>
          전체 <span className="ml-1 text-xs opacity-70">{inquiries.length}</span>
        </button>
        <button onClick={() => setFilter('unanswered')}
          className={`text-sm px-4 py-2 rounded-xl font-medium transition-all flex items-center gap-2 ${filter === 'unanswered' ? 'bg-gray-900 text-white' : 'bg-white text-gray-500 border border-gray-200 hover:border-gray-400'}`}>
          미답변
          {unansweredCount > 0 && (
            <span className={`text-[11px] font-bold px-1.5 py-0.5 rounded-full ${filter === 'unanswered' ? 'bg-white text-gray-900' : 'bg-red-500 text-white'}`}>
              {unansweredCount}
            </span>
          )}
        </button>

        {/* Divider */}
        {uniqueUsers.length > 0 && <div className="w-px bg-gray-200 mx-1 self-stretch" />}

        {/* User filter */}
        {uniqueUsers.length > 0 && (
          <>
            <button onClick={() => setUserFilter('all')}
              className={`text-sm px-4 py-2 rounded-xl font-medium transition-all border ${userFilter === 'all' ? 'bg-gray-100 text-gray-800 border-gray-200' : 'bg-white text-gray-400 border-gray-200 hover:border-gray-400'}`}>
              전체 업체
            </button>
            {uniqueUsers.map(u => (
              <button key={u.id} onClick={() => setUserFilter(u.id)}
                className={`text-sm px-4 py-2 rounded-xl font-medium transition-all border ${userFilter === u.id ? 'bg-gray-800 text-white border-gray-800' : 'bg-white text-gray-500 border-gray-200 hover:border-gray-400'}`}>
                {u.name}
              </button>
            ))}
          </>
        )}
      </div>

      {filtered.length === 0 ? (
        <div className="bg-white rounded-2xl border border-gray-100 py-16 text-center text-gray-400 text-sm">
          {filter === 'unanswered' ? '미답변 문의가 없습니다.' : '문의사항이 없습니다.'}
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map(inq => (
            <div key={inq.id} className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
              {/* Header */}
              <div className="flex items-center gap-3 px-5 py-4 border-b border-gray-50">
                <span className={`text-[11px] px-2.5 py-1 rounded-lg font-medium flex-shrink-0 ${inq.reply ? 'bg-green-50 text-green-700' : 'bg-amber-50 text-amber-700'}`}>
                  {inq.reply ? '답변완료' : '미답변'}
                </span>
                <p className="text-sm font-semibold text-gray-800 flex-1 min-w-0">{inq.title}</p>
                <div className="text-right flex-shrink-0">
                  <p className="text-xs text-gray-500">{inq.userName}</p>
                  <p className="text-[11px] text-gray-400">{inq.createdAt}</p>
                </div>
              </div>

              {/* Content */}
              <div className="px-5 py-4">
                <p className="text-sm text-gray-600 leading-relaxed whitespace-pre-line">{inq.content}</p>
                {inq.imageUrl && (
                  <img src={inq.imageUrl} alt="첨부" className="max-h-48 rounded-xl border border-gray-100 mt-3 object-contain" />
                )}
              </div>

              {/* Reply */}
              <div className="px-5 pb-4">
                {inq.reply ? (
                  <div className="bg-blue-50 rounded-xl p-4 border border-blue-100">
                    <div className="flex items-center gap-2 mb-2">
                      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="text-blue-500">
                        <polyline points="9 17 4 12 9 7" /><path d="M20 18v-2a4 4 0 0 0-4-4H4" />
                      </svg>
                      <p className="text-xs font-semibold text-blue-600">관리자 답변 · {inq.repliedAt}</p>
                    </div>
                    <p className="text-sm text-gray-700 leading-relaxed">{inq.reply}</p>
                  </div>
                ) : (
                  replyId === inq.id ? (
                    <div className="space-y-2">
                      <textarea
                        value={replyText}
                        onChange={e => setReplyText(e.target.value)}
                        rows={3}
                        placeholder="답변을 입력하세요..."
                        className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-accent/20 focus:border-accent resize-none"
                        autoFocus
                      />
                      <div className="flex gap-2">
                        <button onClick={() => handleReply(inq.id)}
                          className="bg-gray-900 text-white px-5 py-2 rounded-xl text-sm font-medium hover:bg-black transition-colors">
                          답변 등록
                        </button>
                        <button onClick={() => { setReplyId(null); setReplyText(''); }}
                          className="text-sm text-gray-400 hover:text-gray-600 px-3">
                          취소
                        </button>
                      </div>
                    </div>
                  ) : (
                    <button
                      onClick={() => { setReplyId(inq.id); setReplyText(''); }}
                      className="flex items-center gap-2 text-sm text-gray-500 border border-gray-200 px-4 py-2 rounded-xl hover:border-gray-400 hover:text-gray-800 transition-all"
                    >
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="9 17 4 12 9 7" /><path d="M20 18v-2a4 4 0 0 0-4-4H4" />
                      </svg>
                      답변하기
                    </button>
                  )
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
