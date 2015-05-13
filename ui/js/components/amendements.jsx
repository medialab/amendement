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
    matches: 'globalMatches'
  }
})
export default class AmendementsList extends Component {
  renderRule([amendement, match]) {
    return <Amendement key={amendement.id}
                       data={amendement}
                       matched={!!match} />;
  }

  render() {
    const zipped = _.zip(this.props.amendements, this.props.matches);

    return <ul className="amendements-list">{zipped.map(this.renderRule)}</ul>;
  }
}

class Amendement extends Component {
  render() {
    const {data: {texte}, matched} = this.props;

    return <li className={matched ? 'matched' : 'unmatched'}>{texte}</li>;
  }
}
