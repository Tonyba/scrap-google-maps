// import {
//     Tooltip,
//     TooltipContent,
//     TooltipProvider,
//     TooltipTrigger,
// } from "@/components/ui/tooltip"

import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"

interface TooltipTable {
    items?: string[]
}

export const ToolTipTable = ({
    items = []
}: TooltipTable) => {

    console.log(items)

    return <Popover>
        <PopoverTrigger><span className="border-b-1 border-dashed border-gray-500 cursor-pointer">{items.length} items</span></PopoverTrigger>
        <PopoverContent>
            <div className="flex flex-col gap-2.5 text-xs">
                {items.map(item => {
                    return <div className="break-words overflow-hidden">{item}</div>
                })}
            </div>
        </PopoverContent>
    </Popover>


    // return <TooltipProvider>
    //     <Tooltip>
    //         <TooltipTrigger><span className="border-b-1 border-dashed border-gray-500">{items.length} items</span></TooltipTrigger>
    //         <TooltipContent>
    //             {items.map(item => {
    //                 <div>{item}</div>
    //             })}
    //         </TooltipContent>
    //     </Tooltip>
    // </TooltipProvider>

}