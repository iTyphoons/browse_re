'use strict';
/*eslint-disable no-unused-vars*/
var test = require('tap').test,
  inferKind = require('../../../lib/infer/kind'),
  parse = require('../../../lib/parsers/javascript'),
  helpers = require('../../helpers');

function toComment(fn, filename) {
  return parse([], {
    file: filename,
    source: fn instanceof Function ? '(' + fn.toString() + ')' : fn
  })[0];
}

test('inferKind', function (t) {
  t.equal(inferKind({
    kind: 'class'
  }).kind, 'class', 'explicit');

  ['class', 'constant', 'event', 'external', 'file',
    'function', 'member', 'mixin', 'module', 'namespace', 'typedef'].forEach(function (tag) {
    var comment = {};
    comment[tag] = true;
    t.equal(inferKind(comment).kind, tag, 'from ' + tag + ' keyword');
  });

  t.equal(inferKind(toComment(function () {
    /** @returns {number} two */
    function foo() { }
    foo();
  })).kind, 'function', 'inferred function');

  t.equal(inferKind(toComment(function () {
    /** @returns {number} two */
    var foo = function () { };
    foo();
  })).kind, 'function', 'inferred var function');

  t.equal(inferKind(toComment(function () {
    /** @returns {number} two */
    function Foo() { }
  })).kind, 'class', 'class via uppercase');

  t.equal(inferKind(toComment(function () {
    /** @returns {number} two */
    return 0;
  })).kind, undefined, 'undetectable');

  t.equal(inferKind(toComment(
    '/**' +
    ' * This is a constant called foo' +
    ' */' +
    'const foo = "bar";')).kind, 'constant', 'constant via const');
  t.end();
});