var fs = require('fs-extra');
var Cucumber = require('cucumber');
var JsonFormatter = Cucumber.Listener.JsonFormatter();

module.exports = function JsonOutputHook() {
        //var currenttime = new Date().toJSON().replace(/:/g, "-");

        //var AbsreportPath = 'bdd/final_reports/FunctionalTestReport/json/testExecutionReport'+ '-' +currenttime+'.json';
        var reportPath = 'bdd/final_reports/FunctionalTestReport/json/'+'Report.json'

        JsonFormatter.log = function (json) {
                fs.writeFileSync(reportPath, json, null, 2);
              //  console.log('Run Complete: json report file location: ' + AbsreportPath);
        };
        this.registerListener(JsonFormatter);
};

