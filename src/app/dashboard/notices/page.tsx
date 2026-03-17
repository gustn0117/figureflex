'use client';
import { useState } from 'react';
import { useStore } from '@/store/useStore';

export default function NoticesPage() {
  const { notices } = useStore();
  const [openId, setOpenId] = useState<string | null>(null);

  return (
    <div className="max-w-3xl mx-auto">
      <h1 className="text-xl font-bold text-gray-900 mb-6">공지사항</h1>

      {notices.length === 0 ? (
        <div className="text-center py-20">
          <p className="text-gray-400 text-sm">등록된 공지사항이 없습니다.</p>
        </div>
      ) : (
        <div className="divide-y divide-gray-100">
          {notices.map(n => (
            <div key={n.id}>
              <button onClick={() => setOpenId(openId === n.id ? null : n.id)}
                className="w-full flex items-center gap-3 py-4 text-left hover:bg-gray-50/50 transition-colors -mx-2 px-2 rounded">
                {n.isImportant && <span className="text-[10px] bg-gray-900 text-white px-1.5 py-0.5 rounded shrink-0 font-medium">중요</span>}
                <span className="text-sm text-gray-700 flex-1">{n.title}</span>
                <span className="text-[11px] text-gray-400 shrink-0">{n.createdAt}</span>
                <svg className={`w-4 h-4 text-gray-400 transition-transform shrink-0 ${openId === n.id ? 'rotate-180' : ''}`}
                  fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
              </button>
              {openId === n.id && (
                <div className="pb-4 pl-2">
                  <div className="bg-gray-50 rounded-lg p-4 text-sm text-gray-600 leading-relaxed whitespace-pre-wrap">{n.content}</div>
                  {n.images?.length > 0 && (
                    <div className="flex flex-wrap gap-2 mt-3">
                      {n.images.map((img, idx) => (
                        <img key={idx} src={img} alt="" className="max-h-60 rounded-lg border border-gray-100 object-contain" />
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
