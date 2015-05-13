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

//var scaling = requireDir('./data/amdmts/');
//amendements = _(scaling).values().map('amendements').flatten().value().concat(amendements);

// Temporary
function preprocess(txt) {
  return txt.replace(/\s/g, ' ').replace(/<\/p><p>/g, ' ').replace(/(<p>|<\/p>)/g, '');
}

var matches = 0,
    results = [],
    recevables = process(amendements);

recevables.forEach(function(amendement, i){
  var result = rules.parse(amendement.texte);

  results.push(result);
  // Formatting output
  var output = '';

  if (!result) {
    output = chalk.red('No match for:') + ' ' + amendement.texte; //_.trunc(amendement.texte, 100)
  }
  else {
    matches++;
    output = chalk.green('Match for:') + ' ' + amendement.texte; //_.trunc(amendement.texte, 100);
    output += '\n' + util.inspect(result);
  }

  output += '\n';

  if (output.match(/name: 'Complete'/))
    console.log(output);
});

function prettyass(number) {
  return _.chunk(("" + number).split("").reverse(), 3).map(function(s){
    return s.reverse().join('');
  }).reverse().join(' ');
}

// Outputting report
console.log(chalk.blue('Report: ') + prettyass(matches) + ' / ' + prettyass(recevables.length) + ' amendements.\n');

_(results)
  .groupBy('name')
  .forIn(function(value, key) {
    console.log(chalk.magenta('Rule n°' + key), '-', value.length);
  })
  .value();
