"use client";
import type {
  LTWH,
  IHighlight,
  NewHighlight,
  HighlightComment,
  ScaledPosition,
  Content,
  Position,
} from "@/lib/react-pdf-highlighter/types";
import {
  AreaHighlight,
  Highlight,
  PdfHighlighter,
  PdfLoader,
  Popup,
  Tip,
} from "./react-pdf-highlighter";
import Loading from "@/app/components/Loading";
import { Sidebar } from "@/app/components/Sidebar";
import toast, { Toaster } from 'react-hot-toast';
import {Button, Card, CardBody } from "@nextui-org/react";

import React, { useCallback, useEffect, useState, useRef } from "react";

import { usePathname } from "next/navigation";
import { useCompletion } from "ai/react";
import { ClientOnly } from "@/lib/clientOnly";
import axios from "axios";
import { renderPdf } from "@/app/annotate/render";
import PDFHeader from "@/app/components/PDFHeader";

const PRIMARY_PDF_URL = "https://r2.xyspg.moe/pdf/the-birds";
const SECONDARY_PDF_URL = "https://arxiv.org/pdf/1604.02480.pdf";


const HighlightPopup = ({
  comment,
}: {
  comment: { text: string; emoji: string };
}) =>
  comment.text ? (
      <Card>
        <CardBody className="max-w-md overflow-auto" >
      {comment.emoji} {comment.text}
        </CardBody>
      </Card>
  ) : null;

export const PDF = ({ pdf, annotation }: { pdf: string, annotation: IHighlight[] }) => {
  const url = pdf || PRIMARY_PDF_URL;
  const [highlights, setHighlights] = useState<IHighlight[]>(annotation || []);
  const { completion, isLoading, complete } = useCompletion();
  const [textSelection, setTextSelection] = useState<any>("");
  const [position, setPosition] = useState<Position>();
  console.log("highlights-->", highlights);
  console.log("position-->", position);

  const pathname = usePathname()
  const uuid = pathname.split("/")[2]





  /*
  * 保存批注
   */
  useEffect(() => {
    async function sendData() {
      try {
        await axios.post("/api/annotation", {
          pdfId: uuid,
          highlights: highlights,
        });
      } catch (error: any) {
        toast.error(`Failed to save annotations:, ${error.message}`);
      }
    }
    if (highlights.length > 0) {
      sendData();
    }
  }, [highlights]);

  async function handleResetHighlights() {
    const confirm = window.confirm("Are you sure you want to remove all annotations?")
    if (!confirm) {
      return
    }
    setHighlights([]);
    try {
      await axios.post("/api/annotation", {
        pdfId: uuid,
        highlights: [],
      });
      toast.success(`Annotations Removed`);
    } catch (error: any) {
      toast.error(`Failed to remove annotations:, ${error.message}`);
    }
  }
  const resetHighlights = () => {
    handleResetHighlights();
  };

  const toggleDocument = () => {};

  let scrollViewerTo = (highlight: any) => {};

  const scrollToHighlightFromHash = () => {
    const highlight = getHighlightById(parseIdFromHash());
    if (highlight) {
      console.log("highlight to scorll", highlight);
      scrollViewerTo(highlight);
    }
  };

  useEffect(() => {
    window.addEventListener("hashchange", scrollToHighlightFromHash, false);
    return () => {
      window.removeEventListener(
        "hashchange",
        scrollToHighlightFromHash,
        false,
      );
    };
  }, []);

  const getHighlightById = useCallback(
    (id: string) => {
      return highlights.find((highlight) => highlight.id === id);
    },
    [highlights],
  );

  const addHighlight = (highlight: NewHighlight) => {
    setHighlights([{ ...highlight, id: getNextId() }, ...highlights]);
  };

  const updateHighlight = (
    highlightId: string,
    position: Object,
    content: Object,
  ) => {
    setHighlights(
      highlights.map((h) => {
        const { id, ...rest } = h;
        return id === highlightId
          ? {
              ...h,
              position: { ...h.position, ...position },
              content: { ...h.content, ...content },
            }
          : h;
      }),
    );
  };

  /*
  * Add highlight with comment
   */
  function handleAddHighlight(position: Position, customText: string | null) {
    const highlight = {
      content: textSelection,
      position,
      comment: { text: customText || completion },
    };
    console.log("highlight to add -->",highlight)
    //@ts-ignore
    addHighlight(highlight);
  }

  const onSelectionFinished = (
    position: Position,
    context: string,
    content: Content,
  ) => {
    setTextSelection(content);
    setPosition(position);
    complete(content?.text as string, {
      body: {
        data: {
          context,
          "pdf_id": uuid
        },
      },
    });
  };

  const handleRemove = (highlight: IHighlight) => {
    setHighlights(highlights.filter((h) => h.id !== highlight.id));
  }

  const highlightTransform = (
    highlight: any,
    index: number,
    setTip: any,
    hideTip: () => void,
    viewportToScaled: any,
    screenshot: any,
    isScrolledTo: boolean,
  ) => {
    const isTextHighlight = !Boolean(
      highlight.content && highlight.content.image,
    );

    return (
      <Popup
        popupContent={<HighlightPopup {...highlight} />}
        onMouseOver={(popupContent) =>
          setTip(highlight, (highlight: any) => popupContent)
        }
        onMouseOut={hideTip}
        key={index}
      >
        {isTextHighlight ? (
          <Highlight
            isScrolledTo={isScrolledTo}
            position={highlight.position}
            comment={highlight.comment}
          />
        ) : (
          <AreaHighlight
            isScrolledTo={isScrolledTo}
            highlight={highlight}
            onChange={(boundingRect) => {
              updateHighlight(
                highlight.id,
                { boundingRect: viewportToScaled(boundingRect) },
                { image: screenshot(boundingRect) },
              );
            }}
          />
        )}
      </Popup>
    );
  };

  const handleRender = async () => {
    if (!highlights) {
      toast.error("You don't have annotations yet")
      return
    }
    toast.promise(renderPdf(url, highlights), {
      loading: "Rendering Your PDF",
      success: "PDF Rendered",
      error: (err) => `There is an error rendering your PDF: ${err.toString()}`
    })
  }

  const handleAddAnnotation = (annotation: string | null) => {
    handleAddHighlight(position as Position, annotation);
  }

  return (
    <>
      <Toaster />

      <div className="flex h-screen">
        <Sidebar
          highlights={highlights}
          resetHighlights={resetHighlights}
          toggleDocument={toggleDocument}
          completion={completion}
          loading={isLoading}
          onRender={handleRender}
          onAddAnnotation={handleAddAnnotation}
          onRemove={handleRemove}
        />
        <div
          style={{
            height: "100vh",
            width: "75vw",
            position: "relative",
          }}
        >
          <PdfLoader url={url} beforeLoad={<Loading />}>
            {(pdfDocument) => (
              <PdfHighlighter
                pdfDocument={pdfDocument}
                enableAreaSelection={(event) => event.altKey}
                onScrollChange={resetHash}
                scrollRef={(scrollTo) => {
                  scrollViewerTo = scrollTo;
                  scrollToHighlightFromHash();
                }}
                //@ts-ignore
                onSelectionFinished={onSelectionFinished}
                highlightTransform={highlightTransform}
                highlights={highlights}
              />
            )}
          </PdfLoader>
        </div>
      </div>
    </>
  );
};

const getNextId = () => String(Math.random()).slice(2);

const parseIdFromHash = () =>
  document.location.hash.slice("#highlight-".length);

const resetHash = () => {
  document.location.hash = "";
};

export default PDF;
