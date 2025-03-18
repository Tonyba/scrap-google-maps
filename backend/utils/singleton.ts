import { Client } from "@googlemaps/google-maps-services-js";


class GoogleMapsClient {
    private static instance: Client | null = null;

    private constructor() { }

    public static getInstance(): Client {
        if (!GoogleMapsClient.instance) {
            GoogleMapsClient.instance = new Client();
        }
        return GoogleMapsClient.instance;
    }
}

export default GoogleMapsClient;