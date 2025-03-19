"use client"


import { useSearchParams } from 'next/navigation';
import { parseRequestFromQuerySearch } from '@/helpers/helper';
import { usePlaces } from '@/hooks/usePlaces';
import { PlacesTable } from './data-table';
import { columns } from './columns';


const Result = () => {

    const params = useSearchParams();
    const request_obj = parseRequestFromQuerySearch(params);

    const { status, data, error, isFetching } = usePlaces(request_obj)


    if (status == 'error') return error.message;


    return <PlacesTable columns={columns} data={data ? data.data.found_places : []} loading={isFetching} />
}

export default Result;