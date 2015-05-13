/**
 * Amendements Amendements List
 * =============================
 *
 */
import React, {Component} from 'react';
import CodeMirror from 'codemirror';
import {branch} from 'baobab-react/decorators';

// Importing needed codemirror assets
require('../regex-mode.js');

@branch({
  cursors: {
    regex: ['regex']
  }
})
export default class Regex extends Component {
  componentDidMount() {
    var node = React.findDOMNode(this.refs.editor);

    this.editor = CodeMirror.fromTextArea(
      node,
      {
        mode: 'regex',
        lineWrapping: true
      }
    );

    this.editor.doc.setValue(this.props.regex || '');
  }

  render() {

    if (this.editor)
      this.editor.doc.setValue(this.props.regex || '');

    return (
      <div>
        <textarea ref="editor" />
      </div>
    );
  }
}
