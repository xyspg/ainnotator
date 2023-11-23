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

import { Button } from "@nextui-org/react";

import React, { useCallback, useEffect, useState, useRef } from "react";
import { Sidebar } from "@/app/components/Sidebar";

import { useCompletion } from "ai/react";
import { useAtom } from "jotai";
import { completionAtom } from "@/app/atoms";

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

export const PDF = ({ pdf }: { pdf: string }) => {
  const [url, setUrl] = useState(pdf || PRIMARY_PDF_URL);
  const [highlights, setHighlights] = useState<Array<IHighlight>>([]);
  const { completion, isLoading, complete } = useCompletion();
  const [textSelection, setTextSelection] = useState<any>("");
  const [position, setPosition] = useState<Position>();
  console.log("highlights", highlights);
    console.log("completion--->", completion);
    console.log("textSelection--->", textSelection);
    console.log("pos--->", position);



  const resetHighlights = () => {
    setHighlights([]);
  };

  const toggleDocument = () => {
    const newUrl =
      url === PRIMARY_PDF_URL ? SECONDARY_PDF_URL : PRIMARY_PDF_URL;
    setUrl(newUrl);
    setHighlights([]);
  };

  const scrollViewerTo = (highlight: any) => {};

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
  }, [scrollViewerTo]);

  const getHighlightById = useCallback(
    (id: string) => {
      return highlights.find((highlight) => highlight.id === id);
    },
    [highlights],
  );

  const addHighlight = (highlight: {
    comment: Comment;
    position: Position;
    content: Content;
  }) => {
    //@ts-ignore
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


  function handleAddHighlight() {
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
    setTextSelection(content)
    setPosition(position)
    complete(content?.text as string, {
      body: {
        data: JSON.stringify({
          context,
        }),
      },
    });
  };

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
          setTip(highlight, (highlight: any) => popupContent)
        }
        onMouseOut={hideTip}
        key={index}
        children={component}
      />
    );
  };

  return (
    <>
      <div className="flex h-screen">
        <Sidebar
          highlights={highlights}
          resetHighlights={resetHighlights}
          toggleDocument={toggleDocument}
          completion={completion}
          loading={isLoading}
          onAddAnnotation={handleAddHighlight}
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
                  scrollViewerTo(scrollTo);
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

const Loading = () => <div>Loading...</div>;
const getNextId = () => String(Math.random()).slice(2);

const parseIdFromHash = () =>
  document.location.hash.slice("#highlight-".length);

const resetHash = () => {
  document.location.hash = "";
};

export default PDF;
