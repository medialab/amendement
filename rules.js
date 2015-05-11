var Grammar = require('./grammar.js')

function MyCustomGrammar() {

  // Extending the Grammar
  Grammar.call(this);
  var def = this.def.bind(this);

  def(
    /Compléter (?:cet |l')amendement par la phrase suivante :.*?« ([^»]*) »/,
    function(content) {
      return {
        IDrule: 1,
        operation: 'ajouter:mots',
        content: content
      };
    }
  );

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
    /(?:(?:(?:À |A )(la fin de )?|(Au début de )?)(?:la (première|seconde|deuxième|troisième) phrase de )?l'alinéa (\d+), )?(?:après (?:la (première|dernière) occurrence de )?(?:les? mots?|l(?:a|es?) références?) :.*?« ([^»]*) », )?insérer (les? mots?|(?:la|les?) références?) :.*?« ([^»]*) »/i,
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

      if (occurrence == 'première')
        type.occurrence = "première occurrence"
      else if (occurrence == 'dernière')
        type.occurrence == "dernière occurrence"

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
        IDrule: 5,
        operation: 'creer:alinea',
        alinea: +where,
        content: newAlinea
      };
    }
  );

  def(
    /(?:(?:À (la fin de )?|(Au début de )?)(?:la (première|seconde|deuxième|troisième) phrase de )?l'alinéa (\d+), )?supprimer les? mots? :.*?« ([^»]*) »/i,
    function(precision, useless, phrase, where, target) {
      var alaphrase = {
        IDrule: 6,
        operation: 'supprimer:mots',
        alinea: +where,
      }

      if (phrase != undefined) {
        alaphrase.phrase = phrase
      };

      alaphrase.target = target;
      return alaphrase
    }
  );

  def(
    /(?:(?:À (la fin de )?|(Au début de )?)(?:la (première|seconde|deuxième|troisième) phrase de )?l'alinéa (\d+), )?insérer (les? mots?|la phrase suivante|(?:la|les) réferences?) :.*?« ([^»]*) »/,
    function(useless1, useless2, phrase, where, target) {
      return {
        IDrule: 4,
        operation: 'insérer:phrase',
        alinea: +where,
        phrase: phrase,
        target: target
      }

    }
  );

  def(
    /Supprimer les alinéas (\d+) (à|et) (\d+)/,
    function(from, operand, to) {
      var order = {
        IDrule: 7,
        operation: 'supprimer:alinea'
      };

      if (operand === 'à') {
        order.from = +from;
        order.to = +to;
      }
      else if (operand === 'et') {
        order.alineas = [+from, +to];
      }
      else {
        throw Error('supprimer:alinea rule - unknown operand "' + operand + '".');
      }

      return order;
    }
  );

  def(
    /Supprimer l'alinéa (\d+)/,
    function(where) {
      return {
        IDrule: 8,
        operation: 'supprimer:alinea',
        alinea: +where
      };
    }
  );

  def(
    /Supprimer la (première|seconde|deuxième|troisième|quatrième) phrase de l'alinéa (\d+)/,
    function(phrase, where) {
      return {
        IDrule: 13,
        operation: 'supprimer:phrase',
        phrase: phrase,
        alinea: +where
      };
    }
  );

  def(
    /.*(compléter).*alinéa (\d+).*«([^»]*)»/i,
    function(operation, where, content) {
      return {
        IDrule: 9,
        operation: 'ajouter:mots',
        alinea: +where,
        content: content.trim()
      }
    }
  );

  def(
    /Rédiger ainsi.*alinéa (\d+) :.*?« ([^»]*) »/i,
    function(where, content) {
      return {
        IDrule: 10,
        operation: 'rediger:alinéa',
        alinea: +where,
        content: content
      }
    }
  );

  // def(
  //   /(Au début|À la fin) de l'alinéa (\d+), insérer les? mots? :.*?« ([^»]*) »/,
  //   function(precision, where, content) {
  //     return {
  //       IDrule: 11,
  //       operation: 'insérer:mots',
  //       alinea: +where,
  //       precision: precision,
  //       content: content
  //     }
  //   }
  // );

  def(
    /(Amendement irrecevable|Cet amendement a été déclaré irrecevable)/,
    function() {

      // TODO: parse the reason?
      return {
        IDrule: 12,
        operation: 'supprimer:amendement',
        irrecevable: true
      };
    }
  );
}

module.exports = new MyCustomGrammar();
