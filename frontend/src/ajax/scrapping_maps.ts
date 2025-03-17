import { parseRequestArgs } from '@/helpers/helper';
import { ScrappingRequest, ScrappingResponse } from '@/utils/types';

import axios from 'axios';

async function fetchPlaces(args: ScrappingRequest) {
    const paremeters_string = parseRequestArgs(args);
    const resp = await axios.get<ScrappingResponse>(`${process.env.API_URL}/scrap-map${paremeters_string}`);

    return resp.data;
}

export {
    fetchPlaces
}