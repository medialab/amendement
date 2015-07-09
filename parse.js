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
    output = chalk.red('No match for:') + ' ' + amendement.texte; //_.trunc(amendement.texte, 100);
  }
  else {
    matches++;
    output = chalk.green('Match for:') + ' ' + amendement.texte; //_.trunc(amendement.texte, 100);
    output += '\n' + util.inspect(result);
  }
  output += '\n';

  //Trying to apply rulez
  if ((result) && (result.name == "Supprimer")) {
    var alinea = leadingzeros(result.alinea).toString();
    if (texte_original[alinea] != undefined) {
      if (result.target.match(/L. [0-9]+/)) {
        result.target = result.target.replace(/‑/g,'-');
      }
      if (result.target) {  
        if (result.phrase) {
          // Need to split phrases
        }
        texte_original[alinea] = texte_original[alinea].replace(result.target, '').replace(/(\s)+/g, '$1');
      }
      else {
        delete texte_original[alinea];      
      } 
    } 
  } 

  if ((result) && (result.name == "Substituer")) {
    var alinea = leadingzeros(result.alinea).toString();
    if (texte_original[alinea] != undefined) {
      if (result.target.match(/L. [0-9]+/)) {
        result.target = result.target.replace(/‑/g,'-');
      }
      texte_original[alinea] = texte_original[alinea].replace(result.target, result.replacement);
    }
  }

  if ((result) && (result.name == "Complete")) {
    var alinea = leadingzeros(result.alinea).toString();
    if (texte_original[alinea] != undefined) {
      character = result.content.substring(0,1);
      if (character == character.toUpperCase()) {
        texte_original[alinea] += " " + result.content;
      }
      if (character == character.toLowerCase()){
        texte_original[alinea] = texte_original[alinea].substring(0, (texte_original[alinea].length - 1)) + " " + result.content;
      }  

    }   
  }

  // if (output.match(/no match for/i)) {
  //   console.log(output);    
  // }
  console.log(output);
});

fs.writeFileSync('law_output.json', JSON.stringify(texte_original, null, 2));

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