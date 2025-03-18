import { fetchPlaces } from '@/ajax/scrapping_maps';
import { ScrappingRequest } from '@/utils/types';
import { useQuery } from '@tanstack/react-query';


export const usePlaces = (request: ScrappingRequest) => {
    return useQuery({
        queryKey: ['places', request],
        queryFn: () => fetchPlaces(request)
    });
}