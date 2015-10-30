var lexicalTypes    = require('../../transpiler/lexer/lexicalTypes');
var lexerFunctions  = require('../../transpiler/lexer/lexerFunctions');
var lexer           = require('../../transpiler/lexer/lexer');
var expect          = require('chai').expect;


describe('Lexer', function() {
  describe('First milestone', function() {

    describe('Basic tests', function () {
      it('should handle variable declarations with numbers', function () {
        input = String.raw`var a = 3`;
        output = [
          { type: "DECLARATION_KEYWORD",  value: "var" },
          { type: "IDENTIFIER",           value: "a" },
          { type: "OPERATOR",             value: "=" },
          { type: "NUMBER",               value: "3" },
          { type: "TERMINATOR",           value: "EOF"}
        ];
        expect(lexer(input)).to.deep.equal(output);
      });

      it('should handle variable reassignment', function () {
        input = String.raw`var a = 1; a = 2`;
        output = [
          { type: "DECLARATION_KEYWORD",  value: "var" },
          { type: "IDENTIFIER",           value: "a" },
          { type: "OPERATOR",             value: "=" },
          { type: "NUMBER",               value: "1" },
          { type: "PUNCTUATION",          value: ";"},
          { type: "IDENTIFIER",           value: "a" },
          { type: "OPERATOR",             value: "=" },
          { type: "NUMBER",               value: "2" },
          { type: "TERMINATOR",           value: "EOF"}
        ];
        expect(lexer(input)).to.deep.equal(output);
      });

      it('should handle variable names with underscores', function () {
        input = String.raw`var my_var = 5`;
        output = [
          { type: "DECLARATION_KEYWORD",  value: "var" },
          { type: "IDENTIFIER",           value: "my_var" },
          { type: "OPERATOR",             value: "=" },
          { type: "NUMBER",               value: "5" },
          { type: "TERMINATOR",           value: "EOF"}
        ];
        expect(lexer(input)).to.deep.equal(output);
      });

      it('should handle lines that end with a semicolon', function () {
        input = String.raw`var myVar = 5;`;
        output = [
          { type: "DECLARATION_KEYWORD",  value: "var" },
          { type: "IDENTIFIER",           value: "myVar" },
          { type: "OPERATOR",             value: "=" },
          { type: "NUMBER",               value: "5" },
          { type: "PUNCTUATION",          value: ";" },
          { type: "TERMINATOR",           value: "EOF"}
        ];
        expect(lexer(input)).to.deep.equal(output);
      });

      it('should handle variable declarations with erratic spacing', function () {
        input = String.raw`var myVar                   =                       5          ;`;
        output = [
          { type: "DECLARATION_KEYWORD",  value: "var" },
          { type: "IDENTIFIER",           value: "myVar" },
          { type: "OPERATOR",             value: "=" },
          { type: "NUMBER",               value: "5" },
          { type: "PUNCTUATION",          value: ";" },
          { type: "TERMINATOR",           value: "EOF"}
        ];
        expect(lexer(input)).to.deep.equal(output);
      });

      it('should handle strings', function () {
        input = String.raw`var b = "hello"`;
        output = [
          { type: "DECLARATION_KEYWORD",  value: "var" },
          { type: "IDENTIFIER",           value: "b" },
          { type: "OPERATOR",             value: "=" },
          { type: "STRING",               value: "hello" },
          { type: "TERMINATOR",           value: "EOF"}
        ];
        expect(lexer(input)).to.deep.equal(output);
      });

      it('should handle booleans', function () {
        input = String.raw`var c = true`;
        output = [
          { type: "DECLARATION_KEYWORD",  value: "var" },
          { type: "IDENTIFIER",           value: "c" },
          { type: "OPERATOR",             value: "=" },
          { type: "BOOLEAN",              value: "true" },
          { type: "TERMINATOR",           value: "EOF"}
        ];
        expect(lexer(input)).to.deep.equal(output);
      });

      it('should handle strings with whitespace', function () {
        input = String.raw`var d = "Test this"`;
        output = [
          { type: "DECLARATION_KEYWORD",  value: "var" },
          { type: "IDENTIFIER",           value: "d" },
          { type: "OPERATOR",             value: "=" },
          { type: "STRING",               value: "Test this" },
          { type: "TERMINATOR",           value: "EOF"}
        ];
        expect(lexer(input)).to.deep.equal(output);
      });

      it('should variables declared with type annotations', function () {
        input = String.raw`var name: String = "Joe"; var age: Int = 45;`;

        output = [
          { type: "DECLARATION_KEYWORD",  value: "var" },
          { type: "IDENTIFIER",           value: "name" },
          { type: "PUNCTUATION",          value: ":" },
          { type: "TYPE_STRING",          value: "String"},
          { type: "OPERATOR",             value: "=" },
          { type: "STRING",               value: "Joe" },
          { type: "PUNCTUATION",          value: ";" },
          { type: "DECLARATION_KEYWORD",  value: "var" },
          { type: "IDENTIFIER",           value: "age" },
          { type: "PUNCTUATION",          value: ":" },
          { type: "TYPE_NUMBER",          value: "Int"},
          { type: "OPERATOR",             value: "=" },
          { type: "NUMBER",               value: "45" },
          { type: "PUNCTUATION",          value: ";" },
          { type: "TERMINATOR",           value: "EOF" }
        ];
        expect(lexer(input)).to.deep.equal(output);
      });

      it('should variables declared with type annotations but no value', function () {
        input = String.raw`var name: String; var age: Int;`;
        output = [
          { type: "DECLARATION_KEYWORD",  value: "var" },
          { type: "IDENTIFIER",           value: "name" },
          { type: "PUNCTUATION",          value: ":" },
          { type: "TYPE_STRING",          value: "String"},
          { type: "PUNCTUATION",          value: ";" },
          { type: "DECLARATION_KEYWORD",  value: "var" },
          { type: "IDENTIFIER",           value: "age" },
          { type: "PUNCTUATION",          value: ":" },
          { type: "TYPE_NUMBER",          value: "Int"},
          { type: "PUNCTUATION",          value: ";" },
          { type: "TERMINATOR",           value: "EOF" }
        ];
        expect(lexer(input)).to.deep.equal(output);
      });

      it('should handle multiple related variables of the same type on a single line, separated by commas', function () {
        input = String.raw`var firstBase, secondBase, thirdBase: String`;

        output = [
          { type: "DECLARATION_KEYWORD",  value: "var" },
          { type: "IDENTIFIER",           value: "firstBase" },
          { type: "PUNCTUATION",          value: "," },
          { type: "IDENTIFIER",           value: "secondBase" },
          { type: "PUNCTUATION",          value: "," },
          { type: "IDENTIFIER",           value: "thirdBase" },
          { type: "PUNCTUATION",          value: ":" },
          { type: "TYPE_STRING",          value: "String"},
          { type: "TERMINATOR",           value: "EOF" }
        ];
        expect(lexer(input)).to.deep.equal(output);
      });

      it('should handle comments', function () {
        input = String.raw`/* Comment 1 */ var a = 1 // Comment 2`;
        output = [
          { type: "MULTI_LINE_COMMENT_START",  value: "/*"},
          { type: "COMMENT",                   value: " Comment 1 "},
          { type: "MULTI_LINE_COMMENT_END",    value: "*/"},
          { type: "DECLARATION_KEYWORD",       value: "var" },
          { type: "IDENTIFIER",                value: "a" },
          { type: "OPERATOR",                  value: "=" },
          { type: "NUMBER",                    value: "1" },
          { type: "COMMENT_START",             value: "//"},
          { type: "COMMENT",                   value: " Comment 2"},
          { type: "TERMINATOR",                value: "EOF"}
        ];
        expect(lexer(input)).to.deep.equal(output);
      });
    });

    describe('Basic collections', function () {

      it('should handle empty arrays', function () {
        input = String.raw`var empty = []`;
        output = [
          { type: "DECLARATION_KEYWORD",        value: "var" },
          { type: "IDENTIFIER",                 value: "empty" },
          { type: "OPERATOR",                   value: "=" },
          { type: "ARRAY_START",                value: "["},
          { type: "ARRAY_END",                  value: "]"},
          { type: "TERMINATOR",                 value: "EOF" }
        ];
        expect(lexer(input)).to.deep.equal(output);
      });

      it('should handle empty dictionaries', function () {
        input = String.raw`var empty = [:]`;
        output = [
          { type: "DECLARATION_KEYWORD",        value: "var" },
          { type: "IDENTIFIER",                 value: "empty" },
          { type: "OPERATOR",                   value: "=" },
          { type: "DICTIONARY_START",           value: "["},
          { type: "PUNCTUATION",                value: ":"},
          { type: "DICTIONARY_END",             value: "]"},
          { type: "TERMINATOR",                 value: "EOF" }
        ];
        expect(lexer(input)).to.deep.equal(output);
      });

      it('should handle initializer syntax for arrays', function () {
        input = String.raw`var empty = [String]();`;
        output = [
          { type: "DECLARATION_KEYWORD",        value: "var" },
          { type: "IDENTIFIER",                 value: "empty" },
          { type: "OPERATOR",                   value: "=" },
          { type: "ARRAY_START",                value: "["},
          { type: "TYPE_STRING",                value: "String"},
          { type: "ARRAY_END",                  value: "]"},
          { type: "INVOCATION_START",           value: "(" },
          { type: "INVOCATION_END",             value: ")" },
          { type: "PUNCTUATION",                value: ";"},
          { type: "TERMINATOR",                 value: "EOF" }
        ];
        expect(lexer(input)).to.deep.equal(output);
      });

      it('should handle initializer syntax for dictionaries', function () {
        input = String.raw`var empty = [String:UInt16]();`;
        output = [
          { type: "DECLARATION_KEYWORD",        value: "var" },
          { type: "IDENTIFIER",                 value: "empty" },
          { type: "OPERATOR",                   value: "=" },
          { type: "DICTIONARY_START",           value: "["},
          { type: "TYPE_STRING",                value: "String"},
          { type: "PUNCTUATION",                value: ":"},
          { type: "TYPE_NUMBER",                value: "UInt16"},
          { type: "DICTIONARY_END",             value: "]"},
          { type: "INVOCATION_START",           value: "(" },
          { type: "INVOCATION_END",             value: ")" },
          { type: "PUNCTUATION",                value: ";"},
          { type: "TERMINATOR",                 value: "EOF" }
        ];
        expect(lexer(input)).to.deep.equal(output);
      });

      it('should handle arrays', function () {
        input = String.raw`var e = ["Eggs", "Milk", "Bacon"]`;
        output = [
          { type: "DECLARATION_KEYWORD",  value: "var" },
          { type: "IDENTIFIER",           value: "e" },
          { type: "OPERATOR",             value: "=" },
          { type: "ARRAY_START",          value: "[" },
          { type: "STRING",               value: "Eggs" },
          { type: "PUNCTUATION",          value: "," },
          { type: "STRING",               value: "Milk" },
          { type: "PUNCTUATION",          value: "," },
          { type: "STRING",               value: "Bacon" },
          { type: "ARRAY_END",            value: "]" },
          { type: "TERMINATOR",           value: "EOF" }
        ];
        expect(lexer(input)).to.deep.equal(output);
      });

      it('should handle arrays with erratic spacing', function () {
        input = String.raw`var e = [  "Eggs","Milk",           "Bacon"                ] ;`;
        output = [
          { type: "DECLARATION_KEYWORD",  value: "var" },
          { type: "IDENTIFIER",           value: "e" },
          { type: "OPERATOR",             value: "=" },
          { type: "ARRAY_START",          value: "[" },
          { type: "STRING",               value: "Eggs" },
          { type: "PUNCTUATION",          value: "," },
          { type: "STRING",               value: "Milk" },
          { type: "PUNCTUATION",          value: "," },
          { type: "STRING",               value: "Bacon" },
          { type: "ARRAY_END",            value: "]" },
          { type: "PUNCTUATION",          value: ";" },
          { type: "TERMINATOR",           value: "EOF" }
        ];
        expect(lexer(input)).to.deep.equal(output);
      });

      it('should handle appending items to an array with the addition assignment operator', function () {
        input = String.raw`var arr = [Int](); arr += [1,2,3];`;
        output = [
          { type: "DECLARATION_KEYWORD",        value: "var" },
          { type: "IDENTIFIER",                 value: "arr" },
          { type: "OPERATOR",                   value: "=" },
          { type: "ARRAY_START",                value: "["},
          { type: "TYPE_NUMBER",                value: "Int"},
          { type: "ARRAY_END",                  value: "]"},
          { type: "INVOCATION_START",           value: "(" },
          { type: "INVOCATION_END",             value: ")" },
          { type: "PUNCTUATION",                value: ";" },
          { type: "IDENTIFIER",                 value: "arr" },
          { type: "OPERATOR",                   value: "+" },
          { type: "OPERATOR",                   value: "=" },
          { type: "ARRAY_START",                value: "["},
          { type: "NUMBER",                     value: "1" },
          { type: "PUNCTUATION",                value: "," },
          { type: "NUMBER",                     value: "2" },
          { type: "PUNCTUATION",                value: "," },
          { type: "NUMBER",                     value: "3" },
          { type: "ARRAY_END",                  value: "]"},
          { type: "PUNCTUATION",                value: ";" },
          { type: "TERMINATOR",                 value: "EOF"},
        ];
        expect(lexer(input)).to.deep.equal(output);
      });

      it('should handle dictionaries', function () {
        input = String.raw`var f = ["one": 1, "two": 2, "three": 3]`;
        output = [
          { type: "DECLARATION_KEYWORD",  value: "var" },
          { type: "IDENTIFIER",           value: "f" },
          { type: "OPERATOR",             value: "=" },
          { type: "DICTIONARY_START",     value: "[" },
          { type: "STRING",               value: "one" },
          { type: "PUNCTUATION",          value: ":" },
          { type: "NUMBER",               value: "1" },
          { type: "PUNCTUATION",          value: "," },
          { type: "STRING",               value: "two" },
          { type: "PUNCTUATION",          value: ":" },
          { type: "NUMBER",               value: "2" },
          { type: "PUNCTUATION",          value: "," },
          { type: "STRING",               value: "three" },
          { type: "PUNCTUATION",          value: ":" },
          { type: "NUMBER",               value: "3" },
          { type: "DICTIONARY_END",       value: "]" },
          { type: "TERMINATOR",           value: "EOF" }
        ];
        expect(lexer(input)).to.deep.equal(output);
      });

      it('should handle tuples', function () {
        input = String.raw`var error = (404, "not found")`;
        output = [
          { type: "DECLARATION_KEYWORD",        value: "var" },
          { type: "IDENTIFIER",                 value: "error" },
          { type: "OPERATOR",                   value: "=" },
          { type: "TUPLE_START",                value: "("},
          { type: "NUMBER",                     value: "404"},
          { type: "PUNCTUATION",                value: "," },
          { type: "STRING",                     value: "not found"},
          { type: "TUPLE_END",                  value: ")"},
          { type: "TERMINATOR",                 value: "EOF" }
        ];
        expect(lexer(input)).to.deep.equal(output);
      });

      it('should handle tuples with element names', function () {
        input = String.raw`let http200Status = (statusCode: 200, description: "OK");`;
        output = [
          { type: "DECLARATION_KEYWORD",        value: "let" },
          { type: "IDENTIFIER",                 value: "http200Status" },
          { type: "OPERATOR",                   value: "=" },
          { type: "TUPLE_START",                value: "("},
          { type: "TUPLE_ELEMENT_NAME",         value: "statusCode"},
          { type: "PUNCTUATION",                value: ":" },
          { type: "NUMBER",                     value: "200"},
          { type: "PUNCTUATION",                value: "," },
          { type: "TUPLE_ELEMENT_NAME",         value: "description"},
          { type: "PUNCTUATION",                value: ":" },
          { type: "STRING",                     value: "OK"},
          { type: "TUPLE_END",                  value: ")"},
          { type: "PUNCTUATION",                value: ";" },
          { type: "TERMINATOR",                 value: "EOF" }
        ];
        expect(lexer(input)).to.deep.equal(output);
      });

      it('should handle empty tuples', function () {
        input = String.raw`var empty = ()`;
        output = [
          { type: "DECLARATION_KEYWORD",        value: "var" },
          { type: "IDENTIFIER",                 value: "empty" },
          { type: "OPERATOR",                   value: "=" },
          { type: "TUPLE_START",                value: "("},
          { type: "TUPLE_END",                  value: ")"},
          { type: "TERMINATOR",                 value: "EOF" }
        ];
        expect(lexer(input)).to.deep.equal(output);
      });

      it('should handle tuples with mixed index numbers and element names, and value lookups using both', function () {
        input = String.raw`var tup = ("one", two: 2); var one = tup.0; var two = tup.1; var twoRedux = tup.two;`;
        output = [
          { type: "DECLARATION_KEYWORD",            value: "var" },
          { type: "IDENTIFIER",                     value: "tup" },
          { type: "OPERATOR",                       value: "=" },
          { type: "TUPLE_START",                    value: "("},
          { type: "STRING",                         value: "one"},
          { type: "PUNCTUATION",                    value: "," },
          { type: "TUPLE_ELEMENT_NAME",             value: "two"},
          { type: "PUNCTUATION",                    value: ":" },
          { type: "NUMBER",                         value: "2"},
          { type: "TUPLE_END",                      value: ")"},
          { type: "PUNCTUATION",                    value: ";" },

          { type: "DECLARATION_KEYWORD",            value: "var" },
          { type: "IDENTIFIER",                     value: "one" },
          { type: "OPERATOR",                       value: "=" },
          { type: "IDENTIFIER",                     value: "tup" },
          { type: "DOT_SYNTAX",                     value: "." },
          { type: "NUMBER",                         value: "0"},
          { type: "PUNCTUATION",                    value: ";" },

          { type: "DECLARATION_KEYWORD",            value: "var" },
          { type: "IDENTIFIER",                     value: "two" },
          { type: "OPERATOR",                       value: "=" },
          { type: "IDENTIFIER",                     value: "tup" },
          { type: "DOT_SYNTAX",                     value: "." },
          { type: "NUMBER",                         value: "1"},
          { type: "PUNCTUATION",                    value: ";" },

          { type: "DECLARATION_KEYWORD",            value: "var" },
          { type: "IDENTIFIER",                     value: "twoRedux" },
          { type: "OPERATOR",                       value: "=" },
          { type: "IDENTIFIER",                     value: "tup" },
          { type: "DOT_SYNTAX",                     value: "." },
          { type: "TUPLE_ELEMENT_NAME",             value: "two"},
          { type: "PUNCTUATION",                    value: ";" },
          { type: "TERMINATOR",                     value: "EOF" }
        ];
        expect(lexer(input)).to.deep.equal(output);
      });

      it('should handle erratic spacing', function () {
        input = String.raw`let g = [1 : "one",2   :"two", 3: "three"]`;
        output = [
          { type: "DECLARATION_KEYWORD",  value: "let" },
          { type: "IDENTIFIER",           value: "g" },
          { type: "OPERATOR",             value: "=" },
          { type: "DICTIONARY_START",     value: "[" },
          { type: "NUMBER",               value: "1" },
          { type: "PUNCTUATION",          value: ":" },
          { type: "STRING",               value: "one" },
          { type: "PUNCTUATION",          value: "," },
          { type: "NUMBER",               value: "2" },
          { type: "PUNCTUATION",          value: ":" },
          { type: "STRING",               value: "two" },
          { type: "PUNCTUATION",          value: "," },
          { type: "NUMBER",               value: "3" },
          { type: "PUNCTUATION",          value: ":" },
          { type: "STRING",               value: "three" },
          { type: "DICTIONARY_END",       value: "]" },
          { type: "TERMINATOR",           value: "EOF" }
        ];
        expect(lexer(input)).to.deep.equal(output);
      });

      it('should handle subscript lookups on arrays', function () {
        input = String.raw`var d = [1, 2]; var one = d[0];`;
        output = [
          { type: "DECLARATION_KEYWORD",        value: "var" },
          { type: "IDENTIFIER",                 value: "d" },
          { type: "OPERATOR",                   value: "=" },
          { type: "ARRAY_START",                value: "[" },
          { type: "NUMBER",                     value: "1" },
          { type: "PUNCTUATION",                value: "," },
          { type: "NUMBER",                     value: "2" },
          { type: "ARRAY_END",                  value: "]" },
          { type: "PUNCTUATION",                value: ";" },
          { type: "DECLARATION_KEYWORD",        value: "var" },
          { type: "IDENTIFIER",                 value: "one" },
          { type: "OPERATOR",                   value: "=" },
          { type: "IDENTIFIER",                 value: "d" },
          { type: "SUBSTRING_LOOKUP_START",     value: "[" },
          { type: "NUMBER",                     value: "0" },
          { type: "SUBSTRING_LOOKUP_END",       value: "]" },
          { type: "PUNCTUATION",                value: ";" },
          { type: "TERMINATOR",                 value: "EOF"}
        ];
        expect(lexer(input)).to.deep.equal(output);
      });

      it('should handle subscript lookups on dictionaries', function () {
        input = String.raw`var d = ["one": 1, "two": 2]; var one = d["one"];`;

        output = [
          { type: "DECLARATION_KEYWORD",        value: "var" },
          { type: "IDENTIFIER",                 value: "d" },
          { type: "OPERATOR",                   value: "=" },
          { type: "DICTIONARY_START",           value: "[" },
          { type: "STRING",                     value: "one" },
          { type: "PUNCTUATION",                value: ":" },
          { type: "NUMBER",                     value: "1" },
          { type: "PUNCTUATION",                value: "," },
          { type: "STRING",                     value: "two" },
          { type: "PUNCTUATION",                value: ":" },
          { type: "NUMBER",                     value: "2" },
          { type: "DICTIONARY_END",             value: "]" },
          { type: "PUNCTUATION",                value: ";" },
          { type: "DECLARATION_KEYWORD",        value: "var" },
          { type: "IDENTIFIER",                 value: "one" },
          { type: "OPERATOR",                   value: "=" },
          { type: "IDENTIFIER",                 value: "d" },
          { type: "SUBSTRING_LOOKUP_START",     value: "[" },
          { type: "STRING",                     value: "one" },
          { type: "SUBSTRING_LOOKUP_END",       value: "]" },
          { type: "PUNCTUATION",                value: ";" },
          { type: "TERMINATOR",                 value: "EOF"}
        ];
        expect(lexer(input)).to.deep.equal(output);
      });

    });

    describe('Numbers and operations', function () {
      it('should handle floating point numbers', function () {
        input = String.raw`let h = 3.14`;
        output = [
          { type: "DECLARATION_KEYWORD",  value: "let" },
          { type: "IDENTIFIER",           value: "h" },
          { type: "OPERATOR",             value: "=" },
          { type: "NUMBER",               value: "3.14" },
          { type: "TERMINATOR",           value: "EOF" }
        ];
        expect(lexer(input)).to.deep.equal(output);
      });

      it('should handle numeric literals written with underscores', function () {
        input = String.raw`let justOverOneMillion = 1_000_000.000_000_1`;

        output = [
          { type: "DECLARATION_KEYWORD",        value: "let" },
          { type: "IDENTIFIER",                 value: "justOverOneMillion" },
          { type: "OPERATOR",                   value: "=" },
          { type: "NUMBER",                     value: "1000000.0000001" },
          { type: "TERMINATOR",                 value: "EOF" }
        ];
        expect(lexer(input)).to.deep.equal(output);
      });

      it('should handle unspaced operators', function () {
        input = String.raw`let i = 5+6`;
        output = [
          { type: "DECLARATION_KEYWORD",  value: "let" },
          { type: "IDENTIFIER",           value: "i" },
          { type: "OPERATOR",             value: "=" },
          { type: "NUMBER",               value: "5" },
          { type: "OPERATOR",             value: "+" },
          { type: "NUMBER",               value: "6" },
          { type: "TERMINATOR",           value: "EOF" }
        ];
        expect(lexer(input)).to.deep.equal(output);
      });

      it('should handle order of operations', function () {
        input = String.raw`var j = 5 + 6 / 4 - (-16 % 4.2) * 55`;
        output = [
          { type: "DECLARATION_KEYWORD",  value: "var" },
          { type: "IDENTIFIER",           value: "j" },
          { type: "OPERATOR",             value: "=" },
          { type: "NUMBER",               value: "5" },
          { type: "OPERATOR",             value: "+" },
          { type: "NUMBER",               value: "6" },
          { type: "OPERATOR",             value: "/" },
          { type: "NUMBER",               value: "4" },
          { type: "OPERATOR",             value: "-" },
          { type: "PUNCTUATION",          value: "(" },
          { type: "OPERATOR",             value: "-" },
          { type: "NUMBER",               value: "16" },
          { type: "OPERATOR",             value: "%" },
          { type: "NUMBER",               value: "4.2" },
          { type: "PUNCTUATION",          value: ")" },
          { type: "OPERATOR",             value: "*" },
          { type: "NUMBER",               value: "55" },
          { type: "TERMINATOR",           value: "EOF" }
        ];
        expect(lexer(input)).to.deep.equal(output);
      });

      it('should handle comparisons', function () {
        input = String.raw`let l = 6 != 9`;
        output = [
          { type: "DECLARATION_KEYWORD",  value: "let" },
          { type: "IDENTIFIER",           value: "l" },
          { type: "OPERATOR",             value: "=" },
          { type: "NUMBER",               value: "6" },
          { type: "OPERATOR",             value: "!" },
          { type: "OPERATOR",             value: "=" },
          { type: "NUMBER",               value: "9" },
          { type: "TERMINATOR",           value: "EOF" }
        ];
        expect(lexer(input)).to.deep.equal(output);
      });

      it('should handle complex comparisons', function () {
        input = String.raw`var l = 6 != 7 || 6 == 7 || 6 > 7 || 6 < 7 || 6 >= 7 || 6 <= 7;`;
        output = [
          { type: "DECLARATION_KEYWORD",  value: "var" },
          { type: "IDENTIFIER",           value: "l" },
          { type: "OPERATOR",             value: "=" },
          { type: "NUMBER",               value: "6" },
          { type: "OPERATOR",             value: "!" },
          { type: "OPERATOR",             value: "=" },
          { type: "NUMBER",               value: "7" },
          { type: "OPERATOR",             value: "|" },
          { type: "OPERATOR",             value: "|" },
          { type: "NUMBER",               value: "6" },
          { type: "OPERATOR",             value: "=" },
          { type: "OPERATOR",             value: "=" },
          { type: "NUMBER",               value: "7" },
          { type: "OPERATOR",             value: "|" },
          { type: "OPERATOR",             value: "|" },
          { type: "NUMBER",               value: "6" },
          { type: "OPERATOR",             value: ">" },
          { type: "NUMBER",               value: "7" },
          { type: "OPERATOR",             value: "|" },
          { type: "OPERATOR",             value: "|" },
          { type: "NUMBER",               value: "6" },
          { type: "OPERATOR",             value: "<" },
          { type: "NUMBER",               value: "7" },
          { type: "OPERATOR",             value: "|" },
          { type: "OPERATOR",             value: "|" },
          { type: "NUMBER",               value: "6" },
          { type: "OPERATOR",             value: ">" },
          { type: "OPERATOR",             value: "=" },
          { type: "NUMBER",               value: "7" },
          { type: "OPERATOR",             value: "|" },
          { type: "OPERATOR",             value: "|" },
          { type: "NUMBER",               value: "6" },
          { type: "OPERATOR",             value: "<" },
          { type: "OPERATOR",             value: "=" },
          { type: "NUMBER",               value: "7" },
          { type: "PUNCTUATION",          value: ";" },
          { type: "TERMINATOR",           value: "EOF" }
        ];
        expect(lexer(input)).to.deep.equal(output);
      });

      it('should handle prefix operators', function () {
        input = String.raw`var a = 1; var m = ++a; var n = --m;`;
        output = [
          { type: "DECLARATION_KEYWORD",  value: "var" },
          { type: "IDENTIFIER",           value: "a" },
          { type: "OPERATOR",             value: "=" },
          { type: "NUMBER",               value: "1" },
          { type: "PUNCTUATION",          value: ";" },
          { type: "DECLARATION_KEYWORD",  value: "var" },
          { type: "IDENTIFIER",           value: "m" },
          { type: "OPERATOR",             value: "=" },
          { type: "OPERATOR",             value: "+" },
          { type: "OPERATOR",             value: "+" },
          { type: "IDENTIFIER",           value: "a" },
          { type: "PUNCTUATION",          value: ";" },
          { type: "DECLARATION_KEYWORD",  value: "var" },
          { type: "IDENTIFIER",           value: "n" },
          { type: "OPERATOR",             value: "=" },
          { type: "OPERATOR",             value: "-" },
          { type: "OPERATOR",             value: "-" },
          { type: "IDENTIFIER",           value: "m" },
          { type: "PUNCTUATION",          value: ";" },
          { type: "TERMINATOR",           value: "EOF" }
        ];
        expect(lexer(input)).to.deep.equal(output);
      });

      it('should handle postfix operators', function () {
        input = String.raw`var a = 1; var m = a++; var n = m--;`;
        output = [
          { type: "DECLARATION_KEYWORD",  value: "var" },
          { type: "IDENTIFIER",           value: "a" },
          { type: "OPERATOR",             value: "=" },
          { type: "NUMBER",               value: "1" },
          { type: "PUNCTUATION",          value: ";" },
          { type: "DECLARATION_KEYWORD",  value: "var" },
          { type: "IDENTIFIER",           value: "m" },
          { type: "OPERATOR",             value: "=" },
          { type: "IDENTIFIER",           value: "a" },
          { type: "OPERATOR",             value: "+" },
          { type: "OPERATOR",             value: "+" },
          { type: "PUNCTUATION",          value: ";" },
          { type: "DECLARATION_KEYWORD",  value: "var" },
          { type: "IDENTIFIER",           value: "n" },
          { type: "OPERATOR",             value: "=" },
          { type: "IDENTIFIER",           value: "m" },
          { type: "OPERATOR",             value: "-" },
          { type: "OPERATOR",             value: "-" },
          { type: "PUNCTUATION",          value: ";" },
          { type: "TERMINATOR",           value: "EOF" }
        ];
        expect(lexer(input)).to.deep.equal(output);
      });

      it('should handle unary operators', function () {
        input = String.raw`var a = true; var b = !a; var c = -a; var d = +b`;
        output = [
          { type: "DECLARATION_KEYWORD",        value: "var" },
          { type: "IDENTIFIER",                 value: "a" },
          { type: "OPERATOR",                   value: "=" },
          { type: "BOOLEAN",                    value: "true" },
          { type: "PUNCTUATION",                value: ";" },
          { type: "DECLARATION_KEYWORD",        value: "var" },
          { type: "IDENTIFIER",                 value: "b" },
          { type: "OPERATOR",                   value: "=" },
          { type: "OPERATOR",                   value: "!" },
          { type: "IDENTIFIER",                 value: "a" },
          { type: "PUNCTUATION",                value: ";" },
          { type: "DECLARATION_KEYWORD",        value: "var" },
          { type: "IDENTIFIER",                 value: "c" },
          { type: "OPERATOR",                   value: "=" },
          { type: "OPERATOR",                   value: "-" },
          { type: "IDENTIFIER",                 value: "a" },
          { type: "PUNCTUATION",                value: ";" },
          { type: "DECLARATION_KEYWORD",        value: "var" },
          { type: "IDENTIFIER",                 value: "d" },
          { type: "OPERATOR",                   value: "=" },
          { type: "OPERATOR",                   value: "+" },
          { type: "IDENTIFIER",                 value: "b" },
          { type: "TERMINATOR",                 value: "EOF"}
        ];
        expect(lexer(input)).to.deep.equal(output);
      });

      it('should handle compound assignment operators', function() {
        input = String.raw`var x = 5; x += 4; x -= 3; x *= 2; x /= 1; x %= 2;`;
        output = [
          { type: "DECLARATION_KEYWORD",  value: "var" },
          { type: "IDENTIFIER",           value: "x" },
          { type: "OPERATOR",             value: "=" },
          { type: "NUMBER",               value: "5" },
          { type: "PUNCTUATION",          value: ";" },
          { type: "IDENTIFIER",           value: "x" },
          { type: "OPERATOR",             value: "+" },
          { type: "OPERATOR",             value: "=" },
          { type: "NUMBER",               value: "4" },
          { type: "PUNCTUATION",          value: ";" },
          { type: "IDENTIFIER",           value: "x" },
          { type: "OPERATOR",             value: "-" },
          { type: "OPERATOR",             value: "=" },
          { type: "NUMBER",               value: "3" },
          { type: "PUNCTUATION",          value: ";" },
          { type: "IDENTIFIER",           value: "x" },
          { type: "OPERATOR",             value: "*" },
          { type: "OPERATOR",             value: "=" },
          { type: "NUMBER",               value: "2" },
          { type: "PUNCTUATION",          value: ";" },
          { type: "IDENTIFIER",           value: "x" },
          { type: "OPERATOR",             value: "/" },
          { type: "OPERATOR",             value: "=" },
          { type: "NUMBER",               value: "1" },
          { type: "PUNCTUATION",          value: ";" },
          { type: "IDENTIFIER",           value: "x" },
          { type: "OPERATOR",             value: "%" },
          { type: "OPERATOR",             value: "=" },
          { type: "NUMBER",               value: "2" },
          { type: "PUNCTUATION",          value: ";" },
          { type: "TERMINATOR",           value: "EOF" }
        ];
        expect(lexer(input)).to.deep.equal(output);
      });

      it('should handle logical operators', function() {
        input = String.raw`var a = !true && true || true`;
        output = [
          { type: "DECLARATION_KEYWORD",  value: "var" },
          { type: "IDENTIFIER",           value: "a" },
          { type: "OPERATOR",             value: "=" },
          { type: "OPERATOR",             value: "!" },
          { type: "BOOLEAN",              value: "true" },
          { type: "OPERATOR",             value: "&" },
          { type: "OPERATOR",             value: "&" },
          { type: "BOOLEAN",              value: "true" },
          { type: "OPERATOR",             value: "|" },
          { type: "OPERATOR",             value: "|" },
          { type: "BOOLEAN",              value: "true" },
          { type: "TERMINATOR",           value: "EOF" }
        ];
        expect(lexer(input)).to.deep.equal(output);
      });

      it('should handle ternary operators', function () {
        input = String.raw`var a = (6 == 7) ? 1 : -1`;
        output = [
          { type: "DECLARATION_KEYWORD",        value: "var" },
          { type: "IDENTIFIER",                 value: "a" },
          { type: "OPERATOR",                   value: "=" },
          { type: "PUNCTUATION",                value: "(" },
          { type: "NUMBER",                     value: "6" },
          { type: "OPERATOR",                   value: "=" },
          { type: "OPERATOR",                   value: "=" },
          { type: "NUMBER",                     value: "7" },
          { type: "PUNCTUATION",                value: ")" },
          { type: "OPERATOR",                   value: "?" },
          { type: "NUMBER",                     value: "1" },
          { type: "PUNCTUATION",                value: ":" },
          { type: "OPERATOR",                   value: "-" },
          { type: "NUMBER",                     value: "1" },
          { type: "TERMINATOR",                 value: "EOF"}
        ];
        expect(lexer(input)).to.deep.equal(output);
      });

      it('should handle ternary operators without a parenthetical', function () {
        input = String.raw`var g = 6 == 7 ? true : false;`;
        output = [
          { type: "DECLARATION_KEYWORD",  value: "var" },
          { type: "IDENTIFIER",           value: "g" },
          { type: "OPERATOR",             value: "=" },
          { type: "NUMBER",               value: "6" },
          { type: "OPERATOR",             value: "=" },
          { type: "OPERATOR",             value: "=" },
          { type: "NUMBER",               value: "7" },
          { type: "OPERATOR",             value: "?" },
          { type: "BOOLEAN",              value: "true" },
          { type: "PUNCTUATION",          value: ":" },
          { type: "BOOLEAN",              value: "false" },
          { type: "PUNCTUATION",          value: ";" },
          { type: "TERMINATOR",           value: "EOF"}
        ];
        expect(lexer(input)).to.deep.equal(output);
      });

      it('should handle ternary operators that include identifiers', function () {
        input = String.raw`let h = false; let i = h ? 1 : 2;`;
        output = [
          { type: "DECLARATION_KEYWORD",  value: "let" },
          { type: "IDENTIFIER",           value: "h" },
          { type: "OPERATOR",             value: "=" },
          { type: "BOOLEAN",              value: "false" },
          { type: "PUNCTUATION",          value: ";" },
          { type: "DECLARATION_KEYWORD",  value: "let" },
          { type: "IDENTIFIER",           value: "i" },
          { type: "OPERATOR",             value: "=" },
          { type: "IDENTIFIER",           value: "h" },
          { type: "OPERATOR",             value: "?" },
          { type: "NUMBER",               value: "1" },
          { type: "PUNCTUATION",          value: ":" },
          { type: "NUMBER",               value: "2" },
          { type: "PUNCTUATION",          value: ";" },
          { type: "TERMINATOR",           value: "EOF"}
        ];
        expect(lexer(input)).to.deep.equal(output);
      });

    });

    describe('String concatenation and interpolation', function () {

      it('should handle string concatenation', function () {
        input = String.raw`var k = "Stephen" + " " + "Tabor" + "!"`;
        output = [
          { type: "DECLARATION_KEYWORD",  value: "var" },
          { type: "IDENTIFIER",           value: "k" },
          { type: "OPERATOR",             value: "=" },
          { type: "STRING",               value: "Stephen" },
          { type: "OPERATOR",             value: "+" },
          { type: "STRING",               value: " " },
          { type: "OPERATOR",             value: "+" },
          { type: "STRING",               value: "Tabor" },
          { type: "OPERATOR",             value: "+" },
          { type: "STRING",               value: "!" },
          { type: "TERMINATOR",           value: "EOF" }
        ];
        expect(lexer(input)).to.deep.equal(output);
      });

      it('should handle string interpolation', function () {
        input = String.raw`var planet = "Earth"; let o = "\(planet)"`;
        output = [
          { type: "DECLARATION_KEYWORD",        value: "var" },
          { type: "IDENTIFIER",                 value: "planet" },
          { type: "OPERATOR",                   value: "=" },
          { type: "STRING",                     value: "Earth" },
          { type: "PUNCTUATION",                value: ";" },
          { type: "DECLARATION_KEYWORD",        value: "let" },
          { type: "IDENTIFIER",                 value: "o" },
          { type: "OPERATOR",                   value: "=" },
          { type: "STRING",                     value: "" },
          { type: "STRING_INTERPOLATION_START", value: "\\(" },
          { type: "IDENTIFIER",                 value: "planet" },
          { type: "STRING_INTERPOLATION_END",   value: ")" },
          { type: "STRING",                     value: "" },
          { type: "TERMINATOR",                 value: "EOF" }
        ];
        expect(lexer(input)).to.deep.equal(output);
      });

      it('should handle string interpolation in the middle of a string', function () {
        input = String.raw`var planet = "Earth"; let o = "Hello \(planet)!"`;
        output = [
          { type: "DECLARATION_KEYWORD",        value: "var" },
          { type: "IDENTIFIER",                 value: "planet" },
          { type: "OPERATOR",                   value: "=" },
          { type: "STRING",                     value: "Earth" },
          { type: "PUNCTUATION",                value: ";" },
          { type: "DECLARATION_KEYWORD",        value: "let" },
          { type: "IDENTIFIER",                 value: "o" },
          { type: "OPERATOR",                   value: "=" },
          { type: "STRING",                     value: "Hello " },
          { type: "STRING_INTERPOLATION_START", value: "\\(" },
          { type: "IDENTIFIER",                 value: "planet" },
          { type: "STRING_INTERPOLATION_END",   value: ")" },
          { type: "STRING",                     value: "!" },
          { type: "TERMINATOR",                 value: "EOF" }
        ];
        expect(lexer(input)).to.deep.equal(output);
      });

      it('should handle interpolation containing operations', function () {
        input = String.raw`var p = "\(100 - 99), 2, 3"`;
        output = [
          { type: "DECLARATION_KEYWORD",        value: "var" },
          { type: "IDENTIFIER",                 value: "p" },
          { type: "OPERATOR",                   value: "=" },
          { type: "STRING",                     value: "" },
          { type: "STRING_INTERPOLATION_START", value: "\\(" },
          { type: "NUMBER",                     value: "100" },
          { type: "OPERATOR",                   value: "-" },
          { type: "NUMBER",                     value: "99" },
          { type: "STRING_INTERPOLATION_END",   value: ")" },
          { type: "STRING",                     value: ", 2, 3" },
          { type: "TERMINATOR",                 value: "EOF" }
        ];
        expect(lexer(input)).to.deep.equal(output);
      });

      it('should handle interpolation containing operations on identifiers', function () {
        input = String.raw`let a = 3; let b = 5; let sum = "the sum of a and b is \(a + b).";`;
        output = [
          { type: "DECLARATION_KEYWORD",        value: "let" },
          { type: "IDENTIFIER",                 value: "a" },
          { type: "OPERATOR",                   value: "=" },
          { type: "NUMBER",                     value: "3" },
          { type: "PUNCTUATION",                value: ";" },
          { type: "DECLARATION_KEYWORD",        value: "let" },
          { type: "IDENTIFIER",                 value: "b" },
          { type: "OPERATOR",                   value: "=" },
          { type: "NUMBER",                     value: "5" },
          { type: "PUNCTUATION",                value: ";" },
          { type: "DECLARATION_KEYWORD",        value: "let" },
          { type: "IDENTIFIER",                 value: "sum" },
          { type: "OPERATOR",                   value: "=" },
          { type: "STRING",                     value: "the sum of a and b is " },
          { type: "STRING_INTERPOLATION_START", value: "\\(" },
          { type: "IDENTIFIER",                 value: "a" },
          { type: "OPERATOR",                   value: "+" },
          { type: "IDENTIFIER",                 value: "b" },
          { type: "STRING_INTERPOLATION_END",   value: ")" },
          { type: "STRING",                     value: "." },
          { type: "PUNCTUATION",                value: ";" },
          { type: "TERMINATOR",                 value: "EOF" }
        ];
        expect(lexer(input)).to.deep.equal(output);
      });
    });

    describe('Nested collections', function () {

      it('should handle dictionaries of arrays', function () {
        input = String.raw`let q = ["array1": [1,2,3], "array2": [4,5,6]];`;
        output = [
          { type: "DECLARATION_KEYWORD",  value: "let" },
          { type: "IDENTIFIER",           value: "q" },
          { type: "OPERATOR",             value: "=" },
          { type: "DICTIONARY_START",     value: "[" },
          { type: "STRING",               value: "array1" },
          { type: "PUNCTUATION",          value: ":" },
          { type: "ARRAY_START",          value: "[" },
          { type: "NUMBER",               value: "1" },
          { type: "PUNCTUATION",          value: "," },
          { type: "NUMBER",               value: "2" },
          { type: "PUNCTUATION",          value: "," },
          { type: "NUMBER",               value: "3" },
          { type: "ARRAY_END",            value: "]" },
          { type: "PUNCTUATION",          value: "," },
          { type: "STRING",               value: "array2" },
          { type: "PUNCTUATION",          value: ":" },
          { type: "ARRAY_START",          value: "[" },
          { type: "NUMBER",               value: "4" },
          { type: "PUNCTUATION",          value: "," },
          { type: "NUMBER",               value: "5" },
          { type: "PUNCTUATION",          value: "," },
          { type: "NUMBER",               value: "6" },
          { type: "ARRAY_END",            value: "]" },
          { type: "DICTIONARY_END",       value: "]" },
          { type: "PUNCTUATION",          value: ";" },
          { type: "TERMINATOR",           value: "EOF" }
        ];
        expect(lexer(input)).to.deep.equal(output);
      });

      it('should handle array access', function () {
        input = String.raw`let arr = [1, 2]; var s = arr[0];`;
        output = [
          { type: "DECLARATION_KEYWORD",        value: "let" },
          { type: "IDENTIFIER",                 value: "arr" },
          { type: "OPERATOR",                   value: "=" },
          { type: "ARRAY_START",                value: "[" },
          { type: "NUMBER",                     value: "1" },
          { type: "PUNCTUATION",                value: "," },
          { type: "NUMBER",                     value: "2" },
          { type: "ARRAY_END",                  value: "]" },
          { type: "PUNCTUATION",                value: ";" },
          { type: "DECLARATION_KEYWORD",        value: "var" },
          { type: "IDENTIFIER",                 value: "s" },
          { type: "OPERATOR",                   value: "=" },
          { type: "IDENTIFIER",                 value: "arr" },
          { type: "SUBSTRING_LOOKUP_START",     value: "[" },
          { type: "NUMBER",                     value: "0" },
          { type: "SUBSTRING_LOOKUP_END",       value: "]" },
          { type: "PUNCTUATION",                value: ";" },
          { type: "TERMINATOR",                 value: "EOF" }
        ];
        expect(lexer(input)).to.deep.equal(output);
      });

      it('should handle array access with numeric operations', function () {
        input = String.raw`let arr = [1, 2]; let t = 100; var u = arr[t - 99];`;
        output = [
          { type: "DECLARATION_KEYWORD",        value: "let" },
          { type: "IDENTIFIER",                 value: "arr" },
          { type: "OPERATOR",                   value: "=" },
          { type: "ARRAY_START",                value: "[" },
          { type: "NUMBER",                     value: "1" },
          { type: "PUNCTUATION",                value: "," },
          { type: "NUMBER",                     value: "2" },
          { type: "ARRAY_END",                  value: "]" },
          { type: "PUNCTUATION",                value: ";" },
          { type: "DECLARATION_KEYWORD",        value: "let" },
          { type: "IDENTIFIER",                 value: "t" },
          { type: "OPERATOR",                   value: "=" },
          { type: "NUMBER",                     value: "100" },
          { type: "PUNCTUATION",                value: ";" },
          { type: "DECLARATION_KEYWORD",        value: "var" },
          { type: "IDENTIFIER",                 value: "u" },
          { type: "OPERATOR",                   value: "=" },
          { type: "IDENTIFIER",                 value: "arr" },
          { type: "SUBSTRING_LOOKUP_START",     value: "[" },
          { type: "IDENTIFIER",                 value: "t" },
          { type: "OPERATOR",                   value: "-" },
          { type: "NUMBER",                     value: "99" },
          { type: "SUBSTRING_LOOKUP_END",       value: "]" },
          { type: "PUNCTUATION",                value: ";" },
          { type: "TERMINATOR",                 value: "EOF" }
        ];
        expect(lexer(input)).to.deep.equal(output);
      });

      it('should handle arrays of that contain a substring lookup', function () {
        input = String.raw`let arr = [1,2]; var u = [arr[0]];`;
        output = [
          { type: "DECLARATION_KEYWORD",        value: "let" },
          { type: "IDENTIFIER",                 value: "arr" },
          { type: "OPERATOR",                   value: "=" },
          { type: "ARRAY_START",                value: "[" },
          { type: "NUMBER",                     value: "1" },
          { type: "PUNCTUATION",                value: "," },
          { type: "NUMBER",                     value: "2" },
          { type: "ARRAY_END",                  value: "]" },
          { type: "PUNCTUATION",                value: ";" },
          { type: "DECLARATION_KEYWORD",        value: "var" },
          { type: "IDENTIFIER",                 value: "u" },
          { type: "OPERATOR",                   value: "=" },
          { type: "ARRAY_START",                value: "[" },
          { type: "IDENTIFIER",                 value: "arr" },
          { type: "SUBSTRING_LOOKUP_START",     value: "[" },
          { type: "NUMBER",                     value: "0" },
          { type: "SUBSTRING_LOOKUP_END",       value: "]" },
          { type: "ARRAY_END",                  value: "]" },
          { type: "PUNCTUATION",                value: ";" },
          { type: "TERMINATOR",                 value: "EOF" }
        ];
        expect(lexer(input)).to.deep.equal(output);
      });

      it('should handle arrays of dictionaries', function () {
        input = String.raw`let arr = [1,2]; var v = [arr[0]: [[1,2], [3,4]], arr[1]: [["one", "two"], ["three", "four"]]];`;
        output = [
          { type: "DECLARATION_KEYWORD",        value: "let" },
          { type: "IDENTIFIER",                 value: "arr" },
          { type: "OPERATOR",                   value: "=" },
          { type: "ARRAY_START",                value: "[" },
          { type: "NUMBER",                     value: "1" },
          { type: "PUNCTUATION",                value: "," },
          { type: "NUMBER",                     value: "2" },
          { type: "ARRAY_END",                  value: "]" },
          { type: "PUNCTUATION",                value: ";" },
          { type: "DECLARATION_KEYWORD",        value: "var" },
          { type: "IDENTIFIER",                 value: "v" },
          { type: "OPERATOR",                   value: "=" },
          { type: "DICTIONARY_START",           value: "[" },
          { type: "IDENTIFIER",                 value: "arr" },
          { type: "SUBSTRING_LOOKUP_START",     value: "[" },
          { type: "NUMBER",                     value: "0" },
          { type: "SUBSTRING_LOOKUP_END",       value: "]" },
          { type: "PUNCTUATION",                value: ":" },
          { type: "ARRAY_START",                value: "[" },
          { type: "ARRAY_START",                value: "[" },
          { type: "NUMBER",                     value: "1" },
          { type: "PUNCTUATION",                value: "," },
          { type: "NUMBER",                     value: "2" },
          { type: "ARRAY_END",                  value: "]" },
          { type: "PUNCTUATION",                value: "," },
          { type: "ARRAY_START",                value: "[" },
          { type: "NUMBER",                     value: "3" },
          { type: "PUNCTUATION",                value: "," },
          { type: "NUMBER",                     value: "4" },
          { type: "ARRAY_END",                  value: "]" },
          { type: "ARRAY_END",                  value: "]" },
          { type: "PUNCTUATION",                value: "," },
          { type: "IDENTIFIER",                 value: "arr" },
          { type: "SUBSTRING_LOOKUP_START",     value: "[" },
          { type: "NUMBER",                     value: "1" },
          { type: "SUBSTRING_LOOKUP_END",       value: "]" },
          { type: "PUNCTUATION",                value: ":" },
          { type: "ARRAY_START",                value: "[" },
          { type: "ARRAY_START",                value: "[" },
          { type: "STRING",                     value: "one" },
          { type: "PUNCTUATION",                value: "," },
          { type: "STRING",                     value: "two" },
          { type: "ARRAY_END",                  value: "]" },
          { type: "PUNCTUATION",                value: "," },
          { type: "ARRAY_START",                value: "[" },
          { type: "STRING",                     value: "three" },
          { type: "PUNCTUATION",                value: "," },
          { type: "STRING",                     value: "four" },
          { type: "ARRAY_END",                  value: "]" },
          { type: "ARRAY_END",                  value: "]" },
          { type: "DICTIONARY_END",             value: "]" },
          { type: "PUNCTUATION",                value: ";" },
          { type: "TERMINATOR",                 value: "EOF" }
        ];
        expect(lexer(input)).to.deep.equal(output);
      });

      it('should handle multi-nested lists', function () {
        input = String.raw`var w = [1: [[1: "two"], [3: "four"]], 2: [["one": 2], ["three": 4]]];`;
        output = [
          { type: "DECLARATION_KEYWORD",  value: "var" },
          { type: "IDENTIFIER",           value: "w" },
          { type: "OPERATOR",             value: "=" },
          { type: "DICTIONARY_START",     value: "[" },
          { type: "NUMBER",               value: "1" },
          { type: "PUNCTUATION",          value: ":" },
          { type: "ARRAY_START",          value: "[" },
          { type: "DICTIONARY_START",     value: "[" },
          { type: "NUMBER",               value: "1" },
          { type: "PUNCTUATION",          value: ":" },
          { type: "STRING",               value: "two" },
          { type: "DICTIONARY_END",       value: "]" },
          { type: "PUNCTUATION",          value: "," },
          { type: "DICTIONARY_START",     value: "[" },
          { type: "NUMBER",               value: "3" },
          { type: "PUNCTUATION",          value: ":" },
          { type: "STRING",               value: "four" },
          { type: "DICTIONARY_END",       value: "]" },
          { type: "ARRAY_END",            value: "]" },
          { type: "PUNCTUATION",          value: "," },
          { type: "NUMBER",               value: "2" },
          { type: "PUNCTUATION",          value: ":" },
          { type: "ARRAY_START",          value: "[" },
          { type: "DICTIONARY_START",     value: "[" },
          { type: "STRING",               value: "one" },
          { type: "PUNCTUATION",          value: ":" },
          { type: "NUMBER",               value: "2" },
          { type: "DICTIONARY_END",       value: "]" },
          { type: "PUNCTUATION",          value: "," },
          { type: "DICTIONARY_START",     value: "[" },
          { type: "STRING",               value: "three" },
          { type: "PUNCTUATION",          value: ":" },
          { type: "NUMBER",               value: "4" },
          { type: "DICTIONARY_END",       value: "]" },
          { type: "ARRAY_END",            value: "]" },
          { type: "DICTIONARY_END",       value: "]" },
          { type: "PUNCTUATION",          value: ";" },
          { type: "TERMINATOR",           value: "EOF" }
        ];
        expect(lexer(input)).to.deep.equal(output);
      });
    });
  });

  describe('Second milestone', function() {

    describe('Single-Line If statements', function() {

      it('should handle single-line if statements', function() {
        input = String.raw`var a = 5; if (true) {--a};`;
        output = [
          { type: "DECLARATION_KEYWORD",  value: "var" },
          { type: "IDENTIFIER",           value: "a" },
          { type: "OPERATOR",             value: "=" },
          { type: "NUMBER",               value: "5" },
          { type: "PUNCTUATION",          value: ";" },
          { type: "STATEMENT_KEYWORD",    value: "if" },
          { type: "PUNCTUATION",          value: "(" },
          { type: "BOOLEAN",              value: "true" },
          { type: "PUNCTUATION",          value: ")" },
          { type: "PUNCTUATION",          value: "{" },
          { type: "OPERATOR",             value: "-" },
          { type: "OPERATOR",             value: "-" },
          { type: "IDENTIFIER",           value: "a" },
          { type: "PUNCTUATION",          value: "}" },
          { type: "PUNCTUATION",          value: ";" },
          { type: "TERMINATOR",           value: "EOF"}
        ];
        expect(lexer(input)).to.deep.equal(output);
      });

      it('should handle single-line if statements with multi-character logical operators', function() {
        input = String.raw`var b = 6; if (5 <= 6) {b++};`;
        output = [
          { type: "DECLARATION_KEYWORD",  value: "var" },
          { type: "IDENTIFIER",           value: "b" },
          { type: "OPERATOR",             value: "=" },
          { type: "NUMBER",               value: "6" },
          { type: "PUNCTUATION",          value: ";" },
          { type: "STATEMENT_KEYWORD",    value: "if" },
          { type: "PUNCTUATION",          value: "(" },
          { type: "NUMBER",               value: "5" },
          { type: "OPERATOR",             value: "<" },
          { type: "OPERATOR",             value: "=" },
          { type: "NUMBER",               value: "6" },
          { type: "PUNCTUATION",          value: ")" },
          { type: "PUNCTUATION",          value: "{" },
          { type: "IDENTIFIER",           value: "b" },
          { type: "OPERATOR",             value: "+" },
          { type: "OPERATOR",             value: "+" },
          { type: "PUNCTUATION",          value: "}" },
          { type: "PUNCTUATION",          value: ";" },
          { type: "TERMINATOR",           value: "EOF"}
        ];
        expect(lexer(input)).to.deep.equal(output);
      });

      it('should handle single-line if statements with multi-character logical operators and multi-character mathematical operators', function() {
        input = String.raw`var c = 1; if (c == 1) {c *= 5};`;
        output = [
          { type: "DECLARATION_KEYWORD",  value: "var" },
          { type: "IDENTIFIER",           value: "c" },
          { type: "OPERATOR",             value: "=" },
          { type: "NUMBER",               value: "1" },
          { type: "PUNCTUATION",          value: ";" },
          { type: "STATEMENT_KEYWORD",    value: "if" },
          { type: "PUNCTUATION",          value: "(" },
          { type: "IDENTIFIER",           value: "c" },
          { type: "OPERATOR",             value: "=" },
          { type: "OPERATOR",             value: "=" },
          { type: "NUMBER",               value: "1" },
          { type: "PUNCTUATION",          value: ")" },
          { type: "PUNCTUATION",          value: "{" },
          { type: "IDENTIFIER",           value: "c" },
          { type: "OPERATOR",             value: "*" },
          { type: "OPERATOR",             value: "=" },
          { type: "NUMBER",               value: "5" },
          { type: "PUNCTUATION",          value: "}" },
          { type: "PUNCTUATION",          value: ";" },
          { type: "TERMINATOR",           value: "EOF"}
        ];
        expect(lexer(input)).to.deep.equal(output);
      });

      it('should handle single-line if statements without a parenthetical', function() {
        input = String.raw`var d = 1; if d != 2 {d++};`;
        output = [
          { type: "DECLARATION_KEYWORD",  value: "var" },
          { type: "IDENTIFIER",           value: "d" },
          { type: "OPERATOR",             value: "=" },
          { type: "NUMBER",               value: "1" },
          { type: "PUNCTUATION",          value: ";" },
          { type: "STATEMENT_KEYWORD",    value: "if" },
          { type: "IDENTIFIER",           value: "d" },
          { type: "OPERATOR",             value: "!" },
          { type: "OPERATOR",             value: "=" },
          { type: "NUMBER",               value: "2" },
          { type: "PUNCTUATION",          value: "{" },
          { type: "IDENTIFIER",           value: "d" },
          { type: "OPERATOR",             value: "+" },
          { type: "OPERATOR",             value: "+" },
          { type: "PUNCTUATION",          value: "}" },
          { type: "PUNCTUATION",          value: ";" },
          { type: "TERMINATOR",           value: "EOF"}
        ];
        expect(lexer(input)).to.deep.equal(output);
      });

      it('should handle complex conditionals without an outer parenthetical', function() {
        input = String.raw`var e = 1; if (e + 1) == 2 {e = 5};`;
        output = [
          { type: "DECLARATION_KEYWORD",  value: "var" },
          { type: "IDENTIFIER",           value: "e" },
          { type: "OPERATOR",             value: "=" },
          { type: "NUMBER",               value: "1" },
          { type: "PUNCTUATION",          value: ";" },
          { type: "STATEMENT_KEYWORD",    value: "if" },
          { type: "PUNCTUATION",          value: "(" },
          { type: "IDENTIFIER",           value: "e" },
          { type: "OPERATOR",             value: "+" },
          { type: "NUMBER",               value: "1" },
          { type: "PUNCTUATION",          value: ")" },
          { type: "OPERATOR",             value: "=" },
          { type: "OPERATOR",             value: "=" },
          { type: "NUMBER",               value: "2" },
          { type: "PUNCTUATION",          value: "{" },
          { type: "IDENTIFIER",           value: "e" },
          { type: "OPERATOR",             value: "=" },
          { type: "NUMBER",               value: "5" },
          { type: "PUNCTUATION",          value: "}" },
          { type: "PUNCTUATION",          value: ";" },
          { type: "TERMINATOR",           value: "EOF"}
        ];
        expect(lexer(input)).to.deep.equal(output);
      });

      it('should handle single line if/else statements', function() {
        input = String.raw`var f = true; if !f {f = true} else {f = false};`;
        output = [
          { type: "DECLARATION_KEYWORD",  value: "var" },
          { type: "IDENTIFIER",           value: "f" },
          { type: "OPERATOR",             value: "=" },
          { type: "BOOLEAN",              value: "true" },
          { type: "PUNCTUATION",          value: ";" },
          { type: "STATEMENT_KEYWORD",    value: "if" },
          { type: "OPERATOR",             value: "!" },
          { type: "IDENTIFIER",           value: "f" },
          { type: "PUNCTUATION",          value: "{" },
          { type: "IDENTIFIER",           value: "f" },
          { type: "OPERATOR",             value: "=" },
          { type: "BOOLEAN",              value: "true" },
          { type: "PUNCTUATION",          value: "}" },
          { type: "STATEMENT_KEYWORD",    value: "else" },
          { type: "PUNCTUATION",          value: "{" },
          { type: "IDENTIFIER",           value: "f" },
          { type: "OPERATOR",             value: "=" },
          { type: "BOOLEAN",              value: "false" },
          { type: "PUNCTUATION",          value: "}" },
          { type: "PUNCTUATION",          value: ";" },
          { type: "TERMINATOR",           value: "EOF"}
        ];
        expect(lexer(input)).to.deep.equal(output);
      });

      it('should handle single-line if/else-if/else statements with parentheticals', function() {
        input = String.raw`var a = 1; if (1 > 2) {++a} else if (1 < 2) {--a} else {a = 42}`;
        output = [
          { type: "DECLARATION_KEYWORD",  value: "var" },
          { type: "IDENTIFIER",           value: "a" },
          { type: "OPERATOR",             value: "=" },
          { type: "NUMBER",               value: "1" },
          { type: "PUNCTUATION",          value: ";" },
          { type: "STATEMENT_KEYWORD",    value: "if" },
          { type: "PUNCTUATION",          value: "(" },
          { type: "NUMBER",               value: "1" },
          { type: "OPERATOR",             value: ">" },
          { type: "NUMBER",               value: "2" },
          { type: "PUNCTUATION",          value: ")" },
          { type: "PUNCTUATION",          value: "{" },
          { type: "OPERATOR",             value: "+" },
          { type: "OPERATOR",             value: "+" },
          { type: "IDENTIFIER",           value: "a" },
          { type: "PUNCTUATION",          value: "}" },
          { type: "STATEMENT_KEYWORD",    value: "else" },
          { type: "STATEMENT_KEYWORD",    value: "if" },
          { type: "PUNCTUATION",          value: "(" },
          { type: "NUMBER",               value: "1" },
          { type: "OPERATOR",             value: "<" },
          { type: "NUMBER",               value: "2" },
          { type: "PUNCTUATION",          value: ")" },
          { type: "PUNCTUATION",          value: "{" },
          { type: "OPERATOR",             value: "-" },
          { type: "OPERATOR",             value: "-" },
          { type: "IDENTIFIER",           value: "a" },
          { type: "PUNCTUATION",          value: "}" },
          { type: "STATEMENT_KEYWORD",    value: "else" },
          { type: "PUNCTUATION",          value: "{" },
          { type: "IDENTIFIER",           value: "a" },
          { type: "OPERATOR",             value: "=" },
          { type: "NUMBER",               value: "42" },
          { type: "PUNCTUATION",          value: "}" },
          { type: "TERMINATOR",           value: "EOF"}
        ];
        expect(lexer(input)).to.deep.equal(output);
      });

      it('should handle single-line if/else-if/else statements with parentheticals', function() {
        input = String.raw`var a = 1; if 1 > 2 {++a} else if 1 < 2 {--a} else {a = 42}`;
        output = [
          { type: "DECLARATION_KEYWORD",  value: "var" },
          { type: "IDENTIFIER",           value: "a" },
          { type: "OPERATOR",             value: "=" },
          { type: "NUMBER",               value: "1" },
          { type: "PUNCTUATION",          value: ";" },
          { type: "STATEMENT_KEYWORD",    value: "if" },
          { type: "NUMBER",               value: "1" },
          { type: "OPERATOR",             value: ">" },
          { type: "NUMBER",               value: "2" },
          { type: "PUNCTUATION",          value: "{" },
          { type: "OPERATOR",             value: "+" },
          { type: "OPERATOR",             value: "+" },
          { type: "IDENTIFIER",           value: "a" },
          { type: "PUNCTUATION",          value: "}" },
          { type: "STATEMENT_KEYWORD",    value: "else" },
          { type: "STATEMENT_KEYWORD",    value: "if" },
          { type: "NUMBER",               value: "1" },
          { type: "OPERATOR",             value: "<" },
          { type: "NUMBER",               value: "2" },
          { type: "PUNCTUATION",          value: "{" },
          { type: "OPERATOR",             value: "-" },
          { type: "OPERATOR",             value: "-" },
          { type: "IDENTIFIER",           value: "a" },
          { type: "PUNCTUATION",          value: "}" },
          { type: "STATEMENT_KEYWORD",    value: "else" },
          { type: "PUNCTUATION",          value: "{" },
          { type: "IDENTIFIER",           value: "a" },
          { type: "OPERATOR",             value: "=" },
          { type: "NUMBER",               value: "42" },
          { type: "PUNCTUATION",          value: "}" },
          { type: "TERMINATOR",           value: "EOF"}
        ];
        expect(lexer(input)).to.deep.equal(output);
      });

    });

    describe(' Single-Line While/Repeat-While loops', function() {

      it('should handle single-line while loops with a parenthetical', function() {
        input = String.raw`var i = 10; while (i >= 0) {i--}`;
        output = [
          { type: "DECLARATION_KEYWORD",  value: "var" },
          { type: "IDENTIFIER",           value: "i" },
          { type: "OPERATOR",             value: "=" },
          { type: "NUMBER",               value: "10" },
          { type: "PUNCTUATION",          value: ";" },
          { type: "STATEMENT_KEYWORD",    value: "while" },
          { type: "PUNCTUATION",          value: "(" },
          { type: "IDENTIFIER",           value: "i" },
          { type: "OPERATOR",             value: ">" },
          { type: "OPERATOR",             value: "=" },
          { type: "NUMBER",               value: "0" },
          { type: "PUNCTUATION",          value: ")" },
          { type: "PUNCTUATION",          value: "{" },
          { type: "IDENTIFIER",           value: "i" },
          { type: "OPERATOR",             value: "-" },
          { type: "OPERATOR",             value: "-" },
          { type: "PUNCTUATION",          value: "}" },
          { type: "TERMINATOR",           value: "EOF"}
        ];
        expect(lexer(input)).to.deep.equal(output);
      });

      it('should handle single-line while loops without a parenthetical', function() {
        input = String.raw`var i = 10; while i >= 0 {i--}`;
        output = [
          { type: "DECLARATION_KEYWORD",  value: "var" },
          { type: "IDENTIFIER",           value: "i" },
          { type: "OPERATOR",             value: "=" },
          { type: "NUMBER",               value: "10" },
          { type: "PUNCTUATION",          value: ";" },
          { type: "STATEMENT_KEYWORD",    value: "while" },
          { type: "IDENTIFIER",           value: "i" },
          { type: "OPERATOR",             value: ">" },
          { type: "OPERATOR",             value: "=" },
          { type: "NUMBER",               value: "0" },
          { type: "PUNCTUATION",          value: "{" },
          { type: "IDENTIFIER",           value: "i" },
          { type: "OPERATOR",             value: "-" },
          { type: "OPERATOR",             value: "-" },
          { type: "PUNCTUATION",          value: "}" },
          { type: "TERMINATOR",           value: "EOF"}
        ];
        expect(lexer(input)).to.deep.equal(output);
      });

      it('should handle single-line repeat-while loops with a parenthetical', function() {
        input = String.raw`var i = 10; repeat {i--} while (i >= 0)`;
        output = [
          { type: "DECLARATION_KEYWORD",  value: "var" },
          { type: "IDENTIFIER",           value: "i" },
          { type: "OPERATOR",             value: "=" },
          { type: "NUMBER",               value: "10" },
          { type: "PUNCTUATION",          value: ";" },
          { type: "STATEMENT_KEYWORD",    value: "repeat" },
          { type: "PUNCTUATION",          value: "{" },
          { type: "IDENTIFIER",           value: "i" },
          { type: "OPERATOR",             value: "-" },
          { type: "OPERATOR",             value: "-" },
          { type: "PUNCTUATION",          value: "}" },
          { type: "STATEMENT_KEYWORD",    value: "while" },
          { type: "PUNCTUATION",          value: "(" },
          { type: "IDENTIFIER",           value: "i" },
          { type: "OPERATOR",             value: ">" },
          { type: "OPERATOR",             value: "=" },
          { type: "NUMBER",               value: "0" },
          { type: "PUNCTUATION",          value: ")" },
          { type: "TERMINATOR",           value: "EOF"}
        ];
        expect(lexer(input)).to.deep.equal(output);
      });

      it('should handle single-line repeat-while loops without a parenthetical', function() {
        input = String.raw`var i = 10; repeat {i--} while i >= 0`;
        output = [
          { type: "DECLARATION_KEYWORD",  value: "var" },
          { type: "IDENTIFIER",           value: "i" },
          { type: "OPERATOR",             value: "=" },
          { type: "NUMBER",               value: "10" },
          { type: "PUNCTUATION",          value: ";" },
          { type: "STATEMENT_KEYWORD",    value: "repeat" },
          { type: "PUNCTUATION",          value: "{" },
          { type: "IDENTIFIER",           value: "i" },
          { type: "OPERATOR",             value: "-" },
          { type: "OPERATOR",             value: "-" },
          { type: "PUNCTUATION",          value: "}" },
          { type: "STATEMENT_KEYWORD",    value: "while" },
          { type: "IDENTIFIER",           value: "i" },
          { type: "OPERATOR",             value: ">" },
          { type: "OPERATOR",             value: "=" },
          { type: "NUMBER",               value: "0" },
          { type: "TERMINATOR",           value: "EOF"}
        ];
        expect(lexer(input)).to.deep.equal(output);
      });

    });

    describe('Single-Line For loops', function() {

      it('should handle single-line for loops with a parenthetical', function() {
        input = String.raw`var a = 0; for (var i = 10; i > 0; i--) {a++};`;
        output = [
          { type: "DECLARATION_KEYWORD",  value: "var" },
          { type: "IDENTIFIER",           value: "a" },
          { type: "OPERATOR",             value: "=" },
          { type: "NUMBER",               value: "0" },
          { type: "PUNCTUATION",          value: ";" },
          { type: "STATEMENT_KEYWORD",    value: "for" },
          { type: "PUNCTUATION",          value: "(" },
          { type: "DECLARATION_KEYWORD",  value: "var" },
          { type: "IDENTIFIER",           value: "i" },
          { type: "OPERATOR",             value: "=" },
          { type: "NUMBER",               value: "10" },
          { type: "PUNCTUATION",          value: ";" },
          { type: "IDENTIFIER",           value: "i" },
          { type: "OPERATOR",             value: ">" },
          { type: "NUMBER",               value: "0" },
          { type: "PUNCTUATION",          value: ";" },
          { type: "IDENTIFIER",           value: "i" },
          { type: "OPERATOR",             value: "-" },
          { type: "OPERATOR",             value: "-" },
          { type: "PUNCTUATION",          value: ")" },
          { type: "PUNCTUATION",          value: "{" },
          { type: "IDENTIFIER",           value: "a" },
          { type: "OPERATOR",             value: "+" },
          { type: "OPERATOR",             value: "+" },
          { type: "PUNCTUATION",          value: "}" },
          { type: "PUNCTUATION",          value: ";" },
          { type: "TERMINATOR",           value: "EOF"}
        ];
        expect(lexer(input)).to.deep.equal(output);
      });

      it('should handle single-line for loops without a parenthetical', function() {
        input = String.raw`var b = 0; for var j = 0; j < 10; j++ {b++};`;
        output = [
          { type: "DECLARATION_KEYWORD",  value: "var" },
          { type: "IDENTIFIER",           value: "b" },
          { type: "OPERATOR",             value: "=" },
          { type: "NUMBER",               value: "0" },
          { type: "PUNCTUATION",          value: ";" },
          { type: "STATEMENT_KEYWORD",    value: "for" },
          { type: "DECLARATION_KEYWORD",  value: "var" },
          { type: "IDENTIFIER",           value: "j" },
          { type: "OPERATOR",             value: "=" },
          { type: "NUMBER",               value: "0" },
          { type: "PUNCTUATION",          value: ";" },
          { type: "IDENTIFIER",           value: "j" },
          { type: "OPERATOR",             value: "<" },
          { type: "NUMBER",               value: "10" },
          { type: "PUNCTUATION",          value: ";" },
          { type: "IDENTIFIER",           value: "j" },
          { type: "OPERATOR",             value: "+" },
          { type: "OPERATOR",             value: "+" },
          { type: "PUNCTUATION",          value: "{" },
          { type: "IDENTIFIER",           value: "b" },
          { type: "OPERATOR",             value: "+" },
          { type: "OPERATOR",             value: "+" },
          { type: "PUNCTUATION",          value: "}" },
          { type: "PUNCTUATION",          value: ";" },
          { type: "TERMINATOR",           value: "EOF"}
        ];
        expect(lexer(input)).to.deep.equal(output);
      });

    });

    describe('Single-Line For-In loops', function() {

      it('should handle simple, single-line for-in loops without a parenthetical', function() {
        input = String.raw`var c = 0; var numbers = [1,2,3,4,5]; for n in numbers {c += n};`;
        output = [
          { type: "DECLARATION_KEYWORD",  value: "var" },
          { type: "IDENTIFIER",           value: "c" },
          { type: "OPERATOR",             value: "=" },
          { type: "NUMBER",               value: "0" },
          { type: "PUNCTUATION",          value: ";" },
          { type: "DECLARATION_KEYWORD",  value: "var" },
          { type: "IDENTIFIER",           value: "numbers" },
          { type: "OPERATOR",             value: "=" },
          { type: "ARRAY_START",          value: "[" },
          { type: "NUMBER",               value: "1" },
          { type: "PUNCTUATION",          value: "," },
          { type: "NUMBER",               value: "2" },
          { type: "PUNCTUATION",          value: "," },
          { type: "NUMBER",               value: "3" },
          { type: "PUNCTUATION",          value: "," },
          { type: "NUMBER",               value: "4" },
          { type: "PUNCTUATION",          value: "," },
          { type: "NUMBER",               value: "5" },
          { type: "ARRAY_END",            value: "]" },
          { type: "PUNCTUATION",          value: ";" },
          { type: "STATEMENT_KEYWORD",    value: "for" },
          { type: "IDENTIFIER",           value: "n" },
          { type: "STATEMENT_KEYWORD",    value: "in" },
          { type: "IDENTIFIER",           value: "numbers" },
          { type: "PUNCTUATION",          value: "{" },
          { type: "IDENTIFIER",           value: "c" },
          { type: "OPERATOR",             value: "+" },
          { type: "OPERATOR",             value: "=" },
          { type: "IDENTIFIER",           value: "n" },
          { type: "PUNCTUATION",          value: "}" },
          { type: "PUNCTUATION",          value: ";" },
          { type: "TERMINATOR",           value: "EOF"}
        ];
        expect(lexer(input)).to.deep.equal(output);
      });

      it('should handle simple, single-line for-in loops with a parenthetical and the item declared as a variable', function() {
        input = String.raw`var c = 0; var numbers = [1,2,3,4,5]; for (var n) in numbers {c += n};`;
        output = [
          { type: "DECLARATION_KEYWORD",  value: "var" },
          { type: "IDENTIFIER",           value: "c" },
          { type: "OPERATOR",             value: "=" },
          { type: "NUMBER",               value: "0" },
          { type: "PUNCTUATION",          value: ";" },
          { type: "DECLARATION_KEYWORD",  value: "var" },
          { type: "IDENTIFIER",           value: "numbers" },
          { type: "OPERATOR",             value: "=" },
          { type: "ARRAY_START",          value: "[" },
          { type: "NUMBER",               value: "1" },
          { type: "PUNCTUATION",          value: "," },
          { type: "NUMBER",               value: "2" },
          { type: "PUNCTUATION",          value: "," },
          { type: "NUMBER",               value: "3" },
          { type: "PUNCTUATION",          value: "," },
          { type: "NUMBER",               value: "4" },
          { type: "PUNCTUATION",          value: "," },
          { type: "NUMBER",               value: "5" },
          { type: "ARRAY_END",            value: "]" },
          { type: "PUNCTUATION",          value: ";" },
          { type: "STATEMENT_KEYWORD",    value: "for" },
          { type: "PUNCTUATION",          value: "(" },
          { type: "DECLARATION_KEYWORD",  value: "var" },
          { type: "IDENTIFIER",           value: "n" },
          { type: "PUNCTUATION",          value: ")" },
          { type: "STATEMENT_KEYWORD",    value: "in" },
          { type: "IDENTIFIER",           value: "numbers" },
          { type: "PUNCTUATION",          value: "{" },
          { type: "IDENTIFIER",           value: "c" },
          { type: "OPERATOR",             value: "+" },
          { type: "OPERATOR",             value: "=" },
          { type: "IDENTIFIER",           value: "n" },
          { type: "PUNCTUATION",          value: "}" },
          { type: "PUNCTUATION",          value: ";" },
          { type: "TERMINATOR",           value: "EOF"}
        ];
        expect(lexer(input)).to.deep.equal(output);
      });

    });

    describe('Multi-line statements', function() {
      it('should handle simple multi-line variable assignment', function() {
        input = String.raw`var b = true;
                 var c = 0;`;
        output = [
          { type: "DECLARATION_KEYWORD",  value: "var" },
          { type: "IDENTIFIER",           value: "b" },
          { type: "OPERATOR",             value: "=" },
          { type: "BOOLEAN",              value: "true" },
          { type: "PUNCTUATION",          value: ";" },
          { type: "TERMINATOR",           value: "\\n"},
          { type: "DECLARATION_KEYWORD",  value: "var" },
          { type: "IDENTIFIER",           value: "c" },
          { type: "OPERATOR",             value: "=" },
          { type: "NUMBER",               value: "0" },
          { type: "PUNCTUATION",          value: ";" },
          { type: "TERMINATOR",           value: "EOF"},
        ];
        expect(lexer(input)).to.deep.equal(output);
      });

      it('should handle complex multi-line variable assignment without semi-colons', function() {
        input = String.raw`var e = ["Eggs", "Milk", "Bacon"]
                 var f = ["one": 1, "two": 2, "three": 3]
                 let g = [1 : "one",2   :"two", 3: "three"]`;
        output = [
          { type: "DECLARATION_KEYWORD",  value: "var" },
          { type: "IDENTIFIER",           value: "e" },
          { type: "OPERATOR",             value: "=" },
          { type: "ARRAY_START",          value: "[" },
          { type: "STRING",               value: "Eggs" },
          { type: "PUNCTUATION",          value: "," },
          { type: "STRING",               value: "Milk" },
          { type: "PUNCTUATION",          value: "," },
          { type: "STRING",               value: "Bacon" },
          { type: "ARRAY_END",            value: "]" },
          { type: "TERMINATOR",           value: "\\n"},
          { type: "DECLARATION_KEYWORD",  value: "var" },
          { type: "IDENTIFIER",           value: "f" },
          { type: "OPERATOR",             value: "=" },
          { type: "DICTIONARY_START",     value: "[" },
          { type: "STRING",               value: "one" },
          { type: "PUNCTUATION",          value: ":" },
          { type: "NUMBER",               value: "1" },
          { type: "PUNCTUATION",          value: "," },
          { type: "STRING",               value: "two" },
          { type: "PUNCTUATION",          value: ":" },
          { type: "NUMBER",               value: "2" },
          { type: "PUNCTUATION",          value: "," },
          { type: "STRING",               value: "three" },
          { type: "PUNCTUATION",          value: ":" },
          { type: "NUMBER",               value: "3" },
          { type: "DICTIONARY_END",       value: "]" },
          { type: "TERMINATOR",           value: "\\n"},
          { type: "DECLARATION_KEYWORD",  value: "let" },
          { type: "IDENTIFIER",           value: "g" },
          { type: "OPERATOR",             value: "=" },
          { type: "DICTIONARY_START",     value: "[" },
          { type: "NUMBER",               value: "1" },
          { type: "PUNCTUATION",          value: ":" },
          { type: "STRING",               value: "one" },
          { type: "PUNCTUATION",          value: "," },
          { type: "NUMBER",               value: "2" },
          { type: "PUNCTUATION",          value: ":" },
          { type: "STRING",               value: "two" },
          { type: "PUNCTUATION",          value: "," },
          { type: "NUMBER",               value: "3" },
          { type: "PUNCTUATION",          value: ":" },
          { type: "STRING",               value: "three" },
          { type: "DICTIONARY_END",       value: "]" },
          { type: "TERMINATOR",           value: "EOF" }
        ];
        expect(lexer(input)).to.deep.equal(output);
      })

      it('should handle simple multi-line variable assignment with type annotations', function() {
        input = String.raw`var name: String = "Joe"
                let num: Int = 5;
                let anotherNum: UInt16 = 6
                var yetAnotherNum: Float = 4.2;
                let truth: Bool = false
                `;
        output = [
          { type: "DECLARATION_KEYWORD",  value: "var" },
          { type: "IDENTIFIER",           value: "name" },
          { type: "PUNCTUATION",          value: ":" },
          { type: "TYPE_STRING",          value: "String"},
          { type: "OPERATOR",             value: "=" },
          { type: "STRING",               value: "Joe" },
          { type: "TERMINATOR",           value: "\\n"},
          { type: "DECLARATION_KEYWORD",  value: "let" },
          { type: "IDENTIFIER",           value: "num" },
          { type: "PUNCTUATION",          value: ":" },
          { type: "TYPE_NUMBER",          value: "Int"},
          { type: "OPERATOR",             value: "=" },
          { type: "NUMBER",               value: "5" },
          { type: "PUNCTUATION",          value: ";" },
          { type: "TERMINATOR",           value: "\\n"},
          { type: "DECLARATION_KEYWORD",  value: "let" },
          { type: "IDENTIFIER",           value: "anotherNum" },
          { type: "PUNCTUATION",          value: ":" },
          { type: "TYPE_NUMBER",          value: "UInt16"},
          { type: "OPERATOR",             value: "=" },
          { type: "NUMBER",               value: "6" },
          { type: "TERMINATOR",           value: "\\n"},
          { type: "DECLARATION_KEYWORD",  value: "var" },
          { type: "IDENTIFIER",           value: "yetAnotherNum" },
          { type: "PUNCTUATION",          value: ":" },
          { type: "TYPE_NUMBER",          value: "Float"},
          { type: "OPERATOR",             value: "=" },
          { type: "NUMBER",               value: "4.2" },
          { type: "PUNCTUATION",          value: ";" },
          { type: "TERMINATOR",           value: "\\n"},
          { type: "DECLARATION_KEYWORD",  value: "let" },
          { type: "IDENTIFIER",           value: "truth" },
          { type: "PUNCTUATION",          value: ":" },
          { type: "TYPE_BOOLEAN",         value: "Bool"},
          { type: "OPERATOR",             value: "=" },
          { type: "BOOLEAN",              value: "false" },
          { type: "TERMINATOR",           value: "\\n"},
          { type: "TERMINATOR",           value: "EOF"}
        ];
        expect(lexer(input)).to.deep.equal(output);
      });

      it('should handle successive single-line comments', function() {
        input = String.raw`// function body goes here
        // firstParameterName and secondParameterName refer to
        // the argument values for the first and second parameters
        `;
        output = [
          { type: "COMMENT_START", value: "//"},
          { type: "COMMENT", value: " function body goes here"},
          { type: "TERMINATOR", value: "\\n"},
          { type: "COMMENT_START", value: "//"},
          { type: "COMMENT", value: " firstParameterName and secondParameterName refer to"},
          { type: "TERMINATOR", value: "\\n"},
          { type: "COMMENT_START", value: "//"},
          { type: "COMMENT", value: " the argument values for the first and second parameters"},
          { type: "TERMINATOR", value: "\\n"},
          { type: "TERMINATOR", value: "EOF"}
        ];
        expect(lexer(input)).to.deep.equal(output);
      });

      it('should handle multi-line comments', function() {
        input = String.raw`/*
        Comment 1
        Comment 2
        */
        `;
        output = [
          { type: "MULTI_LINE_COMMENT_START", value: "/*"},
          { type: "TERMINATOR", value: "\\n"},
          { type: "COMMENT", value: "Comment 1"},
          { type: "TERMINATOR", value: "\\n"},
          { type: "COMMENT", value: "Comment 2"},
          { type: "TERMINATOR", value: "\\n"},
          { type: "MULTI_LINE_COMMENT_END", value: "*/"},
          { type: "TERMINATOR", value: "\\n"},
          { type: "TERMINATOR", value: "EOF"}
        ];
        expect(lexer(input)).to.deep.equal(output);
      });

    });

    describe('Multi-line if statements', function() {
      it('should handle simple multi-line if statements', function() {
        input = String.raw`var a = false
                var b = 0;
                if (a) {
                  b++;
                }`;
        output = [
          { type: "DECLARATION_KEYWORD",  value: "var" },
          { type: "IDENTIFIER",           value: "a" },
          { type: "OPERATOR",             value: "=" },
          { type: "BOOLEAN",              value: "false" },
          { type: "TERMINATOR",           value: "\\n"},
          { type: "DECLARATION_KEYWORD",  value: "var" },
          { type: "IDENTIFIER",           value: "b" },
          { type: "OPERATOR",             value: "=" },
          { type: "NUMBER",               value: "0" },
          { type: "PUNCTUATION",          value: ";" },
          { type: "TERMINATOR",           value: "\\n"},
          { type: "STATEMENT_KEYWORD",    value: "if" },
          { type: "PUNCTUATION",          value: "(" },
          { type: "IDENTIFIER",           value: "a" },
          { type: "PUNCTUATION",          value: ")" },
          { type: "PUNCTUATION",          value: "{" },
          { type: "TERMINATOR",           value: "\\n"},
          { type: "IDENTIFIER",           value: "b" },
          { type: "OPERATOR",             value: "+" },
          { type: "OPERATOR",             value: "+" },
          { type: "PUNCTUATION",          value: ";" },
          { type: "TERMINATOR",           value: "\\n"},
          { type: "PUNCTUATION",          value: "}" },
          { type: "TERMINATOR",           value: "EOF"},
        ]
        expect(lexer(input)).to.deep.equal(output);
      });


      it('should handle simple multi-line if statements with complex conditions', function() {
        input = String.raw`var diceRoll = 6;
                if ++diceRoll == 7 {
                  diceRoll = 1
                }`;
        output = [
          { type: "DECLARATION_KEYWORD",  value: "var" },
          { type: "IDENTIFIER",           value: "diceRoll" },
          { type: "OPERATOR",             value: "=" },
          { type: "NUMBER",               value: "6" },
          { type: "PUNCTUATION",          value: ";" },
          { type: "TERMINATOR",           value: "\\n"},
          { type: "STATEMENT_KEYWORD",    value: "if" },
          { type: "OPERATOR",             value: "+" },
          { type: "OPERATOR",             value: "+" },
          { type: "IDENTIFIER",           value: "diceRoll" },
          { type: "OPERATOR",             value: "=" },
          { type: "OPERATOR",             value: "=" },
          { type: "NUMBER",               value: "7" },
          { type: "PUNCTUATION",          value: "{" },
          { type: "TERMINATOR",           value: "\\n"},
          { type: "IDENTIFIER",           value: "diceRoll" },
          { type: "OPERATOR",             value: "=" },
          { type: "NUMBER",               value: "1" },
          { type: "TERMINATOR",           value: "\\n"},
          { type: "PUNCTUATION",          value: "}" },
          { type: "TERMINATOR",           value: "EOF"},
        ]
        expect(lexer(input)).to.deep.equal(output);
      });


      it('should handle simple multi-line nested if statements', function() {
        input = String.raw`var x = true
                var y = false;
                var a = ""
                var z;
                if (x) {
                  if y {
                    z = true;
                  } else if (true) {
                      a = "<3 JS";
                  } else {
                      a = "never get here";
                  }
                } else {
                  a = "x is false";
                }`;
        output = [
          { type: "DECLARATION_KEYWORD",  value: "var" },
          { type: "IDENTIFIER",           value: "x" },
          { type: "OPERATOR",             value: "=" },
          { type: "BOOLEAN",              value: "true" },
          { type: "TERMINATOR",           value: "\\n"},
          { type: "DECLARATION_KEYWORD",  value: "var" },
          { type: "IDENTIFIER",           value: "y" },
          { type: "OPERATOR",             value: "=" },
          { type: "BOOLEAN",              value: "false" },
          { type: "PUNCTUATION",          value: ";" },
          { type: "TERMINATOR",           value: "\\n"},
          { type: "DECLARATION_KEYWORD",  value: "var" },
          { type: "IDENTIFIER",           value: "a" },
          { type: "OPERATOR",             value: "=" },
          { type: "STRING",               value: "" },
          { type: "TERMINATOR",           value: "\\n"},
          { type: "DECLARATION_KEYWORD",  value: "var" },
          { type: "IDENTIFIER",           value: "z" },
          { type: "PUNCTUATION",          value: ";" },
          { type: "TERMINATOR",           value: "\\n"},

          { type: "STATEMENT_KEYWORD",    value: "if" },
          { type: "PUNCTUATION",          value: "(" },
          { type: "IDENTIFIER",           value: "x" },
          { type: "PUNCTUATION",          value: ")" },
          { type: "PUNCTUATION",          value: "{" },
          { type: "TERMINATOR",           value: "\\n"},

          { type: "STATEMENT_KEYWORD",    value: "if" },
          { type: "IDENTIFIER",           value: "y" },
          { type: "PUNCTUATION",          value: "{" },
          { type: "TERMINATOR",           value: "\\n"},

          { type: "IDENTIFIER",           value: "z" },
          { type: "OPERATOR",             value: "=" },
          { type: "BOOLEAN",              value: "true" },
          { type: "PUNCTUATION",          value: ";" },
          { type: "TERMINATOR",           value: "\\n"},

          { type: "PUNCTUATION",          value: "}" },
          { type: "STATEMENT_KEYWORD",    value: "else" },
          { type: "STATEMENT_KEYWORD",    value: "if" },
          { type: "PUNCTUATION",          value: "(" },
          { type: "BOOLEAN",              value: "true" },
          { type: "PUNCTUATION",          value: ")" },
          { type: "PUNCTUATION",          value: "{" },
          { type: "TERMINATOR",           value: "\\n"},

          { type: "IDENTIFIER",           value: "a" },
          { type: "OPERATOR",             value: "=" },
          { type: "STRING",               value: "<3 JS" },
          { type: "PUNCTUATION",          value: ";" },
          { type: "TERMINATOR",           value: "\\n"},

          { type: "PUNCTUATION",          value: "}" },
          { type: "STATEMENT_KEYWORD",    value: "else" },
          { type: "PUNCTUATION",          value: "{" },
          { type: "TERMINATOR",           value: "\\n"},

          { type: "IDENTIFIER",           value: "a" },
          { type: "OPERATOR",             value: "=" },
          { type: "STRING",               value: "never get here" },
          { type: "PUNCTUATION",          value: ";" },
          { type: "TERMINATOR",           value: "\\n"},

          { type: "PUNCTUATION",          value: "}" },
          { type: "TERMINATOR",           value: "\\n"},

          { type: "PUNCTUATION",          value: "}" },
          { type: "STATEMENT_KEYWORD",    value: "else" },
          { type: "PUNCTUATION",          value: "{" },
          { type: "TERMINATOR",           value: "\\n"},

          { type: "IDENTIFIER",           value: "a" },
          { type: "OPERATOR",             value: "=" },
          { type: "STRING",               value: "x is false" },
          { type: "PUNCTUATION",          value: ";" },
          { type: "TERMINATOR",           value: "\\n"},

          { type: "PUNCTUATION",          value: "}" },
          { type: "TERMINATOR",           value: "EOF"},
        ]
        expect(lexer(input)).to.deep.equal(output);
      });

    });

    describe('Multi-line for loops', function() {
      it('should handle simple multi-line for loops', function() {
        input = String.raw`var b = 0;
                for var i = 0; i < 10; i++ {
                  b++
                }`;
        output = [
          { type: "DECLARATION_KEYWORD",  value: "var" },
          { type: "IDENTIFIER",           value: "b" },
          { type: "OPERATOR",             value: "=" },
          { type: "NUMBER",               value: "0" },
          { type: "PUNCTUATION",          value: ";" },
          { type: "TERMINATOR",           value: "\\n"},
          { type: "STATEMENT_KEYWORD",    value: "for" },
          { type: "DECLARATION_KEYWORD",  value: "var" },
          { type: "IDENTIFIER",           value: "i" },
          { type: "OPERATOR",             value: "=" },
          { type: "NUMBER",               value: "0" },
          { type: "PUNCTUATION",          value: ";" },
          { type: "IDENTIFIER",           value: "i" },
          { type: "OPERATOR",             value: "<" },
          { type: "NUMBER",               value: "10" },
          { type: "PUNCTUATION",          value: ";" },
          { type: "IDENTIFIER",           value: "i" },
          { type: "OPERATOR",             value: "+" },
          { type: "OPERATOR",             value: "+" },
          { type: "PUNCTUATION",          value: "{" },
          { type: "TERMINATOR",           value: "\\n"},
          { type: "IDENTIFIER",           value: "b" },
          { type: "OPERATOR",             value: "+" },
          { type: "OPERATOR",             value: "+" },
          { type: "TERMINATOR",           value: "\\n"},
          { type: "PUNCTUATION",          value: "}" },
          { type: "TERMINATOR",           value: "EOF"}
        ];
        expect(lexer(input)).to.deep.equal(output);
      });

      it('should handle multi-line nested for loops', function() {
        input = String.raw`var arrays = [[1,2,3], [4,5,6], [7,8,9]]
                 var total = 0
                 for (var i = 0; i < 3; i++) {
                   for var j = 0; j < 3; j++ {
                     total += arrays[i][j]
                   }
                 }`;
        output = [
          { type: "DECLARATION_KEYWORD",  value: "var" },
          { type: "IDENTIFIER",           value: "arrays" },
          { type: "OPERATOR",             value: "=" },
          { type: "ARRAY_START",          value: "[" },
          { type: "ARRAY_START",          value: "[" },
          { type: "NUMBER",               value: "1" },
          { type: "PUNCTUATION",          value: "," },
          { type: "NUMBER",               value: "2" },
          { type: "PUNCTUATION",          value: "," },
          { type: "NUMBER",               value: "3" },
          { type: "ARRAY_END",            value: "]" },
          { type: "PUNCTUATION",          value: "," },
          { type: "ARRAY_START",          value: "[" },
          { type: "NUMBER",               value: "4" },
          { type: "PUNCTUATION",          value: "," },
          { type: "NUMBER",               value: "5" },
          { type: "PUNCTUATION",          value: "," },
          { type: "NUMBER",               value: "6" },
          { type: "ARRAY_END",            value: "]" },
          { type: "PUNCTUATION",          value: "," },
          { type: "ARRAY_START",          value: "[" },
          { type: "NUMBER",               value: "7" },
          { type: "PUNCTUATION",          value: "," },
          { type: "NUMBER",               value: "8" },
          { type: "PUNCTUATION",          value: "," },
          { type: "NUMBER",               value: "9" },
          { type: "ARRAY_END",            value: "]" },
          { type: "ARRAY_END",            value: "]" },
          { type: "TERMINATOR",           value: "\\n"},
          { type: "DECLARATION_KEYWORD",  value: "var" },
          { type: "IDENTIFIER",           value: "total" },
          { type: "OPERATOR",             value: "=" },
          { type: "NUMBER",               value: "0" },
          { type: "TERMINATOR",           value: "\\n"},
          { type: "STATEMENT_KEYWORD",    value: "for" },
          { type: "PUNCTUATION",          value: "(" },
          { type: "DECLARATION_KEYWORD",  value: "var" },
          { type: "IDENTIFIER",           value: "i" },
          { type: "OPERATOR",             value: "=" },
          { type: "NUMBER",               value: "0" },
          { type: "PUNCTUATION",          value: ";" },
          { type: "IDENTIFIER",           value: "i" },
          { type: "OPERATOR",             value: "<" },
          { type: "NUMBER",               value: "3" },
          { type: "PUNCTUATION",          value: ";" },
          { type: "IDENTIFIER",           value: "i" },
          { type: "OPERATOR",             value: "+" },
          { type: "OPERATOR",             value: "+" },
          { type: "PUNCTUATION",          value: ")" },
          { type: "PUNCTUATION",          value: "{" },
          { type: "TERMINATOR",           value: "\\n"},
          { type: "STATEMENT_KEYWORD",    value: "for" },
          { type: "DECLARATION_KEYWORD",  value: "var" },
          { type: "IDENTIFIER",           value: "j" },
          { type: "OPERATOR",             value: "=" },
          { type: "NUMBER",               value: "0" },
          { type: "PUNCTUATION",          value: ";" },
          { type: "IDENTIFIER",           value: "j" },
          { type: "OPERATOR",             value: "<" },
          { type: "NUMBER",               value: "3" },
          { type: "PUNCTUATION",          value: ";" },
          { type: "IDENTIFIER",           value: "j" },
          { type: "OPERATOR",             value: "+" },
          { type: "OPERATOR",             value: "+" },
          { type: "PUNCTUATION",          value: "{" },
          { type: "TERMINATOR",           value: "\\n"},
          { type: "IDENTIFIER",           value: "total" },
          { type: "OPERATOR",             value: "+" },
          { type: "OPERATOR",             value: "=" },
          { type: "IDENTIFIER",           value: "arrays" },
          { type: "SUBSTRING_LOOKUP_START",     value: "[" },
          { type: "IDENTIFIER",           value: "i" },
          { type: "SUBSTRING_LOOKUP_END",     value: "]" },
          { type: "SUBSTRING_LOOKUP_START",     value: "[" },
          { type: "IDENTIFIER",           value: "j" },
          { type: "SUBSTRING_LOOKUP_END",     value: "]" },
          { type: "TERMINATOR",           value: "\\n"},
          { type: "PUNCTUATION",          value: "}" },
          { type: "TERMINATOR",           value: "\\n"},
          { type: "PUNCTUATION",          value: "}" },
          { type: "TERMINATOR",           value: "EOF"}
        ];
        expect(lexer(input)).to.deep.equal(output);
      });

    });
    describe('Multi-line for-in loops', function() {
      it('should handle simple multi-line for-in loops', function() {
        input = String.raw`var c = 0
                 var numbers = [1,2,3,4,5]
                 for n in numbers {
                   c += n
                 }`;
        output = [
          { type: "DECLARATION_KEYWORD",  value: "var" },
          { type: "IDENTIFIER",           value: "c" },
          { type: "OPERATOR",             value: "=" },
          { type: "NUMBER",               value: "0" },
          { type: "TERMINATOR",           value: "\\n"},
          { type: "DECLARATION_KEYWORD",  value: "var" },
          { type: "IDENTIFIER",           value: "numbers" },
          { type: "OPERATOR",             value: "=" },
          { type: "ARRAY_START",          value: "[" },
          { type: "NUMBER",               value: "1" },
          { type: "PUNCTUATION",          value: "," },
          { type: "NUMBER",               value: "2" },
          { type: "PUNCTUATION",          value: "," },
          { type: "NUMBER",               value: "3" },
          { type: "PUNCTUATION",          value: "," },
          { type: "NUMBER",               value: "4" },
          { type: "PUNCTUATION",          value: "," },
          { type: "NUMBER",               value: "5" },
          { type: "ARRAY_END",            value: "]" },
          { type: "TERMINATOR",           value: "\\n"},
          { type: "STATEMENT_KEYWORD",    value: "for" },
          { type: "IDENTIFIER",           value: "n" },
          { type: "STATEMENT_KEYWORD",    value: "in" },
          { type: "IDENTIFIER",           value: "numbers" },
          { type: "PUNCTUATION",          value: "{" },
          { type: "TERMINATOR",           value: "\\n"},
          { type: "IDENTIFIER",           value: "c" },
          { type: "OPERATOR",             value: "+" },
          { type: "OPERATOR",             value: "=" },
          { type: "IDENTIFIER",           value: "n" },
          { type: "TERMINATOR",           value: "\\n"},
          { type: "PUNCTUATION",          value: "}" },
          { type: "TERMINATOR",           value: "EOF"}
        ];
        expect(lexer(input)).to.deep.equal(output);
      });

      it('handle for-in loops that iterate over a range', function () {
        input = String.raw`var sum = 0
                      for i in 0..<5 {
                          sum += i
                      }`;;
        output = [
          { type: 'DECLARATION_KEYWORD',            value: 'var' },
          { type: 'IDENTIFIER',                     value: 'sum' },
          { type: 'OPERATOR',                       value: '=' },
          { type: 'NUMBER',                         value: '0' },
          { type: 'TERMINATOR',                     value: '\\n' },
          { type: "STATEMENT_KEYWORD",              value: "for" },
          { type: "IDENTIFIER",                     value: "i" },
          { type: "STATEMENT_KEYWORD",              value: "in" },
          { type: 'NUMBER',                         value: '0' },
          { type: 'HALF-OPEN_RANGE',                value: '..<'},
          { type: 'NUMBER',                         value: '5' },
          { type: "PUNCTUATION",                    value: "{" },
          { type: "TERMINATOR",                     value: "\\n"},
          { type: "IDENTIFIER",                     value: "sum" },
          { type: "OPERATOR",                       value: "+" },
          { type: "OPERATOR",                       value: "=" },
          { type: "IDENTIFIER",                     value: "i" },
          { type: "TERMINATOR",                     value: "\\n"},
          { type: "PUNCTUATION",                    value: "}" },
          { type: "TERMINATOR",                     value: "EOF"},
        ];
        expect(lexer(input)).to.deep.equal(output);
      });

      it('should handle for-in loops that iterate over items in a dictionary', function () {
        input = String.raw`let interestingNumbers = [
                          "Prime": [2, 3, 5, 7, 11, 13],
                          "Fibonacci": [1, 1, 2, 3, 5, 8],
                          "Square": [1, 4, 9, 16, 25],
                      ]
                      var largest = 0
                      for (kind, numbers) in interestingNumbers {
                          for number in numbers {
                              if number > largest {
                                  largest = number
                              }
                          }
                      }`;;
        output = [
          { type: 'DECLARATION_KEYWORD',         value: 'let' },
          { type: 'IDENTIFIER',                  value: 'interestingNumbers' },
          { type: 'OPERATOR',                    value: '=' },
          { type: 'DICTIONARY_START',            value: '[' },
          { type: 'TERMINATOR',                  value: '\\n' },
          { type: 'STRING',                      value: 'Prime' },
          { type: 'PUNCTUATION',                 value: ':' },
          { type: 'ARRAY_START',                 value: '[' },
          { type: 'NUMBER',                      value: '2' },
          { type: 'PUNCTUATION',                 value: ',' },
          { type: 'NUMBER',                      value: '3' },
          { type: 'PUNCTUATION',                 value: ',' },
          { type: 'NUMBER',                      value: '5' },
          { type: 'PUNCTUATION',                 value: ',' },
          { type: 'NUMBER',                      value: '7' },
          { type: 'PUNCTUATION',                 value: ',' },
          { type: 'NUMBER',                      value: '11' },
          { type: 'PUNCTUATION',                 value: ',' },
          { type: 'NUMBER',                      value: '13' },
          { type: 'ARRAY_END',                   value: ']' },
          { type: 'PUNCTUATION',                 value: ',' },
          { type: 'TERMINATOR',                  value: '\\n' },
          { type: 'STRING',                      value: 'Fibonacci' },
          { type: 'PUNCTUATION',                 value: ':' },
          { type: 'ARRAY_START',                 value: '[' },
          { type: 'NUMBER',                      value: '1' },
          { type: 'PUNCTUATION',                 value: ',' },
          { type: 'NUMBER',                      value: '1' },
          { type: 'PUNCTUATION',                 value: ',' },
          { type: 'NUMBER',                      value: '2' },
          { type: 'PUNCTUATION',                 value: ',' },
          { type: 'NUMBER',                      value: '3' },
          { type: 'PUNCTUATION',                 value: ',' },
          { type: 'NUMBER',                      value: '5' },
          { type: 'PUNCTUATION',                 value: ',' },
          { type: 'NUMBER',                      value: '8' },
          { type: 'ARRAY_END',                   value: ']' },
          { type: 'PUNCTUATION',                 value: ',' },
          { type: 'TERMINATOR',                  value: '\\n' },
          { type: 'STRING',                      value: 'Square' },
          { type: 'PUNCTUATION',                 value: ':' },
          { type: 'ARRAY_START',                 value: '[' },
          { type: 'NUMBER',                      value: '1' },
          { type: 'PUNCTUATION',                 value: ',' },
          { type: 'NUMBER',                      value: '4' },
          { type: 'PUNCTUATION',                 value: ',' },
          { type: 'NUMBER',                      value: '9' },
          { type: 'PUNCTUATION',                 value: ',' },
          { type: 'NUMBER',                      value: '16' },
          { type: 'PUNCTUATION',                 value: ',' },
          { type: 'NUMBER',                      value: '25' },
          { type: 'ARRAY_END',                   value: ']' },
          { type: 'PUNCTUATION',                 value: ',' },
          { type: 'TERMINATOR',                  value: '\\n' },
          { type: 'DICTIONARY_END',              value: ']' },
          { type: 'TERMINATOR',                  value: '\\n' },
          { type: "DECLARATION_KEYWORD",         value: "var" },
          { type: "IDENTIFIER",                  value: "largest" },
          { type: "OPERATOR",                    value: "=" },
          { type: "NUMBER",                      value: "0" },
          { type: 'TERMINATOR',                  value: '\\n' },
          { type: "STATEMENT_KEYWORD",           value: "for" },
          { type: 'PUNCTUATION',                 value: '(' },
          { type: "IDENTIFIER",                  value: "kind" },
          { type: 'PUNCTUATION',                 value: ',' },
          { type: "IDENTIFIER",                  value: "numbers" },
          { type: 'PUNCTUATION',                 value: ')' },
          { type: "STATEMENT_KEYWORD",           value: "in" },
          { type: "IDENTIFIER",                  value: "interestingNumbers" },
          { type: "PUNCTUATION",                 value: "{" },
          { type: "TERMINATOR",                  value: "\\n"},
          { type: "STATEMENT_KEYWORD",           value: "for" },
          { type: "IDENTIFIER",                  value: "number" },
          { type: "STATEMENT_KEYWORD",           value: "in" },
          { type: "IDENTIFIER",                  value: "numbers" },
          { type: "PUNCTUATION",                 value: "{" },
          { type: "TERMINATOR",                  value: "\\n"},
          { type: "STATEMENT_KEYWORD",           value: "if" },
          { type: "IDENTIFIER",                  value: "number" },
          { type: "OPERATOR",                    value: ">" },
          { type: "IDENTIFIER",                  value: "largest" },
          { type: "PUNCTUATION",                 value: "{" },
          { type: "TERMINATOR",                  value: "\\n"},
          { type: "IDENTIFIER",                  value: "largest" },
          { type: "OPERATOR",                    value: "=" },
          { type: "IDENTIFIER",                  value: "number" },
          { type: "TERMINATOR",                  value: "\\n"},
          { type: "PUNCTUATION",                 value: "}" },
          { type: "TERMINATOR",                  value: "\\n"},
          { type: "PUNCTUATION",                 value: "}" },
          { type: "TERMINATOR",                  value: "\\n"},
          { type: "PUNCTUATION",                 value: "}" },
          { type: "TERMINATOR",                  value: "EOF"},
        ];
        expect(lexer(input)).to.deep.equal(output);
      });

    });

    describe('Multi-Line While/Repeat-While loops', function() {

      it('should handle multi-line while loops without a parenthetical', function() {
        input = String.raw`var i = 10;
                while i >= 0 {
                  i--
                }`;
        output = [
          { type: "DECLARATION_KEYWORD",  value: "var" },
          { type: "IDENTIFIER",           value: "i" },
          { type: "OPERATOR",             value: "=" },
          { type: "NUMBER",               value: "10" },
          { type: "PUNCTUATION",          value: ";" },
          { type: "TERMINATOR",           value: "\\n"},
          { type: "STATEMENT_KEYWORD",    value: "while" },
          { type: "IDENTIFIER",           value: "i" },
          { type: "OPERATOR",             value: ">" },
          { type: "OPERATOR",             value: "=" },
          { type: "NUMBER",               value: "0" },
          { type: "PUNCTUATION",          value: "{" },
          { type: "TERMINATOR",           value: "\\n"},
          { type: "IDENTIFIER",           value: "i" },
          { type: "OPERATOR",             value: "-" },
          { type: "OPERATOR",             value: "-" },
          { type: "TERMINATOR",           value: "\\n"},
          { type: "PUNCTUATION",          value: "}" },
          { type: "TERMINATOR",           value: "EOF"}
        ];
        expect(lexer(input)).to.deep.equal(output);
      });

      it('should handle multi-line while loops with a parenthetical', function() {
        input = String.raw`var i = 10;
                while (i >= 0) {
                  i--
                }`;
        output = [
          { type: "DECLARATION_KEYWORD",  value: "var" },
          { type: "IDENTIFIER",           value: "i" },
          { type: "OPERATOR",             value: "=" },
          { type: "NUMBER",               value: "10" },
          { type: "PUNCTUATION",          value: ";" },
          { type: "TERMINATOR",           value: "\\n"},
          { type: "STATEMENT_KEYWORD",    value: "while" },
          { type: "PUNCTUATION",          value: "(" },
          { type: "IDENTIFIER",           value: "i" },
          { type: "OPERATOR",             value: ">" },
          { type: "OPERATOR",             value: "=" },
          { type: "NUMBER",               value: "0" },
          { type: "PUNCTUATION",          value: ")" },
          { type: "PUNCTUATION",          value: "{" },
          { type: "TERMINATOR",           value: "\\n"},
          { type: "IDENTIFIER",           value: "i" },
          { type: "OPERATOR",             value: "-" },
          { type: "OPERATOR",             value: "-" },
          { type: "TERMINATOR",           value: "\\n"},
          { type: "PUNCTUATION",          value: "}" },
          { type: "TERMINATOR",           value: "EOF"}
        ];
        expect(lexer(input)).to.deep.equal(output);
      });

      it('should handle multi-line repeat-while loops with a parenthetical', function() {
        input = String.raw`var i = 10;
                 repeat {
                   i--
                 } while (i > 0);`;
        output = [
          { type: "DECLARATION_KEYWORD",  value: "var" },
          { type: "IDENTIFIER",           value: "i" },
          { type: "OPERATOR",             value: "=" },
          { type: "NUMBER",               value: "10" },
          { type: "PUNCTUATION",          value: ";" },
          { type: "TERMINATOR",           value: "\\n"},
          { type: "STATEMENT_KEYWORD",    value: "repeat" },
          { type: "PUNCTUATION",          value: "{" },
          { type: "TERMINATOR",           value: "\\n"},
          { type: "IDENTIFIER",           value: "i" },
          { type: "OPERATOR",             value: "-" },
          { type: "OPERATOR",             value: "-" },
          { type: "TERMINATOR",           value: "\\n"},
          { type: "PUNCTUATION",          value: "}" },
          { type: "STATEMENT_KEYWORD",    value: "while" },
          { type: "PUNCTUATION",          value: "(" },
          { type: "IDENTIFIER",           value: "i" },
          { type: "OPERATOR",             value: ">" },
          { type: "NUMBER",               value: "0" },
          { type: "PUNCTUATION",          value: ")" },
          { type: "PUNCTUATION",          value: ";" },
          { type: "TERMINATOR",           value: "EOF"}
        ];
        expect(lexer(input)).to.deep.equal(output);
      });

      it('should handle multi-line repeat-while loops without a parenthetical', function() {
        input = String.raw`var i = 10
                 repeat {
                   i--
                 } while i > 0`;
        output = [
          { type: "DECLARATION_KEYWORD",  value: "var" },
          { type: "IDENTIFIER",           value: "i" },
          { type: "OPERATOR",             value: "=" },
          { type: "NUMBER",               value: "10" },
          { type: "TERMINATOR",           value: "\\n"},
          { type: "STATEMENT_KEYWORD",    value: "repeat" },
          { type: "PUNCTUATION",          value: "{" },
          { type: "TERMINATOR",           value: "\\n"},
          { type: "IDENTIFIER",           value: "i" },
          { type: "OPERATOR",             value: "-" },
          { type: "OPERATOR",             value: "-" },
          { type: "TERMINATOR",           value: "\\n"},
          { type: "PUNCTUATION",          value: "}" },
          { type: "STATEMENT_KEYWORD",    value: "while" },
          { type: "IDENTIFIER",           value: "i" },
          { type: "OPERATOR",             value: ">" },
          { type: "NUMBER",               value: "0" },
          { type: "TERMINATOR",           value: "EOF"}
        ];
        expect(lexer(input)).to.deep.equal(output);
      });

    });

    describe('Switch Statements', function() {

      it('should handle multi-line switch statements', function() {
        input = String.raw`var x = 2
                var y = "";
                switch x {
                  case 1,2,3:
                    y += "positive";
                  case -1,-2,-3:
                    y += "negative";
                  case 0:
                    y += "zero";
                  default:
                    y += "dunno";
                }`;
        output = [
          { type: "DECLARATION_KEYWORD",  value: "var" },
          { type: "IDENTIFIER",           value: "x" },
          { type: "OPERATOR",             value: "=" },
          { type: "NUMBER",               value: "2" },
          { type: "TERMINATOR",           value: "\\n"},
          { type: "DECLARATION_KEYWORD",  value: "var" },
          { type: "IDENTIFIER",           value: "y" },
          { type: "OPERATOR",             value: "=" },
          { type: "STRING",               value: "" },
          { type: "PUNCTUATION",          value: ";" },
          { type: "TERMINATOR",           value: "\\n"},
          { type: "STATEMENT_KEYWORD",    value: "switch" },
          { type: "IDENTIFIER",           value: "x" },
          { type: "PUNCTUATION",          value: "{" },
          { type: "TERMINATOR",           value: "\\n"},
          { type: "STATEMENT_KEYWORD",    value: "case" },
          { type: "NUMBER",               value: "1" },
          { type: "PUNCTUATION",          value: "," },
          { type: "NUMBER",               value: "2" },
          { type: "PUNCTUATION",          value: "," },
          { type: "NUMBER",               value: "3" },
          { type: "PUNCTUATION",          value: ":" },
          { type: "TERMINATOR",           value: "\\n"},
          { type: "IDENTIFIER",           value: "y" },
          { type: "OPERATOR",             value: "+" },
          { type: "OPERATOR",             value: "=" },
          { type: "STRING",               value: "positive" },
          { type: "PUNCTUATION",          value: ";" },
          { type: "TERMINATOR",           value: "\\n"},
          { type: "STATEMENT_KEYWORD",    value: "case" },
          { type: "OPERATOR",             value: "-" },
          { type: "NUMBER",               value: "1" },
          { type: "PUNCTUATION",          value: "," },
          { type: "OPERATOR",             value: "-" },
          { type: "NUMBER",               value: "2" },
          { type: "PUNCTUATION",          value: "," },
          { type: "OPERATOR",             value: "-" },
          { type: "NUMBER",               value: "3" },
          { type: "PUNCTUATION",          value: ":" },
          { type: "TERMINATOR",           value: "\\n"},
          { type: "IDENTIFIER",           value: "y" },
          { type: "OPERATOR",             value: "+" },
          { type: "OPERATOR",             value: "=" },
          { type: "STRING",               value: "negative" },
          { type: "PUNCTUATION",          value: ";" },
          { type: "TERMINATOR",           value: "\\n"},
          { type: "STATEMENT_KEYWORD",    value: "case" },
          { type: "NUMBER",               value: "0" },
          { type: "PUNCTUATION",          value: ":" },
          { type: "TERMINATOR",           value: "\\n"},
          { type: "IDENTIFIER",           value: "y" },
          { type: "OPERATOR",             value: "+" },
          { type: "OPERATOR",             value: "=" },
          { type: "STRING",               value: "zero" },
          { type: "PUNCTUATION",          value: ";" },
          { type: "TERMINATOR",           value: "\\n"},
          { type: "STATEMENT_KEYWORD",    value: "default" },
          { type: "PUNCTUATION",          value: ":" },
          { type: "TERMINATOR",           value: "\\n"},
          { type: "IDENTIFIER",           value: "y" },
          { type: "OPERATOR",             value: "+" },
          { type: "OPERATOR",             value: "=" },
          { type: "STRING",               value: "dunno" },
          { type: "PUNCTUATION",          value: ";" },
          { type: "TERMINATOR",           value: "\\n"},
          { type: "PUNCTUATION",          value: "}" },
          { type: "TERMINATOR",           value: "EOF"},
        ];
        expect(lexer(input)).to.deep.equal(output);
      });
    });

    describe('Complex Control Flow', function () {

      it('shold handle nested if-else statements within a loop', function () {
        input = String.raw`var gameInProgress = false;
                      var score = 0;
                      var typeOfScore = "";
                      var PAT = "";
                      while gameInProgress {
                          if typeOfScore != "" {
                              if typeOfScore == "TD" {
                                  score += 6
                              } else if typeOfScore == "PAT" {
                                  if PAT == "TD" {
                                      score += 2
                                  } else {
                                      score += 1
                                  }
                              } else if typeOfScore == "FG" {
                                  score += 3
                              } else {
                                  score += 2
                              }
                              typeOfScore = ""
                          }
                      }
                      `;
        output = [
          { type: 'DECLARATION_KEYWORD',         value: 'var' },
          { type: 'IDENTIFIER',                  value: 'gameInProgress' },
          { type: 'OPERATOR',                    value: '=' },
          { type: 'BOOLEAN',                     value: 'false' },
          { type: 'PUNCTUATION',                 value: ';' },
          { type: 'TERMINATOR',                  value: '\\n' },
          { type: 'DECLARATION_KEYWORD',         value: 'var' },
          { type: 'IDENTIFIER',                  value: 'score' },
          { type: 'OPERATOR',                    value: '=' },
          { type: 'NUMBER',                      value: '0' },
          { type: 'PUNCTUATION',                 value: ';' },
          { type: 'TERMINATOR',                  value: '\\n' },
          { type: 'DECLARATION_KEYWORD',         value: 'var' },
          { type: 'IDENTIFIER',                  value: 'typeOfScore' },
          { type: 'OPERATOR',                    value: '=' },
          { type: 'STRING',                      value: '' },
          { type: 'PUNCTUATION',                 value: ';' },
          { type: 'TERMINATOR',                  value: '\\n' },
          { type: 'DECLARATION_KEYWORD',         value: 'var' },
          { type: 'IDENTIFIER',                  value: 'PAT' },
          { type: 'OPERATOR',                    value: '=' },
          { type: 'STRING',                      value: '' },
          { type: 'PUNCTUATION',                 value: ';' },
          { type: 'TERMINATOR',                  value: '\\n' },
          { type: 'STATEMENT_KEYWORD',           value: 'while' },
          { type: 'IDENTIFIER',                  value: 'gameInProgress' },
          { type: 'PUNCTUATION',                 value: '{' },
          { type: 'TERMINATOR',                  value: '\\n' },
          { type: 'STATEMENT_KEYWORD',           value: 'if' },
          { type: 'IDENTIFIER',                  value: 'typeOfScore' },
          { type: 'OPERATOR',                    value: '!' },
          { type: 'OPERATOR',                    value: '=' },
          { type: 'STRING',                      value: '' },
          { type: 'PUNCTUATION',                 value: '{' },
          { type: 'TERMINATOR',                  value: '\\n' },
          { type: 'STATEMENT_KEYWORD',           value: 'if' },
          { type: 'IDENTIFIER',                  value: 'typeOfScore' },
          { type: 'OPERATOR',                    value: '=' },
          { type: 'OPERATOR',                    value: '=' },
          { type: 'STRING',                      value: 'TD' },
          { type: 'PUNCTUATION',                 value: '{' },
          { type: 'TERMINATOR',                  value: '\\n' },
          { type: 'IDENTIFIER',                  value: 'score' },
          { type: 'OPERATOR',                    value: '+' },
          { type: 'OPERATOR',                    value: '=' },
          { type: 'NUMBER',                      value: '6' },
          { type: 'TERMINATOR',                  value: '\\n' },
          { type: 'PUNCTUATION',                 value: '}' },
          { type: 'STATEMENT_KEYWORD',           value: 'else' },
          { type: 'STATEMENT_KEYWORD',           value: 'if' },
          { type: 'IDENTIFIER',                  value: 'typeOfScore' },
          { type: 'OPERATOR',                    value: '=' },
          { type: 'OPERATOR',                    value: '=' },
          { type: 'STRING',                      value: 'PAT' },
          { type: 'PUNCTUATION',                 value: '{' },
          { type: 'TERMINATOR',                  value: '\\n' },
          { type: 'STATEMENT_KEYWORD',           value: 'if' },
          { type: 'IDENTIFIER',                  value: 'PAT' },
          { type: 'OPERATOR',                    value: '=' },
          { type: 'OPERATOR',                    value: '=' },
          { type: 'STRING',                      value: 'TD' },
          { type: 'PUNCTUATION',                 value: '{' },
          { type: 'TERMINATOR',                  value: '\\n' },
          { type: 'IDENTIFIER',                  value: 'score' },
          { type: 'OPERATOR',                    value: '+' },
          { type: 'OPERATOR',                    value: '=' },
          { type: 'NUMBER',                      value: '2' },
          { type: 'TERMINATOR',                  value: '\\n' },
          { type: 'PUNCTUATION',                 value: '}' },
          { type: 'STATEMENT_KEYWORD',           value: 'else' },
          { type: 'PUNCTUATION',                 value: '{' },
          { type: 'TERMINATOR',                  value: '\\n' },
          { type: 'IDENTIFIER',                  value: 'score' },
          { type: 'OPERATOR',                    value: '+' },
          { type: 'OPERATOR',                    value: '=' },
          { type: 'NUMBER',                      value: '1' },
          { type: 'TERMINATOR',                  value: '\\n' },
          { type: 'PUNCTUATION',                 value: '}' },
          { type: 'TERMINATOR',                  value: '\\n' },
          { type: 'PUNCTUATION',                 value: '}' },
          { type: 'STATEMENT_KEYWORD',           value: 'else' },
          { type: 'STATEMENT_KEYWORD',           value: 'if' },
          { type: 'IDENTIFIER',                  value: 'typeOfScore' },
          { type: 'OPERATOR',                    value: '=' },
          { type: 'OPERATOR',                    value: '=' },
          { type: 'STRING',                      value: 'FG' },
          { type: 'PUNCTUATION',                 value: '{' },
          { type: 'TERMINATOR',                  value: '\\n' },
          { type: 'IDENTIFIER',                  value: 'score' },
          { type: 'OPERATOR',                    value: '+' },
          { type: 'OPERATOR',                    value: '=' },
          { type: 'NUMBER',                      value: '3' },
          { type: 'TERMINATOR',                  value: '\\n' },
          { type: 'PUNCTUATION',                 value: '}' },
          { type: 'STATEMENT_KEYWORD',           value: 'else' },
          { type: 'PUNCTUATION',                 value: '{' },
          { type: 'TERMINATOR',                  value: '\\n' },
          { type: 'IDENTIFIER',                  value: 'score' },
          { type: 'OPERATOR',                    value: '+' },
          { type: 'OPERATOR',                    value: '=' },
          { type: 'NUMBER',                      value: '2' },
          { type: 'TERMINATOR',                  value: '\\n' },
          { type: 'PUNCTUATION',                 value: '}' },
          { type: 'TERMINATOR',                  value: '\\n' },
          { type: 'IDENTIFIER',                  value: 'typeOfScore' },
          { type: 'OPERATOR',                    value: '=' },
          { type: 'STRING',                      value: '' },
          { type: 'TERMINATOR',                  value: '\\n' },
          { type: 'PUNCTUATION',                 value: '}' },
          { type: 'TERMINATOR',                  value: '\\n' },
          { type: 'PUNCTUATION',                 value: '}' },
          { type: 'TERMINATOR',                  value: '\\n' },
          { type: 'TERMINATOR',                  value: 'EOF' }
        ];
        expect(lexer(input)).to.deep.equal(output);
      });

      it('should handle complex control flow with erratic spacing and inconsistent use of semicolons and parenthesis', function () {
        input = String.raw`



                    var gameInProgress = false;

                    var score = 0

                    var typeOfScore = "";
                                             var PAT = "";


                    while gameInProgress {
                        if               (typeOfScore != "")
                        {
                        if typeOfScore == "TD" {
                                score += 6
                            } else if typeOfScore == "PAT" {
                                if PAT == "TD" {

                                    score += 2;
                                } else {
                                    score += 1;


                                                                       }
                            } else if (typeOfScore == "FG") {
                                score += 3
                            }

                        else {

                                score += 2
                    }
                            typeOfScore = ""
                        }
                     }

                    `;
        output = [
          { type: 'TERMINATOR',                  value: '\\n' },
          { type: 'TERMINATOR',                  value: '\\n' },
          { type: 'TERMINATOR',                  value: '\\n' },
          { type: 'TERMINATOR',                  value: '\\n' },
          { type: 'DECLARATION_KEYWORD',         value: 'var' },
          { type: 'IDENTIFIER',                  value: 'gameInProgress' },
          { type: 'OPERATOR',                    value: '=' },
          { type: 'BOOLEAN',                     value: 'false' },
          { type: 'PUNCTUATION',                 value: ';' },
          { type: 'TERMINATOR',                  value: '\\n' },
          { type: 'TERMINATOR',                  value: '\\n' },
          { type: 'DECLARATION_KEYWORD',         value: 'var' },
          { type: 'IDENTIFIER',                  value: 'score' },
          { type: 'OPERATOR',                    value: '=' },
          { type: 'NUMBER',                      value: '0' },
          { type: 'TERMINATOR',                  value: '\\n' },
          { type: 'TERMINATOR',                  value: '\\n' },
          { type: 'DECLARATION_KEYWORD',         value: 'var' },
          { type: 'IDENTIFIER',                  value: 'typeOfScore' },
          { type: 'OPERATOR',                    value: '=' },
          { type: 'STRING',                      value: '' },
          { type: 'PUNCTUATION',                 value: ';' },
          { type: 'TERMINATOR',                  value: '\\n' },
          { type: 'DECLARATION_KEYWORD',         value: 'var' },
          { type: 'IDENTIFIER',                  value: 'PAT' },
          { type: 'OPERATOR',                    value: '=' },
          { type: 'STRING',                      value: '' },
          { type: 'PUNCTUATION',                 value: ';' },
          { type: 'TERMINATOR',                  value: '\\n' },
          { type: 'TERMINATOR',                  value: '\\n' },
          { type: 'TERMINATOR',                  value: '\\n' },
          { type: 'STATEMENT_KEYWORD',           value: 'while' },
          { type: 'IDENTIFIER',                  value: 'gameInProgress' },
          { type: 'PUNCTUATION',                 value: '{' },
          { type: 'TERMINATOR',                  value: '\\n' },
          { type: 'STATEMENT_KEYWORD',           value: 'if' },
          { type: 'PUNCTUATION',                 value: '(' },
          { type: 'IDENTIFIER',                  value: 'typeOfScore' },
          { type: 'OPERATOR',                    value: '!' },
          { type: 'OPERATOR',                    value: '=' },
          { type: 'STRING',                      value: '' },
          { type: 'PUNCTUATION',                 value: ')' },
          { type: 'TERMINATOR',                  value: '\\n' },
          { type: 'PUNCTUATION',                 value: '{' },
          { type: 'TERMINATOR',                  value: '\\n' },
          { type: 'STATEMENT_KEYWORD',           value: 'if' },
          { type: 'IDENTIFIER',                  value: 'typeOfScore' },
          { type: 'OPERATOR',                    value: '=' },
          { type: 'OPERATOR',                    value: '=' },
          { type: 'STRING',                      value: 'TD' },
          { type: 'PUNCTUATION',                 value: '{' },
          { type: 'TERMINATOR',                  value: '\\n' },
          { type: 'IDENTIFIER',                  value: 'score' },
          { type: 'OPERATOR',                    value: '+' },
          { type: 'OPERATOR',                    value: '=' },
          { type: 'NUMBER',                      value: '6' },
          { type: 'TERMINATOR',                  value: '\\n' },
          { type: 'PUNCTUATION',                 value: '}' },
          { type: 'STATEMENT_KEYWORD',           value: 'else' },
          { type: 'STATEMENT_KEYWORD',           value: 'if' },
          { type: 'IDENTIFIER',                  value: 'typeOfScore' },
          { type: 'OPERATOR',                    value: '=' },
          { type: 'OPERATOR',                    value: '=' },
          { type: 'STRING',                      value: 'PAT' },
          { type: 'PUNCTUATION',                 value: '{' },
          { type: 'TERMINATOR',                  value: '\\n' },
          { type: 'STATEMENT_KEYWORD',           value: 'if' },
          { type: 'IDENTIFIER',                  value: 'PAT' },
          { type: 'OPERATOR',                    value: '=' },
          { type: 'OPERATOR',                    value: '=' },
          { type: 'STRING',                      value: 'TD' },
          { type: 'PUNCTUATION',                 value: '{' },
          { type: 'TERMINATOR',                  value: '\\n' },
          { type: 'TERMINATOR',                  value: '\\n' },
          { type: 'IDENTIFIER',                  value: 'score' },
          { type: 'OPERATOR',                    value: '+' },
          { type: 'OPERATOR',                    value: '=' },
          { type: 'NUMBER',                      value: '2' },
          { type: 'PUNCTUATION',                 value: ';' },
          { type: 'TERMINATOR',                  value: '\\n' },
          { type: 'PUNCTUATION',                 value: '}' },
          { type: 'STATEMENT_KEYWORD',           value: 'else' },
          { type: 'PUNCTUATION',                 value: '{' },
          { type: 'TERMINATOR',                  value: '\\n' },
          { type: 'IDENTIFIER',                  value: 'score' },
          { type: 'OPERATOR',                    value: '+' },
          { type: 'OPERATOR',                    value: '=' },
          { type: 'NUMBER',                      value: '1' },
          { type: 'PUNCTUATION',                 value: ';' },
          { type: 'TERMINATOR',                  value: '\\n' },
          { type: 'TERMINATOR',                  value: '\\n' },
          { type: 'TERMINATOR',                  value: '\\n' },
          { type: 'PUNCTUATION',                 value: '}' },
          { type: 'TERMINATOR',                  value: '\\n' },
          { type: 'PUNCTUATION',                 value: '}' },
          { type: 'STATEMENT_KEYWORD',           value: 'else' },
          { type: 'STATEMENT_KEYWORD',           value: 'if' },
          { type: 'PUNCTUATION',                 value: '(' },
          { type: 'IDENTIFIER',                  value: 'typeOfScore' },
          { type: 'OPERATOR',                    value: '=' },
          { type: 'OPERATOR',                    value: '=' },
          { type: 'STRING',                      value: 'FG' },
          { type: 'PUNCTUATION',                 value: ')' },
          { type: 'PUNCTUATION',                 value: '{' },
          { type: 'TERMINATOR',                  value: '\\n' },
          { type: 'IDENTIFIER',                  value: 'score' },
          { type: 'OPERATOR',                    value: '+' },
          { type: 'OPERATOR',                    value: '=' },
          { type: 'NUMBER',                      value: '3' },
          { type: 'TERMINATOR',                  value: '\\n' },
          { type: 'PUNCTUATION',                 value: '}' },
          { type: 'TERMINATOR',                  value: '\\n' },
          { type: 'TERMINATOR',                  value: '\\n' },
          { type: 'STATEMENT_KEYWORD',           value: 'else' },
          { type: 'PUNCTUATION',                 value: '{' },
          { type: 'TERMINATOR',                  value: '\\n' },
          { type: 'TERMINATOR',                  value: '\\n' },
          { type: 'IDENTIFIER',                  value: 'score' },
          { type: 'OPERATOR',                    value: '+' },
          { type: 'OPERATOR',                    value: '=' },
          { type: 'NUMBER',                      value: '2' },
          { type: 'TERMINATOR',                  value: '\\n' },
          { type: 'PUNCTUATION',                 value: '}' },
          { type: 'TERMINATOR',                  value: '\\n' },
          { type: 'IDENTIFIER',                  value: 'typeOfScore' },
          { type: 'OPERATOR',                    value: '=' },
          { type: 'STRING',                      value: '' },
          { type: 'TERMINATOR',                  value: '\\n' },
          { type: 'PUNCTUATION',                 value: '}' },
          { type: 'TERMINATOR',                  value: '\\n' },
          { type: 'PUNCTUATION',                 value: '}' },
          { type: 'TERMINATOR',                  value: '\\n' },
          { type: 'TERMINATOR',                  value: '\\n' },
          { type: 'TERMINATOR',                  value: 'EOF' }

        ];
        expect(lexer(input)).to.deep.equal(output);
      });

    });

    describe('Third Milestone', function() {

      describe('Functions', function() {

        it('should handle function declaration and invocation with no spacing and with var in function parameters', function() {
          input = String.raw`func someFunction(var a: Int) -> Int {
                                a = a + 1;
                                return a;
                            }
                            someFunction(5);`;
          output = [
            { type: "DECLARATION_KEYWORD",  value: "func"},
            { type: "IDENTIFIER",           value: "someFunction" },
            { type: "PARAMS_START",         value: "(" },
            { type: "DECLARATION_KEYWORD",  value: "var"},
            { type: "IDENTIFIER",           value: "a" },
            { type: "PUNCTUATION",          value: ":" },
            { type: "TYPE_NUMBER",          value: "Int" },
            { type: "PARAMS_END",           value: ")" },
            { type: "RETURN_ARROW",         value: "->" },
            { type: "TYPE_NUMBER",          value: "Int" },
            { type: "STATEMENTS_START",     value: "{" },
            { type: "TERMINATOR",           value: "\\n"},
            { type: "IDENTIFIER",           value: "a" },
            { type: "OPERATOR",             value: "=" },
            { type: "IDENTIFIER",           value: "a" },
            { type: "OPERATOR",             value: "+" },
            { type: "NUMBER",               value: "1" },
            { type: "PUNCTUATION",          value: ";" },
            { type: "TERMINATOR",           value: "\\n"},
            { type: "STATEMENT_KEYWORD",    value: "return"},
            { type: "IDENTIFIER",           value: "a" },
            { type: "PUNCTUATION",          value: ";" },
            { type: "TERMINATOR",           value: "\\n"},
            { type: "STATEMENTS_END",       value: "}"},
            { type: "TERMINATOR",           value: "\\n"},
            { type: "IDENTIFIER",           value: "someFunction" },
            { type: "INVOCATION_START",     value: "(" },
            { type: "NUMBER",               value: "5" },
            { type: "INVOCATION_END",       value: ")" },
            { type: "PUNCTUATION",          value: ";" },
            { type: "TERMINATOR",           value: "EOF"}
          ]
          expect(lexer(input)).to.deep.equal(output);
        });

        it('should handle function declaration and invocation with no spacing', function() {
          input = String.raw`func someFunction(a: Int)->Int{
                                  let a = a + 1;
                                  return a
                              }
                              someFunction(5);`;
          output = [
            { type: "DECLARATION_KEYWORD",  value: "func"},
            { type: "IDENTIFIER",           value: "someFunction" },
            { type: "PARAMS_START",         value: "(" },
            { type: "IDENTIFIER",           value: "a" },
            { type: "PUNCTUATION",          value: ":" },
            { type: "TYPE_NUMBER",          value: "Int" },
            { type: "PARAMS_END",           value: ")" },
            { type: "RETURN_ARROW",         value: "->" },
            { type: "TYPE_NUMBER",          value: "Int" },
            { type: "STATEMENTS_START",     value: "{" },
            { type: "TERMINATOR",           value: "\\n"},
            { type: "DECLARATION_KEYWORD",  value: "let"},
            { type: "IDENTIFIER",           value: "a" },
            { type: "OPERATOR",             value: "=" },
            { type: "IDENTIFIER",           value: "a" },
            { type: "OPERATOR",             value: "+" },
            { type: "NUMBER",               value: "1" },
            { type: "PUNCTUATION",          value: ";" },
            { type: "TERMINATOR",           value: "\\n"},
            { type: "STATEMENT_KEYWORD",    value: "return"},
            { type: "IDENTIFIER",           value: "a" },
            { type: "TERMINATOR",           value: "\\n"},
            { type: "STATEMENTS_END",       value: "}"},
            { type: "TERMINATOR",           value: "\\n"},
            { type: "IDENTIFIER",           value: "someFunction" },
            { type: "INVOCATION_START",     value: "(" },
            { type: "NUMBER",               value: "5" },
            { type: "INVOCATION_END",       value: ")" },
            { type: "PUNCTUATION",          value: ";" },
            { type: "TERMINATOR",           value: "EOF"}
          ]
          expect(lexer(input)).to.deep.equal(output);
        });


      it('should handle function declaration and invocation with spaces between each part of the declaration', function() {
          input = String.raw`func someFunction (a: Int) -> Int {
                                  let a = a + 1;
                                  return a
                              }
                              someFunction(5);`
          output = [
            { type: "DECLARATION_KEYWORD",  value: "func"},
            { type: "IDENTIFIER",           value: "someFunction" },
            { type: "PARAMS_START",         value: "(" },
            { type: "IDENTIFIER",           value: "a" },
            { type: "PUNCTUATION",          value: ":" },
            { type: "TYPE_NUMBER",          value: "Int" },
            { type: "PARAMS_END",           value: ")" },
            { type: "RETURN_ARROW",         value: "->" },
            { type: "TYPE_NUMBER",          value: "Int" },
            { type: "STATEMENTS_START",     value: "{" },
            { type: "TERMINATOR",           value: "\\n"},
            { type: "DECLARATION_KEYWORD",  value: "let"},
            { type: "IDENTIFIER",           value: "a" },
            { type: "OPERATOR",             value: "=" },
            { type: "IDENTIFIER",           value: "a" },
            { type: "OPERATOR",             value: "+" },
            { type: "NUMBER",               value: "1" },
            { type: "PUNCTUATION",          value: ";" },
            { type: "TERMINATOR",           value: "\\n"},
            { type: "STATEMENT_KEYWORD",    value: "return"},
            { type: "IDENTIFIER",           value: "a" },
            { type: "TERMINATOR",           value: "\\n"},
            { type: "STATEMENTS_END",       value: "}"},
            { type: "TERMINATOR",           value: "\\n"},
            { type: "IDENTIFIER",           value: "someFunction" },
            { type: "INVOCATION_START",     value: "(" },
            { type: "NUMBER",               value: "5" },
            { type: "INVOCATION_END",       value: ")" },
            { type: "PUNCTUATION",          value: ";" },
            { type: "TERMINATOR",           value: "EOF"}
          ]
          expect(lexer(input)).to.deep.equal(output);
        });

        it('should handle function declaration and invocation with no space after the function name', function() {
          input = String.raw`func someFunction(a: Int) -> Int {
                                  let a = a + 1;
                                  return a
                              }
                              someFunction(5);`;
          output = [
            { type: "DECLARATION_KEYWORD",  value: "func"},
            { type: "IDENTIFIER",           value: "someFunction" },
            { type: "PARAMS_START",         value: "(" },
            { type: "IDENTIFIER",           value: "a" },
            { type: "PUNCTUATION",          value: ":" },
            { type: "TYPE_NUMBER",          value: "Int" },
            { type: "PARAMS_END",           value: ")" },
            { type: "RETURN_ARROW",         value: "->" },
            { type: "TYPE_NUMBER",          value: "Int" },
            { type: "STATEMENTS_START",     value: "{" },
            { type: "TERMINATOR",           value: "\\n"},
            { type: "DECLARATION_KEYWORD",  value: "let"},
            { type: "IDENTIFIER",           value: "a" },
            { type: "OPERATOR",             value: "=" },
            { type: "IDENTIFIER",           value: "a" },
            { type: "OPERATOR",             value: "+" },
            { type: "NUMBER",               value: "1" },
            { type: "PUNCTUATION",          value: ";" },
            { type: "TERMINATOR",           value: "\\n"},
            { type: "STATEMENT_KEYWORD",    value: "return"},
            { type: "IDENTIFIER",           value: "a" },
            { type: "TERMINATOR",           value: "\\n"},
            { type: "STATEMENTS_END",       value: "}"},
            { type: "TERMINATOR",           value: "\\n"},
            { type: "IDENTIFIER",           value: "someFunction" },
            { type: "INVOCATION_START",     value: "(" },
            { type: "NUMBER",               value: "5" },
            { type: "INVOCATION_END",       value: ")" },
            { type: "PUNCTUATION",          value: ";" },
            { type: "TERMINATOR",           value: "EOF"}
          ]
          expect(lexer(input)).to.deep.equal(output);
        });

        it('should handle function declaration and invocation with no space after the parameter declaration', function() {
          input = String.raw`func someFunction(a: Int)-> Int {
                                  let a = a + 1;
                                  return a
                              }
                              someFunction(5);`
          output = [
           { type: "DECLARATION_KEYWORD",  value: "func"},
           { type: "IDENTIFIER",           value: "someFunction" },
           { type: "PARAMS_START",         value: "(" },
           { type: "IDENTIFIER",           value: "a" },
           { type: "PUNCTUATION",          value: ":" },
           { type: "TYPE_NUMBER",          value: "Int" },
           { type: "PARAMS_END",           value: ")" },
           { type: "RETURN_ARROW",         value: "->" },
           { type: "TYPE_NUMBER",          value: "Int" },
           { type: "STATEMENTS_START",     value: "{" },
           { type: "TERMINATOR",           value: "\\n"},
           { type: "DECLARATION_KEYWORD",  value: "let"},
           { type: "IDENTIFIER",           value: "a" },
           { type: "OPERATOR",             value: "=" },
           { type: "IDENTIFIER",           value: "a" },
           { type: "OPERATOR",             value: "+" },
           { type: "NUMBER",               value: "1" },
           { type: "PUNCTUATION",          value: ";" },
           { type: "TERMINATOR",           value: "\\n"},
           { type: "STATEMENT_KEYWORD",    value: "return"},
           { type: "IDENTIFIER",           value: "a" },
           { type: "TERMINATOR",           value: "\\n"},
           { type: "STATEMENTS_END",       value: "}"},
           { type: "TERMINATOR",           value: "\\n"},
           { type: "IDENTIFIER",           value: "someFunction" },
           { type: "INVOCATION_START",     value: "(" },
           { type: "NUMBER",               value: "5" },
           { type: "INVOCATION_END",       value: ")" },
           { type: "PUNCTUATION",          value: ";" },
           { type: "TERMINATOR",           value: "EOF"}
          ]
          expect(lexer(input)).to.deep.equal(output);
        });

        it('should handle function declaration and invocation with erratic spacing', function() {
          input = String.raw`func  someFunction(a: Int)           ->  Int{
                                  let a = a +               1;
                                  return                                  a
                              }
                              someFunction           (5)       ;`;
          output = [
            { type: "DECLARATION_KEYWORD",  value: "func"},
            { type: "IDENTIFIER",           value: "someFunction" },
            { type: "PARAMS_START",         value: "(" },
            { type: "IDENTIFIER",           value: "a" },
            { type: "PUNCTUATION",          value: ":" },
            { type: "TYPE_NUMBER",          value: "Int" },
            { type: "PARAMS_END",           value: ")" },
            { type: "RETURN_ARROW",         value: "->" },
            { type: "TYPE_NUMBER",          value: "Int" },
            { type: "STATEMENTS_START",     value: "{" },
            { type: "TERMINATOR",           value: "\\n"},
            { type: "DECLARATION_KEYWORD",  value: "let"},
            { type: "IDENTIFIER",           value: "a" },
            { type: "OPERATOR",             value: "=" },
            { type: "IDENTIFIER",           value: "a" },
            { type: "OPERATOR",             value: "+" },
            { type: "NUMBER",               value: "1" },
            { type: "PUNCTUATION",          value: ";" },
            { type: "TERMINATOR",           value: "\\n"},
            { type: "STATEMENT_KEYWORD",    value: "return"},
            { type: "IDENTIFIER",           value: "a" },
            { type: "TERMINATOR",           value: "\\n"},
            { type: "STATEMENTS_END",       value: "}"},
            { type: "TERMINATOR",           value: "\\n"},
            { type: "IDENTIFIER",           value: "someFunction" },
            { type: "INVOCATION_START",     value: "(" },
            { type: "NUMBER",               value: "5" },
            { type: "INVOCATION_END",       value: ")" },
            { type: "PUNCTUATION",          value: ";" },
            { type: "TERMINATOR",           value: "EOF"}
          ]
          expect(lexer(input)).to.deep.equal(output);
        });

        it('should handle functions that return strings', function() {
          input = String.raw`func sayHelloWorld() -> String {
                                 return "hello, world"
                             }`;
          output = [
            { type: "DECLARATION_KEYWORD",  value: "func"},
            { type: "IDENTIFIER",           value: "sayHelloWorld" },
            { type: "PARAMS_START",         value: "(" },
            { type: "PARAMS_END",           value: ")" },
            { type: "RETURN_ARROW",         value: "->" },
            { type: "TYPE_STRING",          value: "String" },
            { type: "STATEMENTS_START",     value: "{" },
            { type: "TERMINATOR",           value: "\\n"},
            { type: "STATEMENT_KEYWORD",    value: "return"},
            { type: "STRING",               value: "hello, world" },
            { type: "TERMINATOR",           value: "\\n"},
            { type: "STATEMENTS_END",       value: "}"},
            { type: "TERMINATOR",           value: "EOF"}
          ]
          expect(lexer(input)).to.deep.equal(output);
        });

        it('should handle functions with an input that return strings', function() {
          input = String.raw`func sayHello(personName: String) -> String {
                                let greeting = "Hello, " + personName + "!"
                                return greeting
                            }`;
          output = [
            { type: "DECLARATION_KEYWORD",  value: "func"},
            { type: "IDENTIFIER",           value: "sayHello" },
            { type: "PARAMS_START",         value: "(" },
            { type: "IDENTIFIER",           value: "personName" },
            { type: "PUNCTUATION",          value: ":" },
            { type: "TYPE_STRING",          value: "String" },
            { type: "PARAMS_END",           value: ")" },
            { type: "RETURN_ARROW",         value: "->" },
            { type: "TYPE_STRING",          value: "String" },
            { type: "STATEMENTS_START",     value: "{" },
            { type: "TERMINATOR",           value: "\\n"},
            { type: "DECLARATION_KEYWORD",  value: "let" },
            { type: "IDENTIFIER",           value: "greeting" },
            { type: "OPERATOR",             value: "=" },
            { type: "STRING",               value: "Hello, " },
            { type: "OPERATOR",             value: "+" },
            { type: "IDENTIFIER",           value: "personName" },
            { type: "OPERATOR",             value: "+" },
            { type: "STRING",               value: "!" },
            { type: "TERMINATOR",           value: "\\n"},
            { type: "STATEMENT_KEYWORD",    value: "return"},
            { type: "IDENTIFIER",           value: "greeting" },
            { type: "TERMINATOR",           value: "\\n"},
            { type: "STATEMENTS_END",       value: "}"},
            { type: "TERMINATOR",           value: "EOF"}
          ]
          expect(lexer(input)).to.deep.equal(output);
        });

        it('should handle functions that have if else statements that use curly braces and have a return value', function() {
          input = String.raw`func sayHello(alreadyGreeted: Bool) -> String {
                                  if alreadyGreeted {
                                      return "blah"
                                  } else {
                                      return "hello"
                                  }
                              }

                              sayHello(true)`;
          output = [
            { type: "DECLARATION_KEYWORD",  value: "func"},
            { type: "IDENTIFIER",           value: "sayHello" },
            { type: "PARAMS_START",         value: "(" },
            { type: "IDENTIFIER",           value: "alreadyGreeted" },
            { type: "PUNCTUATION",          value: ":" },
            { type: "TYPE_BOOLEAN",         value: "Bool" },
            { type: "PARAMS_END",           value: ")" },
            { type: "RETURN_ARROW",         value: "->" },
            { type: "TYPE_STRING",          value: "String" },
            { type: "STATEMENTS_START",     value: "{" },
            { type: "TERMINATOR",           value: "\\n"},

            { type: "STATEMENT_KEYWORD",    value: "if" },
            { type: "IDENTIFIER",           value: "alreadyGreeted" },
            { type: "PUNCTUATION",          value: "{" },
            { type: "TERMINATOR",           value: "\\n"},

            { type: "STATEMENT_KEYWORD",    value: "return"},
            { type: "STRING",               value: "blah" },
            { type: "TERMINATOR",           value: "\\n"},

            { type: "PUNCTUATION",          value: "}" },
            { type: "STATEMENT_KEYWORD",    value: "else" },
            { type: "PUNCTUATION",          value: "{" },
            { type: "TERMINATOR",           value: "\\n"},

            { type: "STATEMENT_KEYWORD",    value: "return"},
            { type: "STRING",               value: "hello" },
            { type: "TERMINATOR",           value: "\\n"},

            { type: "PUNCTUATION",          value: "}" },
            { type: "TERMINATOR",           value: "\\n"},

            { type: "STATEMENTS_END",       value: "}" },
            { type: "TERMINATOR",           value: "\\n"},
            { type: "TERMINATOR",           value: "\\n"},

            { type: "IDENTIFIER",           value: "sayHello" },
            { type: "INVOCATION_START",     value: "(" },
            { type: "BOOLEAN",              value: "true" },
            { type: "INVOCATION_END",       value: ")" },
            { type: "TERMINATOR",           value: "EOF"}
          ]
          expect(lexer(input)).to.deep.equal(output);
        });

        it('should handle nested functions with function invocation', function() {
          input = String.raw`func sayHello(firstName: String, lastName: String) -> String {
                      func giveString() -> String {
                        return firstName + " " + lastName
                      }
                      return giveString()
                  }`;
          output = [
            { type: "DECLARATION_KEYWORD",  value: "func"},
            { type: "IDENTIFIER",           value: "sayHello" },
            { type: "PARAMS_START",         value: "(" },
            { type: "IDENTIFIER",           value: "firstName" },
            { type: "PUNCTUATION",          value: ":" },
            { type: "TYPE_STRING",          value: "String" },
            { type: "PUNCTUATION",          value: "," },
            { type: "IDENTIFIER",           value: "lastName" },
            { type: "PUNCTUATION",          value: ":" },
            { type: "TYPE_STRING",          value: "String" },
            { type: "PARAMS_END",           value: ")" },
            { type: "RETURN_ARROW",         value: "->" },
            { type: "TYPE_STRING",          value: "String" },
            { type: "STATEMENTS_START",     value: "{" },
            { type: "TERMINATOR",           value: "\\n"},

            { type: "DECLARATION_KEYWORD",  value: "func"},
            { type: "IDENTIFIER",           value: "giveString" },
            { type: "PARAMS_START",         value: "(" },
            { type: "PARAMS_END",           value: ")" },
            { type: "RETURN_ARROW",         value: "->" },
            { type: "TYPE_STRING",          value: "String" },
            { type: "STATEMENTS_START",     value: "{" },
            { type: "TERMINATOR",           value: "\\n"},

            { type: "STATEMENT_KEYWORD",    value: "return"},
            { type: "IDENTIFIER",           value: "firstName" },
            { type: "OPERATOR",             value: "+" },
            { type: "STRING",               value: " " },
            { type: "OPERATOR",             value: "+" },
            { type: "IDENTIFIER",           value: "lastName" },
            { type: "TERMINATOR",           value: "\\n"},

            { type: "STATEMENTS_END",       value: "}" },
            { type: "TERMINATOR",           value: "\\n"},

            { type: "STATEMENT_KEYWORD",    value: "return"},
            { type: "IDENTIFIER",           value: "giveString" },
            { type: "INVOCATION_START",     value: "(" },
            { type: "INVOCATION_END",       value: ")" },
            { type: "TERMINATOR",           value: "\\n"},

            { type: "STATEMENTS_END",       value: "}" },
            { type: "TERMINATOR",           value: "EOF"}
          ];
          expect(lexer(input)).to.deep.equal(output);
        });

        it('should handle functions with string interpolation', function () {
          input = String.raw`func greet(name: String, day: String) -> String {
                          return "Hello \(name), today is \(day)."
                      }
                      greet("Bob", day: "Tuesday")`;
          output = [
            { type: "DECLARATION_KEYWORD",        value: "func"},
            { type: "IDENTIFIER",                 value: "greet" },
            { type: "PARAMS_START",               value: "(" },
            { type: "IDENTIFIER",                 value: "name" },
            { type: "PUNCTUATION",                value: ":" },
            { type: "TYPE_STRING",                value: "String" },
            { type: "PUNCTUATION",                value: "," },
            { type: "IDENTIFIER",                 value: "day" },
            { type: "PUNCTUATION",                value: ":" },
            { type: "TYPE_STRING",                value: "String" },
            { type: "PARAMS_END",                 value: ")" },
            { type: "RETURN_ARROW",               value: "->" },
            { type: "TYPE_STRING",                value: "String" },
            { type: "STATEMENTS_START",           value: "{" },
            { type: "TERMINATOR",                 value: "\\n"},
            { type: "STATEMENT_KEYWORD",          value: "return"},
            { type: "STRING",                     value: "Hello " },
            { type: "STRING_INTERPOLATION_START", value: "\\(" },
            { type: "IDENTIFIER",                 value: "name" },
            { type: "STRING_INTERPOLATION_END",   value: ")" },
            { type: "STRING",                     value: ", today is " },
            { type: "STRING_INTERPOLATION_START", value: "\\(" },
            { type: "IDENTIFIER",                 value: "day" },
            { type: "STRING_INTERPOLATION_END",   value: ")" },
            { type: "STRING",                     value: "." },
            { type: "TERMINATOR",                 value: "\\n"},
            { type: "STATEMENTS_END",             value: "}" },
            { type: "TERMINATOR",                 value: "\\n"},
            { type: "IDENTIFIER",                 value: "greet" },
            { type: "INVOCATION_START",           value: "(" },
            { type: "STRING",                     value: "Bob" },
            { type: "PUNCTUATION",                value: "," },
            { type: "IDENTIFIER",                 value: "day" },
            { type: "PUNCTUATION",                value: ":" },
            { type: "STRING",                     value: "Tuesday" },
            { type: "INVOCATION_END",             value: ")" },
            { type: "TERMINATOR",                 value: "EOF"}
          ];
          expect(lexer(input)).to.deep.equal(output);
        });

        it('should handle functions with many arguments', function () {
          input = String.raw`func addSevenInts(first: Int, second: Int, third: Int, fourth: Int, fifth: Int, sixth: Int, seventh: Int) -> Int {
                            let sum = first + second + third + fourth + fifth + sixth + seventh
                            return sum
                        }
                        addSevenInts(143242134, second: 34543, third: 4, fourth: 6, fifth: 0, sixth: 56, seventh: 5)`;
          output = [
            { type: "DECLARATION_KEYWORD",        value: "func"},
            { type: "IDENTIFIER",                 value: "addSevenInts" },
            { type: "PARAMS_START",               value: "(" },
            { type: "IDENTIFIER",                 value: "first" },
            { type: "PUNCTUATION",                value: ":" },
            { type: "TYPE_NUMBER",                value: "Int" },
            { type: "PUNCTUATION",                value: "," },
            { type: "IDENTIFIER",                 value: "second" },
            { type: "PUNCTUATION",                value: ":" },
            { type: "TYPE_NUMBER",                value: "Int" },
            { type: "PUNCTUATION",                value: "," },
            { type: "IDENTIFIER",                 value: "third" },
            { type: "PUNCTUATION",                value: ":" },
            { type: "TYPE_NUMBER",                value: "Int" },
            { type: "PUNCTUATION",                value: "," },
            { type: "IDENTIFIER",                 value: "fourth" },
            { type: "PUNCTUATION",                value: ":" },
            { type: "TYPE_NUMBER",                value: "Int" },
            { type: "PUNCTUATION",                value: "," },
            { type: "IDENTIFIER",                 value: "fifth" },
            { type: "PUNCTUATION",                value: ":" },
            { type: "TYPE_NUMBER",                value: "Int" },
            { type: "PUNCTUATION",                value: "," },
            { type: "IDENTIFIER",                 value: "sixth" },
            { type: "PUNCTUATION",                value: ":" },
            { type: "TYPE_NUMBER",                value: "Int" },
            { type: "PUNCTUATION",                value: "," },
            { type: "IDENTIFIER",                 value: "seventh" },
            { type: "PUNCTUATION",                value: ":" },
            { type: "TYPE_NUMBER",                value: "Int" },
            { type: "PARAMS_END",                 value: ")" },
            { type: "RETURN_ARROW",               value: "->" },

            { type: "TYPE_NUMBER",                value: "Int" },
            { type: "STATEMENTS_START",           value: "{" },
            { type: "TERMINATOR",                 value: "\\n"},

            { type: "DECLARATION_KEYWORD",        value: "let" },
            { type: "IDENTIFIER",                 value: "sum" },
            { type: "OPERATOR",                   value: "=" },
            { type: "IDENTIFIER",                 value: "first" },
            { type: "OPERATOR",                   value: "+" },
            { type: "IDENTIFIER",                 value: "second" },
            { type: "OPERATOR",                   value: "+" },
            { type: "IDENTIFIER",                 value: "third" },
            { type: "OPERATOR",                   value: "+" },
            { type: "IDENTIFIER",                 value: "fourth" },
            { type: "OPERATOR",                   value: "+" },
            { type: "IDENTIFIER",                 value: "fifth" },
            { type: "OPERATOR",                   value: "+" },
            { type: "IDENTIFIER",                 value: "sixth" },
            { type: "OPERATOR",                   value: "+" },
            { type: "IDENTIFIER",                 value: "seventh" },
            { type: "TERMINATOR",                 value: "\\n"},

            { type: "STATEMENT_KEYWORD",          value: "return"},
            { type: "IDENTIFIER",                 value: "sum" },
            { type: "TERMINATOR",                 value: "\\n"},

            { type: "STATEMENTS_END",             value: "}" },
            { type: "TERMINATOR",                 value: "\\n"},

            { type: "IDENTIFIER",                 value: "addSevenInts" },
            { type: "INVOCATION_START",           value: "(" },
            { type: "NUMBER",                     value: "143242134" },
            { type: "PUNCTUATION",                value: "," },
            { type: "IDENTIFIER",                 value: "second" },
            { type: "PUNCTUATION",                value: ":" },
            { type: "NUMBER",                     value: "34543" },
            { type: "PUNCTUATION",                value: "," },
            { type: "IDENTIFIER",                 value: "third" },
            { type: "PUNCTUATION",                value: ":" },
            { type: "NUMBER",                     value: "4" },
            { type: "PUNCTUATION",                value: "," },
            { type: "IDENTIFIER",                 value: "fourth" },
            { type: "PUNCTUATION",                value: ":" },
            { type: "NUMBER",                     value: "6" },
            { type: "PUNCTUATION",                value: "," },
            { type: "IDENTIFIER",                 value: "fifth" },
            { type: "PUNCTUATION",                value: ":" },
            { type: "NUMBER",                     value: "0" },
            { type: "PUNCTUATION",                value: "," },
            { type: "IDENTIFIER",                 value: "sixth" },
            { type: "PUNCTUATION",                value: ":" },
            { type: "NUMBER",                     value: "56" },
            { type: "PUNCTUATION",                value: "," },
            { type: "IDENTIFIER",                 value: "seventh" },
            { type: "PUNCTUATION",                value: ":" },
            { type: "NUMBER",                     value: "5" },
            { type: "INVOCATION_END",             value: ")" },
            { type: "TERMINATOR",                 value: "EOF"}

          ];
          expect(lexer(input)).to.deep.equal(output);
        });

        it('should handle function invocations with internal parentheses', function () {
          input = String.raw`func addOne(input: Int) -> Int {
                                  return input + 1
                              }
                              addOne(((17 * 4) - 3) * 5)`;

          output = [
            { type: "DECLARATION_KEYWORD",        value: "func"},
            { type: "IDENTIFIER",                 value: "addOne" },
            { type: "PARAMS_START",               value: "(" },
            { type: "IDENTIFIER",                 value: "input" },
            { type: "PUNCTUATION",                value: ":" },
            { type: "TYPE_NUMBER",                value: "Int" },
            { type: "PARAMS_END",                 value: ")" },
            { type: "RETURN_ARROW",               value: "->" },
            { type: "TYPE_NUMBER",                value: "Int" },
            { type: "STATEMENTS_START",           value: "{" },
            { type: "TERMINATOR",                 value: "\\n"},

            { type: "STATEMENT_KEYWORD",          value: "return"},
            { type: "IDENTIFIER",                 value: "input" },
            { type: "OPERATOR",                   value: "+" },
            { type: "NUMBER",                     value: "1" },
            { type: "TERMINATOR",                 value: "\\n"},

            { type: "STATEMENTS_END",             value: "}" },
            { type: "TERMINATOR",                 value: "\\n"},

            { type: "IDENTIFIER",                 value: "addOne" },
            { type: "INVOCATION_START",           value: "(" },
            { type: "PUNCTUATION",                value: "(" },
            { type: "PUNCTUATION",                value: "(" },
            { type: "NUMBER",                     value: "17" },
            { type: "OPERATOR",                   value: "*" },
            { type: "NUMBER",                     value: "4" },
            { type: "PUNCTUATION",                value: ")" },
            { type: "OPERATOR",                   value: "-" },
            { type: "NUMBER",                     value: "3" },
            { type: "PUNCTUATION",                value: ")" },
            { type: "OPERATOR",                   value: "*" },
            { type: "NUMBER",                     value: "5" },
            { type: "INVOCATION_END",             value: ")" },
            { type: "TERMINATOR",                 value: "EOF"}
          ];
          expect(lexer(input)).to.deep.equal(output);
        });

        it('should handle functions that return tuples', function () {
          input = String.raw`func returnTuple(num: Int) -> (plusFive: Int, timesFive: Int) {
                            let plusFiveResult = num + 5
                            let timesFiveResult = num * 5
                            return (plusFiveResult, timesFiveResult)
                        }
                        returnTuple(5)`;
          output = [
            { type: "DECLARATION_KEYWORD",        value: "func"},
            { type: "IDENTIFIER",                 value: "returnTuple" },
            { type: "PARAMS_START",               value: "(" },
            { type: "IDENTIFIER",                 value: "num" },
            { type: "PUNCTUATION",                value: ":" },
            { type: "TYPE_NUMBER",                value: "Int" },
            { type: "PARAMS_END",                 value: ")" },

            { type: "RETURN_ARROW",               value: "->" },

            { type: "TUPLE_START",                value: "("},
            { type: "TUPLE_ELEMENT_NAME",               value: "plusFive" },
            { type: "PUNCTUATION",                value: ":" },
            { type: "TYPE_NUMBER",                value: "Int" },
            { type: "PUNCTUATION",                value: "," },
            { type: "TUPLE_ELEMENT_NAME",               value: "timesFive" },
            { type: "PUNCTUATION",                value: ":" },
            { type: "TYPE_NUMBER",                value: "Int" },
            { type: "TUPLE_END",                  value: ")"},
            { type: "STATEMENTS_START",           value: "{" },
            { type: "TERMINATOR",                 value: "\\n"},

            { type: "DECLARATION_KEYWORD",        value: "let" },
            { type: "IDENTIFIER",                 value: "plusFiveResult" },
            { type: "OPERATOR",                   value: "=" },
            { type: "IDENTIFIER",                 value: "num" },
            { type: "OPERATOR",                   value: "+" },
            { type: "NUMBER",                     value: "5" },
            { type: "TERMINATOR",                 value: "\\n"},

            { type: "DECLARATION_KEYWORD",        value: "let" },
            { type: "IDENTIFIER",                 value: "timesFiveResult" },
            { type: "OPERATOR",                   value: "=" },
            { type: "IDENTIFIER",                 value: "num" },
            { type: "OPERATOR",                   value: "*" },
            { type: "NUMBER",                     value: "5" },
            { type: "TERMINATOR",                 value: "\\n"},

            { type: "STATEMENT_KEYWORD",          value: "return"},
            { type: "TUPLE_START",                value: "("},
            { type: "IDENTIFIER",                 value: "plusFiveResult" },
            { type: "PUNCTUATION",                value: "," },
            { type: "IDENTIFIER",                 value: "timesFiveResult" },
            { type: "TUPLE_END",                  value: ")"},
            { type: "TERMINATOR",                 value: "\\n"},

            { type: "STATEMENTS_END",             value: "}" },
            { type: "TERMINATOR",                 value: "\\n"},

            { type: "IDENTIFIER",                 value: "returnTuple" },
            { type: "INVOCATION_START",           value: "(" },
            { type: "NUMBER",                     value: "5" },
            { type: "INVOCATION_END",             value: ")" },
            { type: "TERMINATOR",                 value: "EOF"}
          ];
          expect(lexer(input)).to.deep.equal(output);
        });

        it('should handle functions that return tuples with mixed values', function () {
          input = String.raw`func nameAndAge(name: String, age: Int) -> (name: String, age: Int) {
                            return (name, age)
                        }
                        let person = nameAndAge("Steve", age: 45)`;
          output = [
            { type: "DECLARATION_KEYWORD",        value: "func"},
            { type: "IDENTIFIER",                 value: "nameAndAge" },
            { type: "PARAMS_START",               value: "(" },
            { type: "IDENTIFIER",                 value: "name" },
            { type: "PUNCTUATION",                value: ":" },
            { type: "TYPE_STRING",                value: "String" },
            { type: "PUNCTUATION",                value: "," },
            { type: "IDENTIFIER",                 value: "age" },
            { type: "PUNCTUATION",                value: ":" },
            { type: "TYPE_NUMBER",                value: "Int" },
            { type: "PARAMS_END",                 value: ")" },

            { type: "RETURN_ARROW",               value: "->" },

            { type: "TUPLE_START",                value: "(" },
            { type: "TUPLE_ELEMENT_NAME",         value: "name" },
            { type: "PUNCTUATION",                value: ":" },
            { type: "TYPE_STRING",                value: "String" },
            { type: "PUNCTUATION",                value: "," },
            { type: "TUPLE_ELEMENT_NAME",         value: "age" },
            { type: "PUNCTUATION",                value: ":" },
            { type: "TYPE_NUMBER",                value: "Int" },
            { type: "TUPLE_END",                  value: ")" },
            { type: "STATEMENTS_START",           value: "{" },
            { type: "TERMINATOR",                 value: "\\n"},

            { type: "STATEMENT_KEYWORD",          value: "return"},
            { type: "TUPLE_START",                value: "("},
            { type: "IDENTIFIER",                 value: "name" },
            { type: "PUNCTUATION",                value: "," },
            { type: "IDENTIFIER",                 value: "age" },
            { type: "TUPLE_END",                  value: ")"},
            { type: "TERMINATOR",                 value: "\\n"},

            { type: "STATEMENTS_END",             value: "}" },
            { type: "TERMINATOR",                 value: "\\n"},

            { type: "DECLARATION_KEYWORD",        value: "let"},
            { type: "IDENTIFIER",                 value: "person" },
            { type: "OPERATOR",                   value: "=" },
            { type: "IDENTIFIER",                 value: "nameAndAge" },
            { type: "INVOCATION_START",           value: "(" },
            { type: "STRING",                     value: "Steve" },
            { type: "PUNCTUATION",                value: "," },
            { type: "IDENTIFIER",                 value: "age" },
            { type: "PUNCTUATION",                value: ":" },
            { type: "NUMBER",                     value: "45" },
            { type: "INVOCATION_END",             value: ")" },
            { type: "TERMINATOR",                 value: "EOF"}
          ];
          expect(lexer(input)).to.deep.equal(output);
        });

        it('should handle functions with for loops, if and else if statments, and native count methods', function () {
          input = String.raw`func minMax(array: [Int]) -> (min: Int, max: Int) {
                      var currentMin = array[0]
                      var currentMax = array[0]
                      for value in array[1..<array.count] {
                          if value < currentMin {
                              currentMin = value
                          } else if value > currentMax {
                              currentMax = value
                          }
                      }
                      return (currentMin, currentMax)
                  }`;
          output = [
            { type: "DECLARATION_KEYWORD",          value: "func"},
            { type: "IDENTIFIER",                   value: "minMax" },
            { type: "PARAMS_START",                 value: "(" },
            { type: "IDENTIFIER",                   value: "array" },
            { type: "PUNCTUATION",                  value: ":" },
            { type: "ARRAY_START",                  value: "["},
            { type: "TYPE_NUMBER",                  value: "Int" },
            { type: "ARRAY_END",                    value: "]"},
            { type: "PARAMS_END",                   value: ")" },
            { type: "RETURN_ARROW",                 value: "->" },
            { type: "TUPLE_START",                  value: "("},
            { type: "TUPLE_ELEMENT_NAME",           value: "min"},
            { type: "PUNCTUATION",                  value: ":" },
            { type: "TYPE_NUMBER",                  value: "Int" },
            { type: "PUNCTUATION",                  value: "," },
            { type: "TUPLE_ELEMENT_NAME",           value: "max"},
            { type: "PUNCTUATION",                  value: ":" },
            { type: "TYPE_NUMBER",                  value: "Int" },
            { type: "TUPLE_END",                    value: ")"},
            { type: "STATEMENTS_START",             value: "{" },
            { type: "TERMINATOR",                   value: "\\n"},

            { type: "DECLARATION_KEYWORD",          value: "var" },
            { type: "IDENTIFIER",                   value: "currentMin" },
            { type: "OPERATOR",                     value: "=" },
            { type: "IDENTIFIER",                   value: "array" },
            { type: "SUBSTRING_LOOKUP_START",       value: "[" },
            { type: "NUMBER",                       value: "0" },
            { type: "SUBSTRING_LOOKUP_END",         value: "]" },
            { type: "TERMINATOR",                   value: "\\n"},

            { type: "DECLARATION_KEYWORD",          value: "var" },
            { type: "IDENTIFIER",                   value: "currentMax" },
            { type: "OPERATOR",                     value: "=" },
            { type: "IDENTIFIER",                   value: "array" },
            { type: "SUBSTRING_LOOKUP_START",       value: "[" },
            { type: "NUMBER",                       value: "0" },
            { type: "SUBSTRING_LOOKUP_END",         value: "]" },
            { type: "TERMINATOR",                   value: "\\n"},

            { type: "STATEMENT_KEYWORD",            value: "for" },
            { type: "IDENTIFIER",                   value: "value" },
            { type: "STATEMENT_KEYWORD",            value: "in" },
            { type: "IDENTIFIER",                   value: "array" },
            { type: "SUBSTRING_LOOKUP_START",       value: "[" },

            { type: "NUMBER",                       value: "1" },
            { type: "HALF-OPEN_RANGE",              value: "..<" },

            { type: "IDENTIFIER",                   value: "array" },
            { type: "DOT_SYNTAX",                   value: "." },
            { type: "TYPE_PROPERTY",                value: "count" },

            { type: "SUBSTRING_LOOKUP_END",         value: "]" },
            { type: "PUNCTUATION",                  value: "{" },
            { type: "TERMINATOR",                   value: "\\n"},

            { type: "STATEMENT_KEYWORD",            value: "if" },
            { type: "IDENTIFIER",                   value: "value" },
            { type: "OPERATOR",                     value: "<" },
            { type: "IDENTIFIER",                   value: "currentMin" },
            { type: "PUNCTUATION",                  value: "{" },
            { type: "TERMINATOR",                   value: "\\n"},

            { type: "IDENTIFIER",                   value: "currentMin" },
            { type: "OPERATOR",                     value: "=" },
            { type: "IDENTIFIER",                   value: "value" },
            { type: "TERMINATOR",                   value: "\\n"},

            { type: "PUNCTUATION",                  value: "}" },
            { type: "STATEMENT_KEYWORD",            value: "else" },
            { type: "STATEMENT_KEYWORD",            value: "if" },
            { type: "IDENTIFIER",                   value: "value" },
            { type: "OPERATOR",                     value: ">" },
            { type: "IDENTIFIER",                   value: "currentMax" },
            { type: "PUNCTUATION",                  value: "{" },
            { type: "TERMINATOR",                   value: "\\n"},

            { type: "IDENTIFIER",                   value: "currentMax" },
            { type: "OPERATOR",                     value: "=" },
            { type: "IDENTIFIER",                   value: "value" },
            { type: "TERMINATOR",                   value: "\\n"},

            { type: "PUNCTUATION",                  value: "}" },
            { type: "TERMINATOR",                   value: "\\n"},

            { type: "PUNCTUATION",                  value: "}" },
            { type: "TERMINATOR",                   value: "\\n"},

            { type: "STATEMENT_KEYWORD",            value: "return"},
            { type: "TUPLE_START",                  value: "("},
            { type: "IDENTIFIER",                   value: "currentMin"},
            { type: "PUNCTUATION",                  value: "," },
            { type: "IDENTIFIER",                   value: "currentMax"},
            { type: "TUPLE_END",                    value: ")"},
            { type: "TERMINATOR",                   value: "\\n"},

            { type: "STATEMENTS_END",               value: "}" },
            { type: "TERMINATOR",                   value: "EOF"}
          ];
          expect(lexer(input)).to.deep.equal(output);
        });

        it('should handle functions with for loops and if and else if statments', function () {
          input = String.raw`func minMax(array: [Int]) -> (min: Int, max: Int) {
                      var currentMin = array[0]
                      var currentMax = array[0]
                      for value in array[1..<2] {
                          if value < currentMin {
                              currentMin = value
                          } else if value > currentMax {
                              currentMax = value
                          }
                      }
                      return (currentMin, currentMax)
                  }`;
          output = [
            { type: "DECLARATION_KEYWORD",            value: "func"},
            { type: "IDENTIFIER",                     value: "minMax" },
            { type: "PARAMS_START",                   value: "(" },
            { type: "IDENTIFIER",                     value: "array" },
            { type: "PUNCTUATION",                    value: ":" },
            { type: "ARRAY_START",                    value: "["},
            { type: "TYPE_NUMBER",                    value: "Int" },
            { type: "ARRAY_END",                      value: "]"},
            { type: "PARAMS_END",                     value: ")" },
            { type: "RETURN_ARROW",                   value: "->" },
            { type: "TUPLE_START",                    value: "("},
            { type: "TUPLE_ELEMENT_NAME",             value: "min"},
            { type: "PUNCTUATION",                    value: ":" },
            { type: "TYPE_NUMBER",                    value: "Int" },
            { type: "PUNCTUATION",                    value: "," },
            { type: "TUPLE_ELEMENT_NAME",             value: "max"},
            { type: "PUNCTUATION",                    value: ":" },
            { type: "TYPE_NUMBER",                    value: "Int" },
            { type: "TUPLE_END",                      value: ")"},
            { type: "STATEMENTS_START",               value: "{" },
            { type: "TERMINATOR",                     value: "\\n"},

            { type: "DECLARATION_KEYWORD",            value: "var" },
            { type: "IDENTIFIER",                     value: "currentMin" },
            { type: "OPERATOR",                       value: "=" },
            { type: "IDENTIFIER",                     value: "array" },
            { type: "SUBSTRING_LOOKUP_START",         value: "[" },
            { type: "NUMBER",                         value: "0" },
            { type: "SUBSTRING_LOOKUP_END",           value: "]" },
            { type: "TERMINATOR",                     value: "\\n"},

            { type: "DECLARATION_KEYWORD",            value: "var" },
            { type: "IDENTIFIER",                     value: "currentMax" },
            { type: "OPERATOR",                       value: "=" },
            { type: "IDENTIFIER",                     value: "array" },
            { type: "SUBSTRING_LOOKUP_START",         value: "[" },
            { type: "NUMBER",                         value: "0" },
            { type: "SUBSTRING_LOOKUP_END",           value: "]" },
            { type: "TERMINATOR",                     value: "\\n"},

            { type: "STATEMENT_KEYWORD",              value: "for" },
            { type: "IDENTIFIER",                     value: "value" },
            { type: "STATEMENT_KEYWORD",              value: "in" },
            { type: "IDENTIFIER",                     value: "array" },
            { type: "SUBSTRING_LOOKUP_START",         value: "[" },

            { type: "NUMBER",                         value: "1" },
            { type: "HALF-OPEN_RANGE",                value: "..<" },
            //TODO get native methods working
            { type: "NUMBER",                         value: "2" },
            // { type: "NODUCKINGCLUE",               value: "array.count" },

            { type: "SUBSTRING_LOOKUP_END",           value: "]" },
            { type: "PUNCTUATION",                    value: "{" },
            { type: "TERMINATOR",                     value: "\\n"},

            { type: "STATEMENT_KEYWORD",              value: "if" },
            { type: "IDENTIFIER",                     value: "value" },
            { type: "OPERATOR",                       value: "<" },
            { type: "IDENTIFIER",                     value: "currentMin" },
            { type: "PUNCTUATION",                    value: "{" },
            { type: "TERMINATOR",                     value: "\\n"},

            { type: "IDENTIFIER",                     value: "currentMin" },
            { type: "OPERATOR",                       value: "=" },
            { type: "IDENTIFIER",                     value: "value" },
            { type: "TERMINATOR",                     value: "\\n"},

            { type: "PUNCTUATION",                    value: "}" },
            { type: "STATEMENT_KEYWORD",              value: "else" },
            { type: "STATEMENT_KEYWORD",              value: "if" },
            { type: "IDENTIFIER",                     value: "value" },
            { type: "OPERATOR",                       value: ">" },
            { type: "IDENTIFIER",                     value: "currentMax" },
            { type: "PUNCTUATION",                    value: "{" },
            { type: "TERMINATOR",                     value: "\\n"},

            { type: "IDENTIFIER",                     value: "currentMax" },
            { type: "OPERATOR",                       value: "=" },
            { type: "IDENTIFIER",                     value: "value" },
            { type: "TERMINATOR",                     value: "\\n"},

            { type: "PUNCTUATION",                    value: "}" },
            { type: "TERMINATOR",                     value: "\\n"},

            { type: "PUNCTUATION",                    value: "}" },
            { type: "TERMINATOR",                     value: "\\n"},

            { type: "STATEMENT_KEYWORD",              value: "return"},
            { type: "TUPLE_START",                    value: "("},
            { type: "IDENTIFIER",                     value: "currentMin"},
            { type: "PUNCTUATION",                    value: "," },
            { type: "IDENTIFIER",                     value: "currentMax"},
            { type: "TUPLE_END",                      value: ")"},
            { type: "TERMINATOR",                     value: "\\n"},

            { type: "STATEMENTS_END",       value: "}" },
            { type: "TERMINATOR",           value: "EOF"}
          ];
          expect(lexer(input)).to.deep.equal(output);
        });

        it('should handle functions that have variadic parameters', function () {
          input = String.raw`func sumOf(numbers: Int...) -> Int {
                            var sum = 0
                            for number in numbers {
                                sum += number
                            }
                            return sum
                        }
                        sumOf(1,2,3)`;
          output = [
            { type: "DECLARATION_KEYWORD",        value: "func"},
            { type: "IDENTIFIER",                 value: "sumOf" },
            { type: "PARAMS_START",               value: "(" },
            { type: "IDENTIFIER",                 value: "numbers" },
            { type: "PUNCTUATION",                value: ":" },
            { type: "TYPE_NUMBER",                value: "Int" },
            { type: "VARIADIC_PARAM",             value: "..." },
            { type: "PARAMS_END",                 value: ")" },
            { type: "RETURN_ARROW",               value: "->" },
            { type: "TYPE_NUMBER",                value: "Int" },
            { type: "STATEMENTS_START",           value: "{" },
            { type: "TERMINATOR",                 value: "\\n"},

            { type: "DECLARATION_KEYWORD",        value: "var" },
            { type: "IDENTIFIER",                 value: "sum" },
            { type: "OPERATOR",                   value: "=" },
            { type: "NUMBER",                     value: "0" },
            { type: "TERMINATOR",                 value: "\\n"},

            { type: "STATEMENT_KEYWORD",          value: "for" },
            { type: "IDENTIFIER",                 value: "number" },
            { type: "STATEMENT_KEYWORD",          value: "in" },
            { type: "IDENTIFIER",                 value: "numbers" },
            { type: "PUNCTUATION",                value: "{" },
            { type: "TERMINATOR",                 value: "\\n"},

            { type: "IDENTIFIER",                 value: "sum" },
            { type: "OPERATOR",                   value: "+" },
            { type: "OPERATOR",                   value: "=" },
            { type: "IDENTIFIER",                 value: "number" },
            { type: "TERMINATOR",                 value: "\\n"},

            { type: "PUNCTUATION",                value: "}" },
            { type: "TERMINATOR",                 value: "\\n"},

            { type: "STATEMENT_KEYWORD",          value: "return"},
            { type: "IDENTIFIER",                 value: "sum" },
            { type: "TERMINATOR",                 value: "\\n"},

            { type: "STATEMENTS_END",             value: "}" },
            { type: "TERMINATOR",                 value: "\\n"},

            { type: "IDENTIFIER",                 value: "sumOf" },
            { type: "INVOCATION_START",           value: "(" },
            { type: "NUMBER",                     value: "1" },
            { type: "PUNCTUATION",                value: "," },
            { type: "NUMBER",                     value: "2" },
            { type: "PUNCTUATION",                value: "," },
            { type: "NUMBER",                     value: "3" },
            { type: "INVOCATION_END",             value: ")" },
            { type: "TERMINATOR",                 value: "EOF"}
          ];
          expect(lexer(input)).to.deep.equal(output);
        });

        it('should handle functions that return functions where the return function is specified within parentheses', function () {
          input = String.raw`func makeIncrementer() -> ((Int) -> Int) {
                                func addOne(number: Int) -> Int {
                                    return 1 + number
                                }
                                return addOne
                            }`;
          output = [
            { type: "DECLARATION_KEYWORD",        value: "func"},
            { type: "IDENTIFIER",                 value: "makeIncrementer" },
            { type: "PARAMS_START",               value: "(" },
            { type: "PARAMS_END",                 value: ")" },
            { type: "RETURN_ARROW",               value: "->" },
            { type: "PUNCTUATION",                value: "(" },
            { type: "PARAMS_START",               value: "(" },
            { type: "TYPE_NUMBER",                value: "Int" },
            { type: "PARAMS_END",                 value: ")" },
            { type: "RETURN_ARROW",               value: "->" },
            { type: "TYPE_NUMBER",                value: "Int" },
            { type: "PUNCTUATION",                value: ")" },
            { type: "STATEMENTS_START",           value: "{" },
            { type: "TERMINATOR",                 value: "\\n"},

            { type: "DECLARATION_KEYWORD",        value: "func"},
            { type: "IDENTIFIER",                 value: "addOne" },
            { type: "PARAMS_START",               value: "(" },
            { type: "IDENTIFIER",                 value: "number" },
            { type: "PUNCTUATION",                value: ":" },
            { type: "TYPE_NUMBER",                value: "Int" },
            { type: "PARAMS_END",                 value: ")" },
            { type: "RETURN_ARROW",               value: "->" },
            { type: "TYPE_NUMBER",                value: "Int" },
            { type: "STATEMENTS_START",           value: "{" },
            { type: "TERMINATOR",                 value: "\\n"},

            { type: "STATEMENT_KEYWORD",          value: "return"},
            { type: "NUMBER",                     value: "1" },
            { type: "OPERATOR",                   value: "+" },
            { type: "IDENTIFIER",                 value: "number" },
            { type: "TERMINATOR",                 value: "\\n"},
            { type: "STATEMENTS_END",             value: "}" },
            { type: "TERMINATOR",                 value: "\\n"},

            { type: "STATEMENT_KEYWORD",          value: "return"},
            { type: "IDENTIFIER",                 value: "addOne" },
            { type: "TERMINATOR",                 value: "\\n"},

            { type: "STATEMENTS_END",             value: "}" },
            { type: "TERMINATOR",                 value: "EOF"}
          ];
          expect(lexer(input)).to.deep.equal(output);
        });

        it('should handle functions that return functions where the return function is specified without parentheses', function () {
          input = String.raw`func makeIncrementer() -> (Int) -> Int {
                                func addOne(number: Int) -> Int {
                                    return 1 + number
                                }
                                return addOne
                            }`;
          output = [
            { type: "DECLARATION_KEYWORD",        value: "func"},
            { type: "IDENTIFIER",                 value: "makeIncrementer" },
            { type: "PARAMS_START",               value: "(" },
            { type: "PARAMS_END",                 value: ")" },
            { type: "RETURN_ARROW",               value: "->" },
            { type: "PARAMS_START",               value: "(" },
            { type: "TYPE_NUMBER",                value: "Int" },
            { type: "PARAMS_END",                 value: ")" },
            { type: "RETURN_ARROW",               value: "->" },
            { type: "TYPE_NUMBER",                value: "Int" },
            { type: "STATEMENTS_START",           value: "{" },
            { type: "TERMINATOR",                 value: "\\n"},

            { type: "DECLARATION_KEYWORD",        value: "func"},
            { type: "IDENTIFIER",                 value: "addOne" },
            { type: "PARAMS_START",               value: "(" },
            { type: "IDENTIFIER",                 value: "number" },
            { type: "PUNCTUATION",                value: ":" },
            { type: "TYPE_NUMBER",                value: "Int" },
            { type: "PARAMS_END",                 value: ")" },
            { type: "RETURN_ARROW",               value: "->" },
            { type: "TYPE_NUMBER",                value: "Int" },
            { type: "STATEMENTS_START",           value: "{" },
            { type: "TERMINATOR",                 value: "\\n"},

            { type: "STATEMENT_KEYWORD",          value: "return"},
            { type: "NUMBER",                     value: "1" },
            { type: "OPERATOR",                   value: "+" },
            { type: "IDENTIFIER",                 value: "number" },
            { type: "TERMINATOR",                 value: "\\n"},

            { type: "STATEMENTS_END",             value: "}" },
            { type: "TERMINATOR",                 value: "\\n"},

            { type: "STATEMENT_KEYWORD",          value: "return"},
            { type: "IDENTIFIER",                 value: "addOne" },
            { type: "TERMINATOR",                 value: "\\n"},

            { type: "STATEMENTS_END",             value: "}" },
            { type: "TERMINATOR",                 value: "EOF"}
          ];
          expect(lexer(input)).to.deep.equal(output);
        });

        xit('should handle functions that take a function specified with parentheses as an argument', function () {
          input = String.raw`func any(list: [Int], condition: ((Int) -> Bool)) -> Bool {
                                  for item in list {
                                      if condition(item) {
                                          return true
                                      }
                                  }
                                  return false
                              }`;
          output = [
            { type: "DECLARATION_KEYWORD",        value: "func"},
            { type: "IDENTIFIER",                 value: "any" },
            { type: "PARAMS_START",               value: "(" },
            { type: "IDENTIFIER",                 value: "list" },
            { type: "PUNCTUATION",                value: ":" },
            { type: "ARRAY_START",                value: "["},
            { type: "TYPE_NUMBER",                value: "Int" },
            { type: "ARRAY_END",                  value: "]"},
            { type: "PUNCTUATION",                value: "," },
            { type: "IDENTIFIER",                 value: "condition" },
            { type: "PUNCTUATION",                value: ":" },
            { type: "PUNCTUATION",                value: "(" },
            { type: "PARAMS_START",               value: "(" },
            { type: "TYPE_NUMBER",                value: "Int" },
            { type: "PARAMS_END",                 value: ")" },
            { type: "RETURN_ARROW",               value: "->" },
            { type: "TYPE_BOOLEAN",               value: "Bool" },
            { type: "PUNCTUATION",                value: ")" },
            { type: "PARAMS_END",                 value: ")" },
            { type: "RETURN_ARROW",               value: "->" },
            { type: "TYPE_BOOLEAN",               value: "Bool" },
            { type: "STATEMENTS_START",           value: "{" },
            { type: "TERMINATOR",                 value: "\\n"},

            { type: "STATEMENT_KEYWORD",          value: "for" },
            { type: "IDENTIFIER",                 value: "item" },
            { type: "STATEMENT_KEYWORD",          value: "in" },
            { type: "IDENTIFIER",                 value: "list" },
            { type: "PUNCTUATION",                value: "{" },
            { type: "TERMINATOR",                 value: "\\n"},

            { type: "STATEMENT_KEYWORD",          value: "if" },
            { type: "IDENTIFIER",                 value: "condition" },
            { type: "INVOCATION_START",           value: "(" },
            { type: "IDENTIFIER",                 value: "item" },
            { type: "INVOCATION_END",             value: ")" },
            { type: "PUNCTUATION",                value: "{" },
            { type: "TERMINATOR",                 value: "\\n"},

            { type: "STATEMENT_KEYWORD",          value: "return"},
            { type: "BOOLEAN",                    value: "true" },
            { type: "TERMINATOR",                 value: "\\n"},

            { type: "PUNCTUATION",                value: "}" },
            { type: "TERMINATOR",                 value: "\\n"},

            { type: "PUNCTUATION",                value: "}" },
            { type: "TERMINATOR",                 value: "\\n"},

            { type: "STATEMENT_KEYWORD",          value: "return"},
            { type: "BOOLEAN",                    value: "false" },
            { type: "TERMINATOR",                 value: "\\n"},

            { type: "STATEMENTS_END",             value: "}" },
            { type: "TERMINATOR",                 value: "EOF"}
          ];
          expect(lexer(input)).to.deep.equal(output);
        });

        it('should handle functions that take a function specified without parentheses as an argument', function () {
          input = String.raw`func any(list: [Int], condition: (Int) -> Bool) -> Bool {
                                  for item in list {
                                      if condition(item) {
                                          return true
                                      }
                                  }
                                  return false
                              }`;
          output = [
            { type: "DECLARATION_KEYWORD",        value: "func"},
            { type: "IDENTIFIER",                 value: "any" },
            { type: "PARAMS_START",               value: "(" },
            { type: "IDENTIFIER",                 value: "list" },
            { type: "PUNCTUATION",                value: ":" },
            { type: "ARRAY_START",                value: "["},
            { type: "TYPE_NUMBER",                value: "Int" },
            { type: "ARRAY_END",                  value: "]"},
            { type: "PUNCTUATION",                value: "," },
            { type: "IDENTIFIER",                 value: "condition" },
            { type: "PUNCTUATION",                value: ":" },
            { type: "PARAMS_START",               value: "(" },
            { type: "TYPE_NUMBER",                value: "Int" },
            { type: "PARAMS_END",                 value: ")" },
            { type: "RETURN_ARROW",               value: "->" },
            { type: "TYPE_BOOLEAN",               value: "Bool" },
            { type: "PARAMS_END",                 value: ")" },
            { type: "RETURN_ARROW",               value: "->" },
            { type: "TYPE_BOOLEAN",               value: "Bool" },
            { type: "STATEMENTS_START",           value: "{" },
            { type: "TERMINATOR",                 value: "\\n"},

            { type: "STATEMENT_KEYWORD",          value: "for" },
            { type: "IDENTIFIER",                 value: "item" },
            { type: "STATEMENT_KEYWORD",          value: "in" },
            { type: "IDENTIFIER",                 value: "list" },
            { type: "PUNCTUATION",                value: "{" },
            { type: "TERMINATOR",                 value: "\\n"},

            { type: "STATEMENT_KEYWORD",          value: "if" },
            { type: "IDENTIFIER",                 value: "condition" },
            { type: "INVOCATION_START",           value: "(" },
            { type: "IDENTIFIER",                 value: "item" },
            { type: "INVOCATION_END",             value: ")" },
            { type: "PUNCTUATION",                value: "{" },
            { type: "TERMINATOR",                 value: "\\n"},

            { type: "STATEMENT_KEYWORD",          value: "return"},
            { type: "BOOLEAN",                    value: "true" },
            { type: "TERMINATOR",                 value: "\\n"},

            { type: "PUNCTUATION",                value: "}" },
            { type: "TERMINATOR",                 value: "\\n"},

            { type: "PUNCTUATION",                value: "}" },
            { type: "TERMINATOR",                 value: "\\n"},

            { type: "STATEMENT_KEYWORD",          value: "return"},
            { type: "BOOLEAN",                    value: "false" },
            { type: "TERMINATOR",                 value: "\\n"},

            { type: "STATEMENTS_END",             value: "}" },
            { type: "TERMINATOR",                 value: "EOF"}
          ];
          expect(lexer(input)).to.deep.equal(output);
        });

        xit('should handle functions whose invocation contains string interpolation that contains a function invocation', function () {
          input = String.raw`func returnWorld() -> String {
                                  return "World"
                              }
                              func printInput(input: String) {
                                  print(input)
                              }
                              printInput("Hello, \(returnWorld())!")`;
          output = [

          ];
          expect(lexer(input)).to.deep.equal(output);
        });

      });

    });

    describe('Classes and Stuctures', function () {

      it('should handle basic definitions of classes and structs', function () {
        input = String.raw`class VideoMode {
                              var interlaced = false
                              var frameRate = 0.0
                          }
                          struct Resolution {
                              var width = 0
                              var height = 0
                          }`;
        output = [
          { type: "DECLARATION_KEYWORD",        value: "class" },
          { type: "IDENTIFIER",                 value: "VideoMode" },
          { type: "CLASS_DEFINITION_START",     value: "{" },
          { type: "TERMINATOR",                 value: "\\n"},

          { type: "DECLARATION_KEYWORD",        value: "var" },
          { type: "IDENTIFIER",                 value: "interlaced" },
          { type: "OPERATOR",                   value: "=" },
          { type: "BOOLEAN",                    value: "false" },
          { type: "TERMINATOR",                 value: "\\n"},

          { type: "DECLARATION_KEYWORD",        value: "var" },
          { type: "IDENTIFIER",                 value: "frameRate" },
          { type: "OPERATOR",                   value: "=" },
          { type: "NUMBER",                     value: "0.0" },
          { type: "TERMINATOR",                 value: "\\n"},

          { type: "CLASS_DEFINITION_END",       value: "}" },
          { type: "TERMINATOR",                 value: "\\n"},

          { type: "DECLARATION_KEYWORD",        value: "struct" },
          { type: "IDENTIFIER",                 value: "Resolution" },
          { type: "STRUCT_DEFINITION_START",    value: "{" },
          { type: "TERMINATOR",                 value: "\\n"},

          { type: "DECLARATION_KEYWORD",        value: "var" },
          { type: "IDENTIFIER",                 value: "width" },
          { type: "OPERATOR",                   value: "=" },
          { type: "NUMBER",                     value: "0" },
          { type: "TERMINATOR",                 value: "\\n"},

          { type: "DECLARATION_KEYWORD",        value: "var" },
          { type: "IDENTIFIER",                 value: "height" },
          { type: "OPERATOR",                   value: "=" },
          { type: "NUMBER",                     value: "0" },
          { type: "TERMINATOR",                 value: "\\n"},

          { type: "STRUCT_DEFINITION_END",      value: "}" },
          { type: "TERMINATOR",                 value: "EOF"}
        ];
        expect(lexer(input)).to.deep.equal(output);
      });

      it('should handle basic initialization of classes and structs', function () {
        input = String.raw`class VideoMode {
                       var interlaced = false
                       var frameRate = 0.0
                    }
                    struct Resolution {
                        var width = 0
                        var height = 0
                    }

                    let someVideoMode = VideoMode()
                    let someResolution = Resolution();`;
        output = [
          { type: "DECLARATION_KEYWORD",        value: "class" },
          { type: "IDENTIFIER",                 value: "VideoMode" },
          { type: "CLASS_DEFINITION_START",     value: "{" },
          { type: "TERMINATOR",                 value: "\\n"},

          { type: "DECLARATION_KEYWORD",        value: "var" },
          { type: "IDENTIFIER",                 value: "interlaced" },
          { type: "OPERATOR",                   value: "=" },
          { type: "BOOLEAN",                    value: "false" },
          { type: "TERMINATOR",                 value: "\\n"},

          { type: "DECLARATION_KEYWORD",        value: "var" },
          { type: "IDENTIFIER",                 value: "frameRate" },
          { type: "OPERATOR",                   value: "=" },
          { type: "NUMBER",                     value: "0.0" },
          { type: "TERMINATOR",                 value: "\\n"},

          { type: "CLASS_DEFINITION_END",       value: "}" },
          { type: "TERMINATOR",                 value: "\\n"},

          { type: "DECLARATION_KEYWORD",        value: "struct" },
          { type: "IDENTIFIER",                 value: "Resolution" },
          { type: "STRUCT_DEFINITION_START",    value: "{" },
          { type: "TERMINATOR",                 value: "\\n"},

          { type: "DECLARATION_KEYWORD",        value: "var" },
          { type: "IDENTIFIER",                 value: "width" },
          { type: "OPERATOR",                   value: "=" },
          { type: "NUMBER",                     value: "0" },
          { type: "TERMINATOR",                 value: "\\n"},

          { type: "DECLARATION_KEYWORD",        value: "var" },
          { type: "IDENTIFIER",                 value: "height" },
          { type: "OPERATOR",                   value: "=" },
          { type: "NUMBER",                     value: "0" },
          { type: "TERMINATOR",                 value: "\\n"},

          { type: "STRUCT_DEFINITION_END",      value: "}" },
          { type: "TERMINATOR",                 value: "\\n"},
          { type: "TERMINATOR",                 value: "\\n"},

          { type: "DECLARATION_KEYWORD",        value: "let" },
          { type: "IDENTIFIER",                 value: "someVideoMode" },
          { type: "OPERATOR",                   value: "=" },
          { type: "IDENTIFIER",                 value: "VideoMode" },
          { type: "INITIALIZATION_START",       value: "(" },
          { type: "INITIALIZATION_END",         value: ")" },
          { type: "TERMINATOR",                 value: "\\n"},

          { type: "DECLARATION_KEYWORD",        value: "let" },
          { type: "IDENTIFIER",                 value: "someResolution" },
          { type: "OPERATOR",                   value: "=" },
          { type: "IDENTIFIER",                 value: "Resolution" },
          { type: "INITIALIZATION_START",       value: "(" },
          { type: "INITIALIZATION_END",         value: ")" },
          { type: "PUNCTUATION",                value: ";" },
          { type: "TERMINATOR",                 value: "EOF"}
        ];
        expect(lexer(input)).to.deep.equal(output);
      });

      it('should handle basic property access via dot notation', function () {
        input = String.raw`class VideoMode {
                               var interlaced = false
                               var frameRate = 0.0
                            }
                            struct Resolution {
                                var width = 0
                                var height = 0
                            }

                            let someVideoMode = VideoMode()
                            let someResolution = Resolution();

                            let someFrameRate = someVideoMode.frameRate;
                            let someWidth = someResolution.width`;
        output = [
          { type: "DECLARATION_KEYWORD",        value: "class" },
          { type: "IDENTIFIER",                 value: "VideoMode" },
          { type: "CLASS_DEFINITION_START",     value: "{" },
          { type: "TERMINATOR",                 value: "\\n"},

          { type: "DECLARATION_KEYWORD",        value: "var" },
          { type: "IDENTIFIER",                 value: "interlaced" },
          { type: "OPERATOR",                   value: "=" },
          { type: "BOOLEAN",                    value: "false" },
          { type: "TERMINATOR",                 value: "\\n"},

          { type: "DECLARATION_KEYWORD",        value: "var" },
          { type: "IDENTIFIER",                 value: "frameRate" },
          { type: "OPERATOR",                   value: "=" },
          { type: "NUMBER",                     value: "0.0" },
          { type: "TERMINATOR",                 value: "\\n"},

          { type: "CLASS_DEFINITION_END",       value: "}" },
          { type: "TERMINATOR",                 value: "\\n"},

          { type: "DECLARATION_KEYWORD",        value: "struct" },
          { type: "IDENTIFIER",                 value: "Resolution" },
          { type: "STRUCT_DEFINITION_START",    value: "{" },
          { type: "TERMINATOR",                 value: "\\n"},

          { type: "DECLARATION_KEYWORD",        value: "var" },
          { type: "IDENTIFIER",                 value: "width" },
          { type: "OPERATOR",                   value: "=" },
          { type: "NUMBER",                     value: "0" },
          { type: "TERMINATOR",                 value: "\\n"},

          { type: "DECLARATION_KEYWORD",        value: "var" },
          { type: "IDENTIFIER",                 value: "height" },
          { type: "OPERATOR",                   value: "=" },
          { type: "NUMBER",                     value: "0" },
          { type: "TERMINATOR",                 value: "\\n"},

          { type: "STRUCT_DEFINITION_END",      value: "}" },
          { type: "TERMINATOR",                 value: "\\n"},
          { type: "TERMINATOR",                 value: "\\n"},

          { type: "DECLARATION_KEYWORD",        value: "let" },
          { type: "IDENTIFIER",                 value: "someVideoMode" },
          { type: "OPERATOR",                   value: "=" },
          { type: "IDENTIFIER",                 value: "VideoMode" },
          { type: "INITIALIZATION_START",        value: "(" },
          { type: "INITIALIZATION_END",          value: ")" },
          { type: "TERMINATOR",                 value: "\\n"},

          { type: "DECLARATION_KEYWORD",        value: "let" },
          { type: "IDENTIFIER",                 value: "someResolution" },
          { type: "OPERATOR",                   value: "=" },
          { type: "IDENTIFIER",                 value: "Resolution" },
          { type: "INITIALIZATION_START",       value: "(" },
          { type: "INITIALIZATION_END",         value: ")" },
          { type: "PUNCTUATION",                value: ";" },
          { type: "TERMINATOR",                 value: "\\n"},
          { type: "TERMINATOR",                 value: "\\n"},

          { type: "DECLARATION_KEYWORD",        value: "let" },
          { type: "IDENTIFIER",                 value: "someFrameRate" },
          { type: "OPERATOR",                   value: "=" },
          { type: "IDENTIFIER",                 value: "someVideoMode" },
          { type: "DOT_SYNTAX",                 value: "." },
          { type: "IDENTIFIER",                 value: "frameRate" },
          { type: "PUNCTUATION",                value: ";" },
          { type: "TERMINATOR",                 value: "\\n"},

          { type: "DECLARATION_KEYWORD",        value: "let" },
          { type: "IDENTIFIER",                 value: "someWidth" },
          { type: "OPERATOR",                   value: "=" },
          { type: "IDENTIFIER",                 value: "someResolution" },
          { type: "DOT_SYNTAX",                 value: "." },
          { type: "IDENTIFIER",                 value: "width" },
          { type: "TERMINATOR",                 value: "EOF"}
        ];
        expect(lexer(input)).to.deep.equal(output);
      });

      it('should handle basic memberwise initialization', function () {
        input = String.raw`struct Resolution {
                              var width = 0
                              var height = 0
                          }

                          let someResolution = Resolution(width: 640, height: 480)`;
        output = [
          { type: "DECLARATION_KEYWORD",        value: "struct" },
          { type: "IDENTIFIER",                 value: "Resolution" },
          { type: "STRUCT_DEFINITION_START",    value: "{" },
          { type: "TERMINATOR",                 value: "\\n"},

          { type: "DECLARATION_KEYWORD",        value: "var" },
          { type: "IDENTIFIER",                 value: "width" },
          { type: "OPERATOR",                   value: "=" },
          { type: "NUMBER",                     value: "0" },
          { type: "TERMINATOR",                 value: "\\n"},

          { type: "DECLARATION_KEYWORD",        value: "var" },
          { type: "IDENTIFIER",                 value: "height" },
          { type: "OPERATOR",                   value: "=" },
          { type: "NUMBER",                     value: "0" },
          { type: "TERMINATOR",                 value: "\\n"},

          { type: "STRUCT_DEFINITION_END",      value: "}" },
          { type: "TERMINATOR",                 value: "\\n"},
          { type: "TERMINATOR",                 value: "\\n"},

          { type: "DECLARATION_KEYWORD",        value: "let" },
          { type: "IDENTIFIER",                 value: "someResolution" },
          { type: "OPERATOR",                   value: "=" },
          { type: "IDENTIFIER",                 value: "Resolution" },
          { type: "INITIALIZATION_START",       value: "(" },
          { type: "IDENTIFIER",                 value: "width" },
          { type: "PUNCTUATION",                value: ":" },
          { type: "NUMBER",                     value: "640" },
          { type: "PUNCTUATION",                value: "," },
          { type: "IDENTIFIER",                 value: "height" },
          { type: "PUNCTUATION",                value: ":" },
          { type: "NUMBER",                     value: "480" },
          { type: "INITIALIZATION_END",         value: ")" },
          { type: "TERMINATOR",                 value: "EOF"}
        ];
        expect(lexer(input)).to.deep.equal(output);
      });

      it('should handle complex memberwise initialization with internal parentheses', function () {
        input = String.raw`var resolutionHeight = 480
                            struct Resolution {
                                var width = 0
                                var height = 0
                            }

                            let someResolution = Resolution(width: ((50 * 2) * 6) + 40, height: resolutionHeight)`;
        output = [
          { type: "DECLARATION_KEYWORD",        value: "var" },
          { type: "IDENTIFIER",                 value: "resolutionHeight" },
          { type: "OPERATOR",                   value: "=" },
          { type: "NUMBER",                     value: "480" },
          { type: "TERMINATOR",                 value: "\\n"},

          { type: "DECLARATION_KEYWORD",        value: "struct" },
          { type: "IDENTIFIER",                 value: "Resolution" },
          { type: "STRUCT_DEFINITION_START",    value: "{" },
          { type: "TERMINATOR",                 value: "\\n"},

          { type: "DECLARATION_KEYWORD",        value: "var" },
          { type: "IDENTIFIER",                 value: "width" },
          { type: "OPERATOR",                   value: "=" },
          { type: "NUMBER",                     value: "0" },
          { type: "TERMINATOR",                 value: "\\n"},

          { type: "DECLARATION_KEYWORD",        value: "var" },
          { type: "IDENTIFIER",                 value: "height" },
          { type: "OPERATOR",                   value: "=" },
          { type: "NUMBER",                     value: "0" },
          { type: "TERMINATOR",                 value: "\\n"},

          { type: "STRUCT_DEFINITION_END",      value: "}" },
          { type: "TERMINATOR",                 value: "\\n"},
          { type: "TERMINATOR",                 value: "\\n"},

          { type: "DECLARATION_KEYWORD",        value: "let" },
          { type: "IDENTIFIER",                 value: "someResolution" },
          { type: "OPERATOR",                   value: "=" },
          { type: "IDENTIFIER",                 value: "Resolution" },
          { type: "INITIALIZATION_START",       value: "(" },
          { type: "IDENTIFIER",                 value: "width" },
          { type: "PUNCTUATION",                value: ":" },

          { type: "PUNCTUATION",                value: "(" },
          { type: "PUNCTUATION",                value: "(" },
          { type: "NUMBER",                     value: "50" },
          { type: "OPERATOR",                   value: "*" },
          { type: "NUMBER",                     value: "2" },
          { type: "PUNCTUATION",                value: ")" },
          { type: "OPERATOR",                   value: "*" },
          { type: "NUMBER",                     value: "6" },
          { type: "PUNCTUATION",                value: ")" },
          { type: "OPERATOR",                   value: "+" },
          { type: "NUMBER",                     value: "40" },

          { type: "PUNCTUATION",                value: "," },
          { type: "IDENTIFIER",                 value: "height" },
          { type: "PUNCTUATION",                value: ":" },
          { type: "IDENTIFIER",                 value: "resolutionHeight" },
          { type: "INITIALIZATION_END",         value: ")" },
          { type: "TERMINATOR",                 value: "EOF"}
        ];
        expect(lexer(input)).to.deep.equal(output);
      });

      xit('should handle complex memberwise initialization with string interpolation that contains a function invocation', function () {
        input = String.raw`struct Greeting {
                              var greeting = ""
                          }
                          func returnWorld() -> String {
                              return "World"
                          }
                          var helloWorld = Greeting(greeting: "Hello, \(returnWorld())!")`;
        output = [

        ];
        expect(lexer(input)).to.deep.equal(output);
      });

      it('should handle variable and constant stored properties', function () {
        input = String.raw`struct FixedLengthRange {
                                var firstValue: Int
                                let length: Int
                            }

                            let rangeOfOneHundred = FixedLengthRange(firstValue: 1, length: 100)`;
        output = [
          { type: "DECLARATION_KEYWORD",        value: "struct" },
          { type: "IDENTIFIER",                 value: "FixedLengthRange" },
          { type: "STRUCT_DEFINITION_START",    value: "{" },
          { type: "TERMINATOR",                 value: "\\n"},

          { type: "DECLARATION_KEYWORD",        value: "var" },
          { type: "IDENTIFIER",                 value: "firstValue" },
          { type: "PUNCTUATION",                value: ":" },
          { type: "TYPE_NUMBER",                value: "Int"},
          { type: "TERMINATOR",                 value: "\\n"},

          { type: "DECLARATION_KEYWORD",        value: "let" },
          { type: "IDENTIFIER",                 value: "length" },
          { type: "PUNCTUATION",                value: ":" },
          { type: "TYPE_NUMBER",                value: "Int"},
          { type: "TERMINATOR",                 value: "\\n"},

          { type: "STRUCT_DEFINITION_END",      value: "}" },
          { type: "TERMINATOR",                 value: "\\n"},
          { type: "TERMINATOR",                 value: "\\n"},

          { type: "DECLARATION_KEYWORD",        value: "let" },
          { type: "IDENTIFIER",                 value: "rangeOfOneHundred" },
          { type: "OPERATOR",                   value: "=" },
          { type: "IDENTIFIER",                 value: "FixedLengthRange" },
          { type: "INITIALIZATION_START",       value: "(" },
          { type: "IDENTIFIER",                 value: "firstValue" },
          { type: "PUNCTUATION",                value: ":" },
          { type: "NUMBER",                     value: "1" },
          { type: "PUNCTUATION",                value: "," },
          { type: "IDENTIFIER",                 value: "length" },
          { type: "PUNCTUATION",                value: ":" },
          { type: "NUMBER",                     value: "100" },
          { type: "INITIALIZATION_END",         value: ")" },
          { type: "TERMINATOR",                 value: "EOF"}
        ];
        expect(lexer(input)).to.deep.equal(output);
      });

      xit('should handle properties of all kinds', function () {
        input = String.raw`class Medley {
                        var a = 1
                        var b = "hai, world"
                        let c = true
                        /* Comment 1

                        */ var d = 1 // Comment 2
                        var e = ["Eggs", "Milk", "Bacon"];
                        var f = ["one": 1, "two": 2, "three": 3]
                        let http200Status = (statusCode: 200, description: "OK")
                        var g = 5 + 6 / 4 - (-16 % 4.2) * 55
                        let h = 6 != 9
                        var i = "Stephen" + " " + "Tabor" + "!"
                    }`;
        output = [
          { type: "DECLARATION_KEYWORD",        value: "class" },
          { type: "IDENTIFIER",                 value: "Medley" },
          { type: "CLASS_DEFINITION_START",     value: "{" },
          { type: "TERMINATOR",                 value: "\\n"},

          { type: "DECLARATION_KEYWORD",        value: "var" },
          { type: "IDENTIFIER",                 value: "a" },
          { type: "OPERATOR",                   value: "=" },
          { type: "NUMBER",                     value: "1" },
          { type: "TERMINATOR",                 value: "\\n"},

          { type: "DECLARATION_KEYWORD",        value: "var" },
          { type: "IDENTIFIER",                 value: "b" },
          { type: "OPERATOR",                   value: "=" },
          { type: "STRING",                     value: "hai, world" },
          { type: "TERMINATOR",                 value: "\\n"},

          { type: "DECLARATION_KEYWORD",        value: "let" },
          { type: "IDENTIFIER",                 value: "c" },
          { type: "OPERATOR",                   value: "=" },
          { type: "BOOLEAN",                    value: "true" },
          { type: "TERMINATOR",                 value: "\\n"},

          { type: "MULTI_LINE_COMMENT_START",   value: "/*"},
          { type: "COMMENT",                    value: " Comment 1 "},
          { type: "TERMINATOR",                 value: "\\n"},
          { type: "TERMINATOR",                 value: "\\n"},
          { type: "MULTI_LINE_COMMENT_END",     value: "*/"},
          { type: "DECLARATION_KEYWORD",        value: "var" },
          { type: "IDENTIFIER",                 value: "d" },
          { type: "OPERATOR",                   value: "=" },
          { type: "NUMBER",                     value: "1" },
          { type: "COMMENT_START",              value: "//"},
          { type: "COMMENT",                    value: " Comment 2"},
          { type: "TERMINATOR",                 value: "\\n"},

          { type: "DECLARATION_KEYWORD",        value: "var" },
          { type: "IDENTIFIER",                 value: "e" },
          { type: "OPERATOR",                   value: "=" },
          { type: "ARRAY_START",                value: "[" },
          { type: "STRING",                     value: "Eggs" },
          { type: "PUNCTUATION",                value: "," },
          { type: "STRING",                     value: "Milk" },
          { type: "PUNCTUATION",                value: "," },
          { type: "STRING",                     value: "Bacon" },
          { type: "ARRAY_END",                  value: "]" },
          { type: "PUNCTUATION",                value: ";" },
          { type: "TERMINATOR",                 value: "\\n"},

          { type: "DECLARATION_KEYWORD",        value: "var" },
          { type: "IDENTIFIER",                 value: "f" },
          { type: "OPERATOR",                   value: "=" },
          { type: "DICTIONARY_START",           value: "[" },
          { type: "STRING",                     value: "one" },
          { type: "PUNCTUATION",                value: ":" },
          { type: "NUMBER",                     value: "1" },
          { type: "PUNCTUATION",                value: "," },
          { type: "STRING",                     value: "two" },
          { type: "PUNCTUATION",                value: ":" },
          { type: "NUMBER",                     value: "2" },
          { type: "PUNCTUATION",                value: "," },
          { type: "STRING",                     value: "three" },
          { type: "PUNCTUATION",                value: ":" },
          { type: "NUMBER",                     value: "3" },
          { type: "DICTIONARY_END",             value: "]" },
          { type: "TERMINATOR",                 value: "\\n"},

          { type: "DECLARATION_KEYWORD",        value: "let" },
          { type: "IDENTIFIER",                 value: "http200Status" },
          { type: "OPERATOR",                   value: "=" },
          { type: "TUPLE_START",                value: "("},
          { type: "TUPLE_ELEMENT_NAME",         value: "statusCode"},
          { type: "PUNCTUATION",                value: ":" },
          { type: "NUMBER",                     value: "200"},
          { type: "PUNCTUATION",                value: "," },
          { type: "TUPLE_ELEMENT_NAME",         value: "description"},
          { type: "PUNCTUATION",                value: ":" },
          { type: "STRING",                     value: "OK"},
          { type: "TUPLE_END",                  value: ")"},
          { type: "TERMINATOR",                 value: "\\n"},

          { type: "DECLARATION_KEYWORD",        value: "var" },
          { type: "IDENTIFIER",                 value: "g" },
          { type: "OPERATOR",                   value: "=" },
          { type: "NUMBER",                     value: "5" },
          { type: "OPERATOR",                   value: "+" },
          { type: "NUMBER",                     value: "6" },
          { type: "OPERATOR",                   value: "/" },
          { type: "NUMBER",                     value: "4" },
          { type: "OPERATOR",                   value: "-" },
          { type: "PUNCTUATION",                value: "(" },
          { type: "OPERATOR",                   value: "-" },
          { type: "NUMBER",                     value: "16" },
          { type: "OPERATOR",                   value: "%" },
          { type: "NUMBER",                     value: "4.2" },
          { type: "PUNCTUATION",                value: ")" },
          { type: "OPERATOR",                   value: "*" },
          { type: "NUMBER",                     value: "55" },
          { type: "TERMINATOR",                 value: "\\n"},

          { type: "DECLARATION_KEYWORD",        value: "let" },
          { type: "IDENTIFIER",                 value: "h" },
          { type: "OPERATOR",                   value: "=" },
          { type: "NUMBER",                     value: "6" },
          { type: "OPERATOR",                   value: "!" },
          { type: "OPERATOR",                   value: "=" },
          { type: "NUMBER",                     value: "9" },
          { type: "TERMINATOR",                 value: "\\n"},

          { type: "DECLARATION_KEYWORD",        value: "var" },
          { type: "IDENTIFIER",                 value: "i" },
          { type: "OPERATOR",                   value: "=" },
          { type: "STRING",                     value: "Stephen" },
          { type: "OPERATOR",                   value: "+" },
          { type: "STRING",                     value: " " },
          { type: "OPERATOR",                   value: "+" },
          { type: "STRING",                     value: "Tabor" },
          { type: "OPERATOR",                   value: "+" },
          { type: "STRING",                     value: "!" },
          { type: "TERMINATOR",                 value: "\\n"},

          { type: "CLASS_DEFINITION_END",       value: "}" },
          { type: "TERMINATOR",                 value: "EOF"}
        ];
        expect(lexer(input)).to.deep.equal(output);
      });

      it('should handle basic class instance method definitions, and their invocation', function () {
        input = String.raw`class Counter {
                                var total = 0
                                func increment() {
                                    ++total
                                }
                                func incrementBy(amount: Int) {
                                    total += amount
                                }
                                func reset() {
                                    total = 0
                                }
                            }
                            var someCounter = Counter()
                            someCounter.incrementBy(5)`;

        output = [
          { type: "DECLARATION_KEYWORD",        value: "class" },
          { type: "IDENTIFIER",                 value: "Counter" },
          { type: "CLASS_DEFINITION_START",     value: "{" },
          { type: "TERMINATOR",                 value: "\\n"},

          { type: "DECLARATION_KEYWORD",        value: "var" },
          { type: "IDENTIFIER",                 value: "total" },
          { type: "OPERATOR",                   value: "=" },
          { type: "NUMBER",                     value: "0" },
          { type: "TERMINATOR",                 value: "\\n"},

          { type: "DECLARATION_KEYWORD",        value: "func"},
          { type: "IDENTIFIER",                 value: "increment" },
          { type: "PARAMS_START",               value: "(" },
          { type: "PARAMS_END",                 value: ")" },
          { type: "STATEMENTS_START",           value: "{" },
          { type: "TERMINATOR",                 value: "\\n"},

          { type: "OPERATOR",                   value: "+" },
          { type: "OPERATOR",                   value: "+" },
          { type: "IDENTIFIER",                 value: "total" },
          { type: "TERMINATOR",                 value: "\\n"},

          { type: "STATEMENTS_END",             value: "}" },
          { type: "TERMINATOR",                 value: "\\n"},

          { type: "DECLARATION_KEYWORD",        value: "func"},
          { type: "IDENTIFIER",                 value: "incrementBy" },
          { type: "PARAMS_START",               value: "(" },
          { type: "IDENTIFIER",                 value: "amount" },
          { type: "PUNCTUATION",                value: ":" },
          { type: "TYPE_NUMBER",                value: "Int" },
          { type: "PARAMS_END",                 value: ")" },
          { type: "STATEMENTS_START",           value: "{" },
          { type: "TERMINATOR",                 value: "\\n"},

          { type: "IDENTIFIER",                 value: "total" },
          { type: "OPERATOR",                   value: "+" },
          { type: "OPERATOR",                   value: "=" },
          { type: "IDENTIFIER",                 value: "amount" },
          { type: "TERMINATOR",                 value: "\\n"},

          { type: "STATEMENTS_END",             value: "}" },
          { type: "TERMINATOR",                 value: "\\n"},

          { type: "DECLARATION_KEYWORD",        value: "func"},
          { type: "IDENTIFIER",                 value: "reset" },
          { type: "PARAMS_START",               value: "(" },
          { type: "PARAMS_END",                 value: ")" },
          { type: "STATEMENTS_START",           value: "{" },
          { type: "TERMINATOR",                 value: "\\n"},

          { type: "IDENTIFIER",                 value: "total" },
          { type: "OPERATOR",                   value: "=" },
          { type: "NUMBER",                     value: "0" },
          { type: "TERMINATOR",                 value: "\\n"},

          { type: "STATEMENTS_END",             value: "}" },
          { type: "TERMINATOR",                 value: "\\n"},

          { type: "CLASS_DEFINITION_END",       value: "}" },
          { type: "TERMINATOR",                 value: "\\n"},

          {type: "DECLARATION_KEYWORD",         value: "var" },
          { type: "IDENTIFIER",                 value: "someCounter" },
          { type: "OPERATOR",                   value: "=" },
          { type: "IDENTIFIER",                 value: "Counter" },
          { type: "INITIALIZATION_START",       value: "(" },
          { type: "INITIALIZATION_END",         value: ")" },
          { type: "TERMINATOR",                 value: "\\n"},

          { type: "IDENTIFIER",                 value: "someCounter" },
          { type: "DOT_SYNTAX",                 value: "." },
          { type: "IDENTIFIER",                 value: "incrementBy" },
          { type: "INVOCATION_START",           value: "(" },
          { type: "NUMBER",                     value: "5" },
          { type: "INVOCATION_END",             value: ")" },
          { type: "TERMINATOR",                 value: "EOF"}
        ];
        expect(lexer(input)).to.deep.equal(output);
      });

      it('should handle basic class instance method definitions with multiple parameter names, and their invocation', function () {
        input = String.raw`class Counter {
                                var total = 0
                                func increment() {
                                    ++total
                                }
                                func incrementBy(amount: Int, numberOfTimes: Int) {
                                        total += amount * numberOfTimes
                                }
                                func reset() {
                                    total = 0
                                }
                            }
                            var someCounter = Counter()
                            someCounter.incrementBy(50, numberOfTimes: 10)
                            someCounter.total`;
        output = [
          { type: "DECLARATION_KEYWORD",        value: "class" },
          { type: "IDENTIFIER",                 value: "Counter" },
          { type: "CLASS_DEFINITION_START",     value: "{" },
          { type: "TERMINATOR",                 value: "\\n"},

          { type: "DECLARATION_KEYWORD",        value: "var" },
          { type: "IDENTIFIER",                 value: "total" },
          { type: "OPERATOR",                   value: "=" },
          { type: "NUMBER",                     value: "0" },
          { type: "TERMINATOR",                 value: "\\n"},

          { type: "DECLARATION_KEYWORD",        value: "func"},
          { type: "IDENTIFIER",                 value: "increment" },
          { type: "PARAMS_START",               value: "(" },
          { type: "PARAMS_END",                 value: ")" },
          { type: "STATEMENTS_START",           value: "{" },
          { type: "TERMINATOR",                 value: "\\n"},

          { type: "OPERATOR",                   value: "+" },
          { type: "OPERATOR",                   value: "+" },
          { type: "IDENTIFIER",                 value: "total" },
          { type: "TERMINATOR",                 value: "\\n"},

          { type: "STATEMENTS_END",             value: "}" },
          { type: "TERMINATOR",                 value: "\\n"},

          { type: "DECLARATION_KEYWORD",        value: "func"},
          { type: "IDENTIFIER",                 value: "incrementBy" },
          { type: "PARAMS_START",               value: "(" },
          { type: "IDENTIFIER",                 value: "amount" },
          { type: "PUNCTUATION",                value: ":" },
          { type: "TYPE_NUMBER",                value: "Int" },
          { type: "PUNCTUATION",                value: "," },
          { type: "IDENTIFIER",                 value: "numberOfTimes" },
          { type: "PUNCTUATION",                value: ":" },
          { type: "TYPE_NUMBER",                value: "Int" },
          { type: "PARAMS_END",                 value: ")" },
          { type: "STATEMENTS_START",           value: "{" },
          { type: "TERMINATOR",                 value: "\\n"},

          { type: "IDENTIFIER",                 value: "total" },
          { type: "OPERATOR",                   value: "+" },
          { type: "OPERATOR",                   value: "=" },
          { type: "IDENTIFIER",                 value: "amount" },
          { type: "OPERATOR",                   value: "*" },
          { type: "IDENTIFIER",                 value: "numberOfTimes" },
          { type: "TERMINATOR",                 value: "\\n"},

          { type: "STATEMENTS_END",             value: "}" },
          { type: "TERMINATOR",                 value: "\\n"},

          { type: "DECLARATION_KEYWORD",        value: "func"},
          { type: "IDENTIFIER",                 value: "reset" },
          { type: "PARAMS_START",               value: "(" },
          { type: "PARAMS_END",                 value: ")" },
          { type: "STATEMENTS_START",           value: "{" },
          { type: "TERMINATOR",                 value: "\\n"},

          { type: "IDENTIFIER",                 value: "total" },
          { type: "OPERATOR",                   value: "=" },
          { type: "NUMBER",                     value: "0" },
          { type: "TERMINATOR",                 value: "\\n"},

          { type: "STATEMENTS_END",             value: "}" },
          { type: "TERMINATOR",                 value: "\\n"},

          { type: "CLASS_DEFINITION_END",       value: "}" },
          { type: "TERMINATOR",                 value: "\\n"},

          {type: "DECLARATION_KEYWORD",         value: "var" },
          { type: "IDENTIFIER",                 value: "someCounter" },
          { type: "OPERATOR",                   value: "=" },
          { type: "IDENTIFIER",                 value: "Counter" },
          { type: "INITIALIZATION_START",       value: "(" },
          { type: "INITIALIZATION_END",         value: ")" },
          { type: "TERMINATOR",                 value: "\\n"},

          { type: "IDENTIFIER",                 value: "someCounter" },
          { type: "DOT_SYNTAX",                 value: "." },
          { type: "IDENTIFIER",                 value: "incrementBy" },
          { type: "INVOCATION_START",           value: "(" },
          { type: "NUMBER",                     value: "50" },
          { type: "PUNCTUATION",                value: "," },
          { type: "IDENTIFIER",                 value: "numberOfTimes" },
          { type: "PUNCTUATION",                value: ":" },
          { type: "NUMBER",                     value: "10" },
          { type: "INVOCATION_END",             value: ")" },
          { type: "TERMINATOR",                 value: "\\n"},

          { type: "IDENTIFIER",                 value: "someCounter" },
          { type: "DOT_SYNTAX",                 value: "." },
          { type: "IDENTIFIER",                 value: "total" },
          { type: "TERMINATOR",                 value: "EOF"}
        ];
        expect(lexer(input)).to.deep.equal(output);
      });

      it('should handle basic instance method definitions that use self, and their invocation', function () {
        input = String.raw`class Counter {
                                var total = 0
                                func increment() {
                                    ++self.total
                                }
                                func incrementBy(amount: Int) {
                                    self.total += amount
                                }
                                func reset() {
                                    self.total = 0
                                }
                            }
                            var someCounter = Counter()
                            someCounter.incrementBy(5)`;

        output = [
          { type: "DECLARATION_KEYWORD",        value: "class" },
          { type: "IDENTIFIER",                 value: "Counter" },
          { type: "CLASS_DEFINITION_START",     value: "{" },
          { type: "TERMINATOR",                 value: "\\n"},

          { type: "DECLARATION_KEYWORD",        value: "var" },
          { type: "IDENTIFIER",                 value: "total" },
          { type: "OPERATOR",                   value: "=" },
          { type: "NUMBER",                     value: "0" },
          { type: "TERMINATOR",                 value: "\\n"},

          { type: "DECLARATION_KEYWORD",        value: "func"},
          { type: "IDENTIFIER",                 value: "increment" },
          { type: "PARAMS_START",               value: "(" },
          { type: "PARAMS_END",                 value: ")" },
          { type: "STATEMENTS_START",           value: "{" },
          { type: "TERMINATOR",                 value: "\\n"},

          { type: "OPERATOR",                   value: "+" },
          { type: "OPERATOR",                   value: "+" },
          { type: "EXPRESSION_OR_TYPE_KEYWORD", value: "self" },
          { type: "DOT_SYNTAX",                 value: "." },
          { type: "IDENTIFIER",                 value: "total" },
          { type: "TERMINATOR",                 value: "\\n"},

          { type: "STATEMENTS_END",             value: "}" },
          { type: "TERMINATOR",                 value: "\\n"},

          { type: "DECLARATION_KEYWORD",        value: "func"},
          { type: "IDENTIFIER",                 value: "incrementBy" },
          { type: "PARAMS_START",               value: "(" },
          { type: "IDENTIFIER",                 value: "amount" },
          { type: "PUNCTUATION",                value: ":" },
          { type: "TYPE_NUMBER",                value: "Int" },
          { type: "PARAMS_END",                 value: ")" },
          { type: "STATEMENTS_START",           value: "{" },
          { type: "TERMINATOR",                 value: "\\n"},

          { type: "EXPRESSION_OR_TYPE_KEYWORD", value: "self" },
          { type: "DOT_SYNTAX",                 value: "." },
          { type: "IDENTIFIER",                 value: "total" },
          { type: "OPERATOR",                   value: "+" },
          { type: "OPERATOR",                   value: "=" },
          { type: "IDENTIFIER",                 value: "amount" },
          { type: "TERMINATOR",                 value: "\\n"},

          { type: "STATEMENTS_END",             value: "}" },
          { type: "TERMINATOR",                 value: "\\n"},

          { type: "DECLARATION_KEYWORD",        value: "func"},
          { type: "IDENTIFIER",                 value: "reset" },
          { type: "PARAMS_START",               value: "(" },
          { type: "PARAMS_END",                 value: ")" },
          { type: "STATEMENTS_START",           value: "{" },
          { type: "TERMINATOR",                 value: "\\n"},

          { type: "EXPRESSION_OR_TYPE_KEYWORD", value: "self" },
          { type: "DOT_SYNTAX",                 value: "." },
          { type: "IDENTIFIER",                 value: "total" },
          { type: "OPERATOR",                   value: "=" },
          { type: "NUMBER",                     value: "0" },
          { type: "TERMINATOR",                 value: "\\n"},

          { type: "STATEMENTS_END",             value: "}" },
          { type: "TERMINATOR",                 value: "\\n"},

          { type: "CLASS_DEFINITION_END",       value: "}" },
          { type: "TERMINATOR",                 value: "\\n"},

          {type: "DECLARATION_KEYWORD",         value: "var" },
          { type: "IDENTIFIER",                 value: "someCounter" },
          { type: "OPERATOR",                   value: "=" },
          { type: "IDENTIFIER",                 value: "Counter" },
          { type: "INITIALIZATION_START",       value: "(" },
          { type: "INITIALIZATION_END",         value: ")" },
          { type: "TERMINATOR",                 value: "\\n"},

          { type: "IDENTIFIER",                 value: "someCounter" },
          { type: "DOT_SYNTAX",                 value: "." },
          { type: "IDENTIFIER",                 value: "incrementBy" },
          { type: "INVOCATION_START",           value: "(" },
          { type: "NUMBER",                     value: "5" },
          { type: "INVOCATION_END",             value: ")" },
          { type: "TERMINATOR",                 value: "EOF"}
        ];
        expect(lexer(input)).to.deep.equal(output);
      });

      it('should handle basic struct mutating method definitions', function () {
        input = String.raw`struct Counter {
                                var total = 0
                                mutating func increment() {
                                    ++total
                                }
                                mutating func incrementBy(amount: Int) {
                                    total += amount
                                }
                                mutating func reset() {
                                    total = 0
                                }
                            }`;
        output = [
          { type: "DECLARATION_KEYWORD",        value: "struct" },
          { type: "IDENTIFIER",                 value: "Counter" },
          { type: "STRUCT_DEFINITION_START",    value: "{" },
          { type: "TERMINATOR",                 value: "\\n"},

          { type: "DECLARATION_KEYWORD",        value: "var" },
          { type: "IDENTIFIER",                 value: "total" },
          { type: "OPERATOR",                   value: "=" },
          { type: "NUMBER",                     value: "0" },
          { type: "TERMINATOR",                 value: "\\n"},

          { type: "CONTEXT_SPECIFIC_KEYWORD",   value: "mutating"},
          { type: "DECLARATION_KEYWORD",        value: "func"},
          { type: "IDENTIFIER",                 value: "increment" },
          { type: "PARAMS_START",               value: "(" },
          { type: "PARAMS_END",                 value: ")" },
          { type: "STATEMENTS_START",           value: "{" },
          { type: "TERMINATOR",                 value: "\\n"},

          { type: "OPERATOR",                   value: "+" },
          { type: "OPERATOR",                   value: "+" },
          { type: "IDENTIFIER",                 value: "total" },
          { type: "TERMINATOR",                 value: "\\n"},

          { type: "STATEMENTS_END",             value: "}" },
          { type: "TERMINATOR",                 value: "\\n"},

          { type: "CONTEXT_SPECIFIC_KEYWORD",   value: "mutating"},
          { type: "DECLARATION_KEYWORD",        value: "func"},
          { type: "IDENTIFIER",                 value: "incrementBy" },
          { type: "PARAMS_START",               value: "(" },
          { type: "IDENTIFIER",                 value: "amount" },
          { type: "PUNCTUATION",                value: ":" },
          { type: "TYPE_NUMBER",                value: "Int" },
          { type: "PARAMS_END",                 value: ")" },
          { type: "STATEMENTS_START",           value: "{" },
          { type: "TERMINATOR",                 value: "\\n"},

          { type: "IDENTIFIER",                 value: "total" },
          { type: "OPERATOR",                   value: "+" },
          { type: "OPERATOR",                   value: "=" },
          { type: "IDENTIFIER",                 value: "amount" },
          { type: "TERMINATOR",                 value: "\\n"},

          { type: "STATEMENTS_END",             value: "}" },
          { type: "TERMINATOR",                 value: "\\n"},

          { type: "CONTEXT_SPECIFIC_KEYWORD",   value: "mutating"},
          { type: "DECLARATION_KEYWORD",        value: "func"},
          { type: "IDENTIFIER",                 value: "reset" },
          { type: "PARAMS_START",               value: "(" },
          { type: "PARAMS_END",                 value: ")" },
          { type: "STATEMENTS_START",           value: "{" },
          { type: "TERMINATOR",                 value: "\\n"},

          { type: "IDENTIFIER",                 value: "total" },
          { type: "OPERATOR",                   value: "=" },
          { type: "NUMBER",                     value: "0" },
          { type: "TERMINATOR",                 value: "\\n"},

          { type: "STATEMENTS_END",             value: "}" },
          { type: "TERMINATOR",                 value: "\\n"},

          { type: "STRUCT_DEFINITION_END",      value: "}" },
          { type: "TERMINATOR",                 value: "EOF"}
        ];
        expect(lexer(input)).to.deep.equal(output);
      });

      it('should handle basic struct mutating methods that assign to self', function () {
        input = String.raw`struct Counter {
                                var total = 0
                                mutating func increment() {
                                    self = Counter(total: ++total)
                                }
                            }`;
        output = [
          { type: "DECLARATION_KEYWORD",        value: "struct" },
          { type: "IDENTIFIER",                 value: "Counter" },
          { type: "STRUCT_DEFINITION_START",    value: "{" },
          { type: "TERMINATOR",                 value: "\\n"},

          { type: "DECLARATION_KEYWORD",        value: "var" },
          { type: "IDENTIFIER",                 value: "total" },
          { type: "OPERATOR",                   value: "=" },
          { type: "NUMBER",                     value: "0" },
          { type: "TERMINATOR",                 value: "\\n"},

          { type: "CONTEXT_SPECIFIC_KEYWORD",   value: "mutating"},
          { type: "DECLARATION_KEYWORD",        value: "func"},
          { type: "IDENTIFIER",                 value: "increment" },
          { type: "PARAMS_START",               value: "(" },
          { type: "PARAMS_END",                 value: ")" },
          { type: "STATEMENTS_START",           value: "{" },
          { type: "TERMINATOR",                 value: "\\n"},

          { type: "EXPRESSION_OR_TYPE_KEYWORD", value: "self" },
          { type: "OPERATOR",                   value: "=" },
          { type: "IDENTIFIER",                 value: "Counter" },
          { type: "INITIALIZATION_START",       value: "(" },
          { type: "IDENTIFIER",                 value: "total" },
          { type: "PUNCTUATION",                value: ":" },
          { type: "OPERATOR",                   value: "+" },
          { type: "OPERATOR",                   value: "+" },
          { type: "IDENTIFIER",                 value: "total" },
          { type: "INITIALIZATION_END",         value: ")" },
          { type: "TERMINATOR",                 value: "\\n"},

          { type: "STATEMENTS_END",             value: "}" },
          { type: "TERMINATOR",                 value: "\\n"},

          { type: "STRUCT_DEFINITION_END",      value: "}" },
          { type: "TERMINATOR",                 value: "EOF"}
        ];
        expect(lexer(input)).to.deep.equal(output);
      });

      it('should handle type methods declared with the static or class keyword', function () {
        input = String.raw`class ParentClass {
                                static func returnTen() -> Int {
                                    return 10
                                }
                                class func returnString() -> String {
                                    return "my string"
                                }
                            }
                            ParentClass.returnTen()
                            ParentClass.returnString()`;

        output = [
          { type: "DECLARATION_KEYWORD",        value: "class" },
          { type: "IDENTIFIER",                 value: "ParentClass" },
          { type: "CLASS_DEFINITION_START",     value: "{" },
          { type: "TERMINATOR",                 value: "\\n"},

          { type: "DECLARATION_KEYWORD",        value: "static"},
          { type: "DECLARATION_KEYWORD",        value: "func"},
          { type: "IDENTIFIER",                 value: "returnTen" },
          { type: "PARAMS_START",               value: "(" },
          { type: "PARAMS_END",                 value: ")" },
          { type: "RETURN_ARROW",               value: "->" },
          { type: "TYPE_NUMBER",                value: "Int" },
          { type: "STATEMENTS_START",           value: "{" },
          { type: "TERMINATOR",                 value: "\\n"},

          { type: "STATEMENT_KEYWORD",          value: "return"},
          { type: "NUMBER",                     value: "10" },
          { type: "TERMINATOR",                 value: "\\n"},

          { type: "STATEMENTS_END",             value: "}" },
          { type: "TERMINATOR",                 value: "\\n"},

          { type: "DECLARATION_KEYWORD",        value: "class"},
          { type: "DECLARATION_KEYWORD",        value: "func"},
          { type: "IDENTIFIER",                 value: "returnString" },
          { type: "PARAMS_START",               value: "(" },
          { type: "PARAMS_END",                 value: ")" },
          { type: "RETURN_ARROW",               value: "->" },
          { type: "TYPE_STRING",                value: "String" },
          { type: "STATEMENTS_START",           value: "{" },
          { type: "TERMINATOR",                 value: "\\n"},

          { type: "STATEMENT_KEYWORD",          value: "return"},
          { type: "STRING",                     value: "my string" },
          { type: "TERMINATOR",                 value: "\\n"},

          { type: "STATEMENTS_END",             value: "}" },
          { type: "TERMINATOR",                 value: "\\n"},

          { type: "CLASS_DEFINITION_END",       value: "}" },
          { type: "TERMINATOR",                 value: "\\n"},

          { type: "IDENTIFIER",                 value: "ParentClass" },
          { type: "DOT_SYNTAX",                 value: "." },
          { type: "IDENTIFIER",                 value: "returnTen" },
          { type: "INVOCATION_START",           value: "(" },
          { type: "INVOCATION_END",             value: ")" },
          { type: "TERMINATOR",                 value: "\\n"},

          { type: "IDENTIFIER",                 value: "ParentClass" },
          { type: "DOT_SYNTAX",                 value: "." },
          { type: "IDENTIFIER",                 value: "returnString" },
          { type: "INVOCATION_START",           value: "(" },
          { type: "INVOCATION_END",             value: ")" },
          { type: "TERMINATOR",                 value: "EOF"}
        ];
        expect(lexer(input)).to.deep.equal(output);
      });

      it('should handle basic class inheritance', function () {
        input = String.raw`class SuperClass {
                                var a = 0
                                var b = 1
                                func incrementA() {
                                    ++a
                                }
                                static func returnTen() -> Int {
                                    return 10
                                }
                                class func returnString() -> String {
                                    return "my string"
                                }
                            }

                            class SubClass: SuperClass {
                                var c = 2
                            }`;
        output = [
          { type: "DECLARATION_KEYWORD",        value: "class" },
          { type: "IDENTIFIER",                 value: "SuperClass" },
          { type: "CLASS_DEFINITION_START",     value: "{" },
          { type: "TERMINATOR",                 value: "\\n"},

          { type: "DECLARATION_KEYWORD",        value: "var" },
          { type: "IDENTIFIER",                 value: "a" },
          { type: "OPERATOR",                   value: "=" },
          { type: "NUMBER",                     value: "0" },
          { type: "TERMINATOR",                 value: "\\n"},

          { type: "DECLARATION_KEYWORD",        value: "var" },
          { type: "IDENTIFIER",                 value: "b" },
          { type: "OPERATOR",                   value: "=" },
          { type: "NUMBER",                     value: "1" },
          { type: "TERMINATOR",                 value: "\\n"},

          { type: "DECLARATION_KEYWORD",        value: "func"},
          { type: "IDENTIFIER",                 value: "incrementA" },
          { type: "PARAMS_START",               value: "(" },
          { type: "PARAMS_END",                 value: ")" },
          { type: "STATEMENTS_START",           value: "{" },
          { type: "TERMINATOR",                 value: "\\n"},

          { type: "OPERATOR",                   value: "+" },
          { type: "OPERATOR",                   value: "+" },
          { type: "IDENTIFIER",                 value: "a" },
          { type: "TERMINATOR",                 value: "\\n"},

          { type: "STATEMENTS_END",             value: "}" },
          { type: "TERMINATOR",                 value: "\\n"},

          { type: "DECLARATION_KEYWORD",        value: "static"},
          { type: "DECLARATION_KEYWORD",        value: "func"},
          { type: "IDENTIFIER",                 value: "returnTen" },
          { type: "PARAMS_START",               value: "(" },
          { type: "PARAMS_END",                 value: ")" },
          { type: "RETURN_ARROW",               value: "->" },
          { type: "TYPE_NUMBER",                value: "Int" },
          { type: "STATEMENTS_START",           value: "{" },
          { type: "TERMINATOR",                 value: "\\n"},

          { type: "STATEMENT_KEYWORD",          value: "return"},
          { type: "NUMBER",                     value: "10" },
          { type: "TERMINATOR",                 value: "\\n"},

          { type: "STATEMENTS_END",             value: "}" },
          { type: "TERMINATOR",                 value: "\\n"},

          { type: "DECLARATION_KEYWORD",        value: "class"},
          { type: "DECLARATION_KEYWORD",        value: "func"},
          { type: "IDENTIFIER",                 value: "returnString" },
          { type: "PARAMS_START",               value: "(" },
          { type: "PARAMS_END",                 value: ")" },
          { type: "RETURN_ARROW",               value: "->" },
          { type: "TYPE_STRING",                value: "String" },
          { type: "STATEMENTS_START",           value: "{" },
          { type: "TERMINATOR",                 value: "\\n"},

          { type: "STATEMENT_KEYWORD",          value: "return"},
          { type: "STRING",                     value: "my string" },
          { type: "TERMINATOR",                 value: "\\n"},

          { type: "STATEMENTS_END",             value: "}" },
          { type: "TERMINATOR",                 value: "\\n"},

          { type: "CLASS_DEFINITION_END",       value: "}" },
          { type: "TERMINATOR",                 value: "\\n"},
          { type: "TERMINATOR",                 value: "\\n"},

          { type: "DECLARATION_KEYWORD",        value: "class" },
          { type: "IDENTIFIER",                 value: "SubClass" },
          { type: "INHERITANCE_OPERATOR",       value: ":" },
          { type: "IDENTIFIER",                 value: "SuperClass" },
          { type: "CLASS_DEFINITION_START",     value: "{" },
          { type: "TERMINATOR",                 value: "\\n"},

          { type: "DECLARATION_KEYWORD",        value: "var" },
          { type: "IDENTIFIER",                 value: "c" },
          { type: "OPERATOR",                   value: "=" },
          { type: "NUMBER",                     value: "2" },
          { type: "TERMINATOR",                 value: "\\n"},

          { type: "CLASS_DEFINITION_END",       value: "}" },
          { type: "TERMINATOR",                 value: "EOF"}
        ];
        expect(lexer(input)).to.deep.equal(output);
      });

      it('should handle methods declared as final methods and methods that override inherited methods', function () {
        input = String.raw`class SuperClass {
                              var a = 0
                              var b = 1
                              func incrementA() {
                                  ++a
                              }
                              static func returnTen() -> Int {
                                  return 10
                              }
                              final func returnString() -> String {
                                  return "my string"
                              }
                          }

                          class SubClass: SuperClass {
                              override func incrementA() {
                                  a++
                              }
                          }`;
        output = [
          { type: "DECLARATION_KEYWORD",        value: "class" },
          { type: "IDENTIFIER",                 value: "SuperClass" },
          { type: "CLASS_DEFINITION_START",     value: "{" },
          { type: "TERMINATOR",                 value: "\\n"},

          { type: "DECLARATION_KEYWORD",        value: "var" },
          { type: "IDENTIFIER",                 value: "a" },
          { type: "OPERATOR",                   value: "=" },
          { type: "NUMBER",                     value: "0" },
          { type: "TERMINATOR",                 value: "\\n"},

          { type: "DECLARATION_KEYWORD",        value: "var" },
          { type: "IDENTIFIER",                 value: "b" },
          { type: "OPERATOR",                   value: "=" },
          { type: "NUMBER",                     value: "1" },
          { type: "TERMINATOR",                 value: "\\n"},

          { type: "DECLARATION_KEYWORD",        value: "func"},
          { type: "IDENTIFIER",                 value: "incrementA" },
          { type: "PARAMS_START",               value: "(" },
          { type: "PARAMS_END",                 value: ")" },
          { type: "STATEMENTS_START",           value: "{" },
          { type: "TERMINATOR",                 value: "\\n"},

          { type: "OPERATOR",                   value: "+" },
          { type: "OPERATOR",                   value: "+" },
          { type: "IDENTIFIER",                 value: "a" },
          { type: "TERMINATOR",                 value: "\\n"},

          { type: "STATEMENTS_END",             value: "}" },
          { type: "TERMINATOR",                 value: "\\n"},

          { type: "DECLARATION_KEYWORD",        value: "static"},
          { type: "DECLARATION_KEYWORD",        value: "func"},
          { type: "IDENTIFIER",                 value: "returnTen" },
          { type: "PARAMS_START",               value: "(" },
          { type: "PARAMS_END",                 value: ")" },
          { type: "RETURN_ARROW",               value: "->" },
          { type: "TYPE_NUMBER",                value: "Int" },
          { type: "STATEMENTS_START",           value: "{" },
          { type: "TERMINATOR",                 value: "\\n"},

          { type: "STATEMENT_KEYWORD",          value: "return"},
          { type: "NUMBER",                     value: "10" },
          { type: "TERMINATOR",                 value: "\\n"},

          { type: "STATEMENTS_END",             value: "}" },
          { type: "TERMINATOR",                 value: "\\n"},

          { type: "CONTEXT_SPECIFIC_KEYWORD",   value: "final"},
          { type: "DECLARATION_KEYWORD",        value: "func"},
          { type: "IDENTIFIER",                 value: "returnString" },
          { type: "PARAMS_START",               value: "(" },
          { type: "PARAMS_END",                 value: ")" },
          { type: "RETURN_ARROW",               value: "->" },
          { type: "TYPE_STRING",                value: "String" },
          { type: "STATEMENTS_START",           value: "{" },
          { type: "TERMINATOR",                 value: "\\n"},

          { type: "STATEMENT_KEYWORD",          value: "return"},
          { type: "STRING",                     value: "my string" },
          { type: "TERMINATOR",                 value: "\\n"},

          { type: "STATEMENTS_END",             value: "}" },
          { type: "TERMINATOR",                 value: "\\n"},

          { type: "CLASS_DEFINITION_END",       value: "}" },
          { type: "TERMINATOR",                 value: "\\n"},
          { type: "TERMINATOR",                 value: "\\n"},

          { type: "DECLARATION_KEYWORD",        value: "class" },
          { type: "IDENTIFIER",                 value: "SubClass" },
          { type: "INHERITANCE_OPERATOR",       value: ":" },
          { type: "IDENTIFIER",                 value: "SuperClass" },
          { type: "CLASS_DEFINITION_START",     value: "{" },
          { type: "TERMINATOR",                 value: "\\n"},

          { type: "CONTEXT_SPECIFIC_KEYWORD",   value: "override"},
          { type: "DECLARATION_KEYWORD",        value: "func"},
          { type: "IDENTIFIER",                 value: "incrementA" },
          { type: "PARAMS_START",               value: "(" },
          { type: "PARAMS_END",                 value: ")" },
          { type: "STATEMENTS_START",           value: "{" },
          { type: "TERMINATOR",                 value: "\\n"},

          { type: "IDENTIFIER",                 value: "a" },
          { type: "OPERATOR",                   value: "+" },
          { type: "OPERATOR",                   value: "+" },
          { type: "TERMINATOR",                 value: "\\n"},

          { type: "STATEMENTS_END",             value: "}" },
          { type: "TERMINATOR",                 value: "\\n"},

          { type: "CLASS_DEFINITION_END",       value: "}" },
          { type: "TERMINATOR",                 value: "EOF"}
        ];
        expect(lexer(input)).to.deep.equal(output);
      });

      it('should handle class declaration, initialization, property value lookups, and method calls with erratic spacing and inconsistent use of semi-colons', function () {
        input = String.raw`       class    SuperClass            {    var a = 0

                           var     b = 1   ;
                               func incrementA(){
                                   ++a
                                                                }
                               static       func returnTen() -> Int {
                                   return 10
                           }
                                                     final func returnString()-> String     {
                                   return "my string"
                                }
                           }

                           class  SubClass :  SuperClass {
                               override func  incrementA() {
                                   a++ ;
                               }
                           }

                            var  someSuper            = SuperClass  ()

                                   someSuper.a         ;someSuper.returnString() ;
                                  `;
        output = [
           { type: "DECLARATION_KEYWORD",        value: "class" },
           { type: "IDENTIFIER",                 value: "SuperClass" },
           { type: "CLASS_DEFINITION_START",     value: "{" },
           { type: "DECLARATION_KEYWORD",        value: "var" },
           { type: "IDENTIFIER",                 value: "a" },
           { type: "OPERATOR",                   value: "=" },
           { type: "NUMBER",                     value: "0" },
           { type: "TERMINATOR",                 value: "\\n"},
           { type: "TERMINATOR",                 value: "\\n"},

           { type: "DECLARATION_KEYWORD",        value: "var" },
           { type: "IDENTIFIER",                 value: "b" },
           { type: "OPERATOR",                   value: "=" },
           { type: "NUMBER",                     value: "1" },
           { type: "PUNCTUATION",                value: ";" },
           { type: "TERMINATOR",                 value: "\\n"},

           { type: "DECLARATION_KEYWORD",        value: "func"},
           { type: "IDENTIFIER",                 value: "incrementA" },
           { type: "PARAMS_START",               value: "(" },
           { type: "PARAMS_END",                 value: ")" },
           { type: "STATEMENTS_START",           value: "{" },
           { type: "TERMINATOR",                 value: "\\n"},

           { type: "OPERATOR",                   value: "+" },
           { type: "OPERATOR",                   value: "+" },
           { type: "IDENTIFIER",                 value: "a" },
           { type: "TERMINATOR",                 value: "\\n"},

           { type: "STATEMENTS_END",             value: "}" },
           { type: "TERMINATOR",                 value: "\\n"},

           { type: "DECLARATION_KEYWORD",        value: "static"},
           { type: "DECLARATION_KEYWORD",        value: "func"},
           { type: "IDENTIFIER",                 value: "returnTen" },
           { type: "PARAMS_START",               value: "(" },
           { type: "PARAMS_END",                 value: ")" },
           { type: "RETURN_ARROW",               value: "->" },
           { type: "TYPE_NUMBER",                value: "Int" },
           { type: "STATEMENTS_START",           value: "{" },
           { type: "TERMINATOR",                 value: "\\n"},

           { type: "STATEMENT_KEYWORD",          value: "return"},
           { type: "NUMBER",                     value: "10" },
           { type: "TERMINATOR",                 value: "\\n"},

           { type: "STATEMENTS_END",             value: "}" },
           { type: "TERMINATOR",                 value: "\\n"},

           { type: "CONTEXT_SPECIFIC_KEYWORD",   value: "final"},
           { type: "DECLARATION_KEYWORD",        value: "func"},
           { type: "IDENTIFIER",                 value: "returnString" },
           { type: "PARAMS_START",               value: "(" },
           { type: "PARAMS_END",                 value: ")" },
           { type: "RETURN_ARROW",               value: "->" },
           { type: "TYPE_STRING",                value: "String" },
           { type: "STATEMENTS_START",           value: "{" },
           { type: "TERMINATOR",                 value: "\\n"},

           { type: "STATEMENT_KEYWORD",          value: "return"},
           { type: "STRING",                     value: "my string" },
           { type: "TERMINATOR",                 value: "\\n"},

           { type: "STATEMENTS_END",             value: "}" },
           { type: "TERMINATOR",                 value: "\\n"},

           { type: "CLASS_DEFINITION_END",       value: "}" },
           { type: "TERMINATOR",                 value: "\\n"},
           { type: "TERMINATOR",                 value: "\\n"},

           { type: "DECLARATION_KEYWORD",        value: "class" },
           { type: "IDENTIFIER",                 value: "SubClass" },
           { type: "INHERITANCE_OPERATOR",       value: ":" },
           { type: "IDENTIFIER",                 value: "SuperClass" },
           { type: "CLASS_DEFINITION_START",     value: "{" },
           { type: "TERMINATOR",                 value: "\\n"},

           { type: "CONTEXT_SPECIFIC_KEYWORD",   value: "override"},
           { type: "DECLARATION_KEYWORD",        value: "func"},
           { type: "IDENTIFIER",                 value: "incrementA" },
           { type: "PARAMS_START",               value: "(" },
           { type: "PARAMS_END",                 value: ")" },
           { type: "STATEMENTS_START",           value: "{" },
           { type: "TERMINATOR",                 value: "\\n"},

           { type: "IDENTIFIER",                 value: "a" },
           { type: "OPERATOR",                   value: "+" },
           { type: "OPERATOR",                   value: "+" },
           { type: "PUNCTUATION",                value: ";" },
           { type: "TERMINATOR",                 value: "\\n"},

           { type: "STATEMENTS_END",             value: "}" },
           { type: "TERMINATOR",                 value: "\\n"},

           { type: "CLASS_DEFINITION_END",       value: "}" },
           { type: "TERMINATOR",                 value: "\\n"},
           { type: "TERMINATOR",                 value: "\\n"},

           { type: "DECLARATION_KEYWORD",        value: "var" },
           { type: "IDENTIFIER",                 value: "someSuper" },
           { type: "OPERATOR",                   value: "=" },
           { type: "IDENTIFIER",                 value: "SuperClass" },
           { type: "INITIALIZATION_START",       value: "(" },
           { type: "INITIALIZATION_END",         value: ")" },
           { type: "TERMINATOR",                 value: "\\n"},
           { type: "TERMINATOR",                 value: "\\n"},

           { type: "IDENTIFIER",                 value: "someSuper" },
           { type: "DOT_SYNTAX",                 value: "." },
           { type: "IDENTIFIER",                 value: "a" },
           { type: "PUNCTUATION",                value: ";" },
           { type: "IDENTIFIER",                 value: "someSuper" },
           { type: "DOT_SYNTAX",                 value: "." },
           { type: "IDENTIFIER",                 value: "returnString" },
           { type: "INVOCATION_START",           value: "(" },
           { type: "INVOCATION_END",             value: ")" },
           { type: "PUNCTUATION",                value: ";" },
           { type: "TERMINATOR",                 value: "\\n"},

           { type: "TERMINATOR",                 value: "EOF"}
        ];
        expect(lexer(input)).to.deep.equal(output);
      });

    });

    describe('Native Methods and Type Properties', function () {

      it('should handle calls to print', function () {
        input = String.raw`var name = "Joe"
                           var arr = [1,2]
                           var tup = (1,2)
                           print(name)
                           print("Hello, \(name)")
                           print(5 * (1 + 1))
                           print(arr[1])
                           print(tup.0)`;
        output = [
          { type: "DECLARATION_KEYWORD",        value: "var" },
          { type: "IDENTIFIER",                 value: "name" },
          { type: "OPERATOR",                   value: "=" },
          { type: "STRING",                     value: "Joe" },
          { type: "TERMINATOR",                 value: "\\n"},

          { type: "DECLARATION_KEYWORD",        value: "var" },
          { type: "IDENTIFIER",                 value: "arr" },
          { type: "OPERATOR",                   value: "=" },
          { type: "ARRAY_START",                value: "[" },
          { type: "NUMBER",                     value: "1" },
          { type: "PUNCTUATION",                value: "," },
          { type: "NUMBER",                     value: "2" },
          { type: "ARRAY_END",                  value: "]" },
          { type: "TERMINATOR",                 value: "\\n"},

          { type: "DECLARATION_KEYWORD",        value: "var" },
          { type: "IDENTIFIER",                 value: "tup" },
          { type: "OPERATOR",                   value: "=" },
          { type: "TUPLE_START",                value: "(" },
          { type: "NUMBER",                     value: "1" },
          { type: "PUNCTUATION",                value: "," },
          { type: "NUMBER",                     value: "2" },
          { type: "TUPLE_END",                  value: ")" },
          { type: "TERMINATOR",                 value: "\\n"},

          { type: "NATIVE_METHOD",              value: "print"},
          { type: "INVOCATION_START",           value: "(" },
          { type: "IDENTIFIER",                 value: "name" },
          { type: "INVOCATION_END",             value: ")" },
          { type: "TERMINATOR",                 value: "\\n"},

          { type: "NATIVE_METHOD",              value: "print"},
          { type: "INVOCATION_START",           value: "(" },
          { type: "STRING",                     value: "Hello, " },
          { type: "STRING_INTERPOLATION_START", value: "\\(" },
          { type: "IDENTIFIER",                 value: "name" },
          { type: "STRING_INTERPOLATION_END",   value: ")" },
          { type: "STRING",                     value: "" },
          { type: "INVOCATION_END",             value: ")" },
          { type: "TERMINATOR",                 value: "\\n"},

          { type: "NATIVE_METHOD",              value: "print"},
          { type: "INVOCATION_START",           value: "(" },
          { type: "NUMBER",                     value: "5" },
          { type: "OPERATOR",                   value: "*" },
          { type: "PUNCTUATION",                value: "(" },
          { type: "NUMBER",                     value: "1" },
          { type: "OPERATOR",                   value: "+" },
          { type: "NUMBER",                     value: "1" },
          { type: "PUNCTUATION",                value: ")" },
          { type: "INVOCATION_END",             value: ")" },
          { type: "TERMINATOR",                 value: "\\n"},

          { type: "NATIVE_METHOD",              value: "print"},
          { type: "INVOCATION_START",           value: "(" },
          { type: "IDENTIFIER",                 value: "arr" },
          { type: "SUBSTRING_LOOKUP_START",     value: "[" },
          { type: "NUMBER",                     value: "1" },
          { type: "SUBSTRING_LOOKUP_END",       value: "]" },
          { type: "INVOCATION_END",             value: ")" },
          { type: "TERMINATOR",                 value: "\\n"},

          { type: "NATIVE_METHOD",              value: "print"},
          { type: "INVOCATION_START",           value: "(" },
          { type: "IDENTIFIER",                 value: "tup" },
          { type: "DOT_SYNTAX",                 value: "." },
          { type: "NUMBER",                     value: "0"},
          { type: "INVOCATION_END",             value: ")" },
          { type: "TERMINATOR",                 value: "EOF" }
        ];
        expect(lexer(input)).to.deep.equal(output);
      });

      describe('Range Operations', function () {

        it('should handle closed ranges', function () {
          input = String.raw`var a = 1...5`;
          output = [
            { type: "DECLARATION_KEYWORD",      value: "var" },
            { type: "IDENTIFIER",               value: "a" },
            { type: "OPERATOR",                 value: "=" },
            { type: "NUMBER",                   value: "1" },
            { type: "CLOSED_RANGE",             value: "..." },
            { type: "NUMBER",                   value: "5" },
            { type: "TERMINATOR",               value: "EOF"}
          ];
          expect(lexer(input)).to.deep.equal(output);
        });

        it('should handle decimal ending in 0 closed ranges', function () {
          input = String.raw`var a = 1.0...5.0`;
          output = [
            { type: "DECLARATION_KEYWORD",      value: "var" },
            { type: "IDENTIFIER",               value: "a" },
            { type: "OPERATOR",                 value: "=" },
            { type: "NUMBER",                   value: "1.0" },
            { type: "CLOSED_RANGE",             value: "..." },
            { type: "NUMBER",                   value: "5.0" },
            { type: "TERMINATOR",               value: "EOF"}
          ];
          expect(lexer(input)).to.deep.equal(output);
        });

        it('should handle random decimal closed ranges', function () {
          input = String.raw`var a = 1.2...5.3`;
          output = [
            { type: "DECLARATION_KEYWORD",      value: "var" },
            { type: "IDENTIFIER",               value: "a" },
            { type: "OPERATOR",                 value: "=" },
            { type: "NUMBER",                   value: "1.2" },
            { type: "CLOSED_RANGE",             value: "..." },
            { type: "NUMBER",                   value: "5.3" },
            { type: "TERMINATOR",               value: "EOF"}
          ];
          expect(lexer(input)).to.deep.equal(output);
        });

        it('should handle half-open ranges', function () {
          input = String.raw`var b = 1..<5`;
          output = [
            { type: "DECLARATION_KEYWORD",      value: "var" },
            { type: "IDENTIFIER",               value: "b" },
            { type: "OPERATOR",                 value: "=" },
            { type: "NUMBER",                   value: "1" },
            { type: "HALF-OPEN_RANGE",          value: "..<" },
            { type: "NUMBER",                   value: "5" },
            { type: "TERMINATOR",               value: "EOF"}
          ];
          expect(lexer(input)).to.deep.equal(output);
        });

        it('should handle decimal ending in 0 half-open ranges', function () {
          input = String.raw`var a = 1.0..<5.0`;
          output = [
            { type: "DECLARATION_KEYWORD",      value: "var" },
            { type: "IDENTIFIER",               value: "a" },
            { type: "OPERATOR",                 value: "=" },
            { type: "NUMBER",                   value: "1.0" },
            { type: "HALF-OPEN_RANGE",          value: "..<" },
            { type: "NUMBER",                   value: "5.0" },
            { type: "TERMINATOR",               value: "EOF"}
          ];
          expect(lexer(input)).to.deep.equal(output);
        });

        it('should handle random decimal half-open ranges', function () {
          input = String.raw`var a = 1.2..<5.3`;
          output = [
            { type: "DECLARATION_KEYWORD",       value: "var" },
            { type: "IDENTIFIER",                value: "a" },
            { type: "OPERATOR",                  value: "=" },
            { type: "NUMBER",                    value: "1.2" },
            { type: "HALF-OPEN_RANGE",           value: "..<" },
            { type: "NUMBER",                    value: "5.3" },
            { type: "TERMINATOR",                value: "EOF"}
          ];
          expect(lexer(input)).to.deep.equal(output);
        });

        it('should handle all ranges', function () {
          input = String.raw`var a = 1...5; var b = 2..<6`;
          output = [
            { type: "DECLARATION_KEYWORD",        value: "var" },
            { type: "IDENTIFIER",                 value: "a" },
            { type: "OPERATOR",                   value: "=" },
            { type: "NUMBER",                     value: "1" },
            { type: "CLOSED_RANGE",               value: "..." },
            { type: "NUMBER",                     value: "5" },
            { type: "PUNCTUATION",                value: ";"},
            { type: "DECLARATION_KEYWORD",        value: "var" },
            { type: "IDENTIFIER",                 value: "b" },
            { type: "OPERATOR",                   value: "=" },
            { type: "NUMBER",                     value: "2" },
            { type: "HALF-OPEN_RANGE",            value: "..<" },
            { type: "NUMBER",                     value: "6" },
            { type: "TERMINATOR",                 value: "EOF"}
          ];
          expect(lexer(input)).to.deep.equal(output);
        });

        it('should handle ranges delimited by identifiers', function () {
          input = String.raw`let start = 0; let end = 10; let range = start..<end; let fullRange = start...end;`;
          output = [
            { type: "DECLARATION_KEYWORD",        value: "let" },
            { type: "IDENTIFIER",                 value: "start" },
            { type: "OPERATOR",                   value: "=" },
            { type: "NUMBER",                     value: "0" },
            { type: "PUNCTUATION",                value: ";" },
            { type: "DECLARATION_KEYWORD",        value: "let" },
            { type: "IDENTIFIER",                 value: "end" },
            { type: "OPERATOR",                   value: "=" },
            { type: "NUMBER",                     value: "10" },
            { type: "PUNCTUATION",                value: ";" },
            { type: "DECLARATION_KEYWORD",        value: "let" },
            { type: "IDENTIFIER",                 value: "range" },
            { type: "OPERATOR",                   value: "=" },
            { type: "IDENTIFIER",                 value: "start" },
            { type: "HALF-OPEN_RANGE",            value: "..<" },
            { type: "IDENTIFIER",                 value: "end" },
            { type: "PUNCTUATION",                value: ";" },
            { type: "DECLARATION_KEYWORD",        value: "let" },
            { type: "IDENTIFIER",                 value: "fullRange" },
            { type: "OPERATOR",                   value: "=" },
            { type: "IDENTIFIER",                 value: "start" },
            { type: "CLOSED_RANGE",               value: "..." },
            { type: "IDENTIFIER",                 value: "end" },
            { type: "PUNCTUATION",                value: ";" },
            { type: "TERMINATOR",                 value: "EOF"}
          ];
          expect(lexer(input)).to.deep.equal(output);
        });

      });

      describe('String Properties and Methods', function () {

        it('should handle the String characters property', function () {
          input = String.raw `var s = "my string, 123!"
                              for c in s.characters {
                                  print(c)
                              }`;
          output = [
            { type: "DECLARATION_KEYWORD",        value: "var" },
            { type: "IDENTIFIER",                 value: "s" },
            { type: "OPERATOR",                   value: "=" },
            { type: "STRING",                     value: "my string, 123!" },
            { type: "TERMINATOR",                 value: "\\n"},

            { type: "STATEMENT_KEYWORD",          value: "for" },
            { type: "IDENTIFIER",                 value: "c" },
            { type: "STATEMENT_KEYWORD",          value: "in" },
            { type: "IDENTIFIER",                 value: "s" },
            { type: "DOT_SYNTAX",                 value: "." },
            { type: "TYPE_PROPERTY",              value: "characters" },
            { type: "PUNCTUATION",                value: "{" },
            { type: "TERMINATOR",                 value: "\\n"},

            { type: "NATIVE_METHOD",              value: "print"},
            { type: "INVOCATION_START",           value: "(" },
            { type: "IDENTIFIER",                 value: "c" },
            { type: "INVOCATION_END",             value: ")" },
            { type: "TERMINATOR",                 value: "\\n"},

            { type: "PUNCTUATION",                value: "}" },
            { type: "TERMINATOR",                 value: "EOF"},
          ];
          expect(lexer(input)).to.deep.equal(output);
        });

        it('should handle the String count property', function () {
          input = String.raw `var s = "my string, 123!"
                              let fifteen = s.characters.count`;
          output = [
            { type: "DECLARATION_KEYWORD",        value: "var" },
            { type: "IDENTIFIER",                 value: "s" },
            { type: "OPERATOR",                   value: "=" },
            { type: "STRING",                     value: "my string, 123!" },
            { type: "TERMINATOR",                 value: "\\n"},

            { type: "DECLARATION_KEYWORD",        value: "let" },
            { type: "IDENTIFIER",                 value: "fifteen" },
            { type: "OPERATOR",                   value: "=" },
            { type: "IDENTIFIER",                 value: "s" },
            { type: "DOT_SYNTAX",                 value: "." },
            { type: "TYPE_PROPERTY",              value: "characters" },
            { type: "DOT_SYNTAX",                 value: "." },
            { type: "TYPE_PROPERTY",              value: "count" },
            { type: "TERMINATOR",                 value: "EOF"},
          ];
          expect(lexer(input)).to.deep.equal(output);
        });

        it('should handle the string isEmpty property', function () {
          input = String.raw `var s: String = ""
                              s.isEmpty`;

          output = [
            { type: "DECLARATION_KEYWORD",        value: "var" },
            { type: "IDENTIFIER",                 value: "s" },
            { type: "PUNCTUATION",                value: ":" },
            { type: "TYPE_STRING",                value: "String"},
            { type: "OPERATOR",                   value: "=" },
            { type: "STRING",                     value: "" },
            { type: "TERMINATOR",                 value: "\\n"},

            { type: "IDENTIFIER",                 value: "s" },
            { type: "DOT_SYNTAX",                 value: "." },
            { type: "TYPE_PROPERTY",              value: "isEmpty"},
            { type: "TERMINATOR",                 value: "EOF"},
          ];
          expect(lexer(input)).to.deep.equal(output);
        });

        it('should handle the String append method', function () {
          input = String.raw `var s = "my string, 123!"
                              var addChar: Character = "!"
                              s.append(addChar)`;
          output = [
            { type: "DECLARATION_KEYWORD",        value: "var" },
            { type: "IDENTIFIER",                 value: "s" },
            { type: "OPERATOR",                   value: "=" },
            { type: "STRING",                     value: "my string, 123!" },
            { type: "TERMINATOR",                 value: "\\n"},

            { type: "DECLARATION_KEYWORD",        value: "var" },
            { type: "IDENTIFIER",                 value: "addChar" },
            { type: "PUNCTUATION",                value: ":" },
            { type: "TYPE_STRING",                value: "Character"},
            { type: "OPERATOR",                   value: "=" },
            { type: "STRING",                     value: "!" },
            { type: "TERMINATOR",                 value: "\\n"},

            { type: "IDENTIFIER",                 value: "s" },
            { type: "DOT_SYNTAX",                 value: "." },
            { type: "NATIVE_METHOD",              value: "append"},
            { type: "INVOCATION_START",           value: "(" },
            { type: "IDENTIFIER",                 value: "addChar" },
            { type: "INVOCATION_END",             value: ")" },
            { type: "TERMINATOR",                 value: "EOF"},
          ];
          expect(lexer(input)).to.deep.equal(output);
        });

        it('should handle the String indices and their associated methods', function () {
          input = String.raw`var s = "my string, 123!"
                             var zero = s.startIndex
                             var one = s.startIndex.successor()
                             var two = s.startIndex.advancedBy(2)
                             var m = s[s.startIndex]
                             var y = s[s.startIndex.advancedBy(1)]
                             var fifteen = s.endIndex
                             var fourteen = s.endIndex.predecessor()
                             var bang = s[s.endIndex.predecessor()]`;
                      //TODO // print("the letter s: \(s[s.startIndex.advancedBy(3)])")`;
          output = [
            { type: "DECLARATION_KEYWORD",        value: "var" },
            { type: "IDENTIFIER",                 value: "s" },
            { type: "OPERATOR",                   value: "=" },
            { type: "STRING",                     value: "my string, 123!" },
            { type: "TERMINATOR",                 value: "\\n"},

            { type: "DECLARATION_KEYWORD",        value: "var" },
            { type: "IDENTIFIER",                 value: "zero" },
            { type: "OPERATOR",                   value: "=" },
            { type: "IDENTIFIER",                 value: "s" },
            { type: "DOT_SYNTAX",                 value: "." },
            { type: "TYPE_PROPERTY",              value: "startIndex" },
            { type: "TERMINATOR",                 value: "\\n"},

            { type: "DECLARATION_KEYWORD",        value: "var" },
            { type: "IDENTIFIER",                 value: "one" },
            { type: "OPERATOR",                   value: "=" },
            { type: "IDENTIFIER",                 value: "s" },
            { type: "DOT_SYNTAX",                 value: "." },
            { type: "TYPE_PROPERTY",              value: "startIndex" },
            { type: "DOT_SYNTAX",                 value: "." },
            { type: "NATIVE_METHOD",              value: "successor"},
            { type: "INVOCATION_START",           value: "(" },
            { type: "INVOCATION_END",             value: ")" },
            { type: "TERMINATOR",                 value: "\\n"},

            { type: "DECLARATION_KEYWORD",        value: "var" },
            { type: "IDENTIFIER",                 value: "two" },
            { type: "OPERATOR",                   value: "=" },
            { type: "IDENTIFIER",                 value: "s" },
            { type: "DOT_SYNTAX",                 value: "." },
            { type: "TYPE_PROPERTY",              value: "startIndex" },
            { type: "DOT_SYNTAX",                 value: "." },
            { type: "NATIVE_METHOD",              value: "advancedBy"},
            { type: "INVOCATION_START",           value: "(" },
            { type: "NUMBER",                     value: "2" },
            { type: "INVOCATION_END",             value: ")" },
            { type: "TERMINATOR",                 value: "\\n"},

            { type: "DECLARATION_KEYWORD",        value: "var" },
            { type: "IDENTIFIER",                 value: "m" },
            { type: "OPERATOR",                   value: "=" },
            { type: "IDENTIFIER",                 value: "s" },
            { type: "SUBSTRING_LOOKUP_START",     value: "[" },
            { type: "IDENTIFIER",                 value: "s" },
            { type: "DOT_SYNTAX",                 value: "." },
            { type: "TYPE_PROPERTY",              value: "startIndex" },
            { type: "SUBSTRING_LOOKUP_END",       value: "]" },
            { type: "TERMINATOR",                 value: "\\n"},

            { type: "DECLARATION_KEYWORD",        value: "var" },
            { type: "IDENTIFIER",                 value: "y" },
            { type: "OPERATOR",                   value: "=" },
            { type: "IDENTIFIER",                 value: "s" },
            { type: "SUBSTRING_LOOKUP_START",     value: "[" },
            { type: "IDENTIFIER",                 value: "s" },
            { type: "DOT_SYNTAX",                 value: "." },
            { type: "TYPE_PROPERTY",              value: "startIndex" },
            { type: "DOT_SYNTAX",                 value: "." },
            { type: "NATIVE_METHOD",              value: "advancedBy"},
            { type: "INVOCATION_START",           value: "(" },
            { type: "NUMBER",                     value: "1" },
            { type: "INVOCATION_END",             value: ")" },
            { type: "SUBSTRING_LOOKUP_END",       value: "]" },
            { type: "TERMINATOR",                 value: "\\n"},

            { type: "DECLARATION_KEYWORD",        value: "var" },
            { type: "IDENTIFIER",                 value: "fifteen" },
            { type: "OPERATOR",                   value: "=" },
            { type: "IDENTIFIER",                 value: "s" },
            { type: "DOT_SYNTAX",                 value: "." },
            { type: "TYPE_PROPERTY",              value: "endIndex" },
            { type: "TERMINATOR",                 value: "\\n"},

            { type: "DECLARATION_KEYWORD",        value: "var" },
            { type: "IDENTIFIER",                 value: "fourteen" },
            { type: "OPERATOR",                   value: "=" },
            { type: "IDENTIFIER",                 value: "s" },
            { type: "DOT_SYNTAX",                 value: "." },
            { type: "TYPE_PROPERTY",              value: "endIndex" },
            { type: "DOT_SYNTAX",                 value: "." },
            { type: "NATIVE_METHOD",              value: "predecessor"},
            { type: "INVOCATION_START",           value: "(" },
            { type: "INVOCATION_END",             value: ")" },
            { type: "TERMINATOR",                 value: "\\n"},

            { type: "DECLARATION_KEYWORD",        value: "var" },
            { type: "IDENTIFIER",                 value: "bang" },
            { type: "OPERATOR",                   value: "=" },
            { type: "IDENTIFIER",                 value: "s" },
            { type: "SUBSTRING_LOOKUP_START",     value: "[" },
            { type: "IDENTIFIER",                 value: "s" },
            { type: "DOT_SYNTAX",                 value: "." },
            { type: "TYPE_PROPERTY",              value: "endIndex" },
            { type: "DOT_SYNTAX",                 value: "." },
            { type: "NATIVE_METHOD",              value: "predecessor"},
            { type: "INVOCATION_START",           value: "(" },
            { type: "INVOCATION_END",             value: ")" },
            { type: "SUBSTRING_LOOKUP_END",       value: "]" },
            // { type: "TERMINATOR",                 value: "\\n"},

            // { type: "NATIVE_METHOD",              value: "print"},
            // { type: "INVOCATION_START",           value: "(" },
            // { type: "STRING",                     value: "the letter s: " },
            // { type: "STRING_INTERPOLATION_START", value: "\\(" },
            // { type: "IDENTIFIER",                 value: "s" },
            // { type: "SUBSTRING_LOOKUP_START",     value: "[" },
            // { type: "IDENTIFIER",                 value: "s" },
            // { type: "DOT_SYNTAX",                 value: "." },
            // { type: "TYPE_PROPERTY",              value: "startIndex" },
            // { type: "DOT_SYNTAX",                 value: "." },
            // { type: "NATIVE_METHOD",              value: "advancedBy"},
            // { type: "INVOCATION_START",           value: "(" },
            // { type: "NUMBER",                     value: "3" },
            // { type: "INVOCATION_END",             value: ")" },
            // { type: "SUBSTRING_LOOKUP_END",       value: "]" },
            // { type: "STRING_INTERPOLATION_END",   value: ")" },
            // { type: "STRING",                     value: "" },
            // { type: "INVOCATION_END",             value: ")" },
            { type: "TERMINATOR",                 value: "EOF"},
          ];
          expect(lexer(input)).to.deep.equal(output);
        });

        it('should handle the String methods for inserting and removing characters', function () {
          input = String.raw`var greeting = "World"
                              var firstPart = "Hello, "
                              greeting.insert("!", atIndex: greeting.endIndex)
                              greeting.insertContentsOf(firstPart.characters, at: greeting.startIndex)
                              greeting.removeAtIndex(greeting.endIndex.predecessor())
                              var range = greeting.startIndex...greeting.startIndex.advancedBy(6)
                              greeting.removeRange(range)`;
          output = [
            { type: "DECLARATION_KEYWORD",        value: "var" },
            { type: "IDENTIFIER",                 value: "greeting" },
            { type: "OPERATOR",                   value: "=" },
            { type: "STRING",                     value: "World" },
            { type: "TERMINATOR",                 value: "\\n"},

            { type: "DECLARATION_KEYWORD",        value: "var" },
            { type: "IDENTIFIER",                 value: "firstPart" },
            { type: "OPERATOR",                   value: "=" },
            { type: "STRING",                     value: "Hello, " },
            { type: "TERMINATOR",                 value: "\\n"},

            { type: "IDENTIFIER",                 value: "greeting" },
            { type: "DOT_SYNTAX",                 value: "." },
            { type: "NATIVE_METHOD",              value: "insert"},
            { type: "INVOCATION_START",           value: "(" },
            { type: "STRING",                     value: "!" },
            { type: "PUNCTUATION",                value: "," },
            { type: "METHOD_ARGUMENT_NAME",       value: "atIndex" },
            { type: "PUNCTUATION",                value: ":" },
            { type: "IDENTIFIER",                 value: "greeting" },
            { type: "DOT_SYNTAX",                 value: "." },
            { type: "TYPE_PROPERTY",              value: "endIndex" },
            { type: "INVOCATION_END",             value: ")" },
            { type: "TERMINATOR",                 value: "\\n"},

            { type: "IDENTIFIER",                 value: "greeting" },
            { type: "DOT_SYNTAX",                 value: "." },
            { type: "NATIVE_METHOD",              value: "insertContentsOf"},
            { type: "INVOCATION_START",           value: "(" },
            { type: "IDENTIFIER",                 value: "firstPart" },
            { type: "DOT_SYNTAX",                 value: "." },
            { type: "TYPE_PROPERTY",              value: "characters" },
            { type: "PUNCTUATION",                value: "," },
            { type: "METHOD_ARGUMENT_NAME",       value: "at" },
            { type: "PUNCTUATION",                value: ":" },
            { type: "IDENTIFIER",                 value: "greeting" },
            { type: "DOT_SYNTAX",                 value: "." },
            { type: "TYPE_PROPERTY",              value: "startIndex" },
            { type: "INVOCATION_END",             value: ")" },
            { type: "TERMINATOR",                 value: "\\n"},

            { type: "IDENTIFIER",                 value: "greeting" },
            { type: "DOT_SYNTAX",                 value: "." },
            { type: "NATIVE_METHOD",              value: "removeAtIndex"},
            { type: "INVOCATION_START",           value: "(" },
            { type: "IDENTIFIER",                 value: "greeting" },
            { type: "DOT_SYNTAX",                 value: "." },
            { type: "TYPE_PROPERTY",              value: "endIndex" },
            { type: "DOT_SYNTAX",                 value: "." },
            { type: "NATIVE_METHOD",              value: "predecessor"},
            { type: "INVOCATION_START",           value: "(" },
            { type: "INVOCATION_END",             value: ")" },
            { type: "INVOCATION_END",             value: ")" },
            { type: "TERMINATOR",                 value: "\\n"},

            { type: "DECLARATION_KEYWORD",        value: "var" },
            { type: "IDENTIFIER",                 value: "range" },
            { type: "OPERATOR",                   value: "=" },
            { type: "IDENTIFIER",                 value: "greeting" },
            { type: "DOT_SYNTAX",                 value: "." },
            { type: "TYPE_PROPERTY",              value: "startIndex" },
            { type: "CLOSED_RANGE",               value: "..." },
            { type: "IDENTIFIER",                 value: "greeting" },
            { type: "DOT_SYNTAX",                 value: "." },
            { type: "TYPE_PROPERTY",              value: "startIndex" },
            { type: "DOT_SYNTAX",                 value: "." },
            { type: "NATIVE_METHOD",              value: "advancedBy"},
            { type: "INVOCATION_START",           value: "(" },
            { type: "NUMBER",                     value: "6" },
            { type: "INVOCATION_END",             value: ")" },
            { type: "TERMINATOR",                 value: "\\n"},

            { type: "IDENTIFIER",                 value: "greeting" },
            { type: "DOT_SYNTAX",                 value: "." },
            { type: "NATIVE_METHOD",              value: "removeRange"},
            { type: "INVOCATION_START",           value: "(" },
            { type: "IDENTIFIER",                 value: "range" },
            { type: "INVOCATION_END",             value: ")" },
            { type: "TERMINATOR",                 value: "EOF"},
          ];
          expect(lexer(input)).to.deep.equal(output);
        });

        it('should handle the has prefix and has suffix string methods', function () {
          input = String.raw `var famousAuthor = "F. Scott Fitzgerald"
                              print(famousAuthor.hasPrefix("F. Scott"))
                              var famousDriver = "Dale Earnhardt, Jr."
                              print(famousDriver.hasSuffix("Jr."))`;
          output = [
            { type: "DECLARATION_KEYWORD",        value: "var" },
            { type: "IDENTIFIER",                 value: "famousAuthor" },
            { type: "OPERATOR",                   value: "=" },
            { type: "STRING",                     value: "F. Scott Fitzgerald" },
            { type: "TERMINATOR",                 value: "\\n"},

            { type: "NATIVE_METHOD",              value: "print"},
            { type: "INVOCATION_START",           value: "(" },
            { type: "IDENTIFIER",                 value: "famousAuthor" },
            { type: "DOT_SYNTAX",                 value: "." },
            { type: "NATIVE_METHOD",              value: "hasPrefix"},
            { type: "INVOCATION_START",           value: "(" },
            { type: "STRING",                     value: "F. Scott" },
            { type: "INVOCATION_END",             value: ")" },
            { type: "INVOCATION_END",             value: ")" },
            { type: "TERMINATOR",                 value: "\\n"},

            { type: "DECLARATION_KEYWORD",        value: "var" },
            { type: "IDENTIFIER",                 value: "famousDriver" },
            { type: "OPERATOR",                   value: "=" },
            { type: "STRING",                     value: "Dale Earnhardt, Jr." },
            { type: "TERMINATOR",                 value: "\\n"},

            { type: "NATIVE_METHOD",              value: "print"},
            { type: "INVOCATION_START",           value: "(" },
            { type: "IDENTIFIER",                 value: "famousDriver" },
            { type: "DOT_SYNTAX",                 value: "." },
            { type: "NATIVE_METHOD",              value: "hasSuffix"},
            { type: "INVOCATION_START",           value: "(" },
            { type: "STRING",                     value: "Jr." },
            { type: "INVOCATION_END",             value: ")" },
            { type: "INVOCATION_END",             value: ")" },
            { type: "TERMINATOR",                 value: "EOF"},
          ];
          expect(lexer(input)).to.deep.equal(output);
        });

      });

      describe('Collection Properties and Methods', function () {

        it('should handle the array append method', function () {
          input = String.raw `var arr = [1,2]
                              arr.append(3)`;
          output = [
            { type: "DECLARATION_KEYWORD",        value: "var" },
            { type: "IDENTIFIER",                 value: "arr" },
            { type: "OPERATOR",                   value: "=" },
            { type: "ARRAY_START",                value: "[" },
            { type: "NUMBER",                     value: "1" },
            { type: "PUNCTUATION",                value: "," },
            { type: "NUMBER",                     value: "2" },
            { type: "ARRAY_END",                  value: "]" },
            { type: "TERMINATOR",                 value: "\\n"},

            { type: "IDENTIFIER",                 value: "arr" },
            { type: "DOT_SYNTAX",                 value: "." },
            { type: "NATIVE_METHOD",              value: "append"},
            { type: "INVOCATION_START",           value: "(" },
            { type: "NUMBER",                     value: "3" },
            { type: "INVOCATION_END",             value: ")" },
            { type: "TERMINATOR",                 value: "EOF"},
          ];
          expect(lexer(input)).to.deep.equal(output);
        });

        it('should handle the array count property', function () {
          input = String.raw `var arr = [1,2]
                              arr.count`;
          output = [
            { type: "DECLARATION_KEYWORD",        value: "var" },
            { type: "IDENTIFIER",                 value: "arr" },
            { type: "OPERATOR",                   value: "=" },
            { type: "ARRAY_START",                value: "[" },
            { type: "NUMBER",                     value: "1" },
            { type: "PUNCTUATION",                value: "," },
            { type: "NUMBER",                     value: "2" },
            { type: "ARRAY_END",                  value: "]" },
            { type: "TERMINATOR",                 value: "\\n"},

            { type: "IDENTIFIER",                 value: "arr" },
            { type: "DOT_SYNTAX",                 value: "." },
            { type: "TYPE_PROPERTY",              value: "count"},
            { type: "TERMINATOR",                 value: "EOF"},
          ];
          expect(lexer(input)).to.deep.equal(output);
        });

        it('should handle the array isEmpty property', function () {
          input = String.raw `var arr = [Int]()
                              arr.isEmpty`;
          output = [
            { type: "DECLARATION_KEYWORD",        value: "var" },
            { type: "IDENTIFIER",                 value: "arr" },
            { type: "OPERATOR",                   value: "=" },
            { type: "ARRAY_START",                value: "["},
            { type: "TYPE_NUMBER",                value: "Int"},
            { type: "ARRAY_END",                  value: "]"},
            { type: "INVOCATION_START",           value: "(" },
            { type: "INVOCATION_END",             value: ")" },
            { type: "TERMINATOR",                 value: "\\n"},

            { type: "IDENTIFIER",                 value: "arr" },
            { type: "DOT_SYNTAX",                 value: "." },
            { type: "TYPE_PROPERTY",              value: "isEmpty"},
            { type: "TERMINATOR",                 value: "EOF"},
          ];
          expect(lexer(input)).to.deep.equal(output);
        });

        it('should handle array initialization with a default value', function () {
          input = String.raw `var arrOfThreeZeros = [Int](count: 3, repeatedValue: 0)`;
          output = [
            { type: "DECLARATION_KEYWORD",        value: "var" },
            { type: "IDENTIFIER",                 value: "arrOfThreeZeros" },
            { type: "OPERATOR",                   value: "=" },
            { type: "ARRAY_START",                value: "["},
            { type: "TYPE_NUMBER",                value: "Int"},
            { type: "ARRAY_END",                  value: "]"},
            { type: "INVOCATION_START",           value: "(" },
            { type: "TYPE_PROPERTY",              value: "count"},
            { type: "PUNCTUATION",                value: ":" },
            { type: "NUMBER",                     value: "3" },
            { type: "PUNCTUATION",                value: "," },
            { type: "METHOD_ARGUMENT_NAME",       value: "repeatedValue"},
            { type: "PUNCTUATION",                value: ":" },
            { type: "NUMBER",                     value: "0" },
            { type: "INVOCATION_END",             value: ")" },
            { type: "TERMINATOR",                 value: "EOF"},
          ];
          expect(lexer(input)).to.deep.equal(output);
        });

        it('should handle the array insertion and removal methods', function () {
          input = String.raw `var arr = [1,2,4,8,5,7]
                              arr.insert(3, atIndex: 2)
                              var eight = arr.removeAtIndex(4)
                              arr.removeLast()
                              var arrTwo = [6,7,8,9,10]
                              arr.insertContentsOf(arrTwo, at: 5)
                              var one = arr.removeFirst()
                              arr.removeAll()`;
          output = [
            { type: "DECLARATION_KEYWORD",        value: "var" },
            { type: "IDENTIFIER",                 value: "arr" },
            { type: "OPERATOR",                   value: "=" },
            { type: "ARRAY_START",                value: "[" },
            { type: "NUMBER",                     value: "1" },
            { type: "PUNCTUATION",                value: "," },
            { type: "NUMBER",                     value: "2" },
            { type: "PUNCTUATION",                value: "," },
            { type: "NUMBER",                     value: "4" },
            { type: "PUNCTUATION",                value: "," },
            { type: "NUMBER",                     value: "8" },
            { type: "PUNCTUATION",                value: "," },
            { type: "NUMBER",                     value: "5" },
            { type: "PUNCTUATION",                value: "," },
            { type: "NUMBER",                     value: "7" },
            { type: "ARRAY_END",                  value: "]" },
            { type: "TERMINATOR",                 value: "\\n"},

            { type: "IDENTIFIER",                 value: "arr" },
            { type: "DOT_SYNTAX",                 value: "." },
            { type: "NATIVE_METHOD",              value: "insert"},
            { type: "INVOCATION_START",           value: "(" },
            { type: "NUMBER",                     value: "3" },
            { type: "PUNCTUATION",                value: "," },
            { type: "METHOD_ARGUMENT_NAME",       value: "atIndex" },
            { type: "PUNCTUATION",                value: ":" },
            { type: "NUMBER",                     value: "2" },
            { type: "INVOCATION_END",             value: ")" },
            { type: "TERMINATOR",                 value: "\\n"},

            { type: "DECLARATION_KEYWORD",        value: "var" },
            { type: "IDENTIFIER",                 value: "eight" },
            { type: "OPERATOR",                   value: "=" },
            { type: "IDENTIFIER",                 value: "arr" },
            { type: "DOT_SYNTAX",                 value: "." },
            { type: "NATIVE_METHOD",              value: "removeAtIndex"},
            { type: "INVOCATION_START",           value: "(" },
            { type: "NUMBER",                     value: "4" },
            { type: "INVOCATION_END",             value: ")" },
            { type: "TERMINATOR",                 value: "\\n"},

            { type: "IDENTIFIER",                 value: "arr" },
            { type: "DOT_SYNTAX",                 value: "." },
            { type: "NATIVE_METHOD",              value: "removeLast"},
            { type: "INVOCATION_START",           value: "(" },
            { type: "INVOCATION_END",             value: ")" },
            { type: "TERMINATOR",                 value: "\\n"},

            { type: "DECLARATION_KEYWORD",        value: "var" },
            { type: "IDENTIFIER",                 value: "arrTwo" },
            { type: "OPERATOR",                   value: "=" },
            { type: "ARRAY_START",                value: "[" },
            { type: "NUMBER",                     value: "6" },
            { type: "PUNCTUATION",                value: "," },
            { type: "NUMBER",                     value: "7" },
            { type: "PUNCTUATION",                value: "," },
            { type: "NUMBER",                     value: "8" },
            { type: "PUNCTUATION",                value: "," },
            { type: "NUMBER",                     value: "9" },
            { type: "PUNCTUATION",                value: "," },
            { type: "NUMBER",                     value: "10" },
            { type: "ARRAY_END",                  value: "]" },
            { type: "TERMINATOR",                 value: "\\n"},

            { type: "IDENTIFIER",                 value: "arr" },
            { type: "DOT_SYNTAX",                 value: "." },
            { type: "NATIVE_METHOD",              value: "insertContentsOf"},
            { type: "INVOCATION_START",           value: "(" },
            { type: "IDENTIFIER",                 value: "arrTwo" },
            { type: "PUNCTUATION",                value: "," },
            { type: "METHOD_ARGUMENT_NAME",       value: "at" },
            { type: "PUNCTUATION",                value: ":" },
            { type: "NUMBER",                     value: "5" },
            { type: "INVOCATION_END",             value: ")" },
            { type: "TERMINATOR",                 value: "\\n"},

            { type: "DECLARATION_KEYWORD",        value: "var" },
            { type: "IDENTIFIER",                 value: "one" },
            { type: "OPERATOR",                   value: "=" },
            { type: "IDENTIFIER",                 value: "arr" },
            { type: "DOT_SYNTAX",                 value: "." },
            { type: "NATIVE_METHOD",              value: "removeFirst"},
            { type: "INVOCATION_START",           value: "(" },
            { type: "INVOCATION_END",             value: ")" },
            { type: "TERMINATOR",                 value: "\\n"},

            { type: "IDENTIFIER",                 value: "arr" },
            { type: "DOT_SYNTAX",                 value: "." },
            { type: "NATIVE_METHOD",              value: "removeAll"},
            { type: "INVOCATION_START",           value: "(" },
            { type: "INVOCATION_END",             value: ")" },
            { type: "TERMINATOR",                 value: "EOF"},
          ];
          expect(lexer(input)).to.deep.equal(output);
        });

        it('should handle using subscript syntax to change a range of values at once, even if the replacement set of values has a different length than the range', function () {
          input = String.raw `var arr = [1,2,3,4,5,6,7]
                              arr[0...3] = [0]
                              arr[0..<9] = [5,6,7]`;
          output = [
            { type: "DECLARATION_KEYWORD",        value: "var" },
            { type: "IDENTIFIER",                 value: "arr" },
            { type: "OPERATOR",                   value: "=" },
            { type: "ARRAY_START",                value: "[" },
            { type: "NUMBER",                     value: "1" },
            { type: "PUNCTUATION",                value: "," },
            { type: "NUMBER",                     value: "2" },
            { type: "PUNCTUATION",                value: "," },
            { type: "NUMBER",                     value: "3" },
            { type: "PUNCTUATION",                value: "," },
            { type: "NUMBER",                     value: "4" },
            { type: "PUNCTUATION",                value: "," },
            { type: "NUMBER",                     value: "5" },
            { type: "PUNCTUATION",                value: "," },
            { type: "NUMBER",                     value: "6" },
            { type: "PUNCTUATION",                value: "," },
            { type: "NUMBER",                     value: "7" },
            { type: "ARRAY_END",                  value: "]" },
            { type: "TERMINATOR",                 value: "\\n"},

            { type: "IDENTIFIER",                 value: "arr" },
            { type: "SUBSTRING_LOOKUP_START",     value: "[" },
            { type: "NUMBER",                     value: "0" },
            { type: "CLOSED_RANGE",               value: "..." },
            { type: "NUMBER",                     value: "3" },
            { type: "SUBSTRING_LOOKUP_END",       value: "]" },
            { type: "OPERATOR",                   value: "=" },
            { type: "ARRAY_START",                value: "[" },
            { type: "NUMBER",                     value: "0" },
            { type: "ARRAY_END",                  value: "]" },
            { type: "TERMINATOR",                 value: "\\n"},

            { type: "IDENTIFIER",                 value: "arr" },
            { type: "SUBSTRING_LOOKUP_START",     value: "[" },
            { type: "NUMBER",                     value: "0" },
            { type: "HALF-OPEN_RANGE",            value: "..<" },
            { type: "NUMBER",                     value: "9" },
            { type: "SUBSTRING_LOOKUP_END",       value: "]" },
            { type: "OPERATOR",                   value: "=" },
            { type: "ARRAY_START",                value: "[" },
            { type: "NUMBER",                     value: "5" },
            { type: "PUNCTUATION",                value: "," },
            { type: "NUMBER",                     value: "6" },
            { type: "PUNCTUATION",                value: "," },
            { type: "NUMBER",                     value: "7" },
            { type: "ARRAY_END",                  value: "]" },
            { type: "TERMINATOR",                 value: "EOF"},
          ];
          expect(lexer(input)).to.deep.equal(output);
        });

      });

    });

  });
});