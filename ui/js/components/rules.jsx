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
  },
  facets: {
    matches: 'globalMatches'
  }
})
export default class RulesList extends Component {
  renderRule(rule, i) {
    return <Rule key={i}
                 data={rule}
                 count={this.counts[rule.name] || 0} />;
  }

  render() {
    const {rules, matches} = this.props;

    this.counts = _(matches)
      .compact()
      .groupBy('name')
      .mapValues(a => a.length)
      .value();

    return <ul className="rules-list">{rules.map(this.renderRule.bind(this))}</ul>;
  }
}

class Rule extends Component {
  static contextTypes = {
    tree: PropTypes.baobab
  };

  handleClick() {
    this.context.tree.set('regex', this.props.data.regex.source);
  }

  render() {
    const {data: {name}, count} = this.props;

    return <li onClick={this.handleClick.bind(this)}>{`Rule : ${name} (${count})`}</li>;
  }
}
