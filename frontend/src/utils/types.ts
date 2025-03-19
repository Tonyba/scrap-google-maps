export interface ScrappingResponse {
    success: boolean;
    maxPlaces: number;
    found_places: FoundPlace[];
}

export interface FoundPlace {
    business_status: string;
    geometry: Geometry;
    icon: string;
    icon_background_color: string;
    icon_mask_base_uri: string;
    name: string;
    opening_hours: OpeningHours;
    photos: Photo[];
    place_photo: string;
    place_id: string;
    plus_code: PlusCode;
    rating: number;
    reference: string;
    scope: string;
    types: string[];
    user_ratings_total: number;
    vicinity: string;
    website: string;
    url: string;
    international_phone_number: string;
    scrapped_website: ScrappedWebsite;
}

export interface Geometry {
    location: Location;
    viewport: Viewport;
}

export interface Location {
    lat: number;
    lng: number;
}

export interface Viewport {
    northeast: Location;
    southwest: Location;
}

export interface OpeningHours {
    open_now: boolean;
}

export interface Photo {
    height: number;
    html_attributions: string[];
    photo_reference: string;
    width: number;
}

export interface PlusCode {
    compound_code: string;
    global_code: string;
}

export interface ScrappedWebsite {
    emails: string[];
    socialMedia: SocialMedia;
    website: string;
}

export interface SocialMedia {
    facebook?: string[];
    instagram?: string[];
    twitter?: string[];
    linkedin?: string[];
    youtube?: string[];
    tiktok?: string[];
}

interface Geolocation {
    country: string,
    city: string
    county: string,
    postal_code: string,
    state: string,
    address: string
}

export interface ScrappingRequest {
    geolocation: Geolocation,
    radius: number,
    max_places: number,
    query_search: string,
    types: string[]
}

export interface IGeolocation extends Geolocation { };