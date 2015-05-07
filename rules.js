var Grammar = require('./grammar.js')

function MyCustomGrammar() {

  // Extending the Grammar
  Grammar.call(this);
  var def = this.def.bind(this);

  def(
    /l'alinéa (\d+), substituer aux mots :.*?« ([^»]*) ».*?les mots :.*?« ([^»]*) »/,
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
