import React from "react";
import {Button, CardHeader} from "@nextui-org/react";
import type { IHighlight } from "@/lib/react-pdf-highlighter";
import { Card, CardBody, CardFooter, Divider } from "@nextui-org/react";

interface Props {
  highlights: Array<IHighlight>;
  resetHighlights: () => void;
  toggleDocument: () => void;
  completion: string;
  loading: boolean;
  onAddAnnotation: () => void;
}

const updateHash = (highlight: IHighlight) => {
  document.location.hash = `highlight-${highlight.id}`;
};

export function Sidebar({
  highlights,
  toggleDocument,
  resetHighlights,
  completion,
  loading,
  onAddAnnotation,
}: Props) {
  return (
    <div className="w-[25vw] bg-neutral-100 text-neutral-900 font-sans font-light overflow-auto">
      <div className="p-8">
        <h2 className="mb-1 font-sans text-3xl font-medium text-blue-600">AInnotator</h2>

        {/*<p>*/}
        {/*  To create area highlight hold ⌥ Option key (Alt), then click and drag.*/}
        {/*</p>*/}

      </div>
      <Divider />
      {!completion && loading && (
        <Card className="m-2">
            <CardBody>
                <div className="flex flex-col items-center justify-center">
                <div className="spinner"></div>
                <p className="text-sm font-medium text-gray-500">Loading...</p>
                </div>
            </CardBody>
        </Card>
      )}
      {!completion && !loading && (
          <p className="p-8 font-medium text-black">Select texts to get started</p>
      )}
      {completion && (
        <Card className="mx-2">
          <CardBody>
          {completion}

          </CardBody>
          <Divider />
          {completion && !loading && (
              <div className="p-4"><Button color="primary" onClick={onAddAnnotation}>Add Annotation</Button></div>
          )}
        </Card>
      ) }

      <ul className="p-8 text-md font-sans font-light flex flex-col gap-4 ">
        {highlights.map((highlight, index) => (
          <li
            key={index}
            onClick={() => {
              updateHash(highlight);
            }}
          >
            <Card>
              <CardHeader>{highlight.comment.text}</CardHeader>
              <Divider />
              {highlight.content.text ? (
                <CardBody className="text-xs" >
                  {`${highlight.content.text.slice(0, 90).trim()}…`}
                </CardBody>
              ) : null}
              {highlight.content.image ? (
                <div
                  className="highlight__image"
                  style={{ marginTop: "0.5rem" }}
                >
                  <img src={highlight.content.image} alt={"Screenshot"} />
                </div>
              ) : null}
            <Divider />
            <CardFooter className="highlight__location">
              Page {highlight.position.pageNumber}
            </CardFooter>
            </Card>

          </li>
        ))}
      </ul>


      {highlights.length > 0 ? (
        <div className="p-4">
          <Button color='danger' onClick={resetHighlights}>Reset highlights</Button>
        </div>
      ) : null}
    </div>
  );
}
