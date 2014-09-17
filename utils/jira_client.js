var _ = require('underscore');
var q = require('q');
var jira = require('jira-api');
var credentials = require('./credentials');
var configuration = require('./configuration');

var JiraClient = {

    get_jira: function (issue, jira_info) {
        var defer = q.defer();

        var user = credentials.get_jira_credentials();
        var options = {
            config: {
                "username": user.username,
                "password": user.password,
                "host": configuration.get_jira_host()
            },
            issueIdOrKey: issue
        };

        if (issue.indexOf("-") > -1 && issue.indexOf('-000') === -1) {
            jira.issue.get(options, function (data) {
                if (data.errorMessages === undefined) {
                    jira_info[issue] = {stage: data.fields.status.name, summary: data.fields.summary};
                }
                defer.resolve();
            });
        } else {
            defer.resolve();
        }

        return defer.promise;
    },

    get_jiras: function (issues) {
        var defer = q.defer();

        var jira_info = {};
        var jiras = _.map(issues, function (issue) {
            return JiraClient.get_jira(issue, jira_info);
        });
        q.all(jiras).then(function () {
            defer.resolve(jira_info);
        });

        return defer.promise;

    }
}

module.exports = {
    JiraClient: JiraClient
}
