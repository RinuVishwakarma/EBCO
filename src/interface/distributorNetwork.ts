export interface DistributorNetworkIndia {
    id: number;
    date: string;
    date_gmt: string;
    guid: {
        rendered: string;
    };
    modified: string;
    modified_gmt: string;
    slug: string;
    status: string;
    type: string;
    link: string;
    title: {
        rendered: string;
    };
    content: {
        rendered: string;
        protected: boolean;
    };
    featured_media: number;
    parent: number;
    template: string;
    meta: {
        _acf_changed: boolean;
    };
    'distributor-network-category': number[];
    acf: {
        contact_person: string;
        email: string;
        phone: string;
        address: string;
        city: string;
        state: string;
        country: string;
        zone: string;
        pincode: number;
        remarks: string;
        latitude: string;
        longitude: string;
        google_maps_link: string;
    };
    jetpack_sharing_enabled: boolean;
    featured_media_src_url: string | null;
    _links: {
        self: {
            href: string;
        }[];
        collection: {
            href: string;
        }[];
        about: {
            href: string;
        }[];
        'wp:attachment': {
            href: string;
        }[];
        'wp:term': {
            taxonomy: string;
            embeddable: boolean;
            href: string;
        }[];
        curies: {
            name: string;
            href: string;
            templated: boolean;
        }[];
    };
}

export interface DistributorNetworkInternational {
    id: number;
    date: string;
    date_gmt: string;
    guid: {
        rendered: string;
    };
    modified: string;
    modified_gmt: string;
    slug: string;
    status: string;
    type: string;
    link: string;
    title: {
        rendered: string;
    };
    content: {
        rendered: string;
        protected: boolean;
    };
    featured_media: number;
    parent: number;
    template: string;
    meta: {
        _acf_changed: boolean;
    };
    'distributor-network-category': number[];
    acf: {
        contact_person: string;
        email: string;
        phone: string;
        address: string;
        city: string;
        state: string;
        country: string;
        zone: string;
        pincode: string | number; // Some entries might be empty strings
        remarks: string;
        latitude: string;
        longitude: string;
        google_maps_link: string
    };
    jetpack_sharing_enabled: boolean;
    featured_media_src_url: string | null;
    _links: {
        self: {
            href: string;
        }[];
        collection: {
            href: string;
        }[];
        about: {
            href: string;
        }[];
        'wp:attachment': {
            href: string;
        }[];
        'wp:term': {
            taxonomy: string;
            embeddable: boolean;
            href: string;
        }[];
        curies: {
            name: string;
            href: string;
            templated: boolean;
        }[];
    };
}
