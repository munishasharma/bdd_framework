'use strict';

const path = require('path'),
    gulp = require('gulp'),
    fs = require('fs'),
    through = require('through2'),
    dargs = require('dargs'),
    gutil = require('gulp-util'),
    spawn = require('child_process').spawn,
    deepmerge = require('deepmerge'),
    argv = require('yargs').argv,
    exec = require('child_process').exec,
    runSequence = require('run-sequence'),
    gulpSequence = require('gulp-sequence').use(gulp),
    os = require('os'),
    del = require('del'),
    mkdirp = require('mkdirp'),
    selectedEnv = argv.env || 'local',
    osPlatform = `${os.type()} ${os.release()} ${os.platform()}`,
    isWin = /^win/.test(process.platform),
    cmd = isWin ? 'wdio.cmd' : 'wdio',
    cucumberReporter = require('cucumber-html-reporter');

let seleniumServer;
let wdioConfigObject = {wdioBin: path.join(__dirname, 'node_modules', '.bin', cmd)}

const cucumberReportOptions = {
    theme: 'bootstrap',
    jsonDir: 'bdd/final_reports/FunctionalTestReport/json/',
    output: 'bdd/final_reports/FunctionalTestReport/html/Report.html',
    brandTitle: 'Acceptance Tests Results Report',
    reportSuiteAsScenarios: true,
    launchReport: true,
    storeScreenShots: true,
    ignoreBadJsonFile: true,
    metadata: {
        "App Version":"v0.0.3",
        "Test Environment": selectedEnv,
        "Platform": osPlatform,
        "Parallel": "Scenarios",
        "Executed": "Remote"
    }
};

gulp.task('execute', gulpSequence('delete','test-runner','final-report'));
//gulp.task('gurukula', gulpSequence('final-report'));

gulp.task('test-runner', (cb) => {
    return runSequence('start-selenium', 'stop-selenium', cb);
});

gulp.task('start-selenium', () => {
    const Chromeexecutable = isWin ? './node_modules/chromedriver/lib/chromedriver/chromedriver.exe' : 'node_modules/chromedriver/bin/chromedriver';
    const command = 'java -jar ./node_modules/selenium-server-standalone-jar/jar/selenium-server-standalone-2.48.2.jar -log ../seleniumLog.txt -Dwebdriver.chrome.driver=' + path.resolve(__dirname, Chromeexecutable);
    console.log('Starting Selenium Server');
    seleniumServer = exec(command, function() {
        console.log('Starting Selenium Server1');
        seleniumServer = null;
    });
    return gulp.src('bdd/configFiles/cuke.conf.js').pipe(webdriver(wdioConfigObject));
});

gulp.task('stop-selenium', (cb) => {
    if (seleniumServer) {
        process.kill(seleniumServer.pid, 'SIGINT');
    }
    cb();
    process.exit(0);
});

gulp.task('delete', function(done) {
    return del([
        'bdd/final_reports/FunctionalTestReport/html/*',
        'bdd/final_reports/FunctionalTestReport/json/*',
    ], done);
});

gulp.task('final-report', (done) => {
    new Promise (function(resolve, reject) {
        try {
            cucumberReporter.generate(cucumberReportOptions);
            resolve();
        }
        catch (error){
            console.log(error);
            done();
        }
    }).then(function(){
        done();
    });
});

let webdriver = module.exports = function(options) {
    return through.obj(function(file, enc, done) {
        let tags = ['~@unit'];
        let config = require(file.history[0]).config;
        config.cucumberOpts = config.cucumberOpts || {};

        if(argv.tags) {
            tags = tags.concat(argv.tags.split(','));
        }

        if (config.defaultTags) {
            tags = tags.concat(config.defaultTags);
        }

        config.cucumberOpts.tags = tags;

        let jsString = [];
        jsString.push('exports.config=');
        jsString.push(JSON.stringify(config));

        let currenttime = new Date().toJSON().replace(/:/g, "-");
        let tmpFile = path.resolve(__dirname, 'cuke-'+currenttime+'.tmp');
        fs.writeFileSync(tmpFile, jsString.join(''));

        let stream = this,
            configFile = tmpFile,
            isWin = /^win/.test(process.platform),
            wdioBin = path.join(__dirname, 'node_modules', '.bin', isWin ? 'wdio.cmd' : 'wdio');

        let opts = deepmerge({
            wdioBin: wdioBin
        }, options || {});

        /**
         * check webdriverio dependency
         */
        if (!fs.existsSync(opts.wdioBin)) {
            return this.emit('error', new gutil.PluginError('gulp-webdriver', 'Haven\'t found the WebdriverIO test runner', {
                showStack: false
            }));
        }

        let args = process.execArgv.concat([configFile]).concat(dargs(opts, {
            excludes: ['wdioBin'],
            keepCamelCase: true
        }));

        gutil.log('spawn wdio with these attributes:\n', args.join('\n'));
        let wdio = spawn(opts.wdioBin, args, {
            stdio: 'inherit'
        });

        wdio.on('exit', function(code) {
            gutil.log('wdio testrunner finished with exit code', code);
            console.log("Deleting tmp cuke file");
            fs.unlinkSync(tmpFile);
            done();
            done = null;
        });

        return stream;
    });
};
