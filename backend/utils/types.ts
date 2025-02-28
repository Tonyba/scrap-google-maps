export interface GooglePlace  {
    name: string;
    business_status: string;
    location: {
        lat: number | null;
        lng: number | null;
    };
    phone_number: string;
    address: string;
    place_id: string;
    rating: number | string;
    total_reviews: number;
    types: string[];
    opening_hours: boolean | string;
    plus_code: string;
    icon: string;
    photos: {
        url: string;
        attribution: string[];
    }[];
    scrapped_website: WebsiteData
}


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

