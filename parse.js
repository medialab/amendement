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
    _ = require('lodash');

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

  console.log(output);
});

function prettyass(number) {
  return _.chunk(("" + number).split("").reverse(), 3).map(function(s){
    return s.reverse().join('');
  }).reverse().join(' ');
}

bylaw[undefined] = recevables.length;

// Outputting report
console.log(chalk.blue('Report : ') + prettyass(matches) + ' / ' + prettyass(recevables.length) + ' amendements.\n');

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