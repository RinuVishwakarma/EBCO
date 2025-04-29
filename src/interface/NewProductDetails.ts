export interface NewProductDetails {
    products: NewProduct[]
    pagination?: NewPagination
  }
  
  export interface NewProduct {
    id: number
    image_urls:{
      featured_image: string
      gallery_images: string[]
    }
    name: string
    slug: string
    price: string
    regular_price: string
    sale_price: string
    status: string
    featured: boolean
    description: string
    short_description: string
    categories: NewCategory[]
    tags: NewTag[]
    images: NewImage[]
    stock_status: string
    stock_quantity?: number
    acf_fields: NewAcfFields
    is_wishlist?:boolean
    is_bookmark?:boolean
    has_options?: boolean
    price_html?: string
  }
  
  export interface NewCategory {
    id: number
    name: string
    slug: string
  }
  
  export interface NewTag {
    id: number
    name: string
    slug: string
  }
  
  export interface NewImage {
    id: number
    src: string
    alt: string
  }
  export interface NewAcfFields {
    youtube_link: string
    "tab-specifications": string
    "tab-fitting_instructions": string
    "tab-caution": string
    "tab-packing_chart": string
    "tab-warranty": string
    "tab-returns": string
    "tab-additional_information": string
    is_shop_product: string
    product_video: boolean
    image_tag: string
    is_pinned: boolean
    "tab-technical_diagram": string
    segment_logo: string
    "tab-cad_data": boolean
  }
  
  export interface NewPagination {
    current_page: number
    per_page: number
    total_products: number
    total_pages: number
  }