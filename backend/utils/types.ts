// import { protos } from '@googlemaps/places';

import type { PlaceData } from "@googlemaps/google-maps-services-js";

// export interface NearbyResponseType extends protos.google.maps.places.v1.ISearchNearbyResponse { }

// export interface SearchRequestType extends protos.google.maps.places.v1.ISearchTextRequest { }

// export interface NewGooglePlace extends protos.google.maps.places.v1.IPlace {
//     scrapped_website?: WebsiteData
// }

export interface GooglePlace extends PlaceData {
    scrapped_website?: WebsiteData;
    place_photo: string;
}

// export interface PlaceRequest extends Partial<protos.google.maps.places.v1.ISearchNearbyRequest> { }


export interface SocialMedia {
    facebook?: string;
    instagram?: string;
    twitter?: string;
    linkedin?: string;
    youtube?: string;
    tiktok?: string;
}

export interface WebsiteData {
    emails: string[];
    socialMedia: SocialMedia;
    website: string;
}

export interface GetPlacesQuery {
    city?: string;
    postal_code?: string;
    country?: string;
    max_places?: string;
    radius?: string;
    state?: string;
    county?: string;
    map_urls?: string[];
    types?: string[];
    language?: string;
    query_search?: string;
    min_rating?: string;
    address?: string;
}