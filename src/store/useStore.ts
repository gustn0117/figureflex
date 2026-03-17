'use client';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { User, Product, CartItem, Order, Notice, Inquiry, Category } from '@/types';
import {
  MOCK_USERS, MOCK_PRODUCTS, MOCK_NOTICES, MOCK_INQUIRIES, MOCK_ORDERS,
  MAIN_CATEGORIES, SUB_CATEGORIES, GRADE_DISCOUNTS, DEPOSIT_RATES
} from '@/data/mockData';

interface AppState {
  // Auth
  currentUser: User | null;
  users: User[];
  login: (email: string, password: string) => User | null;
  logout: () => void;
  register: (user: Omit<User, 'id' | 'status' | 'referralCode' | 'createdAt'>) => boolean;
  approveUser: (userId: string) => void;
  rejectUser: (userId: string) => void;
  updateUserGrade: (userId: string, grade: User['grade']) => void;
  updateUser: (userId: string, data: Partial<User>) => void;
  deleteUser: (userId: string) => void;

  // Categories
  categories: Category[];
  subCategories: Category[];
  addCategory: (cat: Category) => void;
  updateCategory: (id: string, data: Partial<Category>) => void;
  deleteCategory: (id: string) => void;
  addSubCategory: (cat: Category) => void;
  updateSubCategory: (id: string, data: Partial<Category>) => void;
  deleteSubCategory: (id: string) => void;

  // Grade discounts
  gradeDiscounts: Record<string, number>;
  updateGradeDiscount: (grade: string, rate: number) => void;

  // Deposit rates
  depositRates: Record<string, number>;
  updateDepositRate: (grade: string, rate: number) => void;

  // Products
  products: Product[];
  addProduct: (product: Product) => void;
  updateProduct: (id: string, data: Partial<Product>) => void;
  deleteProduct: (id: string) => void;
  deleteProducts: (ids: string[]) => void;
  toggleSoldout: (id: string) => void;

  // Cart
  cart: CartItem[];
  addToCart: (productId: string, quantity: number) => void;
  updateCartQuantity: (productId: string, quantity: number) => void;
  removeFromCart: (productId: string) => void;
  clearCart: () => void;

  // Orders
  orders: Order[];
  placeOrder: () => string | null;
  updateOrderStatus: (orderId: string, status: Order['status']) => void;

  // Notices
  notices: Notice[];
  addNotice: (notice: Notice) => void;
  updateNotice: (id: string, data: Partial<Notice>) => void;
  deleteNotice: (id: string) => void;

  // Inquiries
  inquiries: Inquiry[];
  addInquiry: (inquiry: Inquiry) => void;
  replyInquiry: (id: string, reply: string) => void;
}

