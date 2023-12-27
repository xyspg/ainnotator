import { getDocument, GlobalWorkerOptions } from "pdfjs-dist/legacy/build/pdf";
import type { PDFDocumentProxy } from "pdfjs-dist";
interface Props {
    /** See `GlobalWorkerOptionsType`. */
    workerSrc: string;

    url: string;
    beforeLoad: JSX.Element;
    errorMessage?: JSX.Element;
    children: (pdfDocument: PDFDocumentProxy) => JSX.Element;
    onError?: (error: Error) => void;
    cMapUrl?: string;
    cMapPacked?: boolean;
}

interface State {
    pdfDocument: PDFDocumentProxy | null;
    error: Error | null;
}

export async function batchAnnotate(url: string) {
    // Set the path for the worker.
    GlobalWorkerOptions.workerSrc = "https://unpkg.com/pdfjs-dist@2.16.105/build/pdf.worker.min.js";

    try {
        // Load the PDF document.
        const pdfDocument = await getDocument(url).promise;

        let fullText = '';

        // Iterate through each page.
        for (let pageNum = 1; pageNum <= pdfDocument.numPages; pageNum++) {
            const page = await pdfDocument.getPage(pageNum);
            const textContent = await page.getTextContent();
            //@ts-ignore
            const pageText = textContent.items.map((s) => s.str).join(' ');
            fullText += pageText;
        }

        return fullText;
    } catch (error) {
        console.error(error);
        throw error; // or handle the error as per your onError prop.
    }
}