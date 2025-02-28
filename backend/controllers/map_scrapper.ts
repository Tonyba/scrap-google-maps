import axios from "axios";
import type { GooglePlace, SocialMedia, WebsiteData } from "../utils/types";
import { formatPlaceData } from "../utils/helpers";
import * as cheerio from 'cheerio';
import { API_KEY } from "../utils/constants";


async function getPlaces() {

    let places:GooglePlace[] = [];
    let nextPageToken = null;

    const maxPlaces = 2;
    const radius = 1000;
    const type = "resturant";

    do {
        let url = `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${location}&radius=${radius}&type=${type}&key=${API_KEY}`;
        if (nextPageToken) url += `&pagetoken=${nextPageToken}`;

        try {
            const response = await axios.get(url);
            const results: GooglePlace[] = response.data.results.map(formatPlaceData);
            places = [...places, ...results];
            console.log(`Fetched ${places.length} places...`);

            nextPageToken = response.data.next_page_token;
            if (!nextPageToken || places.length >= maxPlaces) break;

            await new Promise(res => setTimeout(res, 2000));
        } catch (error) {
            console.error("Error fetching data:", error);
            break;
        }
    } while (places.length < maxPlaces);

    places = places.slice(0, maxPlaces);

    for (const place of places) {

        try {
            const details = await getPlaceDetails(place.place_id);

            if(details.formatted_phone_number) place.phone_number = details?.formatted_phone_number;
            if(details.website)  place.scrapped_website = await scrapeWebsite(details?.website);


        } catch (error) {
            console.log(error);
        }

        /*
        console.log(`\nName: ${place.name}`);
        console.log(`Address: ${place.vicinity}`);
        console.log(`Rating: ${place.rating}`);
        console.log(`Phone: ${details?.formatted_phone_number || "N/A"}`);
        console.log(`Website: ${details?.website || "N/A"}`);
        console.log('------------------------------------------');*/

      /// if(details?.website) await scrapeWebsite(details.website);

    }

    console.log(places);
}


async function getPlaceDetails(place_id: string) {
    const url = `https://maps.googleapis.com/maps/api/place/details/json?place_id=${place_id}&fields=name,website,formatted_phone_number&key=${API_KEY}`;
    try {
        const response = await axios.get(url);
        return response.data.result;
    } catch (error) {
        console.error("Error fetching place details:", error);
        return null;
    }
}

async function scrapeWebsite(url: string): Promise<WebsiteData> {
    try {
        const { data } = await axios.get(url);
        const $ = cheerio.load(data);
        const text = $.text();

        // Extract emails
        const emailRegex = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g;
        const emails = Array.from(new Set(text.match(emailRegex) || []));

        // Extract social media links
        const socialMedia: SocialMedia = {};
        const socialRegex = {
            facebook: /https?:\/\/(www\.)?facebook\.com\/[a-zA-Z0-9._-]+/g,
            instagram: /https?:\/\/(www\.)?instagram\.com\/[a-zA-Z0-9._-]+/g,
            twitter: /https?:\/\/(www\.)?twitter\.com\/[a-zA-Z0-9._-]+/g,
            linkedin: /https?:\/\/(www\.)?linkedin\.com\/in\/[a-zA-Z0-9._-]+/g,
            youtube: /https?:\/\/(www\.)?youtube\.com\/channel\/[a-zA-Z0-9._-]+/g,
            tiktok: /https?:\/\/(www\.)?tiktok\.com\/@[a-zA-Z0-9._-]+/g,
        };

        for (const [key, regex] of Object.entries(socialRegex)) {
            const matches = Array.from(new Set(text.match(regex) || []));
            if (matches.length > 0) {
                socialMedia[key as keyof SocialMedia] = matches[0]; // Store first match
            }
        }

        return {
            emails,
            socialMedia,
            website: url,
        };
    } catch (error) {
        console.error(`Error scraping website ${url}:`, error);
        return { emails: [], socialMedia: {}, website: url };
    }
}



export {
    getPlaces
};