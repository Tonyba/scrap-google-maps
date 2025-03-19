import axios from "axios";
//import type { GetPlacesQuery, GooglePlace, NearbyResponseType, PlaceRequest, SearchRequestType, WebsiteData } from "../utils/types";
import type { GetPlacesQuery, GooglePlace, WebsiteData } from "../utils/types";

import * as cheerio from 'cheerio';
import { API_KEY, SELECTED_FIELDS } from "../utils/constants";
import type { NextFunction, Request, Response } from "express";
import GoogleMapsClient from "../utils/singleton";
import type { PlacesNearbyRequest } from "@googlemaps/google-maps-services-js";

const getPlaces = async (
    req: Request<{}, {}, {}, GetPlacesQuery>,
    res: Response,
    next: NextFunction
) => {
    const client = GoogleMapsClient.getInstance();

    let found_places: Partial<GooglePlace>[] = [];

    const defaultMaxPlaces = 2;
    const defaultRadius = 5000;
    const defaultLng = 'en-US';

    const maxPlaces = req.query.max_places ? parseInt(req.query.max_places as string) : defaultMaxPlaces;
    const radius = req.query.radius ? parseInt(req.query.radius as string) : defaultRadius;
    const type = req.query.types || [];
    const query = req.query.query_search || '';
    const city = req.query.city || "";
    const postalCode = req.query.postal_code || "";
    const country = req.query.country || "";
    const state = req.query.state || "";
    const county = req.query.county || "";
    const address = req.query.address || '';

    // console.log(req.query);

    // Construct the location query
    const addressString = [address, county, city, state, postalCode, country].filter(Boolean);
    let locationQuery: string = addressString.join(",").trim();

    if (!locationQuery) {
        return res.status(400).json({ success: false, message: "Invalid Location" });
    }

    const geocodeUrl = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(locationQuery)}&key=${API_KEY}`;

    try {
        const geoResponse = await axios.get(geocodeUrl);
        if (geoResponse.data.status !== "OK" || !geoResponse.data.results.length) {
            return res.status(400).json({ success: false, message: "Invalid Location" });
        }

        const { lat, lng } = geoResponse.data.results[0].geometry.location;

        const placeRequest: PlacesNearbyRequest = {
            params: {
                location: `${lat},${lng}`,
                radius,
                key: API_KEY,
            }
        };

        if (type.length) placeRequest.params.type = type[0];
        if (query) placeRequest.params.keyword = query;

        let nextPageToken: string | undefined;
        let currentResults: Partial<GooglePlace>[] = [];

        do {
            if (nextPageToken) {
                // Add nextPageToken only after the first request
                placeRequest.params.pagetoken = nextPageToken;
                await new Promise(resolve => setTimeout(resolve, 2000)); // Google requires a delay
            }

            const resp = await client.placesNearby(placeRequest);

            currentResults = resp.data.results || [];
            found_places.push(...currentResults);


            nextPageToken = resp.data.next_page_token; // Get nextPageToken if available


        } while (nextPageToken);

        for (const found_place of found_places) {


            const place_data = await client.placeDetails({
                params: {
                    place_id: found_place.place_id!,
                    key: API_KEY,
                    fields: ['website', 'international_phone_number']
                }
            })

            try {

                found_place.website = place_data.data.result.website;
                found_place.url = encodeURI(`https://www.google.com/maps/search/?api=1&query=${found_place.name}&query_place_id=${found_place.place_id}`);
                found_place.international_phone_number = place_data.data.result.international_phone_number;

                if (found_place.photos?.length) found_place.place_photo = found_place.photos[0].photo_reference;

                if (place_data.data.result.website) {
                    found_place.scrapped_website = await scrapWebsite(place_data.data.result.website);
                } else {
                    found_place.scrapped_website = {
                        emails: [],
                        socialMedia: {},
                        website: "",
                    };


                }
            } catch (error) { }
        }

        res.json({ success: true, count: found_places.length, found_places });

    } catch (error: any) {
        return res.status(400).json({ message: error.data?.error_message || "An error occurred" });
    }
};

const getPlacePhoto = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const { photoreference, maxwidth = 200 } = req.query;

        if (!photoreference) {
            return res.status(400).json({ error: 'Missing photo reference' });
        }

        const googleUrl = `https://maps.googleapis.com/maps/api/place/photo?maxwidth=${maxwidth}&photoreference=${photoreference}&key=${API_KEY}`;
        const response = await axios.get(googleUrl, { responseType: 'stream' });

        res.setHeader('Content-Type', response.headers['content-type']);
        response.data.pipe(res);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch photo' });
    }
}

async function scrapWebsite(website: string): Promise<WebsiteData> {
    try {
        // Fetch website HTML with a user-agent to prevent blocking
        const response = await axios.get(website, {
            headers: { "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64)" }
        });
        const html = response.data;
        const $ = cheerio.load(html);

        // Extract all anchor tags
        const baseUrl = new URL(website).origin;
        const links: Set<string> = new Set();
        $("a").each((_, element) => {
            let href = $(element).attr("href");
            if (href) {
                // Convert relative URLs to absolute
                if (!href.startsWith("http")) {
                    href = baseUrl + href;
                }
                links.add(href); // Almacenamos en un Set para evitar duplicados
            }
        });

        // Regex patterns for social media platforms
        const socialMediaPatterns: { [key: string]: RegExp } = {
            facebook: /https?:\/\/(www\.)?facebook\.com\/[a-zA-Z0-9._-]+/i,
            instagram: /https?:\/\/(www\.)?instagram\.com\/[a-zA-Z0-9._-]+/i,
            twitter: /https?:\/\/(www\.)?(?:twitter\.com|x\.com)\/[a-zA-Z0-9._-]+/i,
            linkedin: /https?:\/\/(www\.)?linkedin\.com\/(in|company)\/[a-zA-Z0-9._-]+/i,
            youtube: /https?:\/\/(www\.)?youtube\.com\/(channel|user|c)\/[a-zA-Z0-9._-]+/i,
            tiktok: /https?:\/\/(www\.)?tiktok\.com\/@[a-zA-Z0-9._-]+/i
        };

        // Extraer enlaces de redes sociales sin duplicados
        const socialMedia: { [key: string]: string[] } = {};
        Object.keys(socialMediaPatterns).forEach(platform => {
            socialMedia[platform] = [...new Set([...links].filter(link => socialMediaPatterns[platform].test(link)))];
        });

        // Extraer emails sin duplicados
        const emailPattern = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g;
        const emails = [...new Set(html.match(emailPattern) || [])] as string[];

        return {
            emails,
            socialMedia,
            website
        };
    } catch (error) {
        return { emails: [], socialMedia: {}, website };
    }
}

export {
    getPlaces,
    getPlacePhoto
};