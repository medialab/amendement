/**
 * Amendements State
 * ==================
 *
 */
import Baobab from 'baobab';
import grammar from '../../rules.js';
import data from '../../data/renseignement.json';

function preprocess(txt) {
  return txt
    .replace(/\s/g, ' ')
    .replace(/<\/p><p>/g, ' ')
    .replace(/(<p>|<\/p>)/g, '');
}

var recevables = data.amendements.map(a => a.amendement).filter(function(a){
  return !(a.sort === "Irrecevable" ||
           a.sujet.match(/^article additionnel/i)) &&
           a.source.match(/assemblee-nationale/);
});

recevables.forEach(a => a.texte = preprocess(a.texte));

var state = {
  amendements: recevables,
  regex: null,
  rules: grammar.rules
};

export default new Baobab(state, {
  facets: {
    regex: {
      cursors: {
        source: ['regex']
      },
      get: function(data) {
        return new RegExp(data.source, 'i');
      }
    }
  }
});
