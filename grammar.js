function Grammar() {
 
  // Storing the rules
  this.rules = [];
 
  // Defining a rule
  this.def = function(regex, fn) {
    if (!(regex instanceof RegExp) && Array.isArray(regex))
      regex = new RegExp(regex.join(''), 'i');

    if (!(regex instanceof RegExp))
      throw Error('T\'as merdé Johnny!');

    this.rules.push({regex: regex, fn: fn});
    return this;
  };
 
  // Applying the rules to the given string
  this.parse = function(string) {
    var rule,
        i,
        l;
 
    for (i = 0, l = this.rules.length; i < l; i++) {
      rule = this.rules[i];
 
      var matches = string.match(rule.regex);
 
      if (matches)
        return rule.fn.apply(this, matches.slice(1));
    }
 
    return null;
  };
}

module.exports = Grammar;