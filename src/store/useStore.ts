'use client';
import { create } from 'zustand';
import { User, Product, CartItem, Order, Notice, Inquiry, Category, UserGrade } from '@/types';

// camelCase ↔ snake_case 변환 없이 API가 이미 camelCase로 반환함

interface AppState {
  // Auth
  currentUser: User | null;
  users: User[];
  isLoadingAuth: boolean;
  initSession: () => Promise<void>;
  login: (email: string, password: string) => Promise<{ user: User | null; error: string | null }>;
  logout: () => Promise<void>;
  register: (data: {
    email: string; password: string; name: string; company: string;
    phone: string; address: string; memberType: string;
    referredBy: string; photoUrl: string;
  }) => Promise<{ ok: boolean; error: string | null }>;
  fetchUsers: () => Promise<void>;
  approveUser: (userId: string) => Promise<void>;
  rejectUser: (userId: string) => Promise<void>;
  updateUserGrade: (userId: string, grade: UserGrade) => Promise<void>;
  updateUser: (userId: string, data: Partial<User>) => Promise<void>;
  deleteUser: (userId: string) => Promise<void>;

  // Categories
  categories: Category[];
  subCategories: Category[];
  fetchCategories: () => Promise<void>;
  addCategory: (cat: Omit<Category, 'id'> & { id?: string }) => Promise<void>;
  updateCategory: (id: string, data: Partial<Category>) => void;
  deleteCategory: (id: string) => Promise<void>;
  addSubCategory: (cat: Omit<Category, 'id'> & { id?: string }) => Promise<void>;
  updateSubCategory: (id: string, data: Partial<Category>) => void;
  deleteSubCategory: (id: string) => Promise<void>;

  // Grade settings
  gradeDiscounts: Record<string, number>;
  depositRates: Record<string, number>;
  fetchSettings: () => Promise<void>;
  updateGradeDiscount: (grade: string, rate: number) => void;
  updateDepositRate: (grade: string, rate: number) => void;
  saveSettings: () => Promise<void>;

  // Products
  products: Product[];
  fetchProducts: () => Promise<void>;
  addProduct: (product: Omit<Product, 'id' | 'createdAt' | 'prices'>) => Promise<void>;
  updateProduct: (id: string, data: Partial<Omit<Product, 'prices'>>) => Promise<void>;
  deleteProduct: (id: string) => Promise<void>;
  deleteProducts: (ids: string[]) => Promise<void>;
  toggleSoldout: (id: string) => Promise<void>;

  // Cart (DB)
  cart: CartItem[];
  fetchCart: () => Promise<void>;
  addToCart: (productId: string, quantity: number) => Promise<void>;
  updateCartQuantity: (productId: string, quantity: number) => Promise<void>;
  removeFromCart: (productId: string) => Promise<void>;
  clearCart: () => Promise<void>;

  // Orders
  orders: Order[];
  fetchOrders: () => Promise<void>;
  placeOrder: () => Promise<string | null>;
  updateOrderStatus: (orderId: string, status: Order['status']) => Promise<void>;
  deleteOrders: (orderIds: string[]) => Promise<void>;

  // Notices
  notices: Notice[];
  fetchNotices: () => Promise<void>;
  addNotice: (notice: Omit<Notice, 'id' | 'createdAt'>) => Promise<void>;
  updateNotice: (id: string, data: Partial<Notice>) => Promise<void>;
  deleteNotice: (id: string) => Promise<void>;

  // Inquiries
  inquiries: Inquiry[];
  fetchInquiries: () => Promise<void>;
  addInquiry: (inquiry: Omit<Inquiry, 'id' | 'createdAt' | 'reply' | 'repliedAt'>) => Promise<void>;
  replyInquiry: (id: string, reply: string) => Promise<void>;
}

function calcPrices(basePrice: number, gradeDiscounts: Record<string, number>): Record<UserGrade, number> {
  const grades: UserGrade[] = ['VVIP', 'VIP', 'GOLD', 'SILVER', '일반'];
  const prices: Record<UserGrade, number> = { VVIP: 0, VIP: 0, GOLD: 0, SILVER: 0, '일반': 0 };
  for (const g of grades) {
    prices[g] = Math.round(basePrice * (1 - (gradeDiscounts[g] ?? 0)));
  }
  return prices;
}