export const useStore = create<AppState>()(
  persist(
    (set, get) => ({
      // Auth
      currentUser: null,
      users: MOCK_USERS,
      login: (email, password) => {
        const user = get().users.find(u => u.email === email && u.password === password);
        if (user && user.status === 'approved') {
          set({ currentUser: user });
          return user;
        }
        return null;
      },
      logout: () => set({ currentUser: null, cart: [] }),
      register: (userData) => {
        const exists = get().users.find(u => u.email === userData.email);
        if (exists) return false;
        const newUser: User = {
          ...userData,
          id: `user-${Date.now()}`,
          status: 'pending',
          referralCode: `REF${Date.now().toString(36).toUpperCase()}`,
          createdAt: new Date().toISOString().split('T')[0],
        };
        set(state => ({ users: [...state.users, newUser] }));
        return true;
      },
      approveUser: (userId) => set(state => ({
        users: state.users.map(u => u.id === userId ? { ...u, status: 'approved' as const } : u)
      })),
      rejectUser: (userId) => set(state => ({
        users: state.users.map(u => u.id === userId ? { ...u, status: 'rejected' as const } : u)
      })),
      updateUserGrade: (userId, grade) => set(state => ({
        users: state.users.map(u => u.id === userId ? { ...u, grade } : u)
      })),
      updateUser: (userId, data) => set(state => ({
        users: state.users.map(u => u.id === userId ? { ...u, ...data } : u)
      })),
      deleteUser: (userId) => set(state => ({
        users: state.users.filter(u => u.id !== userId)
      })),

      // Categories
      categories: MAIN_CATEGORIES,
      subCategories: SUB_CATEGORIES,
      addCategory: (cat) => set(state => ({ categories: [...state.categories, cat] })),
      updateCategory: (id, data) => set(state => ({
        categories: state.categories.map(c => c.id === id ? { ...c, ...data } : c)
      })),
      deleteCategory: (id) => set(state => ({
        categories: state.categories.filter(c => c.id !== id),
        subCategories: state.subCategories.filter(sc => sc.parentId !== id),
      })),
      addSubCategory: (cat) => set(state => ({ subCategories: [...state.subCategories, cat] })),
      updateSubCategory: (id, data) => set(state => ({
        subCategories: state.subCategories.map(c => c.id === id ? { ...c, ...data } : c)
      })),
      deleteSubCategory: (id) => set(state => ({
        subCategories: state.subCategories.filter(c => c.id !== id)
      })),

      // Grade discounts
      gradeDiscounts: { ...GRADE_DISCOUNTS },
      updateGradeDiscount: (grade, rate) => set(state => ({
        gradeDiscounts: { ...state.gradeDiscounts, [grade]: rate }
      })),

      // Deposit rates
      depositRates: { ...DEPOSIT_RATES },
      updateDepositRate: (grade, rate) => set(state => ({
        depositRates: { ...state.depositRates, [grade]: rate }
      })),

      // Products
      products: MOCK_PRODUCTS,
      addProduct: (product) => set(state => ({ products: [...state.products, product] })),
      updateProduct: (id, data) => set(state => ({
        products: state.products.map(p => p.id === id ? { ...p, ...data } : p)
      })),
      deleteProduct: (id) => set(state => ({
        products: state.products.filter(p => p.id !== id)
      })),
      deleteProducts: (ids) => set(state => ({
        products: state.products.filter(p => !ids.includes(p.id))
      })),
      toggleSoldout: (id) => set(state => ({
        products: state.products.map(p =>
          p.id === id ? { ...p, status: p.status === 'soldout' ? 'sale' : 'soldout' } : p
        )
      })),

      // Cart
      cart: [],
      addToCart: (productId, quantity) => set(state => {
        const existing = state.cart.find(c => c.productId === productId);
        if (existing) {
          return { cart: state.cart.map(c => c.productId === productId ? { ...c, quantity: c.quantity + quantity } : c) };
        }
        return { cart: [...state.cart, { productId, quantity }] };
      }),
      updateCartQuantity: (productId, quantity) => set(state => ({
        cart: state.cart.map(c => c.productId === productId ? { ...c, quantity } : c)
      })),
      removeFromCart: (productId) => set(state => ({
        cart: state.cart.filter(c => c.productId !== productId)
      })),
      clearCart: () => set({ cart: [] }),

      // Orders
      orders: MOCK_ORDERS,
      placeOrder: () => {
        const state = get();
        if (!state.currentUser || state.cart.length === 0) return null;
        const user = state.currentUser;
        const discountRate = GRADE_DISCOUNTS[user.grade] || 0;
        const items = state.cart.map(ci => {
          const product = state.products.find(p => p.id === ci.productId)!;
          const discount = state.gradeDiscounts[user.grade] || 0;
          const unitPrice = Math.round(product.basePrice * (1 - discount));
          return {
            productId: ci.productId,
            productName: product.name,
            quantity: ci.quantity,
            unitPrice,
            totalPrice: unitPrice * ci.quantity,
          };
        });
        const totalAmount = items.reduce((sum, i) => sum + i.totalPrice, 0);
        const depositRate = state.depositRates[user.grade] ?? 1;
        const depositAmount = Math.round(totalAmount * depositRate);
        const order: Order = {
          id: `order-${Date.now()}`,
          userId: user.id,
          userName: user.name,
          userGrade: user.grade,
          items,
          totalAmount,
          discountRate,
          finalAmount: totalAmount,
          depositAmount,
          status: 'pending',
          createdAt: new Date().toISOString().split('T')[0],
          paidAmount: 0,
        };
        set(state => ({ orders: [...state.orders, order], cart: [] }));
        return order.id;
      },
      updateOrderStatus: (orderId, status) => set(state => ({
        orders: state.orders.map(o => o.id === orderId ? { ...o, status } : o)
      })),

      // Notices
      notices: MOCK_NOTICES,
      addNotice: (notice) => set(state => ({ notices: [notice, ...state.notices] })),
      updateNotice: (id, data) => set(state => ({
        notices: state.notices.map(n => n.id === id ? { ...n, ...data } : n)
      })),
      deleteNotice: (id) => set(state => ({
        notices: state.notices.filter(n => n.id !== id)
      })),

      // Inquiries
      inquiries: MOCK_INQUIRIES,
      addInquiry: (inquiry) => set(state => ({ inquiries: [inquiry, ...state.inquiries] })),
      replyInquiry: (id, reply) => set(state => ({
        inquiries: state.inquiries.map(inq => inq.id === id ? { ...inq, reply, repliedAt: new Date().toISOString().split('T')[0] } : inq)
      })),
    }),
    {
      name: 'figureflex-store',
      version: 4,
    }
  )
);
