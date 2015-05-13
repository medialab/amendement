/**
 * Amendements State
 * ==================
 *
 */
import Baobab from 'baobab';
import grammar from '../../rules.js';
import data from '../../data/renseignement.json';
import process from '../../process.js';

var state = {
  amendements: process(data.amendements),
  regex: null,
  rules: grammar.rules
};

export default new Baobab(state, {
  facets: {

    // The compiled regex from editor
    regex: {
      cursors: {
        source: ['regex']
      },
      get: function(data) {
        return new RegExp(data.source, 'i');
      }
    },

    // The current matches
    globalMatches: {
      cursors: {
        amendements: ['amendements']
      },
      get: function({amendements, regex}) {
        const results = amendements.map(a => grammar.parse(a.texte));

        return results;
      }
    }
  }
});
