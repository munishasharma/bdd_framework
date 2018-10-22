//********* User Defined Config Variables - Start *********//

	var ff;
	var featureFilePath;
	var argv = require('yargs').argv;

	//Specify the browser to be used for suite run
	const browser = 'chrome' +
		'';

	//Port on which Selenium instance is running - Should be 4444 for local run, 4445 for Sauce run , 4723 for local Appium run against real devices
	const port = 4444;


    featureFilePath = 'bdd/features/gherkins_featureFiles/features/nftPerformance.feature';

  exports.config = {

	defaultTags: ['~@descoped', '~@manual','~@wip', '~@mocks','~@batch','@sprint1'],
	host: '127.0.0.1',
	port: 4444,
	//user: 'loantest1234567@gmail.com' ,
	//key: '98d66a73-36f4-4a3a-a766-01b1208a2880',
	path: '/wd/hub',
	specs: [
		featureFilePath
	],

	maxInstances: 1,
	sync: false,

	capabilities: [
		{
			'browserName': browser//,
			//'proxy': {
			//	'proxyType': 'MANUAL',
			//	'httpProxy': '127.0.0.1:8097',
			//	'sslProxy' : '127.0.0.1:8097'
			//}

		}

	],
	framework: 'cucumber',
	reporters: ['spec'],
	reporterOptions: {
		outputDir: 'bdd/final_reports/FunctionalTestReport/'
	},

// If you are using Cucumber you need to specify where your step definitions are located.
	cucumberOpts: {
		timeout: 60000,
		require: ['bdd/features/gherkins_featureFiles/step_definitions/', 'bdd/features/additional_utilities/'],
		ignoreUndefinedDefinitions: false,
		format: 'json'
	},
	logLevel: 'silent',
	coloredLogs: true
};
