var chai = require('chai');

var expect = chai.expect;

describe("Svn Client", function () {

    beforeEach(function () {
        this.client = require('../utils/svn_client');
    });


    describe("process data returned from svn", function () {
        it("should parse issue name", function () {
            var expectedIssueName = 'PROJECT-000';
            var mockedEntry = {
                '$': { revision: 'some_number' },
                msg: [ expectedIssueName + ' [SOME_NAME] - fix sonar exclusions' ]
            };

            var returnedIssueName = this.client.get_issue_from(mockedEntry);

            expect(returnedIssueName).to.equal(expectedIssueName);
        });

    });

});

