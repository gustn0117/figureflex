export type UserGrade = 'VVIP' | 'VIP' | 'GOLD' | 'SILVER' | '일반';
export type UserRole = 'admin' | 'member';
export type UserStatus = 'pending' | 'approved' | 'rejected';
export type MemberType = 'chain' | 'external';

export interface User {
  id: string;
  email: string;
  // password는 서버에서만 처리, 클라이언트에 노출하지 않음
  name: string;
  company: string;
  phone: string;
  address: string;
  role: UserRole;
  grade: UserGrade;
  memberType: MemberType;
  status: UserStatus;
  referralCode: string;
  referredBy: string;
  photoUrl: string;
  createdAt: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  parentId: string | null;
  order: number;
}

export type ProductStatus = 'sale' | 'soldout' | 'expired' | 'upcoming';

export interface Product {
  id: string;
  name: string;
  description: string;
  detailContent: string;
  imageUrl: string;
  images: string[];
  categoryId: string;
  subCategoryId: string;
  basePrice: number;
  prices: Record<UserGrade, number>;
  minQuantity: number;
  maxQuantity: number;
  quantityStep?: number;
  stock: number;
  saleStartDate: string;
  saleEndDate: string;
  status: ProductStatus;
  origin: string;
  manufacturer: string;
  visibleGrades: string[];
  createdAt: string;
}

export interface CartItem {
  productId: string;
  quantity: number;
}

export interface OrderItem {
  productId: string;
  productName: string;
  productImage?: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
}

export type OrderStatus = 'pending' | 'confirmed' | 'preparing' | 'shipped' | 'completed' | 'cancelled';

export interface Order {
  id: string;
  userId: string;
  userName: string;
  userGrade: UserGrade;
  items: OrderItem[];
  totalAmount: number;
  discountRate: number;
  finalAmount: number;
  depositAmount: number;
  status: OrderStatus;
  createdAt: string;
  paidAmount: number;
}

export interface Notice {
  id: string;
  title: string;
  content: string;
  images: string[];
  createdAt: string;
  isImportant: boolean;
}

export interface Inquiry {
  id: string;
  userId: string;
  userName: string;
  title: string;
  content: string;
  imageUrl: string;
  reply: string;
  createdAt: string;
  repliedAt: string;
}
