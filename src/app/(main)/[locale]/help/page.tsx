import React from 'react';
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/app/components/ui/accordion"


const Page = () => {
    const CONTENTS = [
        {
            title: "Some of my annotations were not rendered",
            content: "There is a problem rendering your annotation when it has non-English characters. We are working on a fix."
        },
        {
            title: "My order is not processed",
            content: "Please contact us at <a href='mailto:support@ainnotator.com' class='underline'>support@ainnotator.com"
        }
    ]
    return (
        <div className="p-4 md:p-12">
            <h1 className="text-4xl font-semibold ">Help Center</h1>
            <Accordion type="single" collapsible className='w-full md:w-1/2'>
                {CONTENTS.map((item, index) => (
                    <AccordionItem key={index} value={`item-${index + 2}`}>
                        <AccordionTrigger>{item.title}</AccordionTrigger>
                        <AccordionContent>
                            <div dangerouslySetInnerHTML={{ __html: item.content }} />
                        </AccordionContent>
                    </AccordionItem>
                ))}
            </Accordion>

        </div>
    );
};

export default Page;