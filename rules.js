var Grammar = require('./grammar.js')

function MyCustomGrammar() {

  // Extending the Grammar
  Grammar.call(this);
  var def = this.def.bind(this);

  def(
    /l'alinéa (\d+), substituer aux? mots? :.*?« ([^»]*) ».*?les? mots? :.*?« ([^»]*) »/,
    function(where, target, replacement) {
      return {
        operation: 'substituer',
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
        operation: 'creer',
        alinea: +where,
        content: newAlinea
      };
    }
  );

  def(
    /l'alinéa (\d+), supprimer les? mots? :.*?« ([^»]*) »/,
    function(where, target) {
      return {
        operation: 'supprimer',
        alinea: +where,
        target: target
      };
    }
  );

  def(
    /Supprimer l'alinéa (\d+)/,
    function(where) {
      return {
        operation: 'supprimer',
        alinea: +where
      };
    }
  );

  def(
    /.*(compléter).*alinéa (\d+).*«([^»]*)»/i,
    function(operation, where, content) {
      return {
        operation : 'completer',
        alinea: +where,
        content: content.trim()
      }
    }
  );
}

module.exports = new MyCustomGrammar();
