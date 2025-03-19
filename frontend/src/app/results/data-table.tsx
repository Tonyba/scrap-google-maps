"use client"

import {
    ColumnDef,
    flexRender,
    getCoreRowModel,
    useReactTable,
} from "@tanstack/react-table"

import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { Loader2 } from "lucide-react"

interface DataTableProps<TData, TValue> {
    columns: ColumnDef<TData, TValue>[]
    data: TData[],
    loading: boolean
}

export function PlacesTable<TData, TValue>({
    columns,
    data,
    loading
}: DataTableProps<TData, TValue>) {

    const table = useReactTable({
        data,
        columns,
        getCoreRowModel: getCoreRowModel()
    })

    return (
        <div className="rounded-md border">
            <Table>
                <TableHeader>
                    {table.getHeaderGroups().map((headerGroup) => (
                        <TableRow key={headerGroup.id}>
                            {headerGroup.headers.map((header) => {
                                return (
                                    <TableHead
                                        style={{
                                            minWidth: header.column.columnDef.minSize,
                                            maxWidth: header.column.columnDef.maxSize,
                                        }}
                                        key={header.id}>
                                        <div className="break-words overflow-hidden whitespace-normal">
                                            {header.isPlaceholder
                                                ? null
                                                : flexRender(
                                                    header.column.columnDef.header,
                                                    header.getContext()
                                                )}
                                        </div>

                                    </TableHead>
                                )
                            })}
                        </TableRow>
                    ))}
                </TableHeader>
                <TableBody>

                    {loading
                        ? <TableRow>
                            <TableCell
                                colSpan={columns.length}
                                className='h-24 text-center'
                            >
                                <div className="inline-flex gap-1 items-center"> <Loader2 className="animate-spin" />
                                    Please wait...
                                </div>

                            </TableCell>
                        </TableRow>
                        : table.getRowModel().rows?.length ? (
                            table.getRowModel().rows.map((row) => (
                                <TableRow

                                    key={row.id}
                                    data-state={row.getIsSelected() && "selected"}
                                >
                                    {row.getVisibleCells().map((cell) => (

                                        <TableCell
                                            className={
                                                ['name', 'website', 'url'].includes(cell.column.id)
                                                    ? 'break-words overflow-hidden whitespace-normal' : ''}
                                            style={{
                                                minWidth: cell.column.columnDef.minSize,
                                                maxWidth: cell.column.columnDef.maxSize,
                                            }}
                                            key={cell.id}>
                                            {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                        </TableCell>
                                    ))}
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell colSpan={columns.length} className="h-24 text-center">
                                    No results.
                                </TableCell>
                            </TableRow>
                        )
                    }


                </TableBody>
            </Table>
        </div>
    )

}