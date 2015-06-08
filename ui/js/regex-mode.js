import CodeMirror from 'codemirror';

CodeMirror.defineMode("regex", function() {
  var otherChar = /^[\^\$\.\+\?\*]/;
  var g= 0;
  var comments = {};

  var tokenBase = function(stream) {
    var ch = stream.next();

    if (ch == "\\" && stream.match(/./, false)) {
      if (stream.match(/u\w{4}/)) return "keyword";
      if (stream.match(/u/)) return "err";

      if (stream.match(/x\w{2}/)) return "keyword";
      if (stream.match(/x/)) return "err";

      if (stream.match(/./)) return "keyword";

      return "keyword";
    }


    if (ch == "{"){
      if (stream.match(/(\d|\d,\d?)\}/))  return "keyword";
    }

    if (ch == "[" && stream.match(/[^\]]+\]/)){
      return "variable-2";
    }

    if (ch == "|") {
      return "g" + g;
    }

    if (ch == "(" && stream.match(/\?:/)) {
      g++;
      comments[g] = true;
      return "comment";
    }

    if (ch == "(") {
      return "g" + (++g % 5);
    }

    if (ch == ")") {
      if(g-1 < 0) return "err";
      if (comments[g])
        return "comment";
      return "g" + (g-- % 5);
    }

    if (otherChar.test(ch)) {
      return "keyword";
    }
  };

  return {
    startState: function(base) {
      g= 0;
      comments = {};
    },
    token: tokenBase
  };
});

CodeMirror.defineMIME("text/x-regex", "regex");
