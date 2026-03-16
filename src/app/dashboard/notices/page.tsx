'use client';
import { useState } from 'react';
import { useStore } from '@/store/useStore';

export default function NoticesPage() {
  const { notices } = useStore();
  const [openId, setOpenId] = useState<string | null>(null);

  return (
    <div className="max-w-4xl">
      <h2 className="text-xl font-bold text-gray-800 mb-6">공지사항</h2>

      <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
        {notices.map(n => (
          <div key={n.id} className="border-b border-gray-50 last:border-0">
            <button
              onClick={() => setOpenId(openId === n.id ? null : n.id)}
              className="w-full flex items-center gap-3 px-5 py-4 text-left hover:bg-gray-50 transition-colors"
            >
              {n.isImportant && (
                <span className="text-[10px] bg-highlight text-white px-2 py-0.5 rounded-full flex-shrink-0">중요</span>
              )}
              <span className="text-sm text-gray-700 flex-1">{n.title}</span>
              <span className="text-xs text-gray-400 flex-shrink-0">{n.createdAt}</span>
              <svg
                className={`w-4 h-4 text-gray-400 transition-transform ${openId === n.id ? 'rotate-180' : ''}`}
                fill="none" stroke="currentColor" viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            {openId === n.id && (
              <div className="px-5 pb-5">
                <div className="bg-gray-50 rounded-lg p-4 text-sm text-gray-600 leading-relaxed whitespace-pre-wrap">
                  {n.content}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
