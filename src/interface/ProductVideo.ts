interface Guid {
  rendered: string;
}

interface Title {
  rendered: string;
}

interface Meta {
  _acf_changed: boolean;
}

interface JetpackVideoPress {
  title: string;
  description: string;
  caption: string;
  guid: null | string;
  rating: null | number;
  allow_download: number;
  display_embed: number;
  privacy_setting: number;
  needs_playback_token: boolean;
  is_private: boolean;
  private_enabled_for_site: boolean;
}

interface Description {
  rendered: string;
}

interface Caption {
  rendered: string;
}

interface Audio {
  dataformat: string;
  bitrate: number;
  codec: string;
  sample_rate: number;
  channels: number;
  bits_per_sample: number;
  lossless: boolean;
  channelmode: string;
  compression_ratio: number;
}

interface MediaDetails {
  bitrate: number;
  filesize: number;
  mime_type: string;
  length: number;
  length_formatted: string;
  width: number;
  height: number;
  fileformat: string;
  dataformat: string;
  audio: Audio;
  created_timestamp: number;
  sizes: Record<string, unknown>;
}

interface Link {
  href: string;
}

interface Links {
  self: Link[];
  collection: Link[];
  about: Link[];
  author: Link[];
  replies: Link[];
}

export interface ProductVideo {
  id: number;
  date: string;
  date_gmt: string;
  guid: Guid;
  modified: string;
  modified_gmt: string;
  slug: string;
  status: string;
  type: string;
  link: string;
  title: Title;
  author: number;
  featured_media: number;
  comment_status: string;
  ping_status: string;
  template: string;
  meta: Meta;
  acf: Record<string, unknown>;
  jetpack_videopress_guid: string;
  jetpack_videopress: JetpackVideoPress;
  jetpack_sharing_enabled: boolean;
  description: Description;
  caption: Caption;
  alt_text: string;
  media_type: string;
  mime_type: string;
  media_details: MediaDetails;
  post: number;
  source_url: string;
  _links: Links;
}
