import { Category, Product, Notice, Inquiry, Order } from '@/types';

export const GRADE_DISCOUNTS: Record<string, number> = {
  VVIP: 0.30,
  VIP: 0.20,
  GOLD: 0.10,
  SILVER: 0.05,
  '일반': 0,
};

export const GRADE_LABELS: Record<string, string> = {
  VVIP: 'VVIP (30%)',
  VIP: 'VIP (20%)',
  GOLD: 'GOLD (10%)',
  SILVER: 'SILVER (5%)',
  '일반': '일반 (0%)',
};

export const DEPOSIT_RATES: Record<string, number> = {
  VVIP: 0.10,
  VIP: 0.15,
  GOLD: 0.15,
  SILVER: 0.20,
  '일반': 1.00,
};

export const MAIN_CATEGORIES: Category[] = [
  { id: 'cat-notice', name: '공지사항', slug: 'notices', parentId: null, order: 1 },
  { id: 'cat-ichiban', name: '제일복권', slug: 'ichiban', parentId: null, order: 2 },
  { id: 'cat-figure', name: '피규어', slug: 'figures', parentId: null, order: 3 },
  { id: 'cat-gacha', name: '가챠', slug: 'gacha', parentId: null, order: 4 },
  { id: 'cat-goods', name: '굿즈', slug: 'goods', parentId: null, order: 5 },
  { id: 'cat-inquiry', name: '문의사항', slug: 'inquiry', parentId: null, order: 6 },
];

export const SUB_CATEGORIES: Category[] = [
  { id: 'sub-ichiban-1', name: '이치방쿠지', slug: 'ichiban-kuji', parentId: 'cat-ichiban', order: 1 },
  { id: 'sub-ichiban-2', name: '기타', slug: 'ichiban-etc', parentId: 'cat-ichiban', order: 2 },
  { id: 'sub-figure-1', name: '반다이', slug: 'bandai', parentId: 'cat-figure', order: 1 },
  { id: 'sub-figure-2', name: '후류', slug: 'furyu', parentId: 'cat-figure', order: 2 },
  { id: 'sub-figure-3', name: '세가', slug: 'sega', parentId: 'cat-figure', order: 3 },
  { id: 'sub-figure-4', name: '기타', slug: 'figure-etc', parentId: 'cat-figure', order: 4 },
  { id: 'sub-gacha-1', name: '반다이', slug: 'gacha-bandai', parentId: 'cat-gacha', order: 1 },
  { id: 'sub-gacha-2', name: '일반', slug: 'gacha-general', parentId: 'cat-gacha', order: 2 },
  { id: 'sub-goods-1', name: '일반', slug: 'goods-general', parentId: 'cat-goods', order: 1 },
];

// mockData는 더 이상 사용하지 않음 - 모든 데이터는 Supabase에서 가져옴
export const MOCK_PRODUCTS: Product[] = [];
export const MOCK_NOTICES: Notice[] = [];
export const MOCK_INQUIRIES: Inquiry[] = [];
export const MOCK_ORDERS: Order[] = [];
