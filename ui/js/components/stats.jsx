/**
 * Amendements Stats
 * ==================
 *
 */
import React, {Component} from 'react';
import {branch} from 'baobab-react/decorators';
import _ from 'lodash';

@branch({
  cursors: {
    amendements: ['amendements']
  },
  facets: {
    matches: 'globalMatches'
  }
})
export default class Stats extends Component {
  render() {
    const {amendements, matches} = this.props;

    return (
      <span>Result: {_.compact(matches).length}/{amendements.length}</span>
    );
  }
}
