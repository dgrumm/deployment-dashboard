var http = require('http');
var _ = require('underscore');
var q = require('q');
var express = require('express');
var excelbuilder = require('msexcel-builder');
var jira = require('./utils/jira_client');
var svn = require('./utils/svn_client');
var github = require('./utils/github_client');
var health_page = require('./utils/health_page_client');

var routes = require('./routes');

var app = express();

app.configure(function () {
    app.use(express.static(__dirname + '/public'));
    app.use(express.logger('dev'));
    app.use(express.bodyParser());
    app.use(express.json());
    app.use(express.urlencoded());
});

app.get('/stories/:proj/:start/:end/:svn', function (request, response) {
    var stories = {};
    var svn_client = svn.SvnClient;

    svn_client.get_svn(request.params.proj, request.params.start, request.params.end, request.params.svn)
        .then(function (svn_info) {
            stories = svn_info;
            addJiraInfo(stories, response);
        });
});

function addJiraInfo(stories, response) {
    var jira_client = jira.JiraClient;
    jira_client.get_jiras(_.keys(stories)).then(function (jira_info) {
        _.map(_.keys(jira_info), function (key) {
            stories[key].summary = jira_info[key].summary;
            stories[key].stage = jira_info[key].stage;
        });
        response.json(stories);
    });
}
app.get('/githubstories/:proj/:start', function (request, response) {
    var stories = {};
    var github_client = github.GithubClient;

    github_client.get_commits(request.params.proj, request.params.start)
        .then(function (github_info) {
            stories = github_info;
            addJiraInfo(stories, response);
        });
});

app.post('/export', function (req, res) {
    var workbook = excelbuilder.createWorkbook('./', 'Deployment_Stories_Prod.xlsx')
    var headerProps = ["Story", "Description", "Status", "Risk", "Feature Toggle", "Comments"];

    var projects = req.body;
    projects.forEach(function (project) {

        var sheet = workbook.createSheet(project.name, headerProps.length, 400);
        for (var i = 1; i <= headerProps.length; i++) {
            sheet.font(i, 1, {sz: '16', family: '3', bold: 'true'});
            sheet.set(i, 1, headerProps[i - 1]);
        }

        var row = 2;
        for (story in project.stories) {
            sheet.set(1, row, project.stories[story]["key"]);
            sheet.set(2, row, project.stories[story]["summary"]);
            sheet.set(3, row, project.stories[story]["stage"]);
            row += 1;
        }
    });

    workbook.save(function (ok) {
        if (!ok)
            workbook.cancel();
        else
            console.log('congratulations, your workbook created');
        res.end('Workbook created \n');
    });
});

app.get('/', routes.index);
app.get('/partials/:name', routes.partials);

app.listen(9001);
console.log("listening on port 9001");

