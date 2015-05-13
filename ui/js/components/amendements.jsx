/**
 * Amendements Amendements List
 * =============================
 *
 */
import React, {Component} from 'react';
import {branch} from 'baobab-react/decorators';

@branch({
  cursors: {
    amendements: ['amendements']
  },
  facets: {
    regex: 'regex'
  }
})
export default class AmendementsList extends Component {
  renderRule(amendement, i) {
    return <Amendement key={amendement.id}
                       order={i}
                       data={amendement}
                       regex={this.props.regex} />;
  }

  render() {
    return <ul className="amendements-list">{this.props.amendements.map(this.renderRule.bind(this))}</ul>;
  }
}

class Amendement extends Component {
  render() {
    const txt = this.props.data.texte,
          matched = !!txt.match(this.props.regex);

    return <li className={matched ? 'matched' : 'unmatched'}>{txt}</li>;
  }
}
