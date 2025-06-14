// productRange.tsx

export interface SmartSolutions {
  id: number;
  image: Image[];
  title: string;
  discountPercent?: number;
  price?: number | string;
  regular_price?: number | string;
  discountedPrice?: number | string;
  categories: Category[];
  has_options: boolean;
  priceHtml?: string;
  slug: string
}
interface Category {
  id: number;
  name: string;
  slug: string;
}

interface Image {
  src: string;
  name: string;
}
