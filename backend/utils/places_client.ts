import { PlacesClient, v1 } from '@googlemaps/places';
import { API_KEY } from './constants';



export const placesClient = new PlacesClient({
    apiKey: API_KEY
});
