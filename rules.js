var Grammar = require('./grammar.js')

function MyCustomGrammar() {

  // Extending the Grammar
  Grammar.call(this);
  var def = this.def.bind(this)

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
