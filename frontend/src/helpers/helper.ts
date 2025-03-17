import { IGeolocation, ScrappingRequest } from "@/utils/types";

function parseRequestArgs(args: ScrappingRequest) {
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

export {
    parseRequestArgs
}