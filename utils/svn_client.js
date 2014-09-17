var svn = require('../lib/svn-utils');
var q = require('q');
var credentials = require('./credentials');
var configuration = require('./configuration');

var SvnClient = {

    get_svn: function (proj, start, end, svnUrl) {

        var defer = q.defer();
        var user = credentials.get_svn_credentials();

        svn.log({
                username: user.username,
                password: user.password,
                url: configuration.get_svn_url() + svnUrl + "/" + proj + '/trunk',
                arg: start + ':' + end
            },

            function (err, data) {
                var entries = data.log.logentry;
                var svn_info = {};
                console.log("BEGIN FROM SVN REQUEST" + configuration.get_svn_url() + svnUrl + "/" + proj + '/trunk');
                console.log(err);
                console.log(data);
                console.log("----_END------");

                entries.forEach(function (entry) {
                    var issue = get_issue_from(entry);

                    var commitInfo = {author: entry.author, date: entry.date, msg: entry.msg, path: entry.paths[0].path};
                    if (svn_info[issue] === undefined) {
                        svn_info[issue] = {
                            key: issue,
                            commits: [
                                commitInfo
                            ]
                        };
                    } else {
                        svn_info[issue].commits.push(commitInfo);
                    };
                });

                defer.resolve(svn_info);
            });

        return defer.promise;
    }

}

var get_issue_from = function (entry) {
    var pattern = /\s*\[/;
    return entry.msg[0].split(pattern)[0];
};

module.exports = {
    SvnClient: SvnClient,
    get_issue_from: get_issue_from

}
