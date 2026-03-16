import { User, Category, Product, Notice, Inquiry, Order } from '@/types';

export const GRADE_DISCOUNTS: Record<string, number> = {
  VVIP: 0.30,
  VIP: 0.20,
  GOLD: 0.10,
  SILVER: 0.05,
};

export const GRADE_LABELS: Record<string, string> = {
  VVIP: 'VVIP (30%)',
  VIP: 'VIP (20%)',
  GOLD: 'GOLD (10%)',
  SILVER: 'SILVER (5%)',
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
  // 제일복권
  { id: 'sub-ichiban-1', name: '이치방쿠지', slug: 'ichiban-kuji', parentId: 'cat-ichiban', order: 1 },
  { id: 'sub-ichiban-2', name: '기타', slug: 'ichiban-etc', parentId: 'cat-ichiban', order: 2 },
  // 피규어
  { id: 'sub-figure-1', name: '반다이', slug: 'bandai', parentId: 'cat-figure', order: 1 },
  { id: 'sub-figure-2', name: '후류', slug: 'furyu', parentId: 'cat-figure', order: 2 },
  { id: 'sub-figure-3', name: '세가', slug: 'sega', parentId: 'cat-figure', order: 3 },
  { id: 'sub-figure-4', name: '기타', slug: 'figure-etc', parentId: 'cat-figure', order: 4 },
  // 가챠
  { id: 'sub-gacha-1', name: '반다이', slug: 'gacha-bandai', parentId: 'cat-gacha', order: 1 },
  { id: 'sub-gacha-2', name: '일반', slug: 'gacha-general', parentId: 'cat-gacha', order: 2 },
  // 굿즈 - 하위 없음 (자유 추가)
];

export const MOCK_USERS: User[] = [
  {
    id: 'admin-1',
    email: 'admin@figureflex.com',
    password: 'admin1234',
    name: '관리자',
    company: '피규어플렉스',
    phone: '010-0000-0000',
    role: 'admin',
    grade: 'VVIP',
    memberType: 'chain',
    status: 'approved',
    referralCode: 'ADMIN001',
    referredBy: '',
    photoUrl: '',
    createdAt: '2025-01-01',
  },
  {
    id: 'user-1',
    email: 'chain@test.com',
    password: 'test1234',
    name: '체인점A',
    company: '체인스토어A',
    phone: '010-1111-1111',
    role: 'member',
    grade: 'VIP',
    memberType: 'chain',
    status: 'approved',
    referralCode: 'CHAIN001',
    referredBy: 'ADMIN001',
    photoUrl: '',
    createdAt: '2025-03-01',
  },
  {
    id: 'user-2',
    email: 'external@test.com',
    password: 'test1234',
    name: '외부업체B',
    company: '외부유통B',
    phone: '010-2222-2222',
    role: 'member',
    grade: 'GOLD',
    memberType: 'external',
    status: 'approved',
    referralCode: 'EXT001',
    referredBy: 'ADMIN001',
    photoUrl: '',
    createdAt: '2025-05-01',
  },
  {
    id: 'user-3',
    email: 'pending@test.com',
    password: 'test1234',
    name: '대기업체',
    company: '대기중',
    phone: '010-3333-3333',
    role: 'member',
    grade: 'SILVER',
    memberType: 'external',
    status: 'pending',
    referralCode: 'PEND001',
    referredBy: 'CHAIN001',
    photoUrl: '',
    createdAt: '2025-06-01',
  },
];

export const MOCK_PRODUCTS: Product[] = [];

export const MOCK_NOTICES: Notice[] = [];

export const MOCK_INQUIRIES: Inquiry[] = [];

export const MOCK_ORDERS: Order[] = [];
