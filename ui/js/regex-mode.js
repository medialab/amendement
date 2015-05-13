import CodeMirror from 'codemirror';

CodeMirror.defineMode("regex", function() {
  var otherChar = /^[\^\$\.\+\?\*]/;
  var g= 0;

  var tokenBase = function(stream) {
    var ch = stream.next();

    if (ch == "\\" && stream.match(/./, false)) {
      if (stream.match(/u\w{4}/)) return "def";
      if (stream.match(/u/)) return "err";

      if (stream.match(/x\w{2}/)) return "def";
      if (stream.match(/x/)) return "err";

      if (stream.match(/./)) return "def";

      return "def";
    }


    if (ch == "{"){
      if (stream.match(/(\d|\d,\d?)\}/))  return "def";
    }

    if (ch == "[" && stream.match(/[^\]]+\]/)){
      return "variable-2";
    }

    if (ch == "|") {
      return "g" + g;
    }

    if (ch == "(") {
      stream.match(/[\?\!\:]+/);
      return "g" + (++g % 5);
    }

    if (ch == ")") {
      if(g-1 < 0) return "err";
      return "g" + (g-- % 5);
    }

    if (otherChar.test(ch)) {
      return "def";
    }
  };

  return {
    startState: function(base) {
      g= 0;
    },
    token: tokenBase
  };
});

CodeMirror.defineMIME("text/x-regex", "regex");
