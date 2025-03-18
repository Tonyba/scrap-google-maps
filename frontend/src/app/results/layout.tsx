


export default function ResultsLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {

    return <div className="mi-h-screen flex justify-center items-center">
        <div className="w-full max-w-7xl m-auto px-3 py-10">

            {children}

        </div>
    </div>

}  