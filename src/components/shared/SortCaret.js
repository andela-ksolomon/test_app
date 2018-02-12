import React, { Component } from "react";

export default class SortCaret extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  callSortFunc = () => {
    let { column, order, sortFunction } = this.props;
    let newOrder = order === "asc" ? "desc" : "asc";
    sortFunction(newOrder, column);
  };

  render() {
    let { order } = this.props;
    return (
      <a onClick={this.callSortFunc}>
        {order === "desc"
          ? <span className="caret" />
          : <span className="caret_down" />}
      </a>
    );
  }
}
