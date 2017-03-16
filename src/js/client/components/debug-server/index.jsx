const React = require('react');
const classNames = require('classnames');
const { JSONViewer } = require('../json-viewer/index.jsx');
const LocalStorage = require('../../util/local-storage.js');
require('isomorphic-fetch');


class Row extends React.Component {
  constructor(props) {
    super(props);
    this.onChange = this.onChange.bind(this);
  }

  onChange(e) {
    if (typeof this.props.onChange === 'function') {
      this.props.onChange(e.target.value)
    }
  }

  renderInput() {
    const props = this.props
    if (props.multiline) {
      return (
        <textarea
          onChange = {this.onChange}
          placeholder = {props.placeholder}
          value = {props.value}
        >
        </textarea>
      )
    } else {
      return (
        <input
          type = 'text'
          onChange = {this.onChange}
          placeholder = {props.placeholder}
          value = {props.value}
        />
      )
    }
  }

  renderRest() {
    const props = this.props;
    if (props.label)
      return <div className='debug-row-rest'>{props.children}</div>
  }

  render () {
    const props = this.props
    const className = `debug-row ${props.multiline ? 'multiline' : ''}`
    return (
      <div className = {className}>
        <label>{props.label || props.children}</label>
        {this.renderInput()}
        {this.renderRest()}
      </div>
    )
  }
}


export class DebugServer extends React.Component {
  constructor(props) {
    super(props);
    this.handleURLChange = this.handleURLChange.bind(this);
    this.handleInputChange = this.handleInputChange.bind(this);
    this.fireRequest = this.fireRequest.bind(this);
    this.saveState = this.saveState.bind(this);
    this.state = {
      url: '',
      strInput: '',
      serverResponse: '',
      isGoDisabled: true
    };
  }

  saveState() {
    const {
      url,
      strInput
    } = this.state;
    LocalStorage.set('api-debugger.state', JSON.stringify({
      url,
      strInput
    }));
  }

  componentWillMount() {
    const savedState = LocalStorage.get('api-debugger.state');
    console.log('saved state: ', savedState);
    if (savedState) {
      console.log('consume');
      try {
        console.log('Try to parse...', savedState);
        const ssObj = JSON.parse(savedState);
        this.setState({
          ...ssObj,
          isGoDisabled: this.calcIsGoDisabled(ssObj)
        });
      } catch (err) {
        console.error(err);
      }
    }
  }

  calcIsGoDisabled(newState) {
    console.log('calcIsGoDisabled: ', newState)
    const {
      url,
      strInput
    } = { ...this.state, ...newState };

    if (!url) {
      console.log(0)
      return true;
    }

    if (!strInput){
      console.log(1)
      return false;
    }

    try {
      JSON.parse(strInput);
      return false;
    } catch(err) {
      console.error('Error parsing ', strInput, err);
      return true;
    }
  }

  handleInputChange(strInput) {
    this.setState({
      strInput,
      isGoDisabled: this.calcIsGoDisabled({strInput})
    }, this.saveState);
  }

  handleURLChange(url) {
    this.setState({
      url,
      isGoDisabled: this.calcIsGoDisabled({url})
    }, this.saveState);
  }

  async fireRequest() {
    const opts = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      }
    };

    if (this.state.strInput)
      opts.body = this.state.strInput

    const response = await fetch(this.state.url, opts);
    const json = await response.json();
    console.log(json);
    this.setState({serverResponse: json});
  }

  render() {
    const clazzName = classNames('debug-server', this.props.className);
    return (
      <div className = {clazzName}>
        <Row onChange = {this.handleURLChange} label='Url' value = {this.state.url}>
          <button onClick={this.fireRequest} disabled={this.state.isGoDisabled}>Go</button>
        </Row>
        <Row multiline onChange = {this.handleInputChange} value = {this.state.strInput}>Input JSON</Row>
        <div className='debug-row multiline'>
          <label>Response</label>
          <JSONViewer value = {this.state.serverResponse}/>
        </div>
      </div>
    );
  }
}

module.exports = { DebugServer };
