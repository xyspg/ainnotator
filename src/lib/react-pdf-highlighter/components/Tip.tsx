import React, { Component } from "react";

import "../style/Tip.css";

interface State {
  compact: boolean;
  text: string;
  emoji: string;
}

interface Props {
  onConfirm: () => void;
  onOpen: () => void;
  onUpdate?: () => void;
}

export class Tip extends Component<Props, State> {
  state: State = {
    compact: true,
    text: "",
    emoji: "",
  };

  // for TipContainer
  componentDidUpdate(nextProps: Props, nextState: State) {
    const { onUpdate } = this.props;

    if (onUpdate && this.state.compact !== nextState.compact) {
      onUpdate();
    }
  }

  render() {
    const { onConfirm, onOpen } = this.props;
    const { compact, text, emoji } = this.state;

    return (
      <div>
         <button onClick={onConfirm}>Add annotation</button>
      </div>
    );
  }
}

export default Tip;
