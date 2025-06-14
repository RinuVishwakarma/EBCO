// Define the ProductDetails interface
// Interface for model value
export interface ModelValue {
  modelText: string
  modelImage: string
}

// export Interface for code value
export interface CodeValue {
  codeText: string
}

// export Interface for size value
export interface SizeValue {
  sizes: string[]
}

// export Interface for finish value
export interface FinishValue {
  finishText: string
}

// Union type to represent the possible value types
export type SpecificationValue = {
  valueText: string | string[]
  valueImage?: string
}

// export Interface for a single specification
export interface Specification {
  header: string
  value: SpecificationValue[]
}

// export Interface for the complete specifications array
export interface ProductSpecifications {
  specifications: Specification[]
}

interface Dimension {
  length: string
  width: string
  height: string
}

interface Category {
  id: number
  name: string
  slug: string
}

interface Tag {
  id: number
  name: string
  slug: string
}

export interface ImageProp {
  id: number
  date_created: string
  date_created_gmt: string
  date_modified: string
  date_modified_gmt: string
  src: string
  name: string
  alt: string
}

interface Attribute {
  id: number
  name: string
  slug: string
  position: number
  visible: boolean
  variation: boolean
  options: string[]
  option?: string
}

export interface MetaDataProp {
  id: number
  key: string
  value: string
}

interface Links {
  self: {
    href: string
  }[]
  collection: {
    href: string
  }[]
}
export interface CadData {
  title: string
  file: string
}

export interface ProductDetails {
  cad_data: CadData
  id: number
  name: string
  slug: string
  permalink: string
  date_created: string
  date_created_gmt: string
  date_modified: string
  date_modified_gmt: string
  type: string
  status: string
  featured: boolean
  catalog_visibility: string
  description: string
  short_description: string
  sku: string
  price: string
  regular_price: string
  sale_price: string
  date_on_sale_from: string | null
  date_on_sale_from_gmt: string | null
  date_on_sale_to: string | null
  date_on_sale_to_gmt: string | null
  on_sale: boolean
  purchasable: boolean
  is_bookmark: boolean
  is_wishlist: boolean
  total_sales: number
  virtual: boolean
  downloadable: boolean
  downloads: any[]
  download_limit: number
  download_expiry: number
  external_url: string
  button_text: string
  tax_status: string
  tax_class: string
  manage_stock: boolean
  stock_quantity: number | null
  backorders: string
  backorders_allowed: boolean
  backordered: boolean
  low_stock_amount: number | null
  sold_individually: boolean
  weight: string
  dimensions: Dimension
  shipping_required: boolean
  shipping_taxable: boolean
  shipping_class: string
  shipping_class_id: number
  reviews_allowed: boolean
  average_rating: string
  rating_count: number
  upsell_ids: number[]
  cross_sell_ids: number[]
  parent_id: number
  purchase_note: string
  categories: Category[]
  tags: Tag[]
  images: ImageProp[]
  attributes: Attribute[]
  default_attributes: any[]
  variations: number[]
  grouped_products: any[]
  menu_order: number
  price_html: string
  related_ids: number[]
  meta_data: MetaDataProp[]
  stock_status: string
  has_options: boolean
  post_password: string
  jetpack_sharing_enabled: boolean
  _links: Links
  segment_logo?: string
  tag?: string
  isEdit?: boolean
  isOptionsOpen?: boolean
  selectedSize?: string
  selectedColor?: string
  selectedQuantity?: number
  itemId: number
  itemURL: string
  specifications: string // New field for storing specifications
  fitting_instructions: string // New field for fitting instructions
  caution: string // New field for caution instructions
  warranty: string // New field for warranty information
  returns: string // New field for returns information
  selectedOptions: SelectedOptions // New field for selected attribute options
  selectedImage: string // New field for selected image
  selectedMrp: string // New field for selected MRP
  selectedDiscountedPrice: string // New field for selected discounted price
  parent_slug: string
  parent_categories: Category[]
}
export type SelectedOptions = {
  [key: string]: string
}
