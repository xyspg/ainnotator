import React, { useEffect, useState } from "react";
import { Button, CardHeader, Progress } from "@nextui-org/react";
import type { IHighlight } from "@/lib/react-pdf-highlighter";
import { Card, CardBody, CardFooter, Divider } from "@nextui-org/react";
import { CreditIndicator } from "@/app/components/credit-indicator";

interface Props {
  highlights: Array<IHighlight>;
  resetHighlights: () => void;
  toggleDocument: () => void;
  completion: string;
  loading: boolean;
  onAddAnnotation: (annotation: string | null) => void;
  onRemove: (highlight: IHighlight) => void;
  onRender: () => void;
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
  onRemove,
  onRender,
}: Props) {
  const [isCardVisible, setIsCardVisible] = useState(true);
  const [textSelection, setTextSelection] = useState<string>("");
  const handleAddAnnotation = () => {
    // Toggle the visibility of the card
    setIsCardVisible(false);

    if (textSelection) {
      onAddAnnotation(textSelection);
      return;
    }

    // Call the original onAddAnnotation function
    onAddAnnotation(null);
  };

  /**
   * 在 completion 变化时，将卡片设置为可见
   */

  useEffect(() => {
    setIsCardVisible(true);
  }, [completion]);

  /**
   * 自定义批注，响应 MouseUp 事件
   * 将选中的文本保存到 textSelection 中
   */
  const handleMouseUp = () => {
    const selection = window.getSelection()?.toString();
    if (selection) {
      setTextSelection(selection);
    }
  };

  return (
    <div className="w-[25vw] text-neutral-900 font-sans font-light">
      <div className="p-8">
        <Button color="primary" onClick={onRender} className="m-1">
          Export With Annotations
        </Button>

        {/*<p>*/}
        {/*  To create area highlight hold ⌥ Option key (Alt), then click and drag.*/}
        {/*</p>*/}
      </div>
      <Divider />
      {!completion && loading && (
        <Card className="m-2 p-1">
          <CardBody>
            <div className="flex flex-col items-center justify-center">
              <div className="spinner"></div>
              <Progress
                isIndeterminate
                aria-label="loading"
                size="sm"
                className="max-w-md my-4"
              />
              <p className="text-sm font-medium text-gray-500">Loading...</p>
            </div>
          </CardBody>
        </Card>
      )}
      {!isCardVisible ||
        (!completion && !loading && (
          <p className="p-8 font-medium text-black">
            Select texts to get started
          </p>
        ))}
      {completion && isCardVisible && (
        <Card className="mx-2">
          <CardBody
            onMouseUp={handleMouseUp}
            data-tg-tour="<span>Select some text to create partial ainnotation</span>"
          >
            {completion}
          </CardBody>
          <Divider />
          {completion && !loading && (
            <div className="p-4 flex flex-col gap-2">
              <Button color="primary" onClick={handleAddAnnotation}>
                Add Annotation
              </Button>
              {textSelection ? (
                <Button color="secondary" onClick={handleAddAnnotation}>
                  Add Custom Annotation
                </Button>
              ) : (
                <Button color="secondary" disabled>
                  Select some text to add partially
                </Button>
              )}
            </div>
          )}
        </Card>
      )}

      <ul className="p-8 text-md font-sans font-light flex flex-col gap-4 overflow-auto ">
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
                <CardBody className="text-xs">
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
              <CardFooter className="flex flex-row justify-between">
                Page {highlight.position.pageNumber}
                <Button
                  onClick={() => {
                    onRemove(highlight);
                  }}
                >
                  Remove
                </Button>
              </CardFooter>
            </Card>
          </li>
        ))}
      </ul>

      {highlights.length > 0 ? (
        <div className="p-4 mx-4">
          <Button color="danger" onClick={resetHighlights}>
            Reset highlights
          </Button>
        </div>
      ) : null}
      <div className="p-4 mb-8">
        <CreditIndicator />
      </div>
    </div>
  );
}
