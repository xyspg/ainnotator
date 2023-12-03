"use client";
import {
  PDFArray,
  PDFDocument,
  PDFName,
  PDFString,
  StandardFonts,
} from "pdf-lib";
import { IHighlight } from "@/lib/react-pdf-highlighter";
import { testData } from "@/app/annotate/test-data";

interface Coordinates {
  x1: number;
  y1: number;
  x2: number;
  y2: number;
  scaledWidth: number;
  scaledHeight: number;
}

export async function renderPdf(url: string, highlights: IHighlight[]) {
  /*
   * PDF Highlighter 和 PDF Lib 的坐标系不一样
   * a helper function to correct coordinates
   *
   * scaledWidth and scaledHeight are the data
   * passed from PDF Highlighter
   * pageWidth and pageHeight are actual PDF size
   * used by PDF lib
   */
  function correctCoordinates(
    { x1, y1, x2, y2, scaledWidth, scaledHeight }: Coordinates,
    pageWidth: number,
    pageHeight: number,
  ): number[] {
    const scaleX = pageWidth / scaledWidth;
    const scaleY = pageHeight / scaledHeight;
    const x_1 = x1 * scaleX;
    const y_1 = pageHeight - y1 * scaleY;
    const x_2 = x2 * scaleX;
    const y_2 = pageHeight - y2 * scaleY;
    return [x_1, y_1, x_2, y_2];
  }

  // PDF lib 接收一个 arrayBuffer
  let arrayBuffer;
  try {
    arrayBuffer = await fetch(url).then((res) => res.arrayBuffer());
  } catch (err: any) {
    console.error(err.toString());
    throw new Error(`Failed to fetch PDF file: ${err.toString()}`)
  }
  const pdfDoc = await PDFDocument.load(arrayBuffer);
  const helveticaFont = await pdfDoc.embedFont(StandardFonts.Helvetica);

  // init
  highlights.forEach((annotationEntry) => {
    // first add annotation
    const pageNo = annotationEntry.position.pageNumber;
    const page = pdfDoc.getPages()[pageNo - 1];
    const pageHeight = page.getHeight();
    const pageWidth = page.getWidth();
    const boundingRect = annotationEntry.position.boundingRect;
    const { x1, y1, x2, y2 } = boundingRect;
    // correct the coordinates
    const coords = correctCoordinates(
      {
        x1,
        y1,
        x2,
        y2,
        scaledWidth: boundingRect.width,
        scaledHeight: boundingRect.height,
      },
      pageWidth,
      pageHeight,
    );
    const textToAnnotate = annotationEntry.comment.text;
    const annotation = pdfDoc.context.obj({
      Type: "Annot",
      Subtype: "Text",
      Rect: coords,
      Border: [0, 0, 2],
      C: [1, 1, 0],
      Open: false,
      Name: "Note",
      Contents: PDFString.of(textToAnnotate),
    });
    const annotationRef = pdfDoc.context.register(annotation);

    /* DO NOT REMOVE THIS LINE
     * IDK why there is error after remove it
     */
    page.drawText("");

    const annots = page.node.lookup(PDFName.of("Annots"), PDFArray);
    annots.push(annotationRef);

    // then for highlight
    const highlightPos = annotationEntry.position.rects;
    highlightPos.forEach((highlight) => {
      const { x1, y1, x2, y2 } = highlight;
      const coords = correctCoordinates(
        {
          x1,
          y1,
          x2,
          y2,
          scaledWidth: highlight.width,
          scaledHeight: highlight.height,
        },
        pageWidth,
        pageHeight,
      );
      // Rect: [153, 636, 344, 620]
      // QuadPoints: [153, 636, 344, 636, 153, 620, 344, 620]
      const [x_1, y_1, x_2, y_2] = coords;
      const QuadPoints = [x_1, y_1, x_2, y_1, x_1, y_2, x_2, y_2];
      const highlightAnnotation = pdfDoc.context.obj({
        Type: "Annot",
        Subtype: "Highlight",
        Rect: coords,
        C: [1, 0.64, 0],
        QuadPoints: QuadPoints,
      });
      page.drawText("");

      const highlightAnnotationRef =
        pdfDoc.context.register(highlightAnnotation);
      annots.push(highlightAnnotationRef);
    });
  });

  const pdfBytes = await pdfDoc.save();

  const blob = new Blob([pdfBytes], { type: "application/pdf" });
  const downloadUrl = window.URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = downloadUrl;
  link.setAttribute("download", "filename.pdf");
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  window.URL.revokeObjectURL(downloadUrl);
}
