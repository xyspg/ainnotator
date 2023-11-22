"use client";
import type { IHighlight, NewHighlight } from "./react-pdf-highlighter";
import {
  AreaHighlight,
  Highlight,
  PdfHighlighter,
  PdfLoader,
  Popup,
  Tip,
} from "./react-pdf-highlighter";
import React, { useCallback, useEffect, useState, useRef } from "react";
import { Sidebar } from "@/app/components/Sidebar";

import { useCompletion } from "ai/react";
import { Card, CardBody, Skeleton } from "@nextui-org/react";

// const PRIMARY_PDF_URL = "https://arxiv.org/pdf/1708.08021.pdf";
const PRIMARY_PDF_URL = "https://r2.xyspg.moe/pdf/the-birds";
const SECONDARY_PDF_URL = "https://arxiv.org/pdf/1604.02480.pdf";

const HighlightPopup = ({
  comment,
}: {
  comment: { text: string; emoji: string };
}) =>
  comment.text ? (
    <div className="Highlight__popup">
      {comment.emoji} {comment.text}
    </div>
  ) : null;

export const PDF = ({pdf} : {pdf: string}) => {
  const [url, setUrl] = useState(
    pdf || PRIMARY_PDF_URL,
  );
  const [highlights, setHighlights] = useState<Array<IHighlight>>([]);

  const resetHighlights = () => {
    setHighlights([]);
  };

  const toggleDocument = () => {
    const newUrl =
      url === PRIMARY_PDF_URL ? SECONDARY_PDF_URL : PRIMARY_PDF_URL;
    setUrl(newUrl);
    setHighlights([]);
  };

  const scrollViewerTo = (highlight: any) => {
    // implementation of scrollViewerTo
  };

  const scrollToHighlightFromHash = () => {
    const highlight = getHighlightById(parseIdFromHash());
    if (highlight) {
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
  }, [scrollViewerTo]);

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
  const [completionResult, setCompletionResult] = useState<string>("");
  const { completion, isLoading, complete } = useCompletion();
  useEffect(() => {
    setCompletionResult(completion);
  }, [completion]);
  return (
    <>
      <div className="flex h-screen">
        <Sidebar
          highlights={highlights}
          resetHighlights={resetHighlights}
          toggleDocument={toggleDocument}
          completion={completion}

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
                // pdfScaleValue="page-width"
                scrollRef={(scrollTo) => {}}
                onSelectionFinished={(
                  position,
                  context,
                  content,
                  hideTipAndSelection,
                  transformSelection,
                ) => {
                  complete(content?.text as string, {
                    body: {
                      data: JSON.stringify({
                        context,
                      }),
                    },
                  });
                  console.log("sentence-->", content.text);
                  console.log("completion--->", completion)
                  function handleAddHighlight() {
                    const highlight = {
                      content,
                      position,
                      comment: completion,
                    };
                    addHighlight(highlight);
                    hideTipAndSelection();
                  }
                  return (
                    <>
                      <Tip
                        onOpen={transformSelection}
                        //@ts-ignore
                        onConfirm={(comment) => {
                          handleAddHighlight();
                          hideTipAndSelection();
                        }}
                      />
                    </>
                  );
                }}
                highlightTransform={(
                  highlight,
                  index,
                  setTip,
                  hideTip,
                  viewportToScaled,
                  screenshot,
                  isScrolledTo,
                ) => {
                  const isTextHighlight = !Boolean(
                    highlight.content && highlight.content.image,
                  );

                  const component = isTextHighlight ? (
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
                  );

                  return (
                    <Popup
                      popupContent={<HighlightPopup {...highlight} />}
                      onMouseOver={(popupContent) =>
                        setTip(highlight, (highlight) => popupContent)
                      }
                      onMouseOut={hideTip}
                      key={index}
                      children={component}
                    />
                  );
                }}
                highlights={highlights}
              />
            )}
          </PdfLoader>
        </div>
      </div>
    </>
  );
};

const Loading = () => <div>Loading...</div>;
const getNextId = () => String(Math.random()).slice(2);

const parseIdFromHash = () =>
  document.location.hash.slice("#highlight-".length);

const resetHash = () => {
  document.location.hash = "";
};

export default PDF;
