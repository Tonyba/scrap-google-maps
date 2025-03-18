"use client"


import { useSearchParams } from 'next/navigation';
import { parseRequestFromQuerySearch } from '@/helpers/helper';
import { usePlaces } from '@/hooks/usePlaces';


const Result = () => {

    const params = useSearchParams();
    const request_obj = parseRequestFromQuerySearch(params);

    const { status, data, error, isFetching } = usePlaces(request_obj)

    if (status == 'pending') return 'LOADING...';
    if (status == 'error') return error.message;


    return 'Success';
}

export default Result;