var svnexec = require('./svn-exec')
  , template
  , log;

template = function (context) {
  return [
    'log'
  , '--verbose'
  , '--xml'
  , '--password'
  , context.password
  , '--username'
  , context.username
  , context.url
	, '-r'
	, context.arg
  ];
};

log = function (context, cb) {
  svnexec(template(context), cb);
};

module.exports = log;
