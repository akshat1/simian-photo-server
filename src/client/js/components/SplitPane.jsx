'use strict';

const React = require('react');


class SplitPane extends React.Component {
  static className = {
    root: ((direction, clazz) => `sps-split-pane ${direction.toLowerCase()} ${clazz}`),
    first: 'sps-split-pane-first',
    second: 'sps-split-pane-second',
    splitter: 'sps-split-pane-splitter',
    paneContents: 'sps-split-pane-contents'
  }


  renderFirst() {
    return (
      <div className = {SplitPane.className.first}>
        <div className = {SplitPane.className.paneContents}>
          {this.props.children[0]}
        </div>
      </div>
    );
  }


  renderSecond() {
    return (
      <div className = {SplitPane.className.second}>
        <div className = {SplitPane.className.paneContents}>
          {this.props.children[1]}
        </div>
      </div>
    );
  }


  renderSplitter() {
    return (
      <div className = {SplitPane.className.splitter}>
        <div className = {SplitPane.className.thumb} />
      </div>
    );
  }


  render() {
    const {
      direction,
      className
    } = this.props;
    return (
      <div className = {SplitPane.className.root(direction, className)}>
        {this.renderFirst()}
        {this.renderSplitter()}
        {this.renderSecond()}
      </div>
    );
  }
}


module.exports = SplitPane;
