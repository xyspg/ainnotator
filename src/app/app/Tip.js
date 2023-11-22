import React, { Component } from "react";
import "react-pdf-highlighter/dist/esm/style/Tip.css";
export class Tip extends Component {
  constructor() {
    super(...arguments);
    this.state = {
      compact: true,
      text: "",
      emoji: "",
    };
  }
  // for TipContainer
  componentDidUpdate(nextProps, nextState) {
    const { onUpdate } = this.props;
    if (onUpdate && this.state.compact !== nextState.compact) {
      onUpdate();
    }
  }
  render() {
    const { onConfirm, onOpen } = this.props;
    const { compact, text, emoji } = this.state;
    return (
      <div className="Tip">
        {compact ? (
          <div
            className="Tip__compact font-sans !bg-neutral-900 text-white !rounded-xl !shadow-md"
            onClick={() => {
              onOpen();
              this.setState({ compact: false });
            }}
          >
            Add highlight
          </div>
        ) : (
          <form
            className="Tip__card px-4 py-2 font-sans"
            onSubmit={(event) => {
              event.preventDefault();
              onConfirm({ text, emoji });
            }}
          >
            <div>
              <textarea
                placeholder="Your comment"
                autoFocus={true}
                className="p-2 font-sans"
                value={text}
                onChange={(event) =>
                  this.setState({ text: event.target.value })
                }
                ref={(node) => {
                  if (node) {
                    node.focus();
                  }
                }}
              />
            </div>
            <div>
              <input type="submit" value="Save" />
            </div>
          </form>
        )}
      </div>
    );
  }
}
export default Tip;
//# sourceMappingURL=Tip.js.map
