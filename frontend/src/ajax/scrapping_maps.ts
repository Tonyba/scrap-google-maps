import { parseRequestArgs } from '@/helpers/helper';
import { API_URL } from '@/utils/constans';
import { ScrappingRequest, ScrappingResponse } from '@/utils/types';

import axios from 'axios';


async function fetchPlaces(args: ScrappingRequest) {

    const paremeters_string = parseRequestArgs(args);
    return await axios.get<ScrappingResponse>(`${process.env.NEXT_PUBLIC_API_URL}/scrap-map${paremeters_string}`);

}

export {
    fetchPlaces
}