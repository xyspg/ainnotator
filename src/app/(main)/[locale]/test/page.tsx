"use client"
import React, {useEffect} from 'react';
import {batchAnnotate} from "@/app/(main)/[locale]/test/batch-annotate";

const Page = () => {
    useEffect(() => {
        async function fetchres() {
            const response = await batchAnnotate('https://arxiv.org/pdf/2309.09176.pdf')
            console.log(response);
        }
        fetchres();
    }, []);
    return (
        <div>

        </div>
    );
};

export default Page;