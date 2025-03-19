import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";



export default function ResultsLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {

    return <div className="mi-h-screen flex justify-center items-center">
        <div className="w-full max-w-7xl m-auto px-3 py-10">
            <div className=" mb-5">
                <div className="flex gap-4 items-center">
                    <Link href="/">
                        <Button type="button" variant={"outline"} size="icon">
                            <ArrowLeft />
                        </Button>
                    </Link>

                    <h1>Results</h1>
                </div>
                <p className="mt-2.5">It takes around 2-5 minutes to load the places</p>
            </div>


            {children}
        </div>
    </div>

}  