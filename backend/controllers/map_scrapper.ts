import axios from "axios";
import type { GetPlacesQuery, GooglePlace,  NearbyResponseType,  PlaceRequest, SearchRequestType, WebsiteData} from "../utils/types";

import * as cheerio from 'cheerio';
import { API_KEY, SELECTED_FIELDS } from "../utils/constants";
import type { NextFunction, Request, Response } from "express";
import { placesClient } from "../utils/places_client";




const getPlaces = async (
    req: Request<{}, {}, {},  GetPlacesQuery>, 
    res: Response,
    next: NextFunction
) => {



    let found_places: GooglePlace[] = [];
 

    const defaultMaxPlaces = 2;
    const defaultRadius = 1000;
    const defaultLng = 'en-US';

    const maxPlaces = req.query.max_places ? parseInt(req.query.max_places as string) : defaultMaxPlaces;
    const radius = req.query.radius ? parseInt(req.query.radius as string) : defaultRadius;

    const type = req.query.types || [];
    
    let max_pages = 0; // Initialize max_pages


    const map_urls = req.query.map_urls || [];

    
    const query = req.query.query_search || '';
    const city = req.query.city || "";
    const postalCode = req.query.postal_code || "";
    const country = req.query.country || "";
    const state = req.query.state || "";
    const county = req.query.county || "";
  

    const addressString = [];


    if (query)      addressString.push(query);
    if (county)     addressString.push(county);
    if (city)       addressString.push(city);
    if (state)      addressString.push(state);
    if (postalCode) addressString.push(postalCode);
    if (country)    addressString.push(country);

    let locationQuery: string = addressString.join(",");
    locationQuery = locationQuery.trim();

    if (!locationQuery) {
           return  res.status(400).json({
            success: false,
            message: "Invalid Location",
        });
    }

    const geocodeUrl = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(locationQuery)}&key=${API_KEY}`;

    console.log(locationQuery);

    try {
        
        const geoResponse = await axios.get(geocodeUrl);


        if (
            geoResponse.data.status !== "OK" ||
            !geoResponse.data.results.length
        ) {
            return res.status(400).json({
               success: false,
               message: "Invalid Location",
           });
       }
   
       const { lat, lng } = geoResponse.data.results[0].geometry.location;

       const placeRequest : PlaceRequest  = {
        includedTypes: type,
        maxResultCount: maxPlaces,
        locationRestriction: {
            circle: {
                center: {
                    latitude: lat,
                    longitude: lng
                },
                radius
            }
        },
      }

        try {
          const  resp   = await placesClient.searchNearby(placeRequest, {
            otherArgs: {
              headers: {
                'X-Goog-FieldMask': SELECTED_FIELDS,
              },
            },
          });
          
            found_places = [...resp[0].places || []];

        } catch (error) {
            console.log(error);
            return res.status(400).json({
                success: false,
                message: 'Something went wrong with the google api'
            })
        }
 
   
       for (const found_place of found_places) {

           try {

               if (found_place.websiteUri) {
                    found_place.scrapped_website = await scrapWebsite(found_place.websiteUri);
               } else {
                    found_place.scrapped_website = {
                       emails: [],
                       socialMedia: {},
                       website: "",
                   };
               }
           } catch (error) {}
       }
   
       res.json({
           success: true,
           maxPlaces,
           found_places
       });

    } catch (error: any) {
     
        return res.status(400).json({
          message:  error.data.error_message
        })   
    }

   
};

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
        const links: string[] = [];
        $("a").each((_, element) => {
            let href = $(element).attr("href");
            if (href) {
                // Convert relative URLs to absolute
                if (!href.startsWith("http")) {
                    href = baseUrl + href;
                }
                links.push(href);
            }
        });

        // Regex patterns for social media platforms
        const socialMediaPatterns: { [key: string]: RegExp } = {
            facebook: /https?:\/\/(www\.)?facebook\.com\/[a-zA-Z0-9._-]+/i,
            instagram: /https?:\/\/(www\.)?instagram\.com\/[a-zA-Z0-9._-]+/i,
            twitter: /https?:\/\/(www\.)?twitter\.com\/[a-zA-Z0-9._-]+/i,
            linkedin: /https?:\/\/(www\.)?linkedin\.com\/(in|company)\/[a-zA-Z0-9._-]+/i,
            youtube: /https?:\/\/(www\.)?youtube\.com\/(channel|user|c)\/[a-zA-Z0-9._-]+/i,
            tiktok: /https?:\/\/(www\.)?tiktok\.com\/@[a-zA-Z0-9._-]+/i
        };

        // Extract social media links (as arrays)
        const socialMedia: { [key: string]: string[] } = {};
        Object.keys(socialMediaPatterns).forEach(platform => {
            socialMedia[platform] = links.filter(link => socialMediaPatterns[platform].test(link));
        });

        // Extract emails
        const emailPattern = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g;
        const emails:string[] = html.match(emailPattern) || [];

        return {
            emails: [...new Set(emails)], // Remove duplicates
            socialMedia,
            website
        };
    } catch (error) {
        //console.error("Error scraping website:", error);
        return { emails: [], socialMedia: {},  website };
    }
}



export {
    getPlaces
};