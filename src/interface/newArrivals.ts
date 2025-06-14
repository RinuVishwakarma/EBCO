// productRange.tsx

export interface Arrivals {
    id: number;
    image: string;
    name:string;
    Image2:string;
    description: string;
    categories: Category[]
}
interface Category {
    id: number;
    name: string;
    slug: string;
  }
