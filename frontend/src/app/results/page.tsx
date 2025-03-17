"use client"

import { useRouter } from 'next/router'

const Result = () => {

    const router = useRouter()
    console.log(router.query);

    return <div className="h-screen flex justify-center items-center">
        <div className="w-full max-w-7xl m-auto">



        </div>
    </div>
}

export default Result;