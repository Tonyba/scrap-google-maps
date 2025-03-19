"use client"

import { ToolTipTable } from "@/components/custom/tooltip-table";
import { API_URL } from "@/utils/constans";
import { FoundPlace } from "@/utils/types";
import { ColumnDef } from "@tanstack/react-table"
import Link from "next/link";

export const columns: ColumnDef<FoundPlace>[] = [
    {
        accessorKey: 'index',
        header: '#',
        cell: ({ row }) => {
            return row.index + 1;
        }
    },
    {
        accessorKey: 'place_photo',
        header: 'Image',
        cell: ({ row }) => {
            const place_photo = row.getValue('place_photo');
            return place_photo
                ? <Link target="_blank" href={`${API_URL}/scrap-map/get-place-photo?photoreference=${row.getValue('place_photo')}`}>  <img width={200} height={200} src={`${API_URL}/scrap-map/get-place-photo?photoreference=${row.getValue('place_photo')}`} /> </Link>
                : <div className="text-gray-400">no photo</div>;
        }
    },
    {
        accessorKey: 'name',
        header: 'Name',
        maxSize: 100
    },
    {
        accessorKey: 'rating',
        header: 'Total Score',
        maxSize: 100
    },
    {
        accessorKey: 'user_ratings_total',
        header: 'Reviews Count',
        maxSize: 100
    },
    {
        accessorKey: 'instagrams',
        header: 'Intagrams',
        accessorFn: (row) => row.scrapped_website.socialMedia?.instagram,
        cell: ({ row }) => {
            const items = row.getValue<string[] | undefined>('instagrams');
            return <ToolTipTable items={items} />
        }
    },
    {
        accessorKey: 'facebooks',
        header: 'Facebooks',
        accessorFn: (row) => row.scrapped_website.socialMedia.facebook,
        cell: ({ row }) => {
            const items = row.getValue<string[] | undefined>('facebooks');
            return <ToolTipTable items={items} />
        }
    },
    {
        accessorKey: 'linkedins',
        header: 'Linkedins',
        accessorFn: (row) => row.scrapped_website.socialMedia.linkedin,
        cell: ({ row }) => {
            const items = row.getValue<string[] | undefined>('linkedins');
            return <ToolTipTable items={items} />
        }
    },
    {
        accessorKey: 'youtubes',
        header: 'Youtubes',
        accessorFn: (row) => row.scrapped_website.socialMedia.youtube,
        cell: ({ row }) => {
            const items = row.getValue<string[] | undefined>('youtubes');
            return <ToolTipTable items={items} />
        }
    },
    {
        accessorKey: 'tiktoks',
        header: 'Tiktoks',
        accessorFn: (row) => row.scrapped_website.socialMedia.tiktok,
        cell: ({ row }) => {
            const items = row.getValue<string[] | undefined>('tiktoks');
            return <ToolTipTable items={items} />
        }
    },
    {
        accessorKey: 'twitters',
        header: 'twitter',
        accessorFn: (row) => row.scrapped_website.socialMedia.twitter,
        cell: ({ row }) => {
            const items = row.getValue<string[] | undefined>('twitters');
            return <ToolTipTable items={items} />
        }
    },
    {
        accessorKey: 'international_phone_number',
        header: 'Phone'
    },
    {
        accessorKey: 'emails',
        header: 'Emails',
        accessorFn: (row) => row.scrapped_website.emails,
        cell: ({ row }) => {
            const items = row.getValue<string[] | undefined>('emails');
            return <ToolTipTable items={items} />
        }
    },
    {
        accessorKey: 'website',
        header: 'Website',
        maxSize: 300,
        cell: ({ row }) => {
            const website = row.getValue<string | undefined>('website');
            if (website) return <a className="text-blue-500" target="_blank" href={website}>{website}</a>;
            return <div className="text-gray-400">undefined</div>;
        }
    },
    {
        accessorKey: 'url',
        header: 'URL',
        maxSize: 700,
        cell: ({ row }) => {
            const url: string = row.getValue('url');
            return <a className="text-blue-500" target="_blank" href={url}>{url}</a>
        }
    }
];
