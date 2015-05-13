var chalk = require('chalk'),
    util = require('util'),
    rules = require('./rules.js'),
    _ = require('lodash');
    requireDir = require('require-dir');

var amendements = require('./data/renseignement.json').amendements;

var scaling = requireDir('./data/amdmts/');
amendements = _(scaling).values().map('amendements').flatten().value().concat(amendements);

// Temporary
function preprocess(txt) {
  return txt.replace(/\s/g, ' ').replace(/<\/p><p>/g, ' ').replace(/(<p>|<\/p>)/g, '');
}

var matches = 0;

var amendements_recevables = amendements.filter(function(row){
  return !(row.amendement.sort === "Irrecevable" ||
         row.amendement.sujet.match(/^article additionnel/i)) &&
         row.amendement.source.match(/assemblee-nationale/);
});

var results = [];

amendements_recevables.forEach(function(row, i){
  var amendement = preprocess(row.amendement.texte);

  var result = rules.parse(amendement);
  results.push(result);
  // Formatting output
  var output = '';

  if (!result) {
    output = chalk.red('No match for:') + ' ' + amendement; //_.trunc(amendement, 100)
  }
  else {
    matches++;
    output = chalk.green('Match for:') + ' ' + amendement; //_.trunc(amendement, 100);
    output += '\n' + util.inspect(result);
  }

  output += '\n';

  if (output.match(/IDrule: 7/)) 
    console.log(output);
});

function prettyass(number) {
  return _.chunk(("" + number).split("").reverse(), 3).map(function(s){
    return s.reverse().join('');
  }).reverse().join(' ');
}

// Outputting report
console.log(chalk.blue('Report: ') + prettyass(matches) + ' / ' + prettyass(amendements_recevables.length) + ' amendements.\n');

_(results)
  .groupBy('IDrule')
  .forIn(function(value, key) {
    console.log(chalk.magenta('Rule n°' + key), '-', value.length);
  })
  .value();
