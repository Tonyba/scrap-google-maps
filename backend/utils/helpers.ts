import type { GooglePlace } from "./types";

function formatPlaceData(place: any): GooglePlace {
    return {
        name: place.name || "Unknown",
        business_status: place.business_status || "Unknown",
        location: {
            lat: place.geometry?.location?.lat || null,
            lng: place.geometry?.location?.lng || null
        },
        address: place.vicinity || "No address available",
        place_id: place.place_id || "Unknown",
        rating: place.rating || "No rating",
        total_reviews: place.user_ratings_total || 0,
        types: place.types || [],
        opening_hours: place.opening_hours?.open_now !== undefined ? place.opening_hours.open_now : "Unknown",
        plus_code: place.plus_code?.compound_code || "No plus code",
        icon: place.icon || "",
        photos: place.photos
            ? place.photos.map((photo: any) => ({
                url: `https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photoreference=${photo.photo_reference}`,
                attribution: photo.html_attributions || []
            }))
            : [],
    };
}

export {
    formatPlaceData
}