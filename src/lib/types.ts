export type Locale = "en" | "ar";

export type ProductDTO = {
  id: number;
  slug: string;
  nameEn: string;
  nameAr: string;
  descriptionEn: string;
  descriptionAr: string;
  price: number;
  compareAtPrice: number | null;
  image: string;
  gallery: string[];
  amazonUrl: string;
  categorySlug: string;
  badgeEn: string | null;
  badgeAr: string | null;
  rating: number;
  reviewsCount: number;
  stock: number;
  isFeatured: boolean;
  isActive: boolean;
  createdAt: string;
};

export type CategoryDTO = {
  id: number;
  slug: string;
  nameEn: string;
  nameAr: string;
  descriptionEn: string;
  descriptionAr: string;
  image: string;
  size: "normal" | "large" | "wide";
  sortOrder: number;
};

export type CartLine = {
  slug: string;
  nameEn: string;
  nameAr: string;
  price: number;
  image: string;
  quantity: number;
  stock: number;
};
