/**
 * Amendements Rules
 * ====================
 *
 */
var Grammar = require('./lib/grammar.js')

function MyCustomGrammar() {

  // Extending the Grammar
  Grammar.call(this);
  var def = this.def.bind(this);

  def(
    'TRIPLETRIPLE',
    /(I\. –.*)(II\. –.*)(III\. –.*)/,
    function(first, second, third) {
      return {
        first: first,
        second: second,
        third: third
      }
    }
  );

  def(
    'DOUBLEDOUBLE',
    /(I\. –.*)(II\. –.*)/,
    function(first, second, third) {
      return {
        first: first,
        second: second,
      }
    }
  );

  def(
    'Complete',
    /Compléter ?(?:ainsi )?(?:la (première|seconde|deuxième|troisième|dernière) phrase de )?((?:cet |l')amendement|(?:cet |l')article|(?:cet |l')alinéa (\d+))(?: par (la phrase|l'alinéa|les? mots?|les? mots? et la phrase))?(?: suivant[es]?)? ? ?:.*?« ([^»]*) »/i,
    function(phrase, what, where, ajout, content) {
      var type = {
        operation: 'completer:',
        ajout: '',
        content: content,
      };

      if (phrase != undefined)
        type.phrase = phrase

      if (where != undefined)
        type.alinea = where

      if ((what != undefined) && (what.match(/amendement/)))
        type.operation += "amendement"
      else if ((what != undefined) && (what.match(/article/)))
        type.operation += "article"
      else if ((what != undefined) && (what.match(/alinéa/)))
        type.operation += "alinea"

      if ((ajout != undefined) && (ajout.match(/et la phrase/)))
        type.ajout += "mot&phrase"
      else if ((ajout != undefined) && (ajout.match(/phrase/)))
        type.ajout += "phrase"
      else if ((ajout != undefined) && (ajout.match(/mot/)))
        type.ajout += "mot"
      else if ((ajout != undefined) && (ajout.match(/alinéa/)))
        type.ajout += "alinéa"

      return type;
    }
  );

  def(
    'Substituer',
    /(?:(?:À (la fin de )?|(Au début de )?)(?:la (première|seconde|deuxième|troisième) phrase de )?l'alinéa (\d+), )?substituer (?:aux? mots?|aux? nombres?|(?:à la|aux) références?) :.*?« ([^»]*) ».*?(les? mots?|les? nombres?|la phrase et les? mots? suivants?|(?:la|les?) références?) ?:.*?« ([^»]*) »/,
    function(fin, debut, phrase, where, target, typereplace, replacement) {
      var type = {
        operation: 'substituer:',
        alinea: +where,
        target: target,
        replacement: replacement
      };

      if (phrase != undefined)
        type.phrase = phrase

      if (fin != undefined)
        type.fin = "fin"

      if (debut != undefined)
        type.debut = "début"

      if (typereplace.match(/la phrase et les? mots? suivants?/))
        type.operation += "phrase";
      else if (typereplace.match(/les? nombres?/))
        type.operation += "nombre";
      else if (typereplace.match(/les? mots?/))
        type.operation += "mot";
      else if (typereplace.match(/référence/))
        type.operation += "référence";

      return type
    }
  );

  def(
    'Insérer',
    /(?:(?:(?:À |A )(la fin de )?|(Au début de )?)(?:la (première|seconde|deuxième|troisième|dernière) phrase de )?l'alinéa (\d+), )?(?:après (?:la (première|dernière) occurrence de )?(?:les? mots?|l(?:a|es?) références?) :.*?« ([^»]*) », )?insérer (les? mots?|la phrase suivante|(?:la|les) réferences?) :.*?« ([^»]*) »/i,
    function(fin, debut, phrase, where, occurrence, target, typereplace, replacement) {
      var type = {
        operation: 'insérer:',
        alinea: +where,
        replacement: replacement
      };

      if (phrase != undefined)
        type.phrase = phrase

      if (target!= undefined)
        type.target = target

      if (debut != undefined)
        type.debut = "début"
      if (fin != undefined)
        type.fin = "fin"

      if (occurrence != undefined)
        type.occurrence = occurrence

      if (typereplace.match(/les? mots?/))
        type.operation += "mot";
      else if (typereplace.match(/(la|les) références?/))
        type.operation += "référence";

      return type
    }
  );

  def(
    'Insérer al.',
    /Après l'alinéa (\d+), insérer l'alinéa suivant :.*?« ([^»]*) »/,
    function(where, newAlinea) {
      return {
        operation: 'creer:alinea',
        alinea: +where,
        content: newAlinea
      };
    }
  );

  def(
    'Supprimer',
    /(?:(?:À (la fin de )?|(Au début de )?)(?:la (première|seconde|deuxième|troisième) phrase de )?l'alinéa (\d+), )?supprimer (?:les? mots?|la phrase suivante|(?:la|les) réferences?) :.*?« ([^»]*) »/i,
    function(fin, debut, phrase, where, target) {
      var type = {
        operation: 'supprimer:mots',
        alinea: +where,
        target: target
      };

      if (phrase != undefined)
        type.phrase = phrase

      if (fin != undefined)
        type.fin = 'fin'
      else if (debut != undefined)
        type.debut = 'debut'

      return type
    }
  );

  def(
    'Supprimer al.',
    /Supprimer ((?:la (première|seconde|deuxième|troisième) phrase de )?(?:l'alinéa|les alinéas)? (\d+)(?: (à|et) (\d+))?|cet article)/,
    function(what, phrase, from, operand, to) {
      var type = {
        operation: 'supprimer:',
      };

      if (what.match(/article/))
        type.operation += 'article';

      if (what.match(/alinéa/))
        type.operation += 'alinea';

      if (phrase != undefined) {
        type.operation = 'supprimer:phrase';
        type.phrase = phrase;
      }

      if (!what.match(/article/)){
        if (operand === 'à') {
          type.from = +from;
          type.to = +to;
        }
        else if (operand === 'et') {
          type.alineas = [+from, +to];
        }
        else if (operand === undefined){
          type.alinea = +from;
        }
        else {
          throw Error('supprimer:alinea rule - unknown operand "' + operand + '".');
        }
      }
      return type;
    }
  );

  def(
    'Rédiger ainsi',
    /Rédiger ainsi.*alinéa (\d+) :.*?« ([^»]*) »/i,
    function(where, content) {
      return {
        operation: 'rediger:alinéa',
        alinea: +where,
        content: content
      }
    }
  );
}

module.exports = new MyCustomGrammar();
