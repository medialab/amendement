var rules = require('./rules.js')

var amendements = require('./renseignement.out.json').amendements;

amendements.forEach(function(row, i){
	console.log(rules.parse(row.amendement.texte))
})

