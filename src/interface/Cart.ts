interface Category {
  id: number
  name: string
  slug: string
}
export type SelectedOptions = {
  [key: string]: string
}

export interface CartItemApi {
  cart_item_key: string
  product_id: number
  name: string
  slug: string
  parent_slug: string
  image: string
  quantity: number
  price: string
  total: number
  variation_id: number
  variation: Record<string, string> // Define the structure if known
  categories: Category[]
  sale_price: number
  regular_price: number
  discount_price: number
  selectedMrp?: number | string
  type: string
  selectedQuantity?: number
  selectedImage?: string
  selectedOptions?: CartOptions
}
interface CartOptions {
  [key: string]: string
}
export interface Cart {
  items: CartItemApi[]
  total: string
  subtotal: string
  tax_total: number
}

interface LineTaxData {
  subtotal: any[] // Define a more specific type if known
  total: any[] // Define a more specific type if known
}

interface CartItem {
  key: string
  product_id: number
  variation_id: number
  variation: any[] // Define a more specific type if known
  quantity: number
  data_hash: string
  line_tax_data: LineTaxData
  line_subtotal: number
  line_subtotal_tax: number
  line_total: number
  line_tax: number
  data: Record<string, unknown> // Adjust type as necessary
}

interface CartR {
  [key: string]: CartItem
}

export interface CartResponse {
  success: boolean
  message: string
  cart: CartR
}
