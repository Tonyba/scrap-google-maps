"use client"

import { useSearchParams } from 'next/navigation';
import type { IGeolocation, ScrappingRequest } from '@/utils/types';
import { useQuery } from '@tanstack/react-query';
import { fetchPlaces } from '@/ajax/scrapping_maps';

const Result = () => {

    const params = useSearchParams();

    const param_obj : ScrappingRequest = {
        geolocation: {
            city: '',
            country: '',
            county: '',
            postal_code: '',
            state: ''
        },
        max_places: 0,
        query_search: '',
        radius: 0,
        types: []
    };

    const configParams = ['max_places', 'radius', 'types[]'];
    const address_components = ['city', 'country', 'state', 'county', 'postal_code'];

    configParams.forEach(key => {
        if (key !== 'types[]') {
            const val = params.get(key);
            if (val) {
                // Explicitly handle the type assertion for number properties
                if (key === 'max_places' || key === 'radius') {
                    param_obj[key] = parseInt(val, 10);
                }
            }
        } else {
            const val = params.getAll(key);
            // Explicitly handle the type assertion for the array property
            param_obj.types = val.length ? val : [];
        }
    });


    address_components.map(function(key) {

        const val = params.get(key);

        if(val) {
            param_obj.geolocation[key as keyof IGeolocation] = val;
        }

    });

    const { isPending, error, data } = useQuery({
        queryKey: ['places'],
        queryFn: () => 
            fetchPlaces(param_obj as ScrappingRequest).then((res) => res.data)
    })

    if(isPending) return <div className="h-screen flex justify-center items-center">
        <div className="w-full max-w-7xl m-auto">
                LOADING...
        </div>
    </div>

    if(error) return <div className="h-screen flex justify-center items-center">
    <div className="w-full max-w-7xl m-auto">
            ERROR - {error.message}
    </div>
    </div>

    console.log(data)

    return <div className="h-screen flex justify-center items-center">
        <div className="w-full max-w-7xl m-auto">

                LOADED

        </div>
    </div>
}

export default Result;