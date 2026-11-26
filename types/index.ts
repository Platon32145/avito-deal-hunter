export type Monitor = {
  id: string;
  title: string;
  query: string;
  region: string;
  max_price: number | null;
  min_discount_percent: number;
  is_active: boolean;
  created_at: string;
};

export type Listing = {
  id: string;
  source: string;
  external_id: string;
  title: string;
  price: number;
  currency: string;
  region: string | null;
  url: string;
  image_url: string | null;
  discount_percent: number | null;
  published_at: string | null;
  first_seen_at: string;
};
