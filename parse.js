var chalk = require('chalk'),
    util = require('util'),
    rules = require('./rules.js'),
    _ = require('lodash');

var amendements = require('./data/renseignement.json').amendements;

// Temporary
function preprocess(txt) {
  return txt.replace(/\s/g, ' ').replace(/(<p>|<\/p>)/g, '');
}

var matches = 0;

var amendements_recevables = amendements.filter(function(row){
  return !(row.amendement.sort !== "Irrecevable" &&
         row.amendement.sujet.match(/^article additionnel/i));
});
amendements_recevables.forEach(function(row, i){
  var amendement = preprocess(row.amendement.texte);

  var result = rules.parse(preprocess(amendement));

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

  console.log(output);
});

// Outputting report
console.log(chalk.blue('Report: ') + matches + '/' + amendements_recevables.length + ' amendements.\n');
