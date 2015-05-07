var Grammar = require('./grammar.js')

function MyCustomGrammar() {

  // Extending the Grammar
  Grammar.call(this);
  var def = this.def.bind(this);

  def(
    /Compléter (?:cet |l')amendement par la phrase suivante :.*?« ([^»]*) »/,
    function(content) {
      return {
        operation: 'ajouter:mots',
        content: content
      };
    }
  );

  def(
    /l'alinéa (\d+), substituer aux? mots? :.*?« ([^»]*) ».*?les? mots? :.*?« ([^»]*) »/,
    function(where, target, replacement) {
      return {
        operation: 'substituer:mots',
        alinea: +where,
        target: target,
        replacement: replacement
      };
    }
  );

  def(
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
    /l'alinéa (\d+), supprimer les? mots? :.*?« ([^»]*) »/,
    function(where, target) {
      return {
        operation: 'supprimer:mots',
        alinea: +where,
        target: target
      };
    }
  );

  def(
    /Supprimer les alinéas (\d+) (à|et) (\d+)/,
    function(from, operand, to) {
      var order = {
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
        operation: 'supprimer:alinea',
        alinea: +where
      };
    }
  );

  def(
    /.*(compléter).*alinéa (\d+).*«([^»]*)»/i,
    function(operation, where, content) {
      return {
        operation: 'ajouter:mots',
        alinea: +where,
        content: content.trim()
      }
    }
  );

  def(
    /(Amendement irrecevable|Cet amendement a été déclaré irrecevable)/,
    function() {

      // TODO: parse the reason?
      return {
        operation: 'supprimer:amendement',
        irrecevable: true
      };
    }
  );
}

module.exports = new MyCustomGrammar();
