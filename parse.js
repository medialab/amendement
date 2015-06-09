/**
 * Amendements Parsing
 * ====================
 *
 */
var chalk = require('chalk'),
    util = require('util'),
    requireDir = require('require-dir'),
    rules = require('./rules.js'),
    process = require('./process.js'),
    _ = require('lodash'),
    fs = require('fs');

var texte_original = require('./data/textA001.json').alineas;
var amendements = require('./data/renseignement.json').amendements;
// var scaling = requireDir('./data/amdmts/');
// amendements = _(scaling).values().map('amendements').flatten().value().concat(amendements);

var matches = 0,
    results = [],
    recevables = process(amendements),
    bylaw = {};

recevables.forEach(function(amendement, i){
  var result = rules.parse(amendement.texte);

  bylaw[amendement.texteloi_id] = bylaw[amendement.texteloi_id] || 0;
  bylaw[amendement.texteloi_id] += 1;

  if (result) {
    result.texteloi_id = amendement.texteloi_id;
  }

  results.push(result);

  // Formatting output
  var output = '';

  if (!result) {
    output = chalk.red('No match for:') + ' ' + _.trunc(amendement.texte, 100);
  }
  else {
    matches++;
    output = chalk.green('Match for:') + ' ' + _.trunc(amendement.texte, 100);
    output += '\n' + util.inspect(result);
  }
  output += '\n';

  // Trying to do things
  if ((result) && (result.name == "Supprimer")) {
    console.log(output);
    alinea = leadingzeros(result.alinea);
    if (result.target) {
      texte_original[alinea] = texte_original[alinea].replace(result.target, '').replace(/(\s)+/g, '$1');
    }
    else {
      delete texte_original[alinea];      
    }
  }
});
fs.writeFileSync('diffff.json', JSON.stringify(texte_original, null, 2));

function leadingzeros(number) {
  return _.padLeft(number, 3, '0'); 
}

function prettynumber(number) {
  return _.chunk(("" + number).split("").reverse(), 3).map(function(s){
    return s.reverse().join('');
  }).reverse().join(' ');
}

bylaw[undefined] = recevables.length;

// Outputting report
console.log(chalk.blue('Report : ') + prettynumber(matches) + ' / ' + prettynumber(recevables.length) + ' amendements.\n');

_(results)
  .groupBy('name')
  .forIn(function(value, key) {
    console.log(chalk.magenta('Rule n°' + key), '-', value.length);
  })
  .value();

console.log('\n');

_(results)
  .groupBy('texteloi_id')
  .forIn(function(value, key) {
    console.log(chalk.magenta('Loi n°' + key), '-', value.length, '/', bylaw[key]);
  })
  .value();