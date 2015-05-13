var Grammar = require('./grammar.js')

function MyCustomGrammar() {

  // Extending the Grammar
  Grammar.call(this);
  var def = this.def.bind(this);

  def(
    'Complete'
    /Compléter ?(ainsi )?(?:la (première|seconde|deuxième|troisième|dernière) phrase de )?(?:(?:cet |l')amendement|(?:cet |l')article|(?:cet |l')alinéa (\d+))( par (?:la phrase|l'alinéa|les? mots?|les? mots? et la phrase))?(?: suivant[es]?)? ? ?:.*?« ([^»]*) »/gi,
    function(content) {
      return {
        IDrule: 1,
        operation: 'ajouter:mots',
        content: content
      };
    }
  );

  // def(
  //   /.*(compléter).*alinéa (\d+).*«([^»]*)»/i,
  //   function(operation, where, content) {
  //     return {
  //       IDrule: 7,
  //       operation: 'ajouter:mots',
  //       alinea: +where,
  //       content: content.trim()
  //     }
  //   }
  // );

  def(
    /(?:(?:À (la fin de )?|(Au début de )?)(?:la (première|seconde|deuxième|troisième) phrase de )?l'alinéa (\d+), )?substituer (?:aux? mots?|aux? nombres?|(?:à la|aux) références?) :.*?« ([^»]*) ».*?(les? mots?|les? nombres?|la phrase et les? mots? suivants?|(?:la|les?) références?) ?:.*?« ([^»]*) »/,
    function(fin, debut, phrase, where, target, typereplace, replacement) {
      var type = {
        IDrule: 2,
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
    /(?:(?:(?:À |A )(la fin de )?|(Au début de )?)(?:la (première|seconde|deuxième|troisième|dernière) phrase de )?l'alinéa (\d+), )?(?:après (?:la (première|dernière) occurrence de )?(?:les? mots?|l(?:a|es?) références?) :.*?« ([^»]*) », )?insérer (les? mots?|la phrase suivante|(?:la|les) réferences?) :.*?« ([^»]*) »/i,
    function(fin, debut, phrase, where, occurrence, target, typereplace, replacement) {
      var type = {
        IDrule: 3,
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
    /Après l'alinéa (\d+), insérer l'alinéa suivant :.*?« ([^»]*) »/,
    function(where, newAlinea) {
      return {
        IDrule: 4,
        operation: 'creer:alinea',
        alinea: +where,
        content: newAlinea
      };
    }
  );

  def(
    /(?:(?:À (la fin de )?|(Au début de )?)(?:la (première|seconde|deuxième|troisième) phrase de )?l'alinéa (\d+), )?supprimer (?:les? mots?|la phrase suivante|(?:la|les) réferences?) :.*?« ([^»]*) »/i,
    function(fin, debut, phrase, where, target) {
      var type = {
        IDrule: 5,
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
    /Supprimer ((?:la (première|seconde|deuxième|troisième) phrase de )?(?:l'alinéa|les alinéas)? (\d+)(?: (à|et) (\d+))?|cet article)/,
    function(what, phrase, from, operand, to) {
      var type = {
        IDrule: 6,
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
    /Rédiger ainsi.*alinéa (\d+) :.*?« ([^»]*) »/i,
    function(where, content) {
      return {
        IDrule: 8,
        operation: 'rediger:alinéa',
        alinea: +where,
        content: content
      }
    }
  );

  def(
    /(Amendement irrecevable|Cet amendement a été déclaré irrecevable)/,
    function() {

      // TODO: parse the reason?
      return {
        IDrule: 9 ,
        operation: 'supprimer:amendement',
        irrecevable: true
      };
    }
  );
}

module.exports = new MyCustomGrammar();
