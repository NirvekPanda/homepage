/**
 * Custom ESLint plugin for code quality enforcement
 * Contains rules specific to this project's standards
 */

const noTrivialComments = require('./no-trivial-comments');

module.exports = {
  rules: {
    'no-trivial-comments': noTrivialComments,
  },
};
