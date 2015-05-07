var rules = require('./rules.js')

var amendements = require('./data/renseignement.json').amendements;

// Temporary
function preprocess(txt) {
  return txt.replace(/\s/g, ' ');
}

amendements.forEach(function(row, i){

  var result = rules.parse(preprocess(row.amendement.texte));

  // Adding original amendement for reference and debugging
  if (result)
    result.amendement = row.amendement.texte;

  console.log(result);
})

