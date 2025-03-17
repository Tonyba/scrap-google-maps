export interface ScrappingResponse {
    success: boolean;
    maxPlaces: number;
    found_places: FoundPlace[];
}

export interface FoundPlace {
    types: string[];
    formattedAddress: string;
    rating: number;
    googleMapsUri: string;
    websiteUri?: string;
    businessStatus: BusinessStatus;
    userRatingCount: number;
    displayName: DisplayName;
    photos: Photo[];
    scrapped_website: ScrappedWebsite;
    internationalPhoneNumber?: string;
    primaryType?: string;
}

export enum BusinessStatus {
    Operational = "OPERATIONAL",
}

export interface DisplayName {
    text: string;
    languageCode: LanguageCode;
}

export enum LanguageCode {
    En = "en",
}

export interface Photo {
    name: string;
    widthPx: number;
    heightPx: number;
    authorAttributions: AuthorAttribution[];
    flagContentUri: string;
    googleMapsUri: string;
}

export interface AuthorAttribution {
    displayName: string;
    uri: string;
    photoUri: string;
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
    state: string
}

export interface ScrappingRequest {
    geolocation: Geolocation,
    radius: number,
    max_places: number,
    query_search: string,
    types: string[]
}

export interface IGeolocation extends Geolocation { };