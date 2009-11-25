/* See license.txt for terms of usage */
var Fireformat = FBL.ns(function() {
  /**
   * Takes a collection of objects and concatenates, wrapping when the
   * length of each line exceeds the wrapSize preference.
   * 
   * @param {PrefCache} prefCache Preference lookup cache
   * @param {Array of strings} tokens Tokens to concatenate
   * @param {String} join Token to insert between each token (excluding wrapped joins)
   * @param {int} tokensPerLine Optional parameter that specifies the maximum number of tokens
   *            on a single line. Undefined or less than one prevents wrapping on this condition.
   * @param {int} indentLevel Optional parameter that specifies the indent for each line after the first.
   *            This uses the indent settings defined on prefCache. Defaults to zero.
   * @param {int} offset Optional parameter that specifies the global indent
   *            that will be applied to this final output. Defaults to 0
   */
  this.wrapTokens = function(prefCache, tokens, join, tokensPerLine, indentLevel, offset) {
    var wrapSize = prefCache.getPref("wrapSize")-(offset||0),
        indent = new Array(prefCache.getPref("indentCount")+1).join(prefCache.getPref("indentChar")),
        totalIndent = new Array((indentLevel||0)+1).join(indent),

        tokenLen = tokens.length,
        joinLen = join.length,
        curTokens = [],
        curLen = 0, curToken = 0,
        lines = [];
    for (var i = 0; i < tokenLen; i++) {
      var token = tokens[i];
      curTokens.push(token);
      curLen += token.length + joinLen;
      curToken++;

      if (curLen >= wrapSize || (tokensPerLine > 0 && curToken >= tokensPerLine)) {
        lines.push(curTokens.join(""));
        curTokens = [totalIndent];
        curLen = totalIndent.length;  curToken = 0;
      } else if (i+1 < tokenLen){
        curTokens.push(join);
      }
    }
    if (curTokens.length > 1 || curTokens.length == tokenLen) {
      lines.push(curTokens.join(""));
    }
    return lines.join("\n");
  };

  /**
   * TODO : Proper JS Docs
   */
  this.PrefCache = function(prefDomain) {
    this.prefDomain = prefDomain;
    this.cache = {};
  };
  this.PrefCache.prototype = {
      getPref: function(name) {
        if (this.cache.hasOwnProperty(name)) {
          return this.cache[name];
        }
        
        var ret = Firebug.getPref(this.prefDomain, name);
        if (!(name in this.cache)) {
          this.cache[name] = ret;
        }
        return ret;
      }
  };
});