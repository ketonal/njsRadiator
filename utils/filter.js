var lexer=require('lex')
var lodash=require('lodash')
var util=require('util')

var lex = new lexer();
lex.addRule(/[+]/, function(l) {
    lex.logicChanged = true;
    lex.currentLogic='AND';
});
lex.addRule(/[-]/, function(l) {
    lex.logicChanged = true;
    lex.currentLogic='NOT';
});
lex.addRule(/./, function(c) {
    //sanitize for old use without and/or
    if(!lex.currentLogic) {
        lex.logicChanged = true;
        lex.currentLogic = 'AND';
    }
    var lArray = lex.filter[lex.currentLogic];
    if(!lArray) {
        lex.filter[lex.currentLogic] = [];
        lArray = lex.filter[lex.currentLogic];
    }
    if(lex.logicChanged) {
        lArray[lArray.length] = '';
        lex.logicChanged = false;
    }
    lArray[lArray.length - 1] = lArray[lArray.length - 1] + c;
});

function parseFilter(filterString) {
    lex.filter = {};
    lex.currentLogic = undefined;
    lex.setInput(filterString);
    lex.lex();
    return lex.filter;
}

function matches(str, filter) {
    var gotThisAND = lodash.filter(filter.AND, function(n){return str.indexOf(n) > -1;});
    var gotThisNOT = lodash.filter(filter.NOT, function(n){return str.indexOf(n) > -1;});
    if(filter.AND && filter.NOT) {
        return gotThisAND.length > 0 && gotThisNOT.length === 0;
    } else if(filter.AND) {
        return gotThisAND.length > 0;
    } else if(filter.NOT) {
        return gotThisNOT.length === 0;
    }
}

module.exports = {
  parse: parseFilter,
  matches: matches
}

