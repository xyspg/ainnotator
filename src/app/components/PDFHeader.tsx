import React from "react";
import Link from "next/link";

export default function PDFHeader() {
    return (
        <>
            <div className="sticky h-28 bg-slate-100 flex flex-row justify-start items-center px-4 py-2">
                <Link href="/">
                <h2 className="mb-1 font-sans text-3xl font-medium text-blue-600 font-display p-4">AInnotator</h2>
                </Link>
            </div>
        </>
    )
}