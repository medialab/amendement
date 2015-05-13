/**
 * Amendements Rules List
 * =======================
 *
 */
import React, {Component} from 'react';
import {branch} from 'baobab-react/decorators';
import PropTypes from 'baobab-react/prop-types';

@branch({
  cursors: {
    rules: ['rules']
  }
})
export default class RulesList extends Component {
  renderRule(rule, i) {
    return <Rule key={i} order={i} data={rule} />;
  }

  render() {
    return <ul className="rules-list">{this.props.rules.map(this.renderRule)}</ul>;
  }
}

class Rule extends Component {
  static contextTypes = {
    tree: PropTypes.baobab
  };

  handleClick() {
    this.context.tree.set('regex', this.props.data.source);
  }

  render() {
    return <li onClick={this.handleClick.bind(this)}>{`Rule n°${this.props.order}`}</li>;
  }
}