export const useStore = create<AppState>()(
    (set, get) => ({
      // ─── Auth ───────────────────────────────────────────────────────────
      currentUser: null,
      users: [],
      isLoadingAuth: false,

      initSession: async () => {
        set({ isLoadingAuth: true });
        try {
          const res = await fetch('/api/auth/me');
          const data = await res.json();
          set({ currentUser: data.user ?? null });
        } catch {
          set({ currentUser: null });
        } finally {
          set({ isLoadingAuth: false });
        }
      },

      login: async (email, password) => {
        try {
          const res = await fetch('/api/auth/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password }),
          });
          const data = await res.json();
          if (!res.ok) return { user: null, error: data.error ?? '로그인 실패' };
          set({ currentUser: data.user });
          return { user: data.user, error: null };
        } catch {
          return { user: null, error: '서버 오류가 발생했습니다.' };
        }
      },

      logout: async () => {
        try {
          await fetch('/api/auth/logout', { method: 'POST' });
        } catch {
          // 무시
        }
        set({ currentUser: null, cart: [], orders: [] });
      },

      register: async (data) => {
        try {
          const res = await fetch('/api/auth/register', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data),
          });
          const result = await res.json();
          if (!res.ok) return { ok: false, error: result.error ?? '회원가입 실패' };
          return { ok: true, error: null };
        } catch {
          return { ok: false, error: '서버 오류가 발생했습니다.' };
        }
      },

      fetchUsers: async () => {
        try {
          const res = await fetch('/api/users');
          const data = await res.json();
          if (res.ok) set({ users: data.users ?? [] });
        } catch {
          // 무시
        }
      },

      approveUser: async (userId) => {
        await fetch(`/api/users/${userId}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ status: 'approved' }),
        });
        set(state => ({
          users: state.users.map(u => u.id === userId ? { ...u, status: 'approved' as const } : u)
        }));
      },

      rejectUser: async (userId) => {
        await fetch(`/api/users/${userId}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ status: 'rejected' }),
        });
        set(state => ({
          users: state.users.map(u => u.id === userId ? { ...u, status: 'rejected' as const } : u)
        }));
      },

      updateUserGrade: async (userId, grade) => {
        await fetch(`/api/users/${userId}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ grade }),
        });
        set(state => ({
          users: state.users.map(u => u.id === userId ? { ...u, grade } : u)
        }));
      },

      updateUser: async (userId, data) => {
        await fetch(`/api/users/${userId}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(data),
        });
        set(state => ({
          users: state.users.map(u => u.id === userId ? { ...u, ...data } : u)
        }));
      },

      deleteUser: async (userId) => {
        await fetch(`/api/users/${userId}`, { method: 'DELETE' });
        set(state => ({ users: state.users.filter(u => u.id !== userId) }));
      },

      // ─── Categories ─────────────────────────────────────────────────────
      categories: [],
      subCategories: [],

      fetchCategories: async () => {
        try {
          const res = await fetch('/api/categories');
          const data = await res.json();
          if (res.ok) {
            set({ categories: data.categories ?? [], subCategories: data.subCategories ?? [] });
          }
        } catch {
          // 무시
        }
      },

      addCategory: async (cat) => {
        const id = cat.id ?? `cat-${Date.now()}`;
        const slug = cat.slug || cat.name.toLowerCase().replace(/\s+/g, '-');
        try {
          const res = await fetch('/api/categories', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ id, name: cat.name, slug, parentId: null, order: cat.order }),
          });
          const data = await res.json();
          if (res.ok && data.category) {
            set(state => ({ categories: [...state.categories, data.category] }));
          }
        } catch {
          // 무시
        }
      },

      updateCategory: (id, data) => {
        // 즉시 로컬 반영 후 API 호출 (낙관적 업데이트)
        set(state => ({
          categories: state.categories.map(c => c.id === id ? { ...c, ...data } : c)
        }));
        fetch('/api/categories', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ id, ...data }),
        }).catch(() => {});
      },

      deleteCategory: async (id) => {
        await fetch(`/api/categories?id=${id}`, { method: 'DELETE' });
        set(state => ({
          categories: state.categories.filter(c => c.id !== id),
          subCategories: state.subCategories.filter(sc => sc.parentId !== id),
        }));
      },

      addSubCategory: async (cat) => {
        const id = cat.id ?? `sub-${Date.now()}`;
        const slug = cat.slug || cat.name.toLowerCase().replace(/\s+/g, '-');
        try {
          const res = await fetch('/api/categories', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ id, name: cat.name, slug, parentId: cat.parentId, order: cat.order }),
          });
          const data = await res.json();
          if (res.ok && data.category) {
            set(state => ({ subCategories: [...state.subCategories, data.category] }));
          }
        } catch {
          // 무시
        }
      },

      updateSubCategory: (id, data) => {
        set(state => ({
          subCategories: state.subCategories.map(c => c.id === id ? { ...c, ...data } : c)
        }));
        fetch('/api/categories', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ id, ...data }),
        }).catch(() => {});
      },

      deleteSubCategory: async (id) => {
        await fetch(`/api/categories?id=${id}`, { method: 'DELETE' });
        set(state => ({ subCategories: state.subCategories.filter(c => c.id !== id) }));
      },

      // ─── Grade Settings ──────────────────────────────────────────────────
      gradeDiscounts: { VVIP: 0, VIP: 0, GOLD: 0, SILVER: 0, '일반': 0 },
      depositRates: { VVIP: 1, VIP: 1, GOLD: 1, SILVER: 1, '일반': 1 },

      fetchSettings: async () => {
        try {
          const res = await fetch('/api/settings?t=' + Date.now(), { cache: 'no-store' });
          const data = await res.json();
          if (res.ok && data.gradeDiscounts) {
            set({
              gradeDiscounts: data.gradeDiscounts,
              depositRates: data.depositRates,
            });
          }
        } catch {
          // 무시
        }
      },

      updateGradeDiscount: (grade, rate) => {
        set(state => ({ gradeDiscounts: { ...state.gradeDiscounts, [grade]: rate } }));
      },

      updateDepositRate: (grade, rate) => {
        set(state => ({ depositRates: { ...state.depositRates, [grade]: rate } }));
      },

      saveSettings: async () => {
        const { gradeDiscounts, depositRates } = get();
        const res = await fetch('/api/settings', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ gradeDiscounts, depositRates }),
        });
        if (!res.ok) {
          const data = await res.json().catch(() => ({}));
          throw new Error(data.error || '저장 실패');
        }
      },

      // ─── Products ───────────────────────────────────────────────────────
      products: [],

      fetchProducts: async () => {
        try {
          const res = await fetch('/api/products');
          const data = await res.json();
          if (res.ok) {
            const { gradeDiscounts } = get();
            const products = (data.products ?? []).map((p: Product) => ({
              ...p,
              prices: calcPrices(p.basePrice, gradeDiscounts),
            }));
            set({ products });
          }
        } catch {
          // 무시
        }
      },

      addProduct: async (productData) => {
        try {
          const res = await fetch('/api/products', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(productData),
          });
          const data = await res.json();
          if (res.ok && data.product) {
            const { gradeDiscounts } = get();
            const product = { ...data.product, prices: calcPrices(data.product.basePrice, gradeDiscounts) };
            set(state => ({ products: [product, ...state.products] }));
          }
        } catch {
          // 무시
        }
      },

      updateProduct: async (id, productData) => {
        try {
          await fetch(`/api/products/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(productData),
          });
          const { gradeDiscounts } = get();
          set(state => ({
            products: state.products.map(p => {
              if (p.id !== id) return p;
              const updated = { ...p, ...productData };
              return { ...updated, prices: calcPrices(updated.basePrice, gradeDiscounts) };
            })
          }));
        } catch {
          // 무시
        }
      },

      deleteProduct: async (id) => {
        await fetch(`/api/products/${id}`, { method: 'DELETE' });
        set(state => ({ products: state.products.filter(p => p.id !== id) }));
      },

      deleteProducts: async (ids) => {
        await Promise.all(ids.map(id =>
          fetch(`/api/products/${id}`, { method: 'DELETE' })
        ));
        set(state => ({ products: state.products.filter(p => !ids.includes(p.id)) }));
      },

      toggleSoldout: async (id) => {
        const product = get().products.find(p => p.id === id);
        if (!product) return;
        const newStatus = product.status === 'soldout' ? 'sale' : 'soldout';
        await fetch(`/api/products/${id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ status: newStatus }),
        });
        set(state => ({
          products: state.products.map(p => p.id === id ? { ...p, status: newStatus } : p)
        }));
      },

      // ─── Cart (DB) ────────────────────────────────────────────────────
      cart: [],

      fetchCart: async () => {
        try {
          const res = await fetch('/api/cart');
          const data = await res.json();
          if (res.ok) set({ cart: data.cart ?? [] });
        } catch { /* ignore */ }
      },

      addToCart: async (productId, quantity) => {
        // 낙관적 업데이트
        set(state => {
          const existing = state.cart.find(c => c.productId === productId);
          if (existing) {
            return { cart: state.cart.map(c => c.productId === productId ? { ...c, quantity: c.quantity + quantity } : c) };
          }
          return { cart: [...state.cart, { productId, quantity }] };
        });
        await fetch('/api/cart', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ productId, quantity }),
        });
      },

      updateCartQuantity: async (productId, quantity) => {
        set(state => ({
          cart: state.cart.map(c => c.productId === productId ? { ...c, quantity } : c)
        }));
        await fetch('/api/cart', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ productId, quantity }),
        });
      },

      removeFromCart: async (productId) => {
        set(state => ({ cart: state.cart.filter(c => c.productId !== productId) }));
        await fetch('/api/cart', {
          method: 'DELETE',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ productId }),
        });
      },

      clearCart: async () => {
        set({ cart: [] });
        await fetch('/api/cart', { method: 'DELETE' });
      },

      // ─── Orders ─────────────────────────────────────────────────────────
      orders: [],

      fetchOrders: async () => {
        try {
          const res = await fetch('/api/orders');
          const data = await res.json();
          if (res.ok) set({ orders: data.orders ?? [] });
        } catch {
          // 무시
        }
      },

      placeOrder: async () => {
        const state = get();
        if (!state.currentUser || state.cart.length === 0) return null;
        const user = state.currentUser;
        const discountRate = state.gradeDiscounts[user.grade] ?? 0;
        const depositRate = state.depositRates[user.grade] ?? 1;

        const items = state.cart.map(ci => {
          const product = state.products.find(p => p.id === ci.productId);
          if (!product) return null;
          const unitPrice = Math.round(product.basePrice * (1 - discountRate));
          return {
            productId: ci.productId,
            productName: product.name,
            productImage: product.imageUrl || '',
            quantity: ci.quantity,
            unitPrice,
            totalPrice: unitPrice * ci.quantity,
          };
        }).filter(Boolean);

        if (items.length === 0) return null;

        const totalAmount = items.reduce((sum, i) => sum + i!.totalPrice, 0);
        const depositAmount = Math.round(totalAmount * depositRate);

        try {
          const res = await fetch('/api/orders', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              userId: user.id,
              userName: user.name,
              userGrade: user.grade,
              items,
              totalAmount,
              discountRate,
              finalAmount: totalAmount,
              depositAmount,
              paidAmount: 0,
            }),
          });
          const data = await res.json();
          if (!res.ok || !data.order) return null;

          set(state => ({
            orders: [data.order, ...state.orders],
            cart: [],
          }));
          // DB에서도 장바구니 비우기
          fetch('/api/cart', { method: 'DELETE' }).catch(() => {});
          return data.order.id;
        } catch {
          return null;
        }
      },

      updateOrderStatus: async (orderId, status) => {
        await fetch(`/api/orders/${orderId}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ status }),
        });
        set(state => ({
          orders: state.orders.map(o => o.id === orderId ? { ...o, status } : o)
        }));
      },

      deleteOrders: async (orderIds) => {
        await Promise.all(orderIds.map(id =>
          fetch(`/api/orders/${id}`, { method: 'DELETE' })
        ));
        set(state => ({
          orders: state.orders.filter(o => !orderIds.includes(o.id))
        }));
      },

      // ─── Notices ────────────────────────────────────────────────────────
      notices: [],

      fetchNotices: async () => {
        try {
          const res = await fetch('/api/notices');
          const data = await res.json();
          if (res.ok) set({ notices: data.notices ?? [] });
        } catch {
          // 무시
        }
      },

      addNotice: async (noticeData) => {
        try {
          const res = await fetch('/api/notices', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(noticeData),
          });
          const data = await res.json();
          if (res.ok && data.notice) {
            set(state => ({ notices: [data.notice, ...state.notices] }));
          }
        } catch {
          // 무시
        }
      },

      updateNotice: async (id, noticeData) => {
        try {
          await fetch(`/api/notices/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(noticeData),
          });
          set(state => ({
            notices: state.notices.map(n => n.id === id ? { ...n, ...noticeData } : n)
          }));
        } catch {
          // 무시
        }
      },

      deleteNotice: async (id) => {
        await fetch(`/api/notices/${id}`, { method: 'DELETE' });
        set(state => ({ notices: state.notices.filter(n => n.id !== id) }));
      },

      // ─── Inquiries ──────────────────────────────────────────────────────
      inquiries: [],

      fetchInquiries: async () => {
        try {
          const res = await fetch('/api/inquiries');
          const data = await res.json();
          if (res.ok) set({ inquiries: data.inquiries ?? [] });
        } catch {
          // 무시
        }
      },

      addInquiry: async (inquiryData) => {
        try {
          const res = await fetch('/api/inquiries', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(inquiryData),
          });
          const data = await res.json();
          if (res.ok && data.inquiry) {
            set(state => ({ inquiries: [data.inquiry, ...state.inquiries] }));
          }
        } catch {
          // 무시
        }
      },

      replyInquiry: async (id, reply) => {
        try {
          await fetch(`/api/inquiries/${id}`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ reply }),
          });
          const today = new Date().toISOString().split('T')[0];
          set(state => ({
            inquiries: state.inquiries.map(inq =>
              inq.id === id ? { ...inq, reply, repliedAt: today } : inq
            )
          }));
        } catch {
          // 무시
        }
      },
    })
);
