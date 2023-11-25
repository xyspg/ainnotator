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
    setHighlights([]);
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

  function handleAddHighlight(position: Position) {
    const highlight = {
      content: textSelection,
      position,
      comment: { text: completion },
    };
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
    toast.promise(renderPdf(url, highlights), {
      loading: "Rendering Your PDF",
      success: "PDF Rendered",
      error: (err) => `There is an error rendering your PDF: ${err.toString()}`
    })
  }

  return (
    <ClientOnly>
      <Toaster />
      <div className="sticky h-16 bg-slate-100 flex flex-row justify-start items-center px-4 py-2">
        <Button color="primary" onClick={handleRender} className="m-1">Export With Annotations</Button>
      </div>
      <div className="flex h-screen">
        <Sidebar
          highlights={highlights}
          resetHighlights={resetHighlights}
          toggleDocument={toggleDocument}
          completion={completion}
          loading={isLoading}
          onAddAnnotation={() => {
            handleAddHighlight(position as Position);
          }}
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
    </ClientOnly>
  );
};

const getNextId = () => String(Math.random()).slice(2);

const parseIdFromHash = () =>
  document.location.hash.slice("#highlight-".length);

const resetHash = () => {
  document.location.hash = "";
};

export default PDF;
