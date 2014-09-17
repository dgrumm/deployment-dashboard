var q = require('q');
var credentials = require('./credentials');
var configuration = require('./configuration');
var http = require('http');

var GithubClient = {

    get_commits: function(repo, from) {
        var defer = q.defer();
        var user = credentials.get_github_credentials();

        var auth = 'Basic ' + new Buffer(user.username + ":" + user.password).toString("base64");
        var options = {
            host: configuration.get_github_host(),
            path: '/api/v3/repos/regional-inventory/'+ repo +'/commits?latest_sha='+from,
            headers: {'authorization': auth}
        };

        callback = function (response) {
            var commitsJSON = '';
            var github_info = {};

            //another chunk of data has been recieved, so append it to `str`
            response.on('data', function (chunk) {
                commitsJSON += chunk;
            });

            //the whole response has been recieved, so we just print it out here
            response.on('end', function () {
                var commitsObject = JSON.parse(commitsJSON);
                commitsObject.forEach(function(gitCommit){

                    var issue = get_issue_from(gitCommit.commit.message);

                    var commitInfo = {author: [gitCommit.commit.author.name], date: [gitCommit.commit.committer.date], msg: [gitCommit.commit.message], path: []};
                    if (github_info[issue] === undefined) {
                        github_info[issue] = {
                            key: issue,
                            commits: [commitInfo]
                        };
                    } else {
                        github_info[issue].commits.push(commitInfo);
                    };
                });

                defer.resolve(github_info);
            });
        }

        http.request(options, callback).end();

        return defer.promise;
    }

}

function issueInBracketsFound(splitMessageArray) {
    return splitMessageArray.length > 1;
}
var get_issue_from = function (message) {
    var pattern = /\s*\[/;
    var splitMessageArray = message.split(pattern);
    if(issueInBracketsFound(splitMessageArray)){
        return splitMessageArray[0];
    }
    return "Missing story number";
};

module.exports = {
    GithubClient: GithubClient
}