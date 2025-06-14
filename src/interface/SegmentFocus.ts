export interface SegmentFocus {
  id: number
  date: string
  date_gmt: string
  guid: Guid
  modified: string
  modified_gmt: string
  slug: string
  status: string
  type: string
  link: string
  title: Title
  content: Content
  featured_media: number
  template: string
  meta: Meta
  'segment-focused-category': any[]
  acf: Acf
  _links: Links
}

export interface Guid {
  rendered: string
}

export interface Title {
  rendered: string
}

export interface Content {
  rendered: string
  protected: boolean
}

export interface Meta {
  _acf_changed: boolean
  rank_math_lock_modified_date: boolean
}

export interface Acf {
  banner_video: string
  banner_video_mobile: string
  carousel: SegmentCarousal[]
  content_section_3: ContentSection3
  bottom_cards: BottomCard[]
  sequencing: {
    sequence_banner: number
    sequence_carousel: number
    sequence_mid_content: number
    sequence_cards_carousel: number
  }
}

export interface SegmentCarousal {
  title: string
  description: string
  image: Image
}

export interface Image {
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
  sizes: Sizes
}

export interface Sizes {
  thumbnail: string
  'thumbnail-width': number
  'thumbnail-height': number
  medium: string
  'medium-width': number
  'medium-height': number
  medium_large: string
  'medium_large-width': number
  'medium_large-height': number
  large: string
  'large-width': number
  'large-height': number
  '1536x1536': string
  '1536x1536-width': number
  '1536x1536-height': number
  '2048x2048': string
  '2048x2048-width': number
  '2048x2048-height': number
  woocommerce_thumbnail: string
  'woocommerce_thumbnail-width': number
  'woocommerce_thumbnail-height': number
  woocommerce_single: string
  'woocommerce_single-width': number
  'woocommerce_single-height': number
  woocommerce_gallery_thumbnail: string
  'woocommerce_gallery_thumbnail-width': number
  'woocommerce_gallery_thumbnail-height': number
}

export interface ContentSection3 {
  image: string
  title: string
  description: string
}

export interface BottomCard {
  image: string
  title: string
  sub_title: string
  popup_content: PopupContent
}

export interface PopupContent {
  main_title: string
  main_description: string
  middle_content: MiddleContent
  repeater_content: any
}

export interface MiddleContent {
  title: string
  description: string
  image: any
}

export interface Links {
  self: Self[]
  collection: Collection[]
  about: About[]
  'wp:attachment': WpAttachment[]
  'wp:term': WpTerm[]
  curies: Cury[]
}

export interface Self {
  href: string
}

export interface Collection {
  href: string
}

export interface About {
  href: string
}

export interface WpAttachment {
  href: string
}

export interface WpTerm {
  taxonomy: string
  embeddable: boolean
  href: string
}

export interface Cury {
  name: string
  href: string
  templated: boolean
}

export interface SegmentCarousal {
  title: string
  description: string
  video: string
}

export interface Image {
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
  sizes: Sizes
}

export interface Sizes {
  thumbnail: string
  'thumbnail-width': number
  'thumbnail-height': number
  medium: string
  'medium-width': number
  'medium-height': number
  medium_large: string
  'medium_large-width': number
  'medium_large-height': number
  large: string
  'large-width': number
  'large-height': number
  '1536x1536': string
  '1536x1536-width': number
  '1536x1536-height': number
  '2048x2048': string
  '2048x2048-width': number
  '2048x2048-height': number
  woocommerce_thumbnail: string
  'woocommerce_thumbnail-width': number
  'woocommerce_thumbnail-height': number
  woocommerce_single: string
  'woocommerce_single-width': number
  'woocommerce_single-height': number
  woocommerce_gallery_thumbnail: string
  'woocommerce_gallery_thumbnail-width': number
  'woocommerce_gallery_thumbnail-height': number
}
