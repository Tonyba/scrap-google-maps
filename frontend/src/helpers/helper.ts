import { IGeolocation, ScrappingRequest } from "@/utils/types";
import type { ReadonlyURLSearchParams } from "next/navigation";

function parseRequestArgs(args: ScrappingRequest): string {
    const paremeters: string[] = [];

    Object.keys(args).map((key) => {
        if (key != 'geolocation' && key != 'types') {
            if (args[key as keyof ScrappingRequest]) paremeters.push(`${key}=${args[key as keyof ScrappingRequest]}`);
        }
    });

    Object.keys(args.geolocation).map(function (address_component) {

        if (args.geolocation[address_component as keyof IGeolocation]) {
            const geo_item = `${address_component}=${args.geolocation[address_component as keyof IGeolocation]}`;
            paremeters.push(geo_item);
        }
    });


    args.types.map((type) => {
        paremeters.push(`types[]=${type}`);
    });


    if (paremeters.length) paremeters[0] = '?' + paremeters[0];

    const paremeters_string = paremeters.length ? paremeters.join('&') : '';

    return paremeters_string;
}


function parseRequestFromQuerySearch(params: ReadonlyURLSearchParams): ScrappingRequest {
    const request_obj: ScrappingRequest = {
        geolocation: {
            city: '',
            country: '',
            county: '',
            postal_code: '',
            state: '',
            address: ''
        },
        max_places: 0,
        query_search: '',
        radius: 0,
        types: []
    }

    Object.keys(request_obj).map((key) => {
        if (key != 'geolocation' && key != 'types') {
            const val = params.get(key);
            if (val) {
                if (key === 'max_places' || key === 'radius') {
                    request_obj[key as keyof ScrappingRequest] = parseInt(val, 10) as never; // Convert to number
                } else {
                    request_obj[key as keyof ScrappingRequest] = val as never;
                }
            }
        }
    });

    Object.keys(request_obj.geolocation).map(function (address_component) {
        const val = params.get(address_component);

        if (val) {
            request_obj.geolocation[address_component as keyof IGeolocation] = val;
        }
    });

    params.getAll('types[]').map(type => {
        request_obj.types.push(type)
    })


    return request_obj;
}

export {
    parseRequestArgs,
    parseRequestFromQuerySearch
}