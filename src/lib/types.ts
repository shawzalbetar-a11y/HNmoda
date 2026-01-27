export type ProductStatus = 'available' | 'sold_out';
export type Season = 'spring' | 'summer' | 'autumn' | 'winter';
export type ProductType = 'dress' | 'coat' | 'jacket' | 't-shirt' | 'gown' | 'jeans';

export interface Product {
  id: string;
  name: Record<string, string>;
  description: Record<string, string>;
  images: string[];
  status: ProductStatus;
  season: Season;
  type: ProductType;
  collection: string;
  model: string;
  videoUrl?: string;
  price?: number;
}

export interface Collection {
  id: string;
  name: Record<string, string>;
}
