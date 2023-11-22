import React from "react";
import type { IHighlight } from "react-pdf-highlighter";

interface Props {
  highlights: Array<IHighlight>;
  resetHighlights: () => void;
  toggleDocument: () => void;
  completion: string;
}

const updateHash = (highlight: IHighlight) => {
  document.location.hash = `highlight-${highlight.id}`;
};

export function Sidebar({
  highlights,
  toggleDocument,
  resetHighlights,
  completion,
}: Props) {
  return (
    <div className="w-[25vw] bg-neutral-900 text-white font-sans font-light">
      <div className="p-8">
        <h2 className="mb-1  text-2xl font-medium">PDF Highlighter</h2>

        {/*<p>*/}
        {/*  To create area highlight hold ⌥ Option key (Alt), then click and drag.*/}
        {/*</p>*/}
      </div>
      {completion && (
        <div className="whitespace-pre-wrap my-4 p-4 border-neutral-200 border-1 m-2">
          {completion}
        </div>
      )}

      <ul className="p-8 text-md font-sans font-light ">
        {highlights.map((highlight, index) => (
          <li
            key={index}
            className="sidebar__highlight"
            onClick={() => {
              updateHash(highlight);
            }}
          >
            <div>
              <p className="text-lg font-medium">{highlight.comment.text}</p>
              {highlight.content.text ? (
                <blockquote className="text-xs" style={{ marginTop: "0.5rem" }}>
                  {`${highlight.content.text.slice(0, 90).trim()}…`}
                </blockquote>
              ) : null}
              {highlight.content.image ? (
                <div
                  className="highlight__image"
                  style={{ marginTop: "0.5rem" }}
                >
                  <img src={highlight.content.image} alt={"Screenshot"} />
                </div>
              ) : null}
            </div>
            <div className="highlight__location">
              Page {highlight.position.pageNumber}
            </div>
          </li>
        ))}
      </ul>
      <div style={{ padding: "1rem" }}>
        <button onClick={toggleDocument}>Toggle PDF document</button>
      </div>
      {highlights.length > 0 ? (
        <div style={{ padding: "1rem" }}>
          <button onClick={resetHighlights}>Reset highlights</button>
        </div>
      ) : null}
    </div>
  );
}
