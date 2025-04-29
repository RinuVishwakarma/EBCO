export interface BlogDetails {
  id: number
  date: Date
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
  parent: number
  template: string
  meta: Meta
  'blog-category': number[]
  acf: Acf
  featured_media_src_url: string
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
  layout_type: string
  banner_image: string
  banner_video: boolean
  features_data: FeaturesData[]
  layout_3_contents: Layout3
  html_content:string
}

export interface FeaturesData {
  feature_image: string
  feature_title: string
  feature_description: string
}
export interface Layout3 {
  image: string
  title: string
  description: string
  additional_content: string
}

export interface Links {
  self: Self[]
  collection: Collection[]
  about: About[]
  'wp:featuredmedia': Featuredmedum[]
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

export interface Featuredmedum {
  embeddable: boolean
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
