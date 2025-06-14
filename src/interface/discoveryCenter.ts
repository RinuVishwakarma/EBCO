// productRange.tsx

export interface Arrivals {
  id: number
  image: string
  place: string
  name: string
  address: string
  phone?: number | string
  email?: string
  location?: string
  shortName: string
  contactPerson?: string
}

interface Guid {
  rendered: string
}

interface Title {
  rendered: string
}

interface Content {
  rendered: string
  protected: boolean
}

interface Meta {
  _acf_changed: boolean
}

interface Acf {
  contact_person: string
  email: string
  phone: string
  address: string
  city: string
  state: string
  country: string
  zone: string
  pincode: number
  remarks: string
}

interface Links {
  self: Link[]
  collection: Link[]
  about: Link[]
  'wp:attachment': Link[]
  'wp:term': Link[]
  curies: Curie[]
}

interface Link {
  href: string
}

interface Curie {
  name: string
  href: string
  templated: boolean
}

export interface DiscoveryCenter {
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
  parent: number
  template: string
  meta: Meta
  'discovery-center-category': number[]
  acf: Acf
  jetpack_sharing_enabled: boolean
  featured_media_src_url: string | null
  _links: Links
}
