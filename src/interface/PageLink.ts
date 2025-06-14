interface PageLinks {
  self: { href: string }[]
  collection: { href: string }[]
  about: { href: string }[]
  author: { embeddable: boolean; href: string }[]
  replies: { embeddable: boolean; href: string }[]
  'version-history': { count: number; href: string }[]
  'predecessor-version': { id: number; href: string }[]
  'wp:attachment': { href: string }[]
  curies: { name: string; href: string; templated: boolean }[]
}

export interface BannerVideo {
  ID: number
  id: number
  title: string
  filename: string
  filesize: number
  url: string
  link: string
  alt: string
  author: string
  description: string
  caption: string
  name: string
  status: string
  uploaded_to: number
  date: string
  modified: string
  menu_order: number
  mime_type: string
  type: string
  subtype: string
  icon: string
  width: number
  height: number
}

export interface CarouselItemAbout {
  logo: string
  image: string
  file: string
  route: string
}

interface ACF {
  carousel: CarouselItemAbout[]
  banner_image: boolean
  banner_video: BannerVideo
  banner_carousel: BannerCarousel[]
  popup_content: string
  popup_content_mobile: string
  ocassional_gif: string
  ocassional_gif_mobile: string
}
export interface BannerCarousel {
  video: string
  centered_image: boolean | string
  logo: boolean | string
  product_category: ProductCategory[]
  redirect_url: string
  title: string
}

interface ProductCategory {
  term_id: number
  name: string
  slug: string
  term_group: number
  term_taxonomy_id: number
  taxonomy: string
  description: string
  parent: number
  count: number
  filter: string
}

interface GUID {
  rendered: string
}

interface Title {
  rendered: string
}

interface Content {
  rendered: string
  protected: boolean
}

interface Excerpt {
  rendered: string
  protected: boolean
}

interface Meta {
  _acf_changed: boolean
  footnotes: string
}

export interface WordPressPage {
  id: number
  date: string
  date_gmt: string
  guid: GUID
  modified: string
  modified_gmt: string
  slug: string
  status: string
  type: string
  link: string
  title: Title
  content: Content
  excerpt: Excerpt
  author: number
  featured_media: number
  parent: number
  menu_order: number
  comment_status: string
  ping_status: string
  template: string
  meta: Meta
  acf: ACF
  jetpack_sharing_enabled: boolean
  _links: PageLinks
}
